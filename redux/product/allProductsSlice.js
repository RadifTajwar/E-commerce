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
      const queryParams = params
        ? `?${new URLSearchParams({
            ...(params.page && { page: params.page.toString() }),
            ...(params.limit && { limit: params.limit.toString() }),
            ...(params.searchTerm && { searchTerm: params.searchTerm }),
            ...(params.categoryId && { categoryId: params.categoryId }),
            ...(params.parentCategoryId && { parentCategoryId: params.parentCategoryId }),
            ...(params.startPrice && params.endPrice &&  { startPrice: Number(params.startPrice),endPrice: Number(params.endPrice) }),
            ...(params.colorName && { colorName: params.colorName }),
            ...(params.sortOrder && { sortOrder: params.sortOrder, sortBy: params.sortBy }),
            ...(params.inStock && { inStock: params.inStock }),
            ...(params.onSale && { onSale: params.onSale }),
          })}`
        : "";


      const response = await axios.get(
        `https://leather-for-luxury.vercel.app/api/v1/product${queryParams}`
      );
   
      return {
        products: response.data.data,
        meta: response.data.meta,
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
  reducers: {
    // Clear state function to reset all data
    clearState: (state) => {
      state.products = [];
      state.meta = { total: 0, limit: 0, page: 0 };
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.meta = action.payload.meta;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch products";
      });
  },
});

// Export the `clearState` action
export const { clearState } = allProductSlice.actions;

// Export the reducer
export default allProductSlice.reducer;
