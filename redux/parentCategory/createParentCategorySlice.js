import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Async thunk for creating a parent category
export const createParentCategory = createAsyncThunk(
  'parentCategory/create',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/parent-category/create-parent', {
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
    loading: false,
    error: null,
  },
  reducers: {}, // Optional: Add reducers for local actions
  extraReducers: (builder) => {
    builder
      .addCase(createParentCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createParentCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(createParentCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default parentCategorySlice.reducer;
