import { createAsyncThunk } from "@reduxjs/toolkit";

import { getFarmerDashboard } from "./dashboardService";

// =====================================================
// Fetch Farmer Dashboard
// =====================================================

export const fetchFarmerDashboard = createAsyncThunk(
  "dashboard/fetchFarmerDashboard",

  async (period = "30d", thunkAPI) => {
    try {
      return await getFarmerDashboard(period);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load dashboard",
      );
    }
  },
);
