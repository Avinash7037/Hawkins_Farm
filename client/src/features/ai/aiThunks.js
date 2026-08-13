import { createAsyncThunk } from "@reduxjs/toolkit";

import { askHawkinsAI as askHawkinsAIService } from "./services/aiService";

// =====================================================
// Ask Hawkins AI
// =====================================================

export const askHawkinsAI = createAsyncThunk(
  "ai/askHawkinsAI",

  async (message, thunkAPI) => {
    try {
      return await askHawkinsAIService(message);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.detail ||
          error.message ||
          "Failed to get response from Hawkins AI",
      );
    }
  },
);
