import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Define the initial state
const initialState = {
  user: null,
  accessToken: null,
  status: 'idle',
  error: null,
};

// Create async thunk for user login
export const loginUser = createAsyncThunk(
  'userLogin/loginUser',
  async (userData) => {
    const response = await fetch('https://leather-for-luxury.vercel.app/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Login failed. Invalid credentials or user does not exist.');
    }

    const data = await response.json();
    return data.data; // Return the data containing the user and accessToken
  }
);

// Create the slice
const userLoginSlice = createSlice({
  name: 'userLogin',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null; // Reset error state
    },
    clearUser(state) {
      state.user = null; // Reset user state after logout
      state.accessToken = null; // Clear accessToken as well
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user; // Store user object
        state.accessToken = action.payload.accessToken; // Store accessToken
        state.error = null; // Clear any previous errors
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Login failed. Invalid credentials or user does not exist.';
      });
  },
});

// Export the actions
export const { clearError, clearUser } = userLoginSlice.actions;

// Export the reducer
export default userLoginSlice.reducer;
