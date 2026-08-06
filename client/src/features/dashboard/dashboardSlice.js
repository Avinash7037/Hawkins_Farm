import { createSlice } from "@reduxjs/toolkit";
import { fetchFarmerDashboard } from "./dashboardThunks";
import { fetchFarmerProducts } from "./productThunks";

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
      });
  },
});

export default dashboardSlice.reducer;
