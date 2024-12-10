import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAllProducts = createAsyncThunk(
  "products/fetchAll",
  
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:5000/api/v1/product");
      // console.log("entry nise",response.data.data);
      return response.data.data;
      
    } catch (error) {
      console.log("entry vul nise");
      return rejectWithValue(error.response?.data);
    }
  }
);

const allProductSlice = createSlice({
  name: "allProducts",
  initialState: {
    products: [],
    isLoading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
        console.log("inside",state.products);
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default allProductSlice.reducer;
