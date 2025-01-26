import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch ratings by productId
export const getRatingById = createAsyncThunk(
  'rating/getRatingById',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://leather-for-luxury.vercel.app/api/v1/product/rating/${productId}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.data || 'An error occurred');
    }
  }
);

const getRatingByIdSlice = createSlice({
  name: 'getRatingById',
  initialState: {
    isLoading: false,
    data: null,
    error: null,
  },
  reducers: {
    resetRatingByIdState: (state) => {
      state.isLoading = false;
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRatingById.pending, (state) => {
        state.isLoading = true;
        state.data = null;
        state.error = null;
      })
      .addCase(getRatingById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(getRatingById.rejected, (state, action) => {
        state.isLoading = false;
        state.data = null;
        state.error = action.payload;
      });
  },
});

export const { resetRatingByIdState } = getRatingByIdSlice.actions;

export default getRatingByIdSlice.reducer;
