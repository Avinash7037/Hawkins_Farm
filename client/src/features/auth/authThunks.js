import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  registerUser,
  loginUser,
  forgotPassword as forgotPasswordRequest,
  resetPassword as resetPasswordRequest,
  getProfile,
  updateProfile as updateProfileRequest,
  changePassword as changePasswordRequest,
} from "./services/authService";

// =====================================================
// Register
// =====================================================

export const register = createAsyncThunk(
  "auth/register",

  async (userData, thunkAPI) => {
    try {
      return await registerUser(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Registration failed",
      );
    }
  },
);

// =====================================================
// Login
// =====================================================

export const login = createAsyncThunk(
  "auth/login",

  async (credentials, thunkAPI) => {
    try {
      return await loginUser(credentials);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed",
      );
    }
  },
);

// =====================================================
// Forgot Password
// =====================================================

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",

  async (email, thunkAPI) => {
    try {
      return await forgotPasswordRequest(email);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to generate password reset link",
      );
    }
  },
);

// =====================================================
// Reset Password
// =====================================================

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",

  async ({ token, password }, thunkAPI) => {
    try {
      return await resetPasswordRequest(token, password);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to reset password",
      );
    }
  },
);

// =====================================================
// Fetch Profile
// =====================================================

export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",

  async (_, thunkAPI) => {
    try {
      return await getProfile();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile",
      );
    }
  },
);

// =====================================================
// Update Profile
// =====================================================

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",

  async (profileData, thunkAPI) => {
    try {
      return await updateProfileRequest(profileData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update profile",
      );
    }
  },
);

// =====================================================
// Change Password
// =====================================================

export const changePassword = createAsyncThunk(
  "auth/changePassword",

  async (passwordData, thunkAPI) => {
    try {
      return await changePasswordRequest(passwordData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to change password",
      );
    }
  },
);
