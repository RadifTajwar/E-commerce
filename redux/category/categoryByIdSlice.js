import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Define the API endpoint for fetching a category by ID
const API_CATEGORY_BY_ID_URL = "https://leather-for-luxury.vercel.app/api/v1/category/ById";

// Create an async thunk for fetching a category by ID
export const fetchCategoryById = createAsyncThunk(
  "categoryById/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_CATEGORY_BY_ID_URL}/${id}`);
      return response.data.data; // Return the category data based on the ID
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch category by ID");
    }
  }
);

// Create the slice
const categoryByIdSlice = createSlice({
  name: "categoryById",
  initialState: {
    categoryData: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearCategoryData: (state) => {
      state.categoryData = null; // Clear the category data
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoryById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categoryData = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCategoryData } = categoryByIdSlice.actions;

export default categoryByIdSlice.reducer;
