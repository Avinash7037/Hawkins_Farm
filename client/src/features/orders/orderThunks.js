import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  placeOrder,
  getMyOrders,
  getOrder,
  cancelOrder,
} from "./services/orderService";

// =====================================================
// Fetch My Orders
// =====================================================

export const fetchMyOrders = createAsyncThunk(
  "orders/fetchMyOrders",

  async (_, thunkAPI) => {
    try {
      return await getMyOrders();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders",
      );
    }
  },
);

// =====================================================
// Fetch Single Order
// =====================================================

export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrderById",

  async (id, thunkAPI) => {
    try {
      return await getOrder(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch order",
      );
    }
  },
);

// =====================================================
// Place Order
// =====================================================

export const createOrder = createAsyncThunk(
  "orders/createOrder",

  async (orderData, thunkAPI) => {
    try {
      return await placeOrder(orderData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to place order",
      );
    }
  },
);

// =====================================================
// Cancel Order
// =====================================================

export const cancelBuyerOrder = createAsyncThunk(
  "orders/cancelBuyerOrder",

  async (id, thunkAPI) => {
    try {
      return await cancelOrder(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to cancel order",
      );
    }
  },
);
