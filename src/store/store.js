import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import booksReducer from "./booksSlice";
import reviewSlice from "./reviewSlice";

// store/store.js
export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: booksReducer,
    reviews: reviewSlice
  },
  
});
