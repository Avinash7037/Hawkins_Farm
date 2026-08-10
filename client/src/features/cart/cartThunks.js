import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  getCart,
  addToCart,
  updateCartQuantity,
  removeCartItem,
} from "./services/cartService";

// =====================================================
// Fetch Cart
// =====================================================

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",

  async (_, thunkAPI) => {
    try {
      return await getCart();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart",
      );
    }
  },
);

// =====================================================
// Add Item To Cart
// =====================================================

export const addItemToCart = createAsyncThunk(
  "cart/addItem",

  async (data, thunkAPI) => {
    try {
      await addToCart(data);

      return await getCart();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add item",
      );
    }
  },
);

// =====================================================
// Update Cart Quantity
// =====================================================

export const updateItemQuantity = createAsyncThunk(
  "cart/updateQuantity",

  async ({ id, quantity }, thunkAPI) => {
    try {
      await updateCartQuantity({
        id,
        quantity,
      });

      return await getCart();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update quantity",
      );
    }
  },
);

// =====================================================
// Delete Cart Item
// =====================================================

export const deleteCartItem = createAsyncThunk(
  "cart/deleteItem",

  async (id, thunkAPI) => {
    try {
      await removeCartItem(id);

      return await getCart();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to remove item",
      );
    }
  },
);
