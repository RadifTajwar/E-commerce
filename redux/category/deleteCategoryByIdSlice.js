import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Define the API endpoint for deleting a category
const API_URL = "http://localhost:5000/api/v1/category/delete";

// Create an async thunk for deleting a category by ID
export const deleteCategoryById = createAsyncThunk(
  "deleteCategoryById/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data.data; // Return the response data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete category");
    }
  }
);

// Create the slice
const deleteCategoryByIdSlice = createSlice({
  name: "deleteCategoryById",
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
      .addCase(deleteCategoryById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteCategoryById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = "Category deleted successfully!";
      })
      .addCase(deleteCategoryById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to delete category";
      });
  },
});

export const { clearSuccessMessage } = deleteCategoryByIdSlice.actions;

export default deleteCategoryByIdSlice.reducer;
