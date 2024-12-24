// redux/heroBanner/updateHeroBannerSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the async thunk for updating a hero banner
export const updateHeroBanner = createAsyncThunk(
  'heroBanner/updateHeroBanner',
  async ({ id, bannerData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/v1/banner/Update-Top-Banner/:id/${id}`,
        bannerData
      );
      console.log("heroBannerData sent", bannerData);
      return response.data.data; // Return the updated hero banner data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update hero banner"); // Handle error
    }
  }
);

// Create a slice to handle hero banner updates
const updateHeroBannerSlice = createSlice({
  name: 'heroBanner/updateHeroBanner',
  initialState: {
    heroBannerData: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateHeroBanner.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(updateHeroBanner.fulfilled, (state, action) => {
        state.isLoading = false;
        state.heroBannerData = action.payload; // Store the updated hero banner data
      })
      .addCase(updateHeroBanner.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // Store the error message
      });
  },
});

export default updateHeroBannerSlice.reducer;
