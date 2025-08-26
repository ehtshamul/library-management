// auth.js
import { api ,getBooks } from "./api";



// Auth APIs
export const login = (formData) => api.post("/login", formData);
export const signup = (formData) => api.post("/signup", formData);
export const Dashboard = () => api.get("/dashboard");
export const logout = () => api.post("/logout");
export const refresh = () => api.post("/refresh");

// Books APIs
export const AddBook = (bookdata) =>
  api.post("/", bookdata, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateBook = (id, bookdata) =>
  api.put(`/${id}`, bookdata, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getAllBooks = () => getBooks.get("/getbooks");
export const getLatestBook = () => getBooks.get("/getbooklatest");
export const getBookById = (id) => api.get(`/${id}`);

export const deleteBook = (id) => api.delete(`/${id}`);