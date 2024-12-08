import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the API endpoint for creating a category
const API_URL = "http://localhost:5000/api/v1/category/create-category";

// Create an async thunk for creating a category
export const createCategory = createAsyncThunk(
  "createCategory/create",
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, categoryData);
      return response.data.data; // Return the created category data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create category");
    }
  }
);

// Create the slice
const createCategorySlice = createSlice({
  name: "createCategory",
  initialState: {
    isLoading: false,
    successMessage: null,
    error: null,
  },
  reducers: {
    clearSuccessMessage: (state) => {
      state.successMessage = null; // Clear the success message
    },
    clearError: (state) => {
      state.error = null; // Clear the error message
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = "Category created successfully!";
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to create category";
      });
  },
});

export const { clearSuccessMessage, clearError } = createCategorySlice.actions;

export default createCategorySlice.reducer;
