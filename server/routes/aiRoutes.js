const express = require("express");

const router = express.Router();

const { askAI } = require("../controllers/aiController");

const { protect } = require("../middleware/authMiddleware");

// =====================================================
// Ask Hawkins AI
// =====================================================
//
// POST /api/ai/ask
//
// =====================================================

router.post("/ask", protect, askAI);

// =====================================================
// Export
// =====================================================

module.exports = router;
