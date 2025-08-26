// authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../server/auth";

// ================= Async Thunks =================

// Login
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ formData, navigate, toast }, { rejectWithValue }) => {
    try {
      const response = await api.login(formData);

      // Save user & token to localStorage
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      toast.success("Login successful!");
      navigate("/admin-dashboard");
      return response.data; // expects { user: {...}, accessToken: "..." }
    } catch (error) {
      toast.error("Login failed! Please check your credentials.");
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Signup
export const signupUser = createAsyncThunk(
  "auth/signup",
  async ({ formData, navigate, toast }, { rejectWithValue }) => {
    try {
      const response = await api.signup(formData);
      toast.success("Signup successful!");
      navigate("/login");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Fetch Dashboard/User info
export const fetchDashboard = createAsyncThunk(
  "auth/dashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.Dashboard();
      return response.data; // expects { user: {...} }
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async ({ navigate, toast }, { rejectWithValue }) => {
    try {
      const response = await api.logout();

      // Clear localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      toast.success("Logout successful!");
      navigate("/login");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Refresh Token
export const refreshToken = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.refresh();

      // Save new token
      localStorage.setItem("accessToken", response.data.accessToken);
      return response.data; // expects { accessToken: "..." }
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ================= Auth Slice =================
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    accessToken: localStorage.getItem("accessToken") || null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      // Signup
      .addCase(signupUser.fulfilled, (state) => {
        state.status = "succeeded";
      })
      // Dashboard
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;

        // keep user in localStorage updated
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = "succeeded";
        state.user = null;
        state.accessToken = null;
      })
      // Refresh Token
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.accessToken = action.payload.accessToken;
      })

      // Common Pending Handler
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.status = "loading";
          state.error = null;
        }
      )
      // Common Rejected Handler
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.payload?.message || "Something went wrong";

          // If token refresh fails, clear user/token
          if (action.type.startsWith("auth/refresh")) {
            state.user = null;
            state.accessToken = null;
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
          }
        }
      );
  },
});

export default authSlice.reducer;
