const asyncHandler = require("express-async-handler");

const {
  getUserNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} = require("../services/notificationService");

// =====================================================
// Get My Notifications
// =====================================================

const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await getUserNotifications(req.user._id);

  res.status(200).json({
    success: true,
    notifications,
  });
});

// =====================================================
// Get Unread Notification Count
// =====================================================

const getUnreadCount = asyncHandler(async (req, res) => {
  const unreadCount = await getUnreadNotificationCount(req.user._id);

  res.status(200).json({
    success: true,
    unreadCount,
  });
});

// =====================================================
// Mark Notification As Read
// =====================================================

const markAsRead = asyncHandler(async (req, res) => {
  const notification = await markNotificationAsRead(
    req.params.id,
    req.user._id,
  );

  res.status(200).json({
    success: true,
    notification,
  });
});

// =====================================================
// Mark All As Read
// =====================================================

const markAllAsRead = asyncHandler(async (req, res) => {
  await markAllNotificationsAsRead(req.user._id);

  res.status(200).json({
    success: true,
    message: "All notifications marked as read",
  });
});

module.exports = {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};
