const Notification = require("../models/notificationModel");

// =====================================================
// Create Notification
// =====================================================

const createNotification = async ({
  recipient,
  type,
  title,
  message,
  order = null,
  io = null,
}) => {
  if (!recipient) {
    throw new Error("Notification recipient is required");
  }

  if (!type) {
    throw new Error("Notification type is required");
  }

  if (!title?.trim()) {
    throw new Error("Notification title is required");
  }

  if (!message?.trim()) {
    throw new Error("Notification message is required");
  }

  // ===================================================
  // Save Notification
  // ===================================================

  const notification = await Notification.create({
    recipient,
    type,
    title: title.trim(),
    message: message.trim(),
    order,
  });

  // ===================================================
  // Populate Notification
  // ===================================================

  const populatedNotification = await Notification.findById(
    notification._id,
  ).populate({
    path: "order",
    populate: [
      {
        path: "product",
        select: "name price unit",
      },
      {
        path: "buyer",
        select: "name email",
      },
      {
        path: "farmer",
        select: "name email",
      },
    ],
  });

  // ===================================================
  // Real-Time Notification
  // ===================================================

  if (io) {
    io.to(recipient.toString()).emit("notification", populatedNotification);
  }

  return populatedNotification;
};

// =====================================================
// Get User Notifications
// =====================================================

const getUserNotifications = async (userId) => {
  return Notification.find({
    recipient: userId,
  })
    .populate({
      path: "order",
      populate: {
        path: "product",
        select: "name price unit",
      },
    })
    .sort({
      createdAt: -1,
    })
    .limit(50);
};

// =====================================================
// Get Unread Notification Count
// =====================================================

const getUnreadNotificationCount = async (userId) => {
  return Notification.countDocuments({
    recipient: userId,
    isRead: false,
  });
};

// =====================================================
// Mark One Notification As Read
// =====================================================

const markNotificationAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOne({
    _id: notificationId,
    recipient: userId,
  });

  if (!notification) {
    throw new Error("Notification not found");
  }

  if (!notification.isRead) {
    notification.isRead = true;
    notification.readAt = new Date();

    await notification.save();
  }

  return notification;
};

// =====================================================
// Mark All Notifications As Read
// =====================================================

const markAllNotificationsAsRead = async (userId) => {
  await Notification.updateMany(
    {
      recipient: userId,
      isRead: false,
    },
    {
      $set: {
        isRead: true,
        readAt: new Date(),
      },
    },
  );

  return true;
};

// =====================================================
// Exports
// =====================================================

module.exports = {
  createNotification,
  getUserNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};
