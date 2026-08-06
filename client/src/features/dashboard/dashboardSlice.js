import { createSlice } from "@reduxjs/toolkit";

import { fetchFarmerDashboard } from "./dashboardThunks";

import {
  fetchFarmerProducts,
  editFarmerProduct,
  removeFarmerProduct,
  addFarmerProduct,
} from "./productThunks";

const initialState = {
  dashboard: null,
  products: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder
      // Dashboard
      .addCase(fetchFarmerDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchFarmerDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload.dashboard;
      })

      .addCase(fetchFarmerDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Farmer Products
      .addCase(fetchFarmerProducts.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchFarmerProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
      })

      .addCase(fetchFarmerProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Product
      .addCase(addFarmerProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload.product);
      })

      // Edit Product
      .addCase(editFarmerProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (product) => product._id === action.payload.product._id,
        );

        if (index !== -1) {
          state.products[index] = action.payload.product;
        }
      })

      // Delete Product
      .addCase(removeFarmerProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) => product._id !== action.payload,
        );
      });
  },
});

export default dashboardSlice.reducer;
