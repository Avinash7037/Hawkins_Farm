import { createAsyncThunk } from "@reduxjs/toolkit";
import { getFarmerDashboard } from "./dashboardService";

export const fetchFarmerDashboard = createAsyncThunk(
  "dashboard/fetchFarmerDashboard",
  async (_, thunkAPI) => {
    try {
      return await getFarmerDashboard();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load dashboard",
      );
    }
  },
);
