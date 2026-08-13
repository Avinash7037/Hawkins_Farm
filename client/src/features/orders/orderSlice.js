import { createSlice } from "@reduxjs/toolkit";

import {
  fetchMyOrders,
  fetchOrderById,
  createOrder,
  cancelBuyerOrder,
} from "./orderThunks";

const initialState = {
  // =================================================
  // Orders
  // =================================================

  orders: [],

  // =================================================
  // Selected Order
  // =================================================

  selectedOrder: null,

  // =================================================
  // Loading
  // =================================================

  loading: false,

  detailsLoading: false,

  placing: false,

  // -------------------------------------------------
  // ID of the order currently being cancelled
  // -------------------------------------------------

  cancellingOrderId: null,

  // =================================================
  // Errors
  // =================================================

  error: null,

  detailsError: null,

  cancelError: null,
};

const orderSlice = createSlice({
  name: "orders",

  initialState,

  reducers: {
    // =================================================
    // Clear Selected Order
    // =================================================

    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
      state.detailsError = null;
    },

    // =================================================
    // Clear Errors
    // =================================================

    clearOrderError: (state) => {
      state.error = null;
      state.detailsError = null;
      state.cancelError = null;
    },

    // =================================================
    // Clear Orders
    // =================================================

    clearOrders: (state) => {
      state.orders = [];
      state.selectedOrder = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =================================================
      // Fetch My Orders
      // =================================================

      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;

        state.orders = action.payload?.orders || [];

        state.error = null;
      })

      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || "Failed to fetch orders";
      })

      // =================================================
      // Fetch Single Order
      // =================================================

      .addCase(fetchOrderById.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })

      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.detailsLoading = false;

        state.selectedOrder = action.payload?.order || null;

        state.detailsError = null;
      })

      .addCase(fetchOrderById.rejected, (state, action) => {
        state.detailsLoading = false;

        state.detailsError = action.payload || "Failed to fetch order";
      })

      // =================================================
      // Create Order
      // =================================================

      .addCase(createOrder.pending, (state) => {
        state.placing = true;
        state.error = null;
      })

      .addCase(createOrder.fulfilled, (state, action) => {
        state.placing = false;

        const newOrders = action.payload?.orders || [];

        state.orders = [...newOrders, ...state.orders];

        state.error = null;
      })

      .addCase(createOrder.rejected, (state, action) => {
        state.placing = false;

        state.error = action.payload || "Failed to place order";
      })

      // =================================================
      // Cancel Buyer Order
      // =================================================

      .addCase(cancelBuyerOrder.pending, (state, action) => {
        state.cancellingOrderId = action.meta.arg;

        state.cancelError = null;
      })

      .addCase(cancelBuyerOrder.fulfilled, (state, action) => {
        state.cancellingOrderId = null;

        const cancelledOrder = action.payload?.order;

        if (cancelledOrder) {
          // -------------------------------------------
          // Update order in list
          // -------------------------------------------

          const index = state.orders.findIndex(
            (order) => order._id === cancelledOrder._id,
          );

          if (index !== -1) {
            state.orders[index] = cancelledOrder;
          } else {
            state.orders.unshift(cancelledOrder);
          }

          // -------------------------------------------
          // Update selected order
          // -------------------------------------------

          if (state.selectedOrder?._id === cancelledOrder._id) {
            state.selectedOrder = cancelledOrder;
          }
        }

        state.cancelError = null;
      })

      .addCase(cancelBuyerOrder.rejected, (state, action) => {
        state.cancellingOrderId = null;

        state.cancelError = action.payload || "Failed to cancel order";
      });
  },
});

export const { clearSelectedOrder, clearOrderError, clearOrders } =
  orderSlice.actions;

export default orderSlice.reducer;
