import { createSlice } from "@reduxjs/toolkit";

import { askHawkinsAI } from "./aiThunks";

// =====================================================
// Initial State
// =====================================================

const initialState = {
  messages: [],
  loading: false,
  error: null,
};

// =====================================================
// AI Slice
// =====================================================

const aiSlice = createSlice({
  name: "ai",

  initialState,

  reducers: {
    // -------------------------------------------------
    // Clear Chat
    // -------------------------------------------------

    clearChat: (state) => {
      state.messages = [];
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ===============================================
      // Ask AI - Pending
      // ===============================================

      .addCase(askHawkinsAI.pending, (state, action) => {
        state.loading = true;
        state.error = null;

        state.messages.push({
          id: `${Date.now()}-user`,
          role: "user",
          content: action.meta.arg,
        });
      })

      // ===============================================
      // Ask AI - Fulfilled
      // ===============================================

      .addCase(askHawkinsAI.fulfilled, (state, action) => {
        state.loading = false;

        state.messages.push({
          id: `${Date.now()}-assistant`,
          role: "assistant",

          content: action.payload.answer || "",

          source: action.payload.source || null,

          sources: action.payload.sources || [],
        });
      })

      // ===============================================
      // Ask AI - Rejected
      // ===============================================

      .addCase(askHawkinsAI.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || "Unable to connect to Hawkins AI";

        state.messages.push({
          id: `${Date.now()}-error`,
          role: "assistant",

          content: action.payload || "Sorry, I couldn't process your question.",
        });
      });
  },
});

export const { clearChat } = aiSlice.actions;

export default aiSlice.reducer;
