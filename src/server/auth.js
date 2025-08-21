// src/server/auth.js
import { Api, WebApi } from "./api";

// ================== AUTH APIs ==================
export const login = (formData) => Api.post("/login", formData);
export const signup = (formData) => Api.post("/signup", formData);
export const Dashboard = () => Api.get("/dashboard");
export const refreshToken = () => Api.post("/refresh");
export const logout = () => Api.post("/logout");

// ================== BOOKS APIs ==================
export const AddBook = (bookdata) =>
  Api.post("/books", bookdata, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateBook = (id, bookdata) =>
  Api.put(`/books/${id}`, bookdata, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Public web routes for fetching books
export const getAllBooks = () => WebApi.get("/getbooks");
export const getLatestBook = () => WebApi.get("/getbooklatest");
export const getBookById = (id) => Api.get(`/books/${id}`);