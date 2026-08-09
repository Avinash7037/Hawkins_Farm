import { createSlice } from "@reduxjs/toolkit";

import { fetchFarmerDashboard } from "./dashboardThunks";

import {
  fetchFarmerProducts,
  addFarmerProduct,
  editFarmerProduct,
  removeFarmerProduct,
} from "./productThunks";

import { fetchFarmerOrders, updateFarmerOrderStatus } from "./orderThunks";

const initialState = {
  dashboard: null,

  products: [],

  orders: [],

  loading: false,

  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // ===========================
      // Farmer Dashboard
      // ===========================

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

      // ===========================
      // Farmer Products
      // ===========================

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
      })

      // ===========================
      // Farmer Orders
      // ===========================

      .addCase(fetchFarmerOrders.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchFarmerOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
      })

      .addCase(fetchFarmerOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Order Status

      .addCase(updateFarmerOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(
          (order) => order._id === action.payload.order._id,
        );

        if (index !== -1) {
          state.orders[index] = action.payload.order;
        }
      });
  },
});

export default dashboardSlice.reducer;
