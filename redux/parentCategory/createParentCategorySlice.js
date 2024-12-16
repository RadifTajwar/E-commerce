import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Async thunk for creating a parent category
export const createParentCategory = createAsyncThunk(
  'parentCategory/create',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await fetch('https://leather-for-luxury.vercel.app/api/v1/parent-category/create-parent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        throw new Error('Failed to create category');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const parentCategorySlice = createSlice({
  name: 'parentCategory',
  initialState: {
    categories: [],
    isLoading: false,
    error: null,
  },
  reducers: {}, // Optional: Add reducers for local actions
  extraReducers: (builder) => {
    builder
      .addCase(createParentCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createParentCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories.push(action.payload);
      })
      .addCase(createParentCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default parentCategorySlice.reducer;
