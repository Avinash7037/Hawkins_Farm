import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  getAdminDashboard,
  getAllUsers,
  updateUserStatus,
  getAllAdminProducts,
  updateAdminProductStatus,
  getAllAdminOrders,
  getAllAdminReviews,
  deleteAdminReview as deleteAdminReviewRequest,
} from "./services/adminService";

// =====================================================
// Admin Dashboard
// =====================================================

export const fetchAdminDashboard = createAsyncThunk(
  "admin/fetchAdminDashboard",

  async (_, thunkAPI) => {
    try {
      return await getAdminDashboard();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load admin dashboard",
      );
    }
  },
);

// =====================================================
// Users
// =====================================================

export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",

  async (_, thunkAPI) => {
    try {
      return await getAllUsers();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch users",
      );
    }
  },
);

// =====================================================
// Change User Status
// =====================================================

export const changeUserStatus = createAsyncThunk(
  "admin/changeUserStatus",

  async ({ id, isActive }, thunkAPI) => {
    try {
      return await updateUserStatus(id, isActive);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update user status",
      );
    }
  },
);

// =====================================================
// Products
// =====================================================

export const fetchAllAdminProducts = createAsyncThunk(
  "admin/fetchAllAdminProducts",

  async (_, thunkAPI) => {
    try {
      return await getAllAdminProducts();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch products",
      );
    }
  },
);

// =====================================================
// Change Product Status
// =====================================================

export const changeAdminProductStatus = createAsyncThunk(
  "admin/changeAdminProductStatus",

  async ({ id, isAvailable }, thunkAPI) => {
    try {
      return await updateAdminProductStatus(id, isAvailable);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update product status",
      );
    }
  },
);

// =====================================================
// Orders
// =====================================================

export const fetchAllAdminOrders = createAsyncThunk(
  "admin/fetchAllAdminOrders",

  async (_, thunkAPI) => {
    try {
      return await getAllAdminOrders();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders",
      );
    }
  },
);

// =====================================================
// Reviews
// =====================================================

export const fetchAllAdminReviews = createAsyncThunk(
  "admin/fetchAllAdminReviews",

  async (_, thunkAPI) => {
    try {
      return await getAllAdminReviews();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch reviews",
      );
    }
  },
);

// =====================================================
// Delete Admin Review
// =====================================================

export const deleteAdminReview = createAsyncThunk(
  "admin/deleteAdminReview",

  async (id, thunkAPI) => {
    try {
      return await deleteAdminReviewRequest(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete review",
      );
    }
  },
);
