import { createAsyncThunk } from "@reduxjs/toolkit";
import { getProducts, getProductById } from "./services/productService";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params, thunkAPI) => {
    try {
      return await getProducts(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch products",
      );
    }
  },
);

export const fetchProduct = createAsyncThunk(
  "products/fetchProduct",
  async (id, thunkAPI) => {
    try {
      return await getProductById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch product",
      );
    }
  },
);
