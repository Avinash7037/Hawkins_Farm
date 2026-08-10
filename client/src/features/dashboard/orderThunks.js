import { createAsyncThunk } from "@reduxjs/toolkit";

import { getFarmerOrders, updateOrderStatus } from "./services/orderService";

// =====================================================
// Fetch Farmer Orders
// =====================================================

export const fetchFarmerOrders = createAsyncThunk(
  "farmerOrders/fetchFarmerOrders",

  async (_, thunkAPI) => {
    try {
      return await getFarmerOrders();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch farmer orders",
      );
    }
  },
);

// =====================================================
// Update Farmer Order Status
// =====================================================

export const updateFarmerOrderStatus = createAsyncThunk(
  "farmerOrders/updateFarmerOrderStatus",

  async ({ id, orderStatus }, thunkAPI) => {
    try {
      console.log("Thunk order ID:", id, "Status:", orderStatus);

      if (!id) {
        return thunkAPI.rejectWithValue("Order ID is missing");
      }

      if (!orderStatus) {
        return thunkAPI.rejectWithValue("Order status is required");
      }

      return await updateOrderStatus({
        id,
        orderStatus,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update order status",
      );
    }
  },
);
