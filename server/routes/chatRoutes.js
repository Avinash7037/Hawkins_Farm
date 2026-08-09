const express = require("express");

const router = express.Router();

const {
  sendMessage,
  getChatHistory,
  getUnreadCount,
  markMessagesAsRead,
  getMyConversations,
} = require("../controllers/chatController");

const { protect } = require("../middleware/authMiddleware");

// =====================================================
// Unread Messages
// =====================================================

router.get("/unread", protect, getUnreadCount);

// =====================================================
// My Conversations
// IMPORTANT: Must come BEFORE /:userId
// =====================================================

router.get("/conversations", protect, getMyConversations);

// =====================================================
// Send Message
// =====================================================

router.post("/", protect, sendMessage);

// =====================================================
// Mark Messages As Read
// =====================================================

router.put("/:userId/read", protect, markMessagesAsRead);

// =====================================================
// Get Chat History
// =====================================================

router.get("/:userId", protect, getChatHistory);

module.exports = router;
