import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, registerUser, getProfile } from "./services/authService";

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

export const fetchProfile = createAsyncThunk(
  "auth/profile",
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
