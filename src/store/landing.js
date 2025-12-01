import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../server/auth";

// 🔹 Async Thunk for submitting contact form
export const submitContactForm = createAsyncThunk(
    "landing/submitContactForm",
    async (formData, thunkAPI) => {
        try {
            const res = await api.submitContactForm(formData);
            return res.data; // expect success message or submitted data
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || err.message);
        }
    }
);
export const fetchAllmessages = createAsyncThunk(
    "landing/fetchAllmessages",
    async (_, thunkAPI) => {
        try {
            const res = await api.getAllMessages();
            return res.data; // expect success message or submitted data
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || err.message);
        }
    }
);
export const replyToMessage = createAsyncThunk(
    "landing/replyToMessage",
    async ({ id, replyText }, thunkAPI) => {
        try {
            const res = await api.replyToMessage({ id, replyText });
            return res.data; // expect success message or submitted data
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || err.message);
        }
    }
);

// 🔹 Initial State
const initialState = {
    status: "idle", // idle | loading | succeeded | failed
    error: null,
    data: null, // store success response if needed
};

// 🔹 Slice
const contactSlice = createSlice({
    name: "landing",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(submitContactForm.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(submitContactForm.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = action.payload;
            })
            .addCase(submitContactForm.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(fetchAllmessages.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchAllmessages.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = action.payload;
            })
            .addCase(fetchAllmessages.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(replyToMessage.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(replyToMessage.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = action.payload;
            })
            .addCase(replyToMessage.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });



    },
});

export default contactSlice.reducer;
//         state.books.push(action.payload);
//         state.status = "succeeded";
