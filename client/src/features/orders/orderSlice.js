import { createSlice } from "@reduxjs/toolkit";
import { createOrder, fetchMyOrders, fetchOrder } from "./orderThunks";

const initialState = {
  orders: [],
  order: null,
  loading: false,
  error: null,
  success: false,
};

const orderSlice = createSlice({
  name: "orders",

  initialState,

  reducers: {
    clearOrderState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.orders = action.payload.orders;
      })

      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Buyer Orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
      })

      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Single Order
      .addCase(fetchOrder.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.order;
      })

      .addCase(fetchOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderState } = orderSlice.actions;

export default orderSlice.reducer;
