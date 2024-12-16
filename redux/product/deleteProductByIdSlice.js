import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const deleteProductById = createAsyncThunk(
  "products/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `https://leather-for-luxury.vercel.app/api/v1/product/delete/${id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const deleteProductByIdSlice = createSlice({
  name: "deleteProduct",
  initialState: {
    success: false,
    isLoading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProductById.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
      })
      .addCase(deleteProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default deleteProductByIdSlice.reducer;
