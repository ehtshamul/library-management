import axios from "axios";

// =======================
// Axios Instances
// =======================
export const api = axios.create({
  baseURL: "/api/auth",
  withCredentials: true,
  timeout: 10000,
});

export const getBooks = axios.create({
  baseURL: "/api/web",
  withCredentials: true,
  timeout: 10000,
});

const refreshApi = axios.create({
  baseURL: "/api/auth",
  withCredentials: true,
  timeout: 10000,
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
    console.log("🔄 Attempting to refresh token...");
    const { data } = await refreshApi.post("/refresh");
    const newToken = data?.accessToken;

    if (newToken) {
      console.log("✅ Token refreshed successfully");
      localStorage.setItem("accessToken", newToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
      getBooks.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
      return newToken;
    } else {
      throw new Error("No access token received from refresh");
    }
  } catch (err) {
    console.error("❌ Token refresh failed:", err);
    // Clear all auth data and redirect to login
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    
    // Dispatch storage event to notify other components
    window.dispatchEvent(new Event("storage"));
    
    // Redirect to login if not already there
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
  
  // Handle network errors
  if (!response) {
    console.error("Network error:", error);
    return Promise.reject(error);
  }

  const { status } = response;
  const isRefreshCall = originalRequest.url?.includes("/refresh");

  console.log(`Response error: ${status} - ${response.statusText}`);

  // Force logout on forbidden
  if (status === 403) {
    console.log("🔄 403 Forbidden - Clearing auth data");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
    
    if (window.location.pathname !== "/login") {
      window.location.replace("/login");
    }
    return Promise.reject(error);
  }

  // Handle unauthorized with refresh
  if (status === 401 && !originalRequest._retry && !isRefreshCall) {
    console.log("🔄 401 Unauthorized - Attempting token refresh");
    originalRequest._retry = true;

    if (isRefreshing) {
      console.log("🔄 Token refresh already in progress, queuing request");
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
        console.log("✅ Retrying original request with new token");
        return instance(originalRequest);
      }
    } catch (err) {
      console.error("❌ Token refresh failed, processing queue with error");
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
      (res) => {
        console.log(`✅ ${res.config.method?.toUpperCase()} ${res.config.url} - ${res.status}`);
        return res;
      },
      handleResponseError(instance)
    );
    instance.__hasResponseInterceptor = true;
  }
};

attachResponseInterceptor(api);
attachResponseInterceptor(getBooks);

export default api;