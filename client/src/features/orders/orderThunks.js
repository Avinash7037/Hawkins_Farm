import { createAsyncThunk } from "@reduxjs/toolkit";
import { placeOrder, getMyOrders, getOrder } from "./services/orderService";

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

export const fetchOrder = createAsyncThunk(
  "orders/fetchOrder",
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
