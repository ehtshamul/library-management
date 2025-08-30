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
export const deletereview = createAsyncThunk(
  "reviews/delete",
  async (Reviewsid, thunkApi) => {
    try {
      const response = await api.deleteReview(Reviewsid);
      // backend returns { message, review } - normalize to return the deleted review
      return response.data?.review || response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data || "Server error");
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
        state.error = action.payload;
      })
      // delete review 

      .addCase(deletereview.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deletereview.fulfilled, (state, action) => {
        state.status = "succeeded";
        // action.payload may be the deleted review or an object containing .review
        const deleted = action.payload?.review || action.payload;
        const deletedId = deleted?._id || deleted?.id;
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
        state.error = action.payload;
      });
  },
});

export default reviewSlice.reducer;
