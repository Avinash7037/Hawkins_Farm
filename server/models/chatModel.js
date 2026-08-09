const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Efficiently fetch messages between two users
chatSchema.index({
  sender: 1,
  receiver: 1,
  createdAt: 1,
});

chatSchema.index({
  receiver: 1,
  sender: 1,
  createdAt: 1,
});

// Efficiently find unread messages
chatSchema.index({
  receiver: 1,
  isRead: 1,
});

module.exports = mongoose.model("Chat", chatSchema);
