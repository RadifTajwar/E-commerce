import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { authService, type LoginResponse } from "@/services/auth.service";
import type { LoginInput, RegisterInput, Session, User } from "@/types/user";
import { createApiThunk } from "../create-request-slice";

type Status = "idle" | "loading" | "succeeded" | "failed";

/**
 * Session state. The token itself lives in an httpOnly cookie set by
 * /api/auth/login; the browser only ever sees { email, role, expiresAt }.
 */
export interface AuthState {
  user: User | null;
  session: Session | null;
  /** Login request status (kept as `status` for the existing forms). */
  status: Status;
  error: string | null;
  /** Whether the session has been checked with the server since page load. */
  sessionStatus: Status;
}

export const loginUser = createApiThunk<LoginResponse, LoginInput>("userLogin/loginUser", (input) =>
  authService.login(input),
);
export const logoutUser = createApiThunk<null, void>("userLogin/logoutUser", () => authService.logout());
export const fetchSession = createApiThunk<Session | null, void>("userLogin/fetchSession", () =>
  authService.getSession(),
);

const initialAuth: AuthState = { user: null, session: null, status: "idle", error: null, sessionStatus: "idle" };

const authSlice = createSlice({
  name: "userLogin",
  initialState: initialAuth,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearUser(state) {
      state.user = null;
      state.session = null;
      state.status = "idle";
    },
    setSession(state, action: PayloadAction<Session | null>) {
      state.session = action.payload;
      state.sessionStatus = "succeeded";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.session = action.payload.session;
        state.sessionStatus = "succeeded";
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Login failed. Invalid credentials or user does not exist.";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.session = null;
        state.status = "idle";
        state.sessionStatus = "succeeded";
      })
      .addCase(fetchSession.pending, (state) => {
        state.sessionStatus = "loading";
      })
      .addCase(fetchSession.fulfilled, (state, action) => {
        state.session = action.payload;
        state.sessionStatus = "succeeded";
      })
      .addCase(fetchSession.rejected, (state) => {
        state.session = null;
        state.sessionStatus = "failed";
      });
  },
});

// ---- registration (store key `createUser`, unchanged) -------------------------
export interface CreateUserState {
  user: User | null;
  status: Status;
  error: string | null;
}

export const createUser = createApiThunk<User, RegisterInput>("userCreate/createUser", (input) =>
  authService.register(input),
);

const createUserSlice = createSlice({
  name: "userCreate",
  initialState: { user: null, status: "idle", error: null } as CreateUserState,
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
        state.error = action.payload ?? "User creation failed. Mail already exists.";
      });
  },
});

export const { clearError, clearUser, setSession } = authSlice.actions;
export const { resetState: resetCreateUser } = createUserSlice.actions;
export const authReducer = authSlice.reducer;
export const createUserReducer = createUserSlice.reducer;
