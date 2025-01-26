import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to send rating
export const sendRating = createAsyncThunk(
  'rating/sendRating',
  async (ratingData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'http://leather-for-luxury.vercel.app/api/v1/product/rating',
        ratingData
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.data || 'An error occurred');
    }
  }
);

const ratingSlice = createSlice({
  name: 'rating',
  initialState: {
    isLoading: false,
    isSuccess: false,
    error: null,
  },
  reducers: {
    resetRatingState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendRating.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(sendRating.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.error = null;
      })
      .addCase(sendRating.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error = action.payload;
      });
  },
});

export const { resetRatingState } = ratingSlice.actions;

export default ratingSlice.reducer;
