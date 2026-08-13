const axios = require("axios");

// =====================================================
// Python AI Service URL
// =====================================================

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

// =====================================================
// Ask Hawkins AI
// =====================================================

const askHawkinsAI = async (message) => {
  if (!message || !message.trim()) {
    throw new Error("Message is required");
  }

  try {
    const response = await axios.post(
      `${AI_SERVICE_URL}/ai/chat`,
      {
        message: message.trim(),
      },
      {
        timeout: 60000,
      },
    );

    return response.data;
  } catch (error) {
    console.error(
      "Hawkins AI service error:",
      error.response?.data || error.message,
    );

    throw new Error(
      error.response?.data?.detail ||
        error.response?.data?.message ||
        "Hawkins AI service is unavailable",
    );
  }
};

// =====================================================
// Export
// =====================================================

module.exports = {
  askHawkinsAI,
};
