import { createSlice } from "@reduxjs/toolkit";

import {
  fetchCart,
  addItemToCart,
  updateItemQuantity,
  deleteCartItem,
} from "./cartThunks";

const initialState = {
  cart: [],
  totalItems: 0,
  totalPrice: 0,

  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    // =====================================================
    // Clear Cart Error
    // =====================================================

    clearCartError: (state) => {
      state.error = null;
    },

    // =====================================================
    // Reset Cart
    // =====================================================

    resetCart: (state) => {
      state.cart = [];
      state.totalItems = 0;
      state.totalPrice = 0;
      state.loading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ===================================================
      // Fetch Cart
      // ===================================================

      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;

        state.cart = action.payload.cart || [];

        state.totalItems = action.payload.totalItems || 0;

        state.totalPrice = action.payload.totalPrice || 0;

        state.error = null;
      })

      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || "Failed to fetch cart";
      })

      // ===================================================
      // Add Item
      // ===================================================

      .addCase(addItemToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.loading = false;

        state.cart = action.payload.cart || [];

        state.totalItems = action.payload.totalItems || 0;

        state.totalPrice = action.payload.totalPrice || 0;

        state.error = null;
      })

      .addCase(addItemToCart.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || "Failed to add item";
      })

      // ===================================================
      // Update Quantity
      // ===================================================

      .addCase(updateItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateItemQuantity.fulfilled, (state, action) => {
        state.loading = false;

        state.cart = action.payload.cart || [];

        state.totalItems = action.payload.totalItems || 0;

        state.totalPrice = action.payload.totalPrice || 0;

        state.error = null;
      })

      .addCase(updateItemQuantity.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || "Failed to update quantity";
      })

      // ===================================================
      // Delete Item
      // ===================================================

      .addCase(deleteCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.loading = false;

        state.cart = action.payload.cart || [];

        state.totalItems = action.payload.totalItems || 0;

        state.totalPrice = action.payload.totalPrice || 0;

        state.error = null;
      })

      .addCase(deleteCartItem.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || "Failed to remove item";
      });
  },
});

export const { clearCartError, resetCart } = cartSlice.actions;

export default cartSlice.reducer;
