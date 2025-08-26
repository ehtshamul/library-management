import axios from "axios";


 export const api = axios.create({
  baseURL: "http://localhost:7000/api/auth", // adjust to your backend base URL
  withCredentials: true,
});

 export const getBooks= axios.create({
  baseURL: "http://localhost:7000/api/web", // adjust to your backend base URL
  withCredentials: true,
});

// attach token automatically if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// book endpoints (export helpers used by slices)
export const getAllBooks = () => getBooks.get("/getbooks");

// get boohs by id for update book get date 
export const getBookById = (id) => api.get(`/${id}`);

// add books or create book
export const addBook = (formData) =>
  api.post("/", formData, { headers: { "Content-Type": "multipart/form-data" } });
// edit books 
export const updateBook = (id, formData) =>
  api.put(`/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
// delete books 
export const deleteBook = (id) => api.delete(`/${id}`);

export default api;