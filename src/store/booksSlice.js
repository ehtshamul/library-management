// booksSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../server/auth";

// ✅ Async Thunks
export const getAllBooks = createAsyncThunk("books/getAll", async (_, thunkAPI) => {
  try {
    const res = await api.getAllBooks();
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch books");
  }
});

export const getBookById = createAsyncThunk("books/getById", async (id, thunkAPI) => {
  try {
    const res = await api.getBookById(id);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch book");
  }
});

export const addBook = createAsyncThunk("books/add", async (bookData, thunkAPI) => {
  try {
    const res = await api.AddBook(bookData);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to add book");
  }
});

export const updateBook = createAsyncThunk("books/update", async ({ id, bookData }, thunkAPI) => {
  try {
    const res = await api.updateBook(id, bookData);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to update book");
  }
});

// ✅ Slice
const booksSlice = createSlice({
  name: "books",
  initialState: {
    books: [],
    selectedBook: null,
    status: "idle",
    error: null,
  },
  reducers: {
    clearSelectedBook: (state) => {
      state.selectedBook = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all books
      .addCase(getAllBooks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllBooks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.books = action.payload;
      })
      .addCase(getAllBooks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Get book by id
      .addCase(getBookById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getBookById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedBook = action.payload;
      })
      .addCase(getBookById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Add book
      .addCase(addBook.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addBook.fulfilled, (state, action) => {
        state.status = "succeeded";
        const created = action.payload?.book || action.payload;
        if (created) {
          state.books.push(created);
        }
      })
      .addCase(addBook.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Update book
      .addCase(updateBook.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updated = action.payload?.book || action.payload;
        if (updated) {
          const index = state.books.findIndex(b => (b._id || b.id) === (updated._id || updated.id));
          if (index !== -1) {
            state.books[index] = updated;
          }
        }
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  }
});

export const { clearSelectedBook } = booksSlice.actions;
export default booksSlice.reducer;