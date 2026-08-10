import { createSlice } from "@reduxjs/toolkit";

import { createCheckout, verifyCheckout } from "./paymentThunks";

const initialState = {
  loading: false,
  error: null,

  checkout: null,

  orders: [],

  verified: false,
};

const paymentSlice = createSlice({
  name: "payment",

  initialState,

  reducers: {
    // =====================================================
    // Reset Payment
    // =====================================================

    resetPayment: (state) => {
      state.loading = false;
      state.error = null;
      state.checkout = null;
      state.orders = [];
      state.verified = false;
    },

    // =====================================================
    // Clear Payment Error
    // =====================================================

    clearPaymentError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ===================================================
      // Create Checkout
      // ===================================================

      .addCase(createCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.verified = false;
      })

      .addCase(createCheckout.fulfilled, (state, action) => {
        state.loading = false;

        state.checkout = action.payload;

        state.error = null;
      })

      .addCase(createCheckout.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || "Payment initialization failed";
      })

      // ===================================================
      // Verify Payment
      // ===================================================

      .addCase(verifyCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(verifyCheckout.fulfilled, (state, action) => {
        state.loading = false;

        state.verified = true;

        state.orders = action.payload?.orders || [];

        state.error = null;
      })

      .addCase(verifyCheckout.rejected, (state, action) => {
        state.loading = false;

        state.verified = false;

        state.error = action.payload || "Payment verification failed";
      });
  },
});

export const { resetPayment, clearPaymentError } = paymentSlice.actions;

export default paymentSlice.reducer;
