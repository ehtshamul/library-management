import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../server/auth";

// thunk to add review
export const addReview = createAsyncThunk(
  "reviews/add",
  async (reviewData, thunkApi) => {
    try {
      const response = await api.addreview(reviewData);
      return response.data.review; // backend should return a single review
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data || "Server error");
    }
  }
);



// thunk to show reviews (by book id)
export const showReview = createAsyncThunk(
  "reviews/show",
  async (bookId, thunkApi) => {
    try {
      const response = await api.showview(bookId);
      // make sure backend returns { reviews: [...] }
      return response.data.reviews;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data || "Server error");
    }
  }
);
// thunk to delete reviews
export const reviewdelete = createAsyncThunk(
  "reviews/delete",
  async (id, thunkApi) => {
    try {
      const response = await api.deleteReview(id);
      return response.data.review; // backend should return deleted review
    } catch (error) {
      return thunkApi.rejectWithValue("Server error");
    }
  }
);

const initialState = {
  reviews: [],
  status: "idle",
  error: null,
};

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // add review
      .addCase(addReview.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reviews.push(action.payload);
      })
      .addCase(addReview.rejected, (state, action) => {
        state.status = "failed";
        // Normalize error to string to avoid storing objects that crash React when rendered
        const payload = action.payload;
        if (typeof payload === 'string') state.error = payload;
        else if (payload?.message) state.error = payload.message;
        else state.error = JSON.stringify(payload);
      })

      // approve review
      .addCase(reviewdelete.pending, (state) => {
        state.status = "loading";
      })
      .addCase(reviewdelete.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reviews = state.reviews.filter(
          (review) => review._id !== action.payload._id
        );
      })
      .addCase(reviewdelete.rejected, (state, action) => {
        state.status = "failed";
        const payload = action.payload;
        if (typeof payload === 'string') state.error = payload;
        else if (payload?.message) state.error = payload.message;
        else state.error = JSON.stringify(payload);
      })

      // show reviews
      .addCase(showReview.pending, (state) => {
        state.status = "loading";
      })
      .addCase(showReview.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reviews = action.payload; // ✅ directly assign array
      })
      .addCase(showReview.rejected, (state, action) => {
        state.status = "failed";
        const payload = action.payload;
        if (typeof payload === 'string') state.error = payload;
        else if (payload?.message) state.error = payload.message;
        else state.error = JSON.stringify(payload);
      });
  },
});

export default reviewSlice.reducer;
