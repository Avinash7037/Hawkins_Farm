import { createSlice } from "@reduxjs/toolkit";

import { fetchFarmerOrders, updateFarmerOrderStatus } from "./orderThunks";

const initialState = {
  orders: [],
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "farmerOrders",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchFarmerOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
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

export default orderSlice.reducer;
