import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  getMyNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "./services/notificationService";

// =====================================================
// Fetch Notifications
// =====================================================

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",

  async (_, thunkAPI) => {
    try {
      return await getMyNotifications();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch notifications",
      );
    }
  },
);

// =====================================================
// Fetch Unread Count
// =====================================================

export const fetchUnreadNotificationCount = createAsyncThunk(
  "notifications/fetchUnreadCount",

  async (_, thunkAPI) => {
    try {
      return await getUnreadNotificationCount();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch unread notification count",
      );
    }
  },
);

// =====================================================
// Mark One As Read
// =====================================================

export const markNotificationRead = createAsyncThunk(
  "notifications/markNotificationRead",

  async (id, thunkAPI) => {
    try {
      return await markNotificationAsRead(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to mark notification as read",
      );
    }
  },
);

// =====================================================
// Mark All As Read
// =====================================================

export const markAllNotificationsRead = createAsyncThunk(
  "notifications/markAllNotificationsRead",

  async (_, thunkAPI) => {
    try {
      return await markAllNotificationsAsRead();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to mark notifications as read",
      );
    }
  },
);
