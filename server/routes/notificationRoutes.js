const express = require("express");

const router = express.Router();

const {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");

// =====================================================
// Get My Notifications
// =====================================================

router.get("/", protect, getMyNotifications);

// =====================================================
// Get Unread Count
// =====================================================

router.get("/unread-count", protect, getUnreadCount);

// =====================================================
// Mark All As Read
// =====================================================

router.put("/read-all", protect, markAllAsRead);

// =====================================================
// Mark One As Read
// =====================================================

router.put("/:id/read", protect, markAsRead);

module.exports = router;
