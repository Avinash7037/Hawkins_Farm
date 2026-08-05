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
    clearCartError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.cart;
        state.totalItems = action.payload.totalItems;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Item
      .addCase(addItemToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.cart;
        state.totalItems = action.payload.totalItems;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Quantity
      .addCase(updateItemQuantity.fulfilled, (state, action) => {
        state.cart = action.payload.cart;
        state.totalItems = action.payload.totalItems;
        state.totalPrice = action.payload.totalPrice;
      })

      // Delete Item
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.cart = action.payload.cart;
        state.totalItems = action.payload.totalItems;
        state.totalPrice = action.payload.totalPrice;
      });
  },
});

export const { clearCartError } = cartSlice.actions;

export default cartSlice.reducer;
