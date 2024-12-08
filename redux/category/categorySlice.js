import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Define the API endpoints
const API_URL = "http://localhost:5000/api/v1/category";
const API_CATEGORY_BY_ID_URL = "http://localhost:5000/api/v1/category/ById";

// Create an async thunk for fetching all categories
export const fetchAllCategories = createAsyncThunk(
  "categories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data.data; // Return the categories data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch categories");
    }
  }
);

// Create an async thunk for fetching a category by ID
export const fetchCategoryById = createAsyncThunk(
  "category/fetchById",
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
const categorySlice = createSlice({
  name: "categories",
  initialState: {
    categories: [],        // All categories
    categoryData: null,    // Single category data based on ID
    categoryId: null,      // Currently selected category ID
    isLoading: false,
    error: null,
  },
  reducers: {
    setCategoryId: (state, action) => {
      state.categoryId = action.payload; // Set the categoryId for fetching by ID
    },
    clearCategoryData: (state) => {
      state.categoryData = null;  // Clear the category data
      state.categoryId = null;    // Reset the selected category ID
    },
  },
  extraReducers: (builder) => {
    builder
      // For fetching all categories
      .addCase(fetchAllCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // For fetching category by ID
      .addCase(fetchCategoryById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categoryData = action.payload;  // Store the fetched category data
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // Handle errors
      });
  },
});

// Export the actions
export const { setCategoryId, clearCategoryData } = categorySlice.actions;

export default categorySlice.reducer;
