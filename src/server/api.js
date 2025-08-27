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

// Prime default Authorization header at startup if a token already exists
try {
  const existingToken = localStorage.getItem("accessToken");
  if (existingToken) {
    api.defaults.headers.common.Authorization = `Bearer ${existingToken}`;
    getBooks.defaults.headers.common.Authorization = `Bearer ${existingToken}`;
  }
} catch {}

// =======================
// Attach access token
// =======================
const attachToken = (config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    if (config.headers && typeof config.headers.set === "function") {
      config.headers.set("Authorization", `Bearer ${token}`);
    } else {
      const next = { ...(config.headers || {}) };
      next.Authorization = `Bearer ${token}`;
      next.authorization = `Bearer ${token}`;
      config.headers = next;
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
          api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
          getBooks.defaults.headers.common.Authorization = `Bearer ${newToken}`;
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
        if (originalRequest.headers && typeof originalRequest.headers.set === "function") {
          originalRequest.headers.set("Authorization", `Bearer ${token}`);
        } else {
          originalRequest.headers = { ...(originalRequest.headers || {}), Authorization: `Bearer ${token}` };
        }
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
