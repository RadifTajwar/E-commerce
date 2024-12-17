// src/store/slices/createOrderSlice.js

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state of the slice
const initialState = {
  order: [],
  isLoading: false,
  error: null,
};

// Define the async thunk for creating an order
export const createOrder = createAsyncThunk(
  'createOrder/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'https://leather-for-luxury.vercel.app/api/v1/order/create-order',
        orderData
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message || 'Failed to create order'
        );
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

// Create the slice
const createOrderSlice = createSlice({
  name: 'createOrder',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default createOrderSlice.reducer;
