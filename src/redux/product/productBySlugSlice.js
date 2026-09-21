import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch product by slug
export const fetchProductBySlug = createAsyncThunk(
  "products/fetchBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://leather-for-luxury.vercel.app/api/v1/product/${slug}`
      );
      return response.data.data; // Assuming the response has the product data
    } catch (error) {
      return rejectWithValue(error.response?.data.message || "Failed to fetch product by slug");
    }
  }
);

// Slice definition for fetching product by slug
const productBySlugSlice = createSlice({
  name: "productBySlug",
  initialState: {
    productData: null, // Product data fetched by slug
    isLoading: false, // Loading state
    error: null, // Error state
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductBySlug.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productData = action.payload; // Store the product data
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // Store the error message
      });
  },
});

// Export the reducer
export default productBySlugSlice.reducer;
