import axios from "axios";

// Auth routes
export const Api = axios.create({
  baseURL: "http://localhost:7000/api/auth",
});

// Attach token
Api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Book routes
export const getBooks = axios.create({
  baseURL: "http://localhost:7000/api/web",
});
