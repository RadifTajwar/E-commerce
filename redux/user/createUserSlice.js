import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Define the initial state
const initialState = {
  user: null,
  status: "idle",
  error: null,
};

// Create async thunk for user creation
export const createUser = createAsyncThunk(
  "userCreate/createUser",
  async (userData) => {
    const response = await fetch(
      "https://leather-for-luxury.vercel.app/api/v1/user/create-user",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );

    if (!response.ok) {
      throw new Error("User creation failed!.Mail already exist");
    }

    const data = await response.json();
    return data.data; // Assume API returns user data upon success
  }
);

const userCreateSlice = createSlice({
  name: "userCreate",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    resetState(state) {
      state.status = "idle";
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.error = null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.error.message ?? "User creation failed. Mail already exists.";
      });
  },
});

// Export the new action
export const { clearError, resetState } = userCreateSlice.actions;

// Export the reducer
export default userCreateSlice.reducer;
