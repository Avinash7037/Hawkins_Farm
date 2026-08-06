import { createAsyncThunk } from "@reduxjs/toolkit";

import { createPaymentOrder, verifyPayment } from "./services/paymentService";

export const createCheckout = createAsyncThunk(
  "payment/createCheckout",
  async (deliveryAddress, thunkAPI) => {
    try {
      return await createPaymentOrder(deliveryAddress);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Payment initialization failed",
      );
    }
  },
);

export const verifyCheckout = createAsyncThunk(
  "payment/verifyCheckout",
  async (paymentData, thunkAPI) => {
    try {
      return await verifyPayment(paymentData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Payment verification failed",
      );
    }
  },
);
