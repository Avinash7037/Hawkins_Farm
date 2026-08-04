const express = require("express");

const router = express.Router();

const {
  getChatHistory,
  getUnreadCount,
} = require("../controllers/chatController");

const { protect } = require("../middleware/authMiddleware");

router.get("/unread", protect, getUnreadCount);

router.get("/:userId", protect, getChatHistory);

module.exports = router;
