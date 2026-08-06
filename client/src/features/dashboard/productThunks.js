import { createAsyncThunk } from "@reduxjs/toolkit";
import { getFarmerProducts } from "./productService";

export const fetchFarmerProducts = createAsyncThunk(
  "dashboard/fetchFarmerProducts",
  async (_, thunkAPI) => {
    try {
      return await getFarmerProducts();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch products",
      );
    }
  },
);
