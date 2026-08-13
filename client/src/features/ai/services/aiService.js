import api from "../../../services/api";

// =====================================================
// Ask Hawkins AI
// =====================================================

export const askHawkinsAI = async (message) => {
  if (!message || !message.trim()) {
    throw new Error("Message is required");
  }

  const response = await api.post("/ai/ask", {
    message: message.trim(),
  });

  return response.data;
};
