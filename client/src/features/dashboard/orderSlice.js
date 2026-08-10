import { createSlice } from "@reduxjs/toolkit";

import { fetchFarmerOrders, updateFarmerOrderStatus } from "./orderThunks";

const initialState = {
  // =====================================================
  // Orders
  // =====================================================

  orders: [],

  // =====================================================
  // Loading
  // =====================================================

  loading: false,

  updating: false,

  // =====================================================
  // Errors
  // =====================================================

  error: null,

  updateError: null,
};

const orderSlice = createSlice({
  name: "farmerOrders",

  initialState,

  reducers: {
    // ===================================================
    // Clear Errors
    // ===================================================

    clearFarmerOrderError: (state) => {
      state.error = null;
      state.updateError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =================================================
      // Fetch Farmer Orders
      // =================================================

      .addCase(fetchFarmerOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchFarmerOrders.fulfilled, (state, action) => {
        state.loading = false;

        state.orders = action.payload.orders || [];

        state.error = null;
      })

      .addCase(fetchFarmerOrders.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || "Failed to fetch orders";
      })

      // =================================================
      // Update Farmer Order Status
      // =================================================

      .addCase(updateFarmerOrderStatus.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })

      .addCase(updateFarmerOrderStatus.fulfilled, (state, action) => {
        state.updating = false;

        const updatedOrder = action.payload.order;

        if (updatedOrder) {
          const index = state.orders.findIndex(
            (order) => order._id === updatedOrder._id,
          );

          if (index !== -1) {
            state.orders[index] = updatedOrder;
          }
        }

        state.updateError = null;
      })

      .addCase(updateFarmerOrderStatus.rejected, (state, action) => {
        state.updating = false;

        state.updateError = action.payload || "Failed to update order";
      });
  },
});

export const { clearFarmerOrderError } = orderSlice.actions;

export default orderSlice.reducer;
