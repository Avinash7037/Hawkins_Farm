import { createSlice } from "@reduxjs/toolkit";

import {
  login,
  register,
  forgotPassword,
  resetPassword,
  fetchProfile,
  updateProfile,
  changePassword,
} from "./authThunks";

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

  // ===================================================
  // Forgot Password
  // ===================================================

  forgotPasswordLoading: false,

  forgotPasswordError: null,

  resetUrl: null,

  // ===================================================
  // Reset Password
  // ===================================================

  resetPasswordLoading: false,

  resetPasswordError: null,

  resetPasswordSuccess: false,
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
      disconnectSocket();

      state.user = null;

      state.token = null;

      state.loading = false;

      state.error = null;

      localStorage.removeItem("user");

      localStorage.removeItem("token");
    },

    // =================================================
    // Clear Error
    // =================================================

    clearError: (state) => {
      state.error = null;
    },

    // =================================================
    // Clear Password Reset State
    // =================================================

    clearPasswordResetState: (state) => {
      state.forgotPasswordLoading = false;

      state.forgotPasswordError = null;

      state.resetUrl = null;

      state.resetPasswordLoading = false;

      state.resetPasswordError = null;

      state.resetPasswordSuccess = false;
    },
  },

  // ===================================================
  // Async Actions
  // ===================================================

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

        if (action.payload?.token) {
          state.user = action.payload.user;

          state.token = action.payload.token;

          localStorage.setItem("user", JSON.stringify(action.payload.user));

          localStorage.setItem("token", action.payload.token);

          connectSocket(action.payload.token, action.payload.user?._id);
        }
      })

      .addCase(register.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || "Registration failed";
      })

      // =================================================
      // FORGOT PASSWORD
      // =================================================

      .addCase(forgotPassword.pending, (state) => {
        state.forgotPasswordLoading = true;

        state.forgotPasswordError = null;

        state.resetUrl = null;
      })

      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.forgotPasswordLoading = false;

        state.forgotPasswordError = null;

        state.resetUrl = action.payload?.resetUrl || null;
      })

      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotPasswordLoading = false;

        state.forgotPasswordError =
          action.payload || "Failed to generate reset link";
      })

      // =================================================
      // RESET PASSWORD
      // =================================================

      .addCase(resetPassword.pending, (state) => {
        state.resetPasswordLoading = true;

        state.resetPasswordError = null;

        state.resetPasswordSuccess = false;
      })

      .addCase(resetPassword.fulfilled, (state) => {
        state.resetPasswordLoading = false;

        state.resetPasswordError = null;

        state.resetPasswordSuccess = true;
      })

      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPasswordLoading = false;

        state.resetPasswordSuccess = false;

        state.resetPasswordError = action.payload || "Failed to reset password";
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

        localStorage.setItem("user", JSON.stringify(action.payload.user));

        if (state.token && action.payload.user?._id) {
          connectSocket(state.token, action.payload.user._id);
        }
      })

      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || "Failed to fetch profile";
      })

      // =================================================
      // UPDATE PROFILE
      // =================================================

      .addCase(updateProfile.pending, (state) => {
        state.loading = true;

        state.error = null;
      })

      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;

        state.user = action.payload.user;

        localStorage.setItem("user", JSON.stringify(action.payload.user));

        state.error = null;
      })

      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || "Failed to update profile";
      })

      // =================================================
      // CHANGE PASSWORD
      // =================================================

      .addCase(changePassword.pending, (state) => {
        state.loading = true;

        state.error = null;
      })

      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;

        state.error = null;
      })

      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || "Failed to change password";
      });
  },
});

// =====================================================
// Actions
// =====================================================

export const { logout, clearError, clearPasswordResetState } =
  authSlice.actions;

// =====================================================
// Reducer
// =====================================================

export default authSlice.reducer;
