import { createAsyncThunk } from "@reduxjs/toolkit";

import { getFarmerOrders, updateOrderStatus } from "./services/orderService";

export const fetchFarmerOrders = createAsyncThunk(
  "dashboard/fetchFarmerOrders",
  async (_, thunkAPI) => {
    try {
      return await getFarmerOrders();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders",
      );
    }
  },
);

export const updateFarmerOrderStatus = createAsyncThunk(
  "dashboard/updateFarmerOrderStatus",
  async ({ id, orderStatus }, thunkAPI) => {
    try {
      return await updateOrderStatus({
        id,
        orderStatus,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update order",
      );
    }
  },
);
