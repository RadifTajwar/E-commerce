// redux/category/updateCategoryDataSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the async thunk for making the API call to update the category
export const updateCategoryData = createAsyncThunk(
  'category/updateCategoryData',
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      
      const response = await axios.patch(
        `https://leather-for-luxury.vercel.app/api/v1/category/update/${id}`,
        categoryData
      );
      console.log("categoryData ashche vaia", categoryData);
      return response.data.data; // Return the updated category data
    } catch (error) {
      return rejectWithValue(error.response.data); // Return the error response if the request fails
    }
  }
);

// Create a slice to handle category data updates
const updateCategoryDataSlice = createSlice({
  name: 'category/updateCategoryData',
  initialState: {
    categoryData: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateCategoryData.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(updateCategoryData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categoryData = action.payload; // Store the updated category data
      })
      .addCase(updateCategoryData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // Store the error message
      });
  },
});

export default updateCategoryDataSlice.reducer;
