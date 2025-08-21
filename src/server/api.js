// src/server/api.js
import axios from "axios";

// Auth API instance
export const Api = axios.create({
  baseURL: "http://localhost:7000/api/auth",
  withCredentials: true,
});

// Books API instance
export const getBooks = axios.create({
  baseURL: "http://localhost:7000/api/auth", // Changed from /api/web to /api/auth
  withCredentials: true,
});

// Attach token automatically to both instances
[Api, getBooks].forEach(instance => {
  instance.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Add response interceptor to handle auth errors
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );
});