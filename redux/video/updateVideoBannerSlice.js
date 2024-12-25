// redux/videoBanner/updateVideoBannerSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the async thunk for updating a video banner
export const updateVideoBanner = createAsyncThunk(
  'videoBanner/updateVideoBanner',
  async ({ id, bannerData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `https://leather-for-luxury.vercel.app/api/v1/banner/Update-Video-Banner/${id}`,
        bannerData
      );
      console.log("videoBannerData sent", bannerData);
      return response.data.data; // Return the updated video banner data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update video banner"); // Handle error
    }
  }
);

// Create a slice to handle video banner updates
const updateVideoBannerSlice = createSlice({
  name: 'videoBanner/updateVideoBanner',
  initialState: {
    videoBannerData: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateVideoBanner.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(updateVideoBanner.fulfilled, (state, action) => {
        state.isLoading = false;
        state.videoBannerData = action.payload; // Store the updated video banner data
      })
      .addCase(updateVideoBanner.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // Store the error message
      });
  },
});

export default updateVideoBannerSlice.reducer;
