import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state
const initialState = {
  order: null,
  isLoading: false,
  error: null,
};

// Async thunk for fetching order by ID
export const fetchOrderByUser = createAsyncThunk(
  "order/fetchById",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://leather-for-luxury.vercel.app/api/v1/order/User/${email}`
      );
      return response.data.data; // Assuming the response contains the order data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to fetch order"
        );
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

// Create slice
const getOrderByUserSlice = createSlice({
  name: "orderByUser",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload; // Populate the state with the fetched order
      })
      .addCase(fetchOrderByUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch order";
      });
  },
});

export default getOrderByUserSlice.reducer;
