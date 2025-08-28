// auth.js
import { api, getBooks } from "./api";


// auth .js 
// Auth APIs
export const login = (formData) => api.post("/login", formData);
export const signup = (formData) => api.post("/signup", formData);
export const Dashboard = () => api.get("/dashboard");
export const logout = () => api.post("/logout");
export const refresh = () => api.post("/refresh");

// Books APIs
export const addBook = (bookdata) =>
  api.post("/", bookdata);

export const updateBook = (id, bookdata) =>
  api.put(`/${id}`, bookdata);

// export const getAllBooks = () => getBooks.get("/getbooks");
export const getLatestBook = () => getBooks.get("/getbooklatest");
// export const getBookById = (id) => api.get(`/${id}`);
export const getAllBooks = () => getBooks.get("/getbooks");
export const getBookById = (id) => api.get(`/${id}`);

export const deleteBook = (id) => api.delete(`/${id}`);
export const searchBooks = (query) =>
  getBooks.get("/search", { params: { query } });
// get approved admin 
// Approve or update review status. Accepts an optional body (e.g. { status: 'Approved' }).



export const addreview = (reviewdata) => {
  return getBooks.post("/add", reviewdata);
};
export const showview = (id) => {
  return getBooks.get(`/show/${id}`);
};
export const deleteReview = (id) => {
  return getBooks.delete(`/${id}`);
};
