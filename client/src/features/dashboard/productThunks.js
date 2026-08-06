import { createAsyncThunk } from "@reduxjs/toolkit";
import { getFarmerProducts } from "./productService";
import { createProduct } from "./productService";

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

import { updateProduct, deleteProduct } from "./productService";

export const editFarmerProduct = createAsyncThunk(
  "dashboard/editFarmerProduct",
  async ({ id, data }, thunkAPI) => {
    try {
      return await updateProduct({ id, data });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update product",
      );
    }
  },
);

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
