import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import booksReducer from "./booksSlice";
import reviewSlice from "./reviewSlice";
import borrowReducer from "./Borrow";

// store/store.js
export const store = configureStore({
  reducer: {
    auth: authReducer,
    borrow: borrowReducer,
    books: booksReducer,
    reviews: reviewSlice
  },
  
});
