import { createSlice } from "@reduxjs/toolkit";

import {
  fetchChatHistory,
  sendChatMessage,
  fetchUnreadCount,
  markChatAsRead,
  fetchMyConversations,
} from "./chatThunks";

const initialState = {
  // ===================================================
  // Current Chat
  // ===================================================

  chats: [],
  activeUser: null,

  // ===================================================
  // Conversations
  // ===================================================

  conversations: [],
  conversationsLoading: false,

  // ===================================================
  // Unread
  // ===================================================

  unreadMessages: 0,

  // ===================================================
  // Loading
  // ===================================================

  loading: false,
  sending: false,

  // ===================================================
  // Errors
  // ===================================================

  error: null,
  sendError: null,

  // ===================================================
  // Socket
  // ===================================================

  onlineUsers: [],
  typingUser: null,
};

const chatSlice = createSlice({
  name: "chat",

  initialState,

  reducers: {
    // =================================================
    // Set Active Chat User
    // =================================================

    setActiveUser: (state, action) => {
      state.activeUser = action.payload;
      state.error = null;
      state.sendError = null;
    },

    // =================================================
    // Clear Active Chat
    // =================================================

    clearActiveUser: (state) => {
      state.activeUser = null;
      state.chats = [];
      state.typingUser = null;
      state.error = null;
      state.sendError = null;
    },

    // =================================================
    // Add Real-Time Message
    // =================================================

    addMessage: (state, action) => {
      const message = action.payload;

      if (!message?._id) {
        return;
      }

      const exists = state.chats.some((chat) => chat._id === message._id);

      if (!exists) {
        state.chats.push(message);
      }
    },

    // =================================================
    // Set Online Users
    // =================================================

    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload || [];
    },

    // =================================================
    // Set Typing User
    // =================================================

    setTypingUser: (state, action) => {
      state.typingUser = action.payload;
    },

    // =================================================
    // Clear Typing User
    // =================================================

    clearTypingUser: (state) => {
      state.typingUser = null;
    },

    // =================================================
    // Clear Chat Error
    // =================================================

    clearChatError: (state) => {
      state.error = null;
      state.sendError = null;
    },

    // =================================================
    // Increase Unread Count
    // =================================================

    incrementUnreadCount: (state) => {
      state.unreadMessages += 1;
    },

    // =================================================
    // Decrease Unread Count
    // =================================================

    decreaseUnreadCount: (state) => {
      if (state.unreadMessages > 0) {
        state.unreadMessages -= 1;
      }
    },

    // =================================================
    // Reset Unread Count
    // =================================================

    resetUnreadCount: (state) => {
      state.unreadMessages = 0;
    },
  },

  extraReducers: (builder) => {
    builder

      // =================================================
      // Fetch Chat History
      // =================================================

      .addCase(fetchChatHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.loading = false;

        state.chats = action.payload?.chats || [];

        state.error = null;
      })

      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || "Failed to fetch chat history";
      })

      // =================================================
      // Send Message
      // =================================================

      .addCase(sendChatMessage.pending, (state) => {
        state.sending = true;
        state.sendError = null;
      })

      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.sending = false;
        state.sendError = null;

        const message = action.payload?.chat;

        if (!message?._id) {
          return;
        }

        // Prevent duplicate message if
        // Socket.IO also delivers it.
        const exists = state.chats.some((chat) => chat._id === message._id);

        if (!exists) {
          state.chats.push(message);
        }
      })

      .addCase(sendChatMessage.rejected, (state, action) => {
        state.sending = false;

        state.sendError = action.payload || "Failed to send message";
      })

      // =================================================
      // Fetch Unread Count
      // =================================================

      .addCase(fetchUnreadCount.pending, (state) => {
        state.error = null;
      })

      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadMessages = action.payload?.unreadMessages || 0;
      })

      .addCase(fetchUnreadCount.rejected, (state, action) => {
        state.error = action.payload || "Failed to fetch unread messages";
      })

      // =================================================
      // Mark Messages As Read
      // =================================================

      .addCase(markChatAsRead.pending, (state) => {
        state.error = null;
      })

      .addCase(markChatAsRead.fulfilled, (state) => {
        state.error = null;
      })

      .addCase(markChatAsRead.rejected, (state, action) => {
        state.error = action.payload || "Failed to mark messages as read";
      })

      // =================================================
      // Fetch My Conversations
      // =================================================

      .addCase(fetchMyConversations.pending, (state) => {
        state.conversationsLoading = true;
        state.error = null;
      })

      .addCase(fetchMyConversations.fulfilled, (state, action) => {
        state.conversationsLoading = false;

        state.conversations = action.payload?.conversations || [];

        state.error = null;
      })

      .addCase(fetchMyConversations.rejected, (state, action) => {
        state.conversationsLoading = false;

        state.error = action.payload || "Failed to fetch conversations";
      });
  },
});

export const {
  setActiveUser,
  clearActiveUser,
  addMessage,
  setOnlineUsers,
  setTypingUser,
  clearTypingUser,
  clearChatError,
  incrementUnreadCount,
  decreaseUnreadCount,
  resetUnreadCount,
} = chatSlice.actions;

export default chatSlice.reducer;
