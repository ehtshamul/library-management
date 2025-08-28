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
// Token Attachment
// =======================
const attachToken = (config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
};

api.interceptors.request.use(attachToken);
getBooks.interceptors.request.use(attachToken);

// =======================
// Refresh Token Logic
// =======================
let isRefreshing = false;
let refreshQueue = [];

const processQueue = (error, token = null) => {
  refreshQueue.forEach(({ resolve, reject }) => {
    token ? resolve(token) : reject(error);
  });
  refreshQueue = [];
};

const refreshToken = async () => {
  try {
    const { data } = await refreshApi.post("/refresh");
    const newToken = data?.accessToken;

    if (newToken) {
      localStorage.setItem("accessToken", newToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
      getBooks.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    }

    return newToken;
  } catch (err) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
    if (window.location.pathname !== "/login") {
      window.location.replace("/login");
    }
    throw err;
  }
};

// =======================
// Response Interceptor
// =======================
const handleResponseError = (instance) => async (error) => {
  const { response, config: originalRequest } = error;
  if (!response) return Promise.reject(error);

  const { status } = response;
  const isRefreshCall = originalRequest.url?.includes("/refresh");

  // Force logout on forbidden
  if (status === 403) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    if (window.location.pathname !== "/login") {
      window.location.replace("/login");
    }
    return Promise.reject(error);
  }

  // Handle unauthorized with refresh
  if (status === 401 && !originalRequest._retry && !isRefreshCall) {
    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({
          resolve: (token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            resolve(instance(originalRequest));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      const newToken = await refreshToken();
      processQueue(null, newToken);

      if (newToken) {
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return instance(originalRequest);
      }
    } catch (err) {
      processQueue(err, null);
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }

  return Promise.reject(error);
};

// =======================
// Attach Interceptors Once
// =======================
const attachResponseInterceptor = (instance) => {

  if (!instance.__hasResponseInterceptor) {
    instance.interceptors.response.use(
      (res) => res,
      handleResponseError(instance)
    );
    instance.__hasResponseInterceptor = true;
  }
};

attachResponseInterceptor(api);
attachResponseInterceptor(getBooks);

export default api;