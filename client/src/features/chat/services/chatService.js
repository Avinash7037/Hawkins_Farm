import api from "../../../services/api";

// =====================================================
// Get Chat History
// =====================================================

export const getChatHistory = async (userId) => {
  const response = await api.get(`/chat/${userId}`);

  return response.data;
};

// =====================================================
// Send Message
// =====================================================

export const sendMessage = async (data) => {
  const response = await api.post("/chat", data);

  return response.data;
};

// =====================================================
// Get Unread Count
// =====================================================

export const getUnreadCount = async () => {
  const response = await api.get("/chat/unread");

  return response.data;
};

// =====================================================
// Mark Messages As Read
// =====================================================

export const markMessagesAsRead = async (userId) => {
  const response = await api.put(`/chat/${userId}/read`);

  return response.data;
};

// =====================================================
// Get My Conversations
// =====================================================

export const getMyConversations = async () => {
  const response = await api.get("/chat/conversations");

  return response.data;
};
