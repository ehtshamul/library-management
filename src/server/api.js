import axios from "axios";


 export const api = axios.create({
  baseURL: "http://localhost:7000/api/auth", // adjust to your backend base URL
  withCredentials: true,
});

 export const getBooks= axios.create({
  baseURL: "http://localhost:7000/api/web", // adjust to your backend base URL
  withCredentials: true,
});

// attach token automatically if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// auto-refresh access token on 401 and retry the original request
let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(newToken) {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback) {
  refreshSubscribers.push(callback);
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config || {};

    const status = error?.response?.status;
    const isRefreshEndpoint = typeof originalRequest.url === "string" && originalRequest.url.includes("/refresh");

    if (status === 401 && !originalRequest._retry && !isRefreshEndpoint) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const { data } = await api.post("/refresh");
          const newToken = data?.accessToken;
          if (newToken) {
            localStorage.setItem("accessToken", newToken);
            api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
          }
          onRefreshed(newToken || null);
        } catch (refreshError) {
          onRefreshed(null);
          isRefreshing = false;
          refreshSubscribers = [];
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve, reject) => {
        addRefreshSubscriber((token) => {
          if (!token) {
            reject(error);
            return;
          }
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

// book endpoints (export helpers used by slices)
export const getAllBooks = () => getBooks.get("/getbooks");

// get boohs by id for update book get date 
export const getBookById = (id) => api.get(`/${id}`);

// add books or create book
export const addBook = (formData) =>
  api.post("/", formData, { headers: { "Content-Type": "multipart/form-data" } });
// edit books 
export const updateBook = (id, formData) =>
  api.put(`/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
// delete books 
export const deleteBook = (id) => api.delete(`/${id}`);

export default api;