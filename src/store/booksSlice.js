import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../server/auth";
// booksSlice.js  redux toolkit slice for books management

// ...existing code...

// 🔹 Async Thunks
export const getAllBooks = createAsyncThunk("books/fetchAll", async (_, thunkAPI) => {
  try {
    const res = await api.getAllBooks();
    return res.data; // expect array of books
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const fetchLatestBooks = createAsyncThunk("books/fetchLatest", async (_, thunkAPI) => {
  try {
    const res = await api.getLatestBook(); // backend should support sorting or we slice here
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const fetchBookById = createAsyncThunk("books/fetchById", async (id, thunkAPI) => {
  try {
    const res = await api.getBookById(id);
    return res.data; // expect single book object
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const addBook = createAsyncThunk("books/create", async (bookFormData, thunkAPI) => {
  try {
    const res = await api.addBook(bookFormData);
    return res.data; // expect created book
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const updateBook = createAsyncThunk(
  "books/modify",
  async ({ id, bookFormData }, thunkAPI) => {
    try {
      const res = await api.updateBook(id, bookFormData);
      return res.data; // expect updated book
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteBook = createAsyncThunk("books/remove", async (id, thunkAPI) => {
  try {
    await api.deleteBook(id);
    return id; // return removed id
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});
export const searchBooks =createAsyncThunk("books/search", async (query,thunkApi)=>{
  try{
    const res=await api.searchBooks(query);
    return res.data;
  }catch(err){
    return thunkApi.rejectWithValue(err.response?.data || err.message);
  } 
})

// 🔹 Initial State
const initialState = {
  books: [],
  selectedBook: null,
  status: "idle",
  error: null,
};

// 🔹 Slice
const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    clearSelectedBook: (state) => {
      state.selectedBook = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllBooks.fulfilled, (state, action) => {
        state.books = action.payload;
        state.status = "succeeded";
        state.error = null;
         
      })
      .addCase(fetchLatestBooks.fulfilled, (state, action) => {
        state.books = action.payload;
        state.status = "succeeded";
          
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.selectedBook = action.payload;
        state.status = "succeeded";
         
      })
      .addCase(addBook.fulfilled, (state, action) => {
        const newBook = action.payload?.book || action.payload;
        if (newBook) state.books.unshift(newBook); // add new at beginning
        state.status = "succeeded";
        
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        const updated = action.payload?.book || action.payload;
        if (updated?._id) {
          state.books = state.books.map((b) => (b._id === updated._id ? updated : b));
        }
        state.status = "succeeded";
         
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.books = state.books.filter((b) => b._id !== action.payload);
        state.status = "succeeded";
         
      })
      .addCase(searchBooks.fulfilled,(state,action)=>{
        state.books=action.payload;
        state.status="succeeded";
      })
      
      .addMatcher((action) => action.type.endsWith("/pending"), (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addMatcher((action) => action.type.endsWith("/rejected"), (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
      
  },

});

// 🔹 Exports
export const { clearSelectedBook } = booksSlice.actions;
export default booksSlice.reducer;