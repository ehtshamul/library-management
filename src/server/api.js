import axios from "axios";

// =======================
// Axios Instances
// =======================
export const api = axios.create({
  baseURL: "/api/auth",
  withCredentials: true,
});

export const getBooks = axios.create({
  baseURL: "/api/web",
  withCredentials: true,
});

const refreshApi = axios.create({
  baseURL: "/api/auth",
  withCredentials: true,
});

// =======================
// Attach access token
// =======================
const attachToken = (config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    if (config.headers && typeof config.headers.set === "function") {
      config.headers.set("Authorization", `Bearer ${token}`);
    } else {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
};

api.interceptors.request.use(attachToken);
getBooks.interceptors.request.use(attachToken);

// =======================
// Refresh token handling
// =======================
let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(newToken) {
  refreshSubscribers.forEach(cb => cb(newToken));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback) {
  refreshSubscribers.push(callback);
}

const createResponseInterceptor = (instance) => async (error) => {
  const { response, config: originalRequest } = error;
  if (!response) return Promise.reject(error);

  const status = response.status;
  const isRefreshEndpoint = originalRequest.url?.includes("/refresh");

  if (status === 401 && !originalRequest._retry && !isRefreshEndpoint) {
    originalRequest._retry = true;

    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const { data } = await refreshApi.post("/refresh");
        const newToken = data?.accessToken;
        if (newToken) {
          localStorage.setItem("accessToken", newToken);
          if (api.defaults.headers && typeof api.defaults.headers.set === "function") {
            api.defaults.headers.set("Authorization", `Bearer ${newToken}`);
          } else {
            api.defaults.headers = api.defaults.headers || {};
            api.defaults.headers.common = api.defaults.headers.common || {};
            api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
          }
          if (getBooks.defaults.headers && typeof getBooks.defaults.headers.set === "function") {
            getBooks.defaults.headers.set("Authorization", `Bearer ${newToken}`);
          } else {
            getBooks.defaults.headers = getBooks.defaults.headers || {};
            getBooks.defaults.headers.common = getBooks.defaults.headers.common || {};
            getBooks.defaults.headers.common.Authorization = `Bearer ${newToken}`;
          }
        }
        onRefreshed(newToken);
      } catch (refreshError) {
        onRefreshed(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event('storage'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return new Promise((resolve, reject) => {
      addRefreshSubscriber((token) => {
        if (!token) return reject(error);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        resolve(instance(originalRequest));
      });
    });
  }

  return Promise.reject(error);
};

// Attach interceptors
api.interceptors.response.use(res => res, createResponseInterceptor(api));
getBooks.interceptors.response.use(res => res, createResponseInterceptor(getBooks));

export default api;
