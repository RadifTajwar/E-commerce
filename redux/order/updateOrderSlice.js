import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for the PATCH request
export const updateOrderStatus = createAsyncThunk(
  "order/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `https://leather-for-luxury.vercel.app/api/v1/order/update/${id}`,
        { status }
      );
      return response.data.data; // Assuming API returns the updated order data
    } catch (error) {
      // Handle error and reject
      return rejectWithValue(
        error.response?.data || "Something went wrong while updating the order status"
      );
    }
  }
);


const updateCategorySlice = createSlice({
  name: "updateCategory",
  initialState: {
    isLoading: false,
    order: null,
    error: null,
  },
  reducers: {
    clearState: (state) => {
      state.isLoading = false;
      state.order = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
        state.error = null;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.order = null;
        state.error = action.payload;
      });
  },
});

export const { clearState } = updateCategorySlice.actions;
export default updateCategorySlice.reducer;
