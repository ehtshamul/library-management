import axios from "axios";

// =======================
// Axios Instances
// =======================
const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:7000";

export const api = axios.create({
  baseURL: `${API_BASE}/api/auth`,
  withCredentials: true,
  timeout: 10000,
});
export const landingApi = axios.create({
  baseURL: `${API_BASE}/api/landing`,
  withCredentials: true,
  timeout: 10000,
});


export const getBooks = axios.create({
  baseURL: `${API_BASE}/api/web`,
  withCredentials: true,
  timeout: 10000,
});

export const adminApi = axios.create({
  baseURL: `${API_BASE}/api/admin`,
  withCredentials: true,
  timeout: 10000,
});

const refreshApi = axios.create({
  baseURL: `${API_BASE}/api/auth`,
  withCredentials: true,
  timeout: 10000,
});

// =======================
// Token Attachment
// =======================
const attachToken = (config) => {
  console.log("🔧 Request interceptor:", { url: config.url, method: config.method });

  // Don't add token for auth endpoints (login, signup, refresh)
  // Use endsWith so both absolute and relative URLs are handled.
  try {
    const urlStr = config.url ? String(config.url) : '';
    const authPaths = ['/login', '/signup', '/refresh'];
    const isAuthEndpoint = authPaths.some((p) => urlStr.endsWith(p));
    if (isAuthEndpoint) {
      console.log('✅ Auth endpoint - no token needed');
      return config;
    }
  } catch (e) {
    // If anything goes wrong while checking, continue and attempt to attach token.
    console.warn('Could not determine request url for auth check', e);
  }

  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
    console.log('🔑 Token attached to request');
  } else {
    console.log('⚠️ No token available');
  }
  return config;
};

api.interceptors.request.use(attachToken);
getBooks.interceptors.request.use(attachToken);
// Ensure admin and landing axios instances also attach tokens
adminApi.interceptors.request.use(attachToken);
landingApi.interceptors.request.use(attachToken);

// =======================
// Refresh Token Logic
// =======================
let isRefreshing = false;
let refreshQueue = [];

const processQueue = (error, token = null) => {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (token) {
      resolve(token);
    } else {
      reject(error);
    }
  });
  refreshQueue = [];
};

const refreshToken = async () => {
  try {
    console.log("🔄 Refreshing token...");
    const { data } = await refreshApi.post("/refresh");
    const newToken = data?.accessToken;

    if (!newToken) throw new Error("No access token received");

    // Save token
    localStorage.setItem("accessToken", newToken);

    // Update default headers
    api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    getBooks.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    adminApi.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    // also update landing API headers so contact/landing endpoints reuse the refreshed token if needed
    landingApi.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

    console.log("✅ Token refreshed");
    return newToken;
  } catch (err) {
    console.error("❌ Refresh failed:", err);

    // Cleanup storage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));

    // Redirect if not already on login
    if (window.location.pathname !== "/login") {
      window.location.replace("/login");
    }

    throw err;
  }
};

// =======================
// Response Interceptor Handler
// =======================
const handleResponseError = (instance) => async (error) => {
  const { response, config: originalRequest } = error;

  if (!response) {
    console.error("🌐 Network error:", error);
    return Promise.reject(error);
  }

  const { status } = response;
  const isRefreshCall = originalRequest?.url?.includes("/refresh");

  console.log(`⚠️ Response error: ${status} - ${response.statusText}`);

  // Forbidden → force logout
  if (status === 403) {
    console.log("🚫 403 Forbidden - logging out");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));

    if (window.location.pathname !== "/login") {
      window.location.replace("/login");
    }
    return Promise.reject(error);
  }

  // Unauthorized → try refresh
  if (status === 401 && !originalRequest._retry && !isRefreshCall) {
    originalRequest._retry = true;

    if (isRefreshing) {
      // Queue requests until refresh completes
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
        console.log("🔁 Retrying original request with new token");
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
// Attach Response Interceptors Once
// =======================
const attachResponseInterceptor = (instance) => {
  if (!instance.__hasResponseInterceptor) {
    instance.interceptors.response.use(
      (res) => {
        console.log(
          `✅ ${res.config.method?.toUpperCase()} ${res.config.url} - ${res.status}`
        );
        return res;
      },
      handleResponseError(instance)
    );
    instance.__hasResponseInterceptor = true;
  }
};

attachResponseInterceptor(api);
attachResponseInterceptor(getBooks);
attachResponseInterceptor(adminApi);
attachResponseInterceptor(landingApi);

export default api;
