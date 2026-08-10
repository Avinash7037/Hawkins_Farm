import { createAsyncThunk } from "@reduxjs/toolkit";

import { createPaymentOrder, verifyPayment } from "./services/paymentService";

// =====================================================
// Create Checkout
// =====================================================

export const createCheckout = createAsyncThunk(
  "payment/createCheckout",

  async ({ deliveryAddress, paymentMethod }, thunkAPI) => {
    try {
      return await createPaymentOrder({
        deliveryAddress,
        paymentMethod,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Payment initialization failed",
      );
    }
  },
);

// =====================================================
// Verify Razorpay Payment
// =====================================================

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
