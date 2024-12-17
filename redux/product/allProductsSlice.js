import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state
const initialState = {
  products: [],
  meta: { total: 0, limit: 0, page: 0 },
  isLoading: false,
  error: null,
};

// Async thunk for fetching all products
export const fetchAllProducts = createAsyncThunk(
  "products/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      // Construct query string if parameters are provided
      const queryParams = params
        ? `?${new URLSearchParams({
            ...(params.page && { page: params.page.toString() }),
            ...(params.limit && { limit: params.limit.toString() }),
            ...(params.searchTerm && { searchTerm: params.searchTerm }),
          })}`
        : "";

      // Make the request with or without query params
      const response = await axios.get(
        `https://leather-for-luxury.vercel.app/api/v1/product${queryParams}`
      );
      return {
        products: response.data.data, // Just return `data` as products
        meta: response.data.meta, // Return `meta` separately
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to fetch products"
        );
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

// Create slice
const allProductSlice = createSlice({
  name: "allProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        // Set both data and meta from action payload
        state.products = action.payload.products; // Populate products with data
        state.meta = action.payload.meta; // Populate meta with pagination info (or other metadata)
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch products";
      });
  },
});

export default allProductSlice.reducer;
