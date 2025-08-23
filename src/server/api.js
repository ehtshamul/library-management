// api.js
import axios from "axios";

// ================= Auth routes =================
export const Api = axios.create({
  baseURL: "http://localhost:7000/api/auth",
  withCredentials: true,
});

// Interceptor to attach access token to every request
Api.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      req.headers["Authorization"] = `Bearer ${token}`;
    }
    return req;
  },
  (error) => Promise.reject(error)
);

// ================= Book routes =================
export const getBooks = axios.create({
  baseURL: "http://localhost:7000/api/web",
  withCredentials: true,
});

// Attach token to book requests as well
getBooks.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      req.headers["Authorization"] = `Bearer ${token}`;
    }
    return req;
  },
  (error) => Promise.reject(error)
);