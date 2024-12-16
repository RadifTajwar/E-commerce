// redux/category/updateParentCategoryDataSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the async thunk for making the API call to update the parent category
export const updateParentCategoryData = createAsyncThunk(
  'category/updateParentCategoryData',
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `https://leather-for-luxury.vercel.app/api/v1/parent-category/update/${id}`,
        categoryData
      );
      console.log("parentCategoryData sent", categoryData);
      return response.data.data; // Return the updated parent category data
    } catch (error) {
      return rejectWithValue(error.response.data); // Return the error response if the request fails
    }
  }
);

// Create a slice to handle parent category data updates
const updateParentCategoryDataSlice = createSlice({
  name: 'category/updateParentCategoryData',
  initialState: {
    parentCategoryData: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateParentCategoryData.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(updateParentCategoryData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.parentCategoryData = action.payload; // Store the updated parent category data
      })
      .addCase(updateParentCategoryData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // Store the error message
      });
  },
});

export default updateParentCategoryDataSlice.reducer;
