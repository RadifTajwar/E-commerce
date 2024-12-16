import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch all parent categories
export const fetchAllParentCategories = createAsyncThunk(
    "parentCategories/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("https://leather-for-luxury.vercel.app/api/v1/parent-category");
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
const allParentCategorySlice = createSlice({
    name: "parentCategories",
    initialState: {
        parentCategories: [], // List of parent categories
        isLoading: false, // Loading state
        error: null, // Error state
    },
    reducers: {}, // No synchronous reducers needed in this case
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllParentCategories.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAllParentCategories.fulfilled, (state, action) => {
                state.isLoading = false;
                state.parentCategories = action.payload;
            })
            .addCase(fetchAllParentCategories.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

// Export the reducer
export default allParentCategorySlice.reducer;
