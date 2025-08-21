// src/server/auth.js
import { Api, getBooks } from "./api";

// ================== AUTH APIs ==================
export const login = (formData) => Api.post("/login", formData);
export const signup = (formData) => Api.post("/signup", formData);
export const Dashboard = () => Api.get("/dashboard");
export const refreshToken = () => Api.post("/refresh");
export const logout = () => Api.post("/logout");

// ================== BOOKS APIs ==================
export const AddBook = (bookdata) =>
  getBooks.post("/books", bookdata, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateBook = (id, bookdata) =>
  getBooks.put(`/books/${id}`, bookdata, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getAllBooks = () => getBooks.get("/books");
export const getLatestBook = () => getBooks.get("/books/latest");
export const getBookById = (id) => getBooks.get(`/books/${id}`);