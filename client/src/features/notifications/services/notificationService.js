import api from "../../../services/api";

// =====================================================
// Get My Notifications
// =====================================================

export const getMyNotifications = async () => {
  const response = await api.get("/notifications");

  return response.data;
};

// =====================================================
// Get Unread Count
// =====================================================

export const getUnreadNotificationCount = async () => {
  const response = await api.get("/notifications/unread-count");

  return response.data;
};

// =====================================================
// Mark One As Read
// =====================================================

export const markNotificationAsRead = async (id) => {
  const response = await api.put(`/notifications/${id}/read`);

  return response.data;
};

// =====================================================
// Mark All As Read
// =====================================================

export const markAllNotificationsAsRead = async () => {
  const response = await api.put("/notifications/read-all");

  return response.data;
};
