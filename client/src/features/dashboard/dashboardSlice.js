import { createSlice } from "@reduxjs/toolkit";
import { fetchFarmerDashboard } from "./dashboardThunks";
import {
  fetchFarmerProducts,
  editFarmerProduct,
  removeFarmerProduct,
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
      .addCase(fetchFarmerProducts.fulfilled, (state, action) => {
        state.products = action.payload.products;
      })

      .addCase(editFarmerProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (p) => p._id === action.payload.product._id,
        );

        if (index !== -1) {
          state.products[index] = action.payload.product;
        }
      })

      .addCase(removeFarmerProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p._id !== action.payload);
      });
  },
});

export default dashboardSlice.reducer;
