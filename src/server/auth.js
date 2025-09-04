// auth.js
import axios from "axios";
import { api, getBooks } from "./api";


// auth .js 
// Auth APIs
export const login = (formData) => {
  console.log("🚀 Frontend sending login request:", formData);
  return api.post("/login", formData);
};
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
  return getBooks.post("/reviews/add", reviewdata);
};
export const showview = (id) => {
  return getBooks.get(`/reviews/show/${id}`);
};
export const deleteReview = (id) => {
  return getBooks.delete(`/reviews/${id}`);
};
export const approvedAdmin = (id, reviewData) => {
  return api.patch(`/reviews/approved/${id}`, reviewData);  // Correct template literal usage
};
export const getAllreviews = () => {
  return api.get("/reviews/getalls");
}
export const createBorrow = (userId, bookId, duedate) => {
  console.log("📡 Borrow API call to:", `/borrow/${bookId}`);
 return axios.post(`/api/auth/borrow/${bookId}`, { userId, duedate });
}
export const returnBorrow = (borrowId, userId) => {
  console.log("📡 Return API call to:", `/return/${borrowId}`, "with userId:", userId);
  return axios.post(`/api/auth/borrow/return/${borrowId}`, { userId });
};

export const getUserBorrows = (userId) => {
  console.log("📡 Get User Borrows API call to:", `/borrow/user/${userId}`);
  return axios.get(`/api/auth/borrow/${userId}`);
};

export const forgetpassword =(email)=>{
  return axios.post('http://localhost:7000/api/admin/send-otp',{email});
}
export const resetPassword =(email, otp, newPassword, confirmPassword)=>{
  return axios.post('http://localhost:7000/api/admin/reset-password',{email, otp, newPassword, confirmPassword});
}