import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Define the API endpoint for deleting a parent category
const API_URL = "https://leather-for-luxury.vercel.app/api/v1/parent-category/delete";

// Create an async thunk for deleting a parent category by ID
export const deleteParentCategoryById = createAsyncThunk(
  "deleteParentCategoryById/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data.data; // Return the response data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete parent category");
    }
  }
);

// Create the slice
const deleteParentCategoryByIdSlice = createSlice({
  name: "deleteParentCategoryById",
  initialState: {
    isLoading: false,
    successMessage: null,
    error: null,
  },
  reducers: {
    clearSuccessMessage: (state) => {
      state.successMessage = null; // Clear the success message
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteParentCategoryById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteParentCategoryById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = "Parent category deleted successfully!";
      })
      .addCase(deleteParentCategoryById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to delete parent category";
      });
  },
});

export const { clearSuccessMessage } = deleteParentCategoryByIdSlice.actions;

export default deleteParentCategoryByIdSlice.reducer;
