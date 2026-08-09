import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  getChatHistory,
  sendMessage,
  getUnreadCount,
  markMessagesAsRead,
  getMyConversations,
} from "./services/chatService";

// =====================================================
// Fetch Chat History
// =====================================================

export const fetchChatHistory = createAsyncThunk(
  "chat/fetchChatHistory",

  async (userId, thunkAPI) => {
    try {
      return await getChatHistory(userId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch chat history",
      );
    }
  },
);

// =====================================================
// Send Message
// =====================================================

export const sendChatMessage = createAsyncThunk(
  "chat/sendMessage",

  async (data, thunkAPI) => {
    try {
      return await sendMessage(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to send message",
      );
    }
  },
);

// =====================================================
// Fetch Unread Count
// =====================================================

export const fetchUnreadCount = createAsyncThunk(
  "chat/fetchUnreadCount",

  async (_, thunkAPI) => {
    try {
      return await getUnreadCount();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch unread messages",
      );
    }
  },
);

// =====================================================
// Mark Messages As Read
// =====================================================

export const markChatAsRead = createAsyncThunk(
  "chat/markAsRead",

  async (userId, thunkAPI) => {
    try {
      return await markMessagesAsRead(userId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to mark messages as read",
      );
    }
  },
);

// =====================================================
// Fetch My Conversations
// =====================================================

export const fetchMyConversations = createAsyncThunk(
  "chat/fetchMyConversations",

  async (_, thunkAPI) => {
    try {
      return await getMyConversations();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch conversations",
      );
    }
  },
);
