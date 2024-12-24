import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch all hero banners
export const fetchAllHeroBanners = createAsyncThunk(
    "heroBanners/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("http://localhost:5000/api/v1/banner/All-Top-Banner/");
            return response.data.data; // Assuming the response contains a `data` field
        } catch (error) {
            return rejectWithValue(
                error.response && error.response.data
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

// Slice definition
const allHeroBannerSlice = createSlice({
    name: "heroBanners",
    initialState: {
        heroBanners: [], // List of hero banners
        isLoading: false, // Loading state
        error: null, // Error state
    },
    reducers: {}, // No synchronous reducers needed in this case
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllHeroBanners.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAllHeroBanners.fulfilled, (state, action) => {
                state.isLoading = false;
                state.heroBanners = action.payload;
            })
            .addCase(fetchAllHeroBanners.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

// Export the reducer
export default allHeroBannerSlice.reducer;
