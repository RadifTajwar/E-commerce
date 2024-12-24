import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Define the API endpoint for fetching a hero banner by ID
const API_HERO_BANNER_BY_ID_URL = "http://localhost:5000/api/v1/banner/Top-Banner";

// Create an async thunk for fetching a hero banner by ID
export const fetchHeroBannerById = createAsyncThunk(
  "heroBannerById/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_HERO_BANNER_BY_ID_URL}/${id}`);
      return response.data.data; // Return the hero banner data based on the ID
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch hero banner by ID");
    }
  }
);

// Create the slice
const heroBannerByIdSlice = createSlice({
  name: "heroBannerById",
  initialState: {
    heroBannerData: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearHeroBannerData: (state) => {
      state.heroBannerData = null; // Clear the hero banner data
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHeroBannerById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHeroBannerById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.heroBannerData = action.payload;
      })
      .addCase(fetchHeroBannerById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearHeroBannerData } = heroBannerByIdSlice.actions;

export default heroBannerByIdSlice.reducer;
