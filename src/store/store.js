import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import booksReducer from "./booksSlice";

// store/store.js
export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: booksReducer,
  },
  
});
