// auth.js
import { Api, getBooks } from "./api";

// Auth APIs
export const login = (formData) => Api.post("/login", formData);
export const signup = (formData) => Api.post("/signup", formData);
export const Dashboard = () => Api.get("/dashboard");
export const logout = () => Api.post("/logout");
export const refresh = () => Api.post("/refresh");

// Books APIs
export const AddBook = (bookdata) =>
  Api.post("/", bookdata, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateBook = (id, bookdata) =>
  Api.put(`/${id}`, bookdata, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getAllBooks = () => getBooks.get("/getbooks");
export const getLatestBook = () => getBooks.get("/getbooklatest");
export const getBookById = (id) => getBooks.get(`/books/${id}`);
