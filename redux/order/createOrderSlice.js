// src/store/slices/createOrderSlice.js

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state of the slice
const initialState = {
  order: null,
  isLoading: false,
  error: null,
  status: 'idle', // Add a status property
};

// Define the async thunk for creating an order
export const createOrder = createAsyncThunk(
  'createOrder/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/v1/order/create-order',
        orderData
      );
      return response.data.data;
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
  reducers: {
    resetOrder: (state) => {
      state.status = 'idle';
      state.order = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.status = 'loading'; // Update status
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
        state.status = 'succeeded'; // Update status
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.status = 'failed'; // Update status
      });
  },
});

export const { resetOrder } = createOrderSlice.actions;
export default createOrderSlice.reducer;
