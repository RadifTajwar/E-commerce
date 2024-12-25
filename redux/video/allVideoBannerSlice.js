import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch all video banners
export const fetchAllVideoBanners = createAsyncThunk(
    "videoBanners/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("https://leather-for-luxury.vercel.app/api/v1/banner/all-VideoBanner");
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
const allVideoBannerSlice = createSlice({
    name: "videoBanners",
    initialState: {
        videoBanners: [], // List of video banners
        isLoading: false, // Loading state
        error: null, // Error state
    },
    reducers: {}, // No synchronous reducers needed in this case
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllVideoBanners.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAllVideoBanners.fulfilled, (state, action) => {
                state.isLoading = false;
                state.videoBanners = action.payload;
            })
            .addCase(fetchAllVideoBanners.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

// Export the reducer
export default allVideoBannerSlice.reducer;
