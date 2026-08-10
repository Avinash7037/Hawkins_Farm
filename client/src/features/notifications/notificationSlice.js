import { createSlice } from "@reduxjs/toolkit";

import {
  fetchNotifications,
  fetchUnreadNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
} from "./notificationThunks";

// =====================================================
// Initial State
// =====================================================

const initialState = {
  notifications: [],

  unreadCount: 0,

  loading: false,

  unreadLoading: false,

  markingRead: false,

  error: null,
};

// =====================================================
// Slice
// =====================================================

const notificationSlice = createSlice({
  name: "notifications",

  initialState,

  reducers: {
    // =================================================
    // Add Real-Time Notification
    // =================================================

    addNotification: (state, action) => {
      const notification = action.payload;

      if (!notification?._id) {
        return;
      }

      const exists = state.notifications.some(
        (item) => item._id === notification._id,
      );

      if (!exists) {
        state.notifications.unshift(notification);

        if (!notification.isRead) {
          state.unreadCount += 1;
        }
      }
    },

    // =================================================
    // Clear Notifications
    // =================================================

    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      state.error = null;
    },

    // =================================================
    // Reset Error
    // =================================================

    clearNotificationError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =================================================
      // Fetch Notifications
      // =================================================

      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;

        state.notifications = action.payload?.notifications || [];

        state.unreadCount = state.notifications.filter(
          (notification) => !notification.isRead,
        ).length;

        state.error = null;
      })

      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || "Failed to fetch notifications";
      })

      // =================================================
      // Fetch Unread Count
      // =================================================

      .addCase(fetchUnreadNotificationCount.pending, (state) => {
        state.unreadLoading = true;
      })

      .addCase(fetchUnreadNotificationCount.fulfilled, (state, action) => {
        state.unreadLoading = false;

        state.unreadCount = action.payload?.unreadCount || 0;
      })

      .addCase(fetchUnreadNotificationCount.rejected, (state, action) => {
        state.unreadLoading = false;

        state.error = action.payload || "Failed to fetch unread count";
      })

      // =================================================
      // Mark One Read
      // =================================================

      .addCase(markNotificationRead.pending, (state) => {
        state.markingRead = true;
        state.error = null;
      })

      .addCase(markNotificationRead.fulfilled, (state, action) => {
        state.markingRead = false;

        const updatedNotification = action.payload?.notification;

        if (!updatedNotification?._id) {
          return;
        }

        const index = state.notifications.findIndex(
          (notification) => notification._id === updatedNotification._id,
        );

        if (index !== -1) {
          state.notifications[index] = updatedNotification;
        }

        state.unreadCount = state.notifications.filter(
          (notification) => !notification.isRead,
        ).length;
      })

      .addCase(markNotificationRead.rejected, (state, action) => {
        state.markingRead = false;

        state.error = action.payload || "Failed to mark notification as read";
      })

      // =================================================
      // Mark All Read
      // =================================================

      .addCase(markAllNotificationsRead.pending, (state) => {
        state.markingRead = true;
        state.error = null;
      })

      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.markingRead = false;

        state.notifications = state.notifications.map((notification) => ({
          ...notification,
          isRead: true,
          readAt: notification.readAt || new Date().toISOString(),
        }));

        state.unreadCount = 0;
      })

      .addCase(markAllNotificationsRead.rejected, (state, action) => {
        state.markingRead = false;

        state.error = action.payload || "Failed to mark notifications as read";
      });
  },
});

export const { addNotification, clearNotifications, clearNotificationError } =
  notificationSlice.actions;

export default notificationSlice.reducer;
