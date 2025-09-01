import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../server/auth";

// ======================
// Thunks
// ======================

// Add review
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

// Show reviews (by book id)
export const showReview = createAsyncThunk(
  "reviews/show",
  async (bookId, thunkApi) => {
    try {
      const response = await api.showview(bookId);
      return response.data.reviews; // make sure backend returns { reviews: [...] }
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data || "Server error");
    }
  }
);

// Delete review
export const deletereview = createAsyncThunk(
  "reviews/delete",
  async (reviewId, thunkApi) => {
    try {
      const response = await api.deleteReview(reviewId);
      return response.data?.review || response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data || "Server error");
    }
  }
);

// Approve review (admin)
export const ApprovedAdmin = createAsyncThunk(
  "reviews/approved",
  async ({ id, status }, thunkApi) => {
    try {
      const response = await api.approvedAdmin(id, { status });
      return response.data.review; // backend returns updated review
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data || "Server error");
    }
  }
);

// Get all reviews (admin)
export const getAllreviews = createAsyncThunk(
  "reviews/getAll",
  async (_, thunkApi) => {
    try {
      const response = await api.getAllreviews();
      console.log("API response:", response.data);
      return response.data.reviews; // backend returns { reviews: [...] }
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data || "Server error");
    }
  }
);

// ======================
// Slice
// ======================

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
      // Add review
      .addCase(addReview.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reviews.push(action.payload);
      })
      .addCase(addReview.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Delete review
      .addCase(deletereview.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deletereview.fulfilled, (state, action) => {
        state.status = "succeeded";
        const deletedId = action.payload?._id || action.payload?.id;
        if (deletedId) {
          state.reviews = state.reviews.filter(
            (review) => (review._id || review.id) !== deletedId
          );
        }
      })
      .addCase(deletereview.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Admin approve review
      .addCase(ApprovedAdmin.pending, (state) => {
        state.status = "loading";
      })
      .addCase(ApprovedAdmin.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedReview = action.payload;
        const index = state.reviews.findIndex(
          (review) => review._id === updatedReview._id
        );
        if (index !== -1) {
          state.reviews[index] = updatedReview;
        }
      })
      .addCase(ApprovedAdmin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Get all reviews (admin)
      .addCase(getAllreviews.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllreviews.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reviews = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getAllreviews.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Show reviews (by book)
      .addCase(showReview.pending, (state) => {
        state.status = "loading";
      })
      .addCase(showReview.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reviews = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(showReview.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default reviewSlice.reducer;
