import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const updateProductData = createAsyncThunk(
  "products/update",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `https://leather-for-luxury.vercel.app/api/v1/product/update/${id}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const updateProductDataSlice = createSlice({
  name: "updateProduct",
  initialState: {
    success: false,
    isLoading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProductData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProductData.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
      })
      .addCase(updateProductData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default updateProductDataSlice.reducer;
