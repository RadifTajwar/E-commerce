import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state
const initialState = {
  order: null,
  isLoading: false,
  error: null,
};

// Async thunk for fetching order by ID
export const fetchOrderById = createAsyncThunk(
  "order/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://leather-for-luxury.vercel.app/api/v1/order/ById/${id}`);
      return response.data.data; // Assuming the response contains the order data
    } catch (error) {
      console.log(id,"yes it is what it is");
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || "Failed to fetch order");
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

// Create slice
const getOrderByIdSlice = createSlice({
  name: "orderById",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload; // Populate the state with the fetched order
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch order";
      });
  },
});

export default getOrderByIdSlice.reducer;
