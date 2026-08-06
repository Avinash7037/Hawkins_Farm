import { createSlice } from "@reduxjs/toolkit";
import { createCheckout, verifyCheckout } from "./paymentThunks";

const initialState = {
  loading: false,
  error: null,
  checkout: null,
  verified: false,
};

const paymentSlice = createSlice({
  name: "payment",

  initialState,

  reducers: {
    resetPayment(state) {
      state.loading = false;
      state.error = null;
      state.checkout = null;
      state.verified = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // Create Checkout
      .addCase(createCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.checkout = action.payload;
      })

      .addCase(createCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Verify Payment
      .addCase(verifyCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(verifyCheckout.fulfilled, (state) => {
        state.loading = false;
        state.verified = true;
      })

      .addCase(verifyCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPayment } = paymentSlice.actions;

export default paymentSlice.reducer;
