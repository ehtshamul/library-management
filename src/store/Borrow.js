import { createSlice, createAsyncThunk, isPending, isRejected } from "@reduxjs/toolkit";
import * as api from "../server/auth";

// 🔹 Async Thunk for creating a borrow
export const createBorrow = createAsyncThunk(
  "borrow/create",
  async ({ userId, bookId, duedate }, thunkAPI) => {
    try {
      const response = await api.createBorrow(userId, bookId, duedate);

      console.log("🚀 Borrow created:", response);
      console.log("📡 Borrow API raw response:", response.data);
      return response.data.borrow;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error");
    }
  }
);
export const returnBorrow = createAsyncThunk(
  "borrow/return",
  async ({ borrowId, userId }, thunkAPI) => {
    try {
      const response = await api.returnBorrow(borrowId, userId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error");
    }
  }
);
export const getUserBorrows = createAsyncThunk(
  "borrow/getUserBorrows",
  async (userId, thunkAPI) => {
    try {
      const response = await api.getUserBorrows(userId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error");
    }
  }
);

// 🔹 Initial State
const initialState = {
  borrow: null,
  loading: false,
  error: null,
};

// 🔹 Slice
const borrowSlice = createSlice({
  name: "borrow",
  initialState,
  reducers: {
    clearBorrow: (state) => {
      state.borrow = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBorrow.fulfilled, (state, action) => {
        state.borrow = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(returnBorrow.fulfilled, (state, action) => {
        state.borrow = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getUserBorrows.fulfilled, (state, action) => {
        state.borrow = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addMatcher(isPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(isRejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearBorrow } = borrowSlice.actions;
export default borrowSlice.reducer;
