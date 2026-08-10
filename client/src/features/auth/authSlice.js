import { createSlice } from "@reduxjs/toolkit";

import { login, register, fetchProfile } from "./authThunks";

import { connectSocket, disconnectSocket } from "../../socket";

// =====================================================
// Stored Authentication Data
// =====================================================

const storedUser = localStorage.getItem("user");

const storedToken = localStorage.getItem("token");

// =====================================================
// Initial State
// =====================================================

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,

  token: storedToken || null,

  loading: false,

  error: null,
};

// =====================================================
// Auth Slice
// =====================================================

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    // =================================================
    // Logout
    // =================================================

    logout: (state) => {
      // -------------------------------------------------
      // Disconnect Socket
      // -------------------------------------------------

      disconnectSocket();

      // -------------------------------------------------
      // Clear Redux State
      // -------------------------------------------------

      state.user = null;

      state.token = null;

      state.loading = false;

      state.error = null;

      // -------------------------------------------------
      // Clear Local Storage
      // -------------------------------------------------

      localStorage.removeItem("user");

      localStorage.removeItem("token");
    },

    // =================================================
    // Clear Error
    // =================================================

    clearError: (state) => {
      state.error = null;
    },
  },

  // =====================================================
  // Async Actions
  // =====================================================

  extraReducers: (builder) => {
    builder

      // =================================================
      // LOGIN
      // =================================================

      .addCase(login.pending, (state) => {
        state.loading = true;

        state.error = null;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;

        state.user = action.payload.user;

        state.token = action.payload.token;

        // -------------------------------------------------
        // Persist Authentication
        // -------------------------------------------------

        localStorage.setItem("user", JSON.stringify(action.payload.user));

        localStorage.setItem("token", action.payload.token);

        // -------------------------------------------------
        // Connect Socket.IO
        // -------------------------------------------------

        connectSocket(action.payload.token, action.payload.user?._id);
      })

      .addCase(login.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || "Login failed";
      })

      // =================================================
      // REGISTER
      // =================================================

      .addCase(register.pending, (state) => {
        state.loading = true;

        state.error = null;
      })

      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;

        // -------------------------------------------------
        // Registration With Automatic Login
        // -------------------------------------------------

        if (action.payload?.token) {
          state.user = action.payload.user;

          state.token = action.payload.token;

          // -------------------------------------------------
          // Persist Authentication
          // -------------------------------------------------

          localStorage.setItem("user", JSON.stringify(action.payload.user));

          localStorage.setItem("token", action.payload.token);

          // -------------------------------------------------
          // Connect Socket.IO
          // -------------------------------------------------

          connectSocket(action.payload.token, action.payload.user?._id);
        }
      })

      .addCase(register.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || "Registration failed";
      })

      // =================================================
      // FETCH PROFILE
      // =================================================

      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;

        state.error = null;
      })

      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;

        state.user = action.payload.user;

        // -------------------------------------------------
        // Update Stored User
        // -------------------------------------------------

        localStorage.setItem("user", JSON.stringify(action.payload.user));

        // -------------------------------------------------
        // Connect Socket.IO
        // -------------------------------------------------

        if (state.token && action.payload.user?._id) {
          connectSocket(state.token, action.payload.user._id);
        }
      })

      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || "Failed to fetch profile";
      });
  },
});

// =====================================================
// Actions
// =====================================================

export const { logout, clearError } = authSlice.actions;

// =====================================================
// Reducer
// =====================================================

export default authSlice.reducer;
