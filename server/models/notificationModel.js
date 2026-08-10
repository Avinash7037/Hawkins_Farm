const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    // =====================================================
    // Recipient
    // =====================================================

    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // =====================================================
    // Notification Type
    // =====================================================

    type: {
      type: String,
      enum: [
        "ORDER_PLACED",
        "ORDER_ACCEPTED",
        "ORDER_REJECTED",
        "ORDER_PACKED",
        "ORDER_SHIPPED",
        "ORDER_DELIVERED",
        "ORDER_CANCELLED",
        "ORDER_REFUNDED",
      ],
      required: true,
    },

    // =====================================================
    // Title
    // =====================================================

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    // =====================================================
    // Message
    // =====================================================

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    // =====================================================
    // Related Order
    // =====================================================

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },

    // =====================================================
    // Read Status
    // =====================================================

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// =====================================================
// Index
// =====================================================

notificationSchema.index({
  recipient: 1,
  isRead: 1,
  createdAt: -1,
});

notificationSchema.index({
  recipient: 1,
  createdAt: -1,
});

module.exports = mongoose.model("Notification", notificationSchema);
