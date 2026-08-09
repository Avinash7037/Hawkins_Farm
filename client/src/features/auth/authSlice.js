import { createSlice } from "@reduxjs/toolkit";

import { login, register, fetchProfile } from "./authThunks";

import { connectSocket, disconnectSocket } from "../../socket";

const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,

  token: storedToken || null,

  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    // ===================================================
    // Logout
    // ===================================================

    logout: (state) => {
      disconnectSocket();

      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;

      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },

    // ===================================================
    // Clear Error
    // ===================================================

    clearError: (state) => {
      state.error = null;
    },
  },

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

        localStorage.setItem("user", JSON.stringify(action.payload.user));

        localStorage.setItem("token", action.payload.token);

        // Connect Socket.IO using the new JWT
        connectSocket(action.payload.token);
      })

      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
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

        // If registration returns a token,
        // connect Socket.IO immediately.
        if (action.payload?.token) {
          state.user = action.payload.user;
          state.token = action.payload.token;

          localStorage.setItem("user", JSON.stringify(action.payload.user));

          localStorage.setItem("token", action.payload.token);

          connectSocket(action.payload.token);
        }
      })

      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // =================================================
      // PROFILE
      // =================================================

      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;

        // If a valid stored token exists,
        // connect Socket.IO when the profile loads.
        if (state.token) {
          connectSocket(state.token);
        }
      });
  },
});

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;
