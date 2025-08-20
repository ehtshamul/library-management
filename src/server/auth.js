import { Api, getBooks } from "./api";

// Auth APIs
export const login = (formData) => Api.post("/login", formData);
export const signup = (formData) => Api.post("/signup", formData);
export const Dashboard = () => Api.get("/dashboard");

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

// Add this new function to get a book by ID
export const getBookById = (id) => Api.get(`/${id}`);