import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Define the API endpoint for fetching a video banner by ID
const API_VIDEO_BANNER_BY_ID_URL = "https://leather-for-luxury.vercel.app/api/v1/banner/Video-Banner";

// Create an async thunk for fetching a video banner by ID
export const fetchVideoBannerById = createAsyncThunk(
  "videoBannerById/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_VIDEO_BANNER_BY_ID_URL}/${id}`);
      return response.data.data; // Return the video banner data based on the ID
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch video banner by ID");
    }
  }
);

// Create the slice
const videoBannerByIdSlice = createSlice({
  name: "videoBannerById",
  initialState: {
    videoBannerData: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearVideoBannerData: (state) => {
      state.videoBannerData = null; // Clear the video banner data
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideoBannerById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVideoBannerById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.videoBannerData = action.payload;
      })
      .addCase(fetchVideoBannerById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearVideoBannerData } = videoBannerByIdSlice.actions;

export default videoBannerByIdSlice.reducer;
