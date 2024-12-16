import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Define the API endpoint for fetching a parent category by ID
const API_PARENT_CATEGORY_BY_ID_URL = "https://leather-for-luxury.vercel.app/api/v1/parent-category/ById";

// Create an async thunk for fetching a parent category by ID
export const fetchParentCategoryById = createAsyncThunk(
  "parentCategoryById/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_PARENT_CATEGORY_BY_ID_URL}/${id}`);
      return response.data.data; // Return the parent category data based on the ID
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch parent category by ID");
    }
  }
);

// Create the slice
const parentCategoryByIdSlice = createSlice({
  name: "parentCategoryById",
  initialState: {
    parentCategoryData: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearParentCategoryData: (state) => {
      state.parentCategoryData = null; // Clear the parent category data
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchParentCategoryById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchParentCategoryById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.parentCategoryData = action.payload;
      })
      .addCase(fetchParentCategoryById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearParentCategoryData } = parentCategoryByIdSlice.actions;

export default parentCategoryByIdSlice.reducer;
