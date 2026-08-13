import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  getFarmerProducts,
  createProduct,
  updateProduct,
  restockProduct,
  deleteProduct,
} from "./productService";

// =====================================================
// Fetch Farmer Products
// =====================================================

export const fetchFarmerProducts = createAsyncThunk(
  "dashboard/fetchFarmerProducts",

  async (_, thunkAPI) => {
    try {
      return await getFarmerProducts();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch products",
      );
    }
  },
);

// =====================================================
// Add Farmer Product
// =====================================================

export const addFarmerProduct = createAsyncThunk(
  "dashboard/addFarmerProduct",

  async (formData, thunkAPI) => {
    try {
      return await createProduct(formData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add product",
      );
    }
  },
);

// =====================================================
// Edit Farmer Product
// =====================================================

export const editFarmerProduct = createAsyncThunk(
  "dashboard/editFarmerProduct",

  async ({ id, data }, thunkAPI) => {
    try {
      return await updateProduct({
        id,
        data,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update product",
      );
    }
  },
);

// =====================================================
// Restock Farmer Product
// =====================================================

export const restockFarmerProduct = createAsyncThunk(
  "dashboard/restockFarmerProduct",

  async ({ id, quantity }, thunkAPI) => {
    try {
      return await restockProduct({
        id,
        quantity,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to restock product",
      );
    }
  },
);

// =====================================================
// Delete Farmer Product
// =====================================================

export const removeFarmerProduct = createAsyncThunk(
  "dashboard/removeFarmerProduct",

  async (id, thunkAPI) => {
    try {
      await deleteProduct(id);

      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete product",
      );
    }
  },
);
