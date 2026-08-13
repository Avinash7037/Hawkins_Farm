const asyncHandler = require("express-async-handler");

const { askHawkinsAI } = require("../services/aiService");

// =====================================================
// Ask Hawkins AI
// =====================================================

const askAI = asyncHandler(async (req, res) => {
  const { message } = req.body;

  // ===================================================
  // Validate Message
  // ===================================================

  if (!message || !message.trim()) {
    return res.status(400).json({
      success: false,
      message: "Message is required",
    });
  }

  // ===================================================
  // Ask Python AI Service
  // ===================================================

  const result = await askHawkinsAI(message);

  // ===================================================
  // Response
  // ===================================================

  return res.status(200).json({
    success: true,

    answer: result.answer,

    source: result.source || "unknown",

    sources: result.sources || [],
  });
});

// =====================================================
// Export
// =====================================================

module.exports = {
  askAI,
};
