import { createSlice } from "@reduxjs/toolkit";

import {
  fetchAdminDashboard,
  fetchAllUsers,
  changeUserStatus,
  fetchAllAdminProducts,
  changeAdminProductStatus,
  fetchAllAdminOrders,
  fetchAllAdminReviews,
  deleteAdminReview,
} from "./adminThunks";

const initialState = {
  // ===================================================
  // Dashboard
  // ===================================================

  dashboard: null,

  dashboardLoading: false,

  // ===================================================
  // Users
  // ===================================================

  users: [],

  usersLoading: false,

  updatingUser: false,

  // ===================================================
  // Products
  // ===================================================

  products: [],

  productsLoading: false,

  updatingProduct: false,

  // ===================================================
  // Orders
  // ===================================================

  orders: [],

  ordersLoading: false,

  // ===================================================
  // Reviews
  // ===================================================

  reviews: [],

  reviewsLoading: false,

  deletingReview: false,

  // ===================================================
  // Errors
  // ===================================================

  error: null,

  usersError: null,

  updateUserError: null,

  productsError: null,

  updateProductError: null,

  ordersError: null,

  reviewsError: null,

  deleteReviewError: null,
};

const adminSlice = createSlice({
  name: "admin",

  initialState,

  reducers: {
    // =================================================
    // Clear Errors
    // =================================================

    clearAdminError: (state) => {
      state.error = null;

      state.usersError = null;

      state.updateUserError = null;

      state.productsError = null;

      state.updateProductError = null;

      state.ordersError = null;

      state.reviewsError = null;

      state.deleteReviewError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =================================================
      // Admin Dashboard
      // =================================================

      .addCase(fetchAdminDashboard.pending, (state) => {
        state.dashboardLoading = true;

        state.error = null;
      })

      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.dashboardLoading = false;

        state.dashboard = action.payload?.dashboard || null;

        state.error = null;
      })

      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.dashboardLoading = false;

        state.error = action.payload || "Failed to load admin dashboard";
      })

      // =================================================
      // Fetch Users
      // =================================================

      .addCase(fetchAllUsers.pending, (state) => {
        state.usersLoading = true;

        state.usersError = null;
      })

      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.usersLoading = false;

        state.users = action.payload?.users || [];

        state.usersError = null;
      })

      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.usersLoading = false;

        state.usersError = action.payload || "Failed to fetch users";
      })

      // =================================================
      // Change User Status
      // =================================================

      .addCase(changeUserStatus.pending, (state) => {
        state.updatingUser = true;

        state.updateUserError = null;
      })

      .addCase(changeUserStatus.fulfilled, (state, action) => {
        state.updatingUser = false;

        const updatedUser = action.payload?.user;

        if (updatedUser) {
          const index = state.users.findIndex(
            (user) => user._id === updatedUser._id,
          );

          if (index !== -1) {
            state.users[index] = updatedUser;
          }
        }

        state.updateUserError = null;
      })

      .addCase(changeUserStatus.rejected, (state, action) => {
        state.updatingUser = false;

        state.updateUserError =
          action.payload || "Failed to update user status";
      })

      // =================================================
      // Fetch Admin Products
      // =================================================

      .addCase(fetchAllAdminProducts.pending, (state) => {
        state.productsLoading = true;

        state.productsError = null;
      })

      .addCase(fetchAllAdminProducts.fulfilled, (state, action) => {
        state.productsLoading = false;

        state.products = action.payload?.products || [];

        state.productsError = null;
      })

      .addCase(fetchAllAdminProducts.rejected, (state, action) => {
        state.productsLoading = false;

        state.productsError = action.payload || "Failed to fetch products";
      })

      // =================================================
      // Change Product Status
      // =================================================

      .addCase(changeAdminProductStatus.pending, (state) => {
        state.updatingProduct = true;

        state.updateProductError = null;
      })

      .addCase(changeAdminProductStatus.fulfilled, (state, action) => {
        state.updatingProduct = false;

        const updatedProduct = action.payload?.product;

        if (updatedProduct) {
          const index = state.products.findIndex(
            (product) => product._id === updatedProduct._id,
          );

          if (index !== -1) {
            state.products[index] = updatedProduct;
          }
        }

        state.updateProductError = null;
      })

      .addCase(changeAdminProductStatus.rejected, (state, action) => {
        state.updatingProduct = false;

        state.updateProductError =
          action.payload || "Failed to update product status";
      })

      // =================================================
      // Fetch Admin Orders
      // =================================================

      .addCase(fetchAllAdminOrders.pending, (state) => {
        state.ordersLoading = true;

        state.ordersError = null;
      })

      .addCase(fetchAllAdminOrders.fulfilled, (state, action) => {
        state.ordersLoading = false;

        state.orders = action.payload?.orders || [];

        state.ordersError = null;
      })

      .addCase(fetchAllAdminOrders.rejected, (state, action) => {
        state.ordersLoading = false;

        state.ordersError = action.payload || "Failed to fetch orders";
      })

      // =================================================
      // Fetch Admin Reviews
      // =================================================

      .addCase(fetchAllAdminReviews.pending, (state) => {
        state.reviewsLoading = true;

        state.reviewsError = null;
      })

      .addCase(fetchAllAdminReviews.fulfilled, (state, action) => {
        state.reviewsLoading = false;

        state.reviews = action.payload?.reviews || [];

        state.reviewsError = null;
      })

      .addCase(fetchAllAdminReviews.rejected, (state, action) => {
        state.reviewsLoading = false;

        state.reviewsError = action.payload || "Failed to fetch reviews";
      })

      // =================================================
      // Delete Admin Review
      // =================================================

      .addCase(deleteAdminReview.pending, (state) => {
        state.deletingReview = true;

        state.deleteReviewError = null;
      })

      .addCase(deleteAdminReview.fulfilled, (state, action) => {
        state.deletingReview = false;

        const deletedReviewId = action.meta.arg;

        state.reviews = state.reviews.filter(
          (review) => review._id !== deletedReviewId,
        );

        state.deleteReviewError = null;
      })

      .addCase(deleteAdminReview.rejected, (state, action) => {
        state.deletingReview = false;

        state.deleteReviewError = action.payload || "Failed to delete review";
      });
  },
});

export const { clearAdminError } = adminSlice.actions;

export default adminSlice.reducer;
