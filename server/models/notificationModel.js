const mongoose = require("mongoose");

// =====================================================
// Notification Schema
// =====================================================

const notificationSchema = new mongoose.Schema(
  {
    // =================================================
    // Recipient
    // =================================================

    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // =================================================
    // Notification Type
    // =================================================

    type: {
      type: String,

      enum: [
        // Orders
        "ORDER_PLACED",
        "ORDER_ACCEPTED",
        "ORDER_REJECTED",
        "ORDER_PACKED",
        "ORDER_SHIPPED",
        "ORDER_DELIVERED",
        "ORDER_CANCELLED",
        "ORDER_REFUNDED",

        // Stock
        "LOW_STOCK",
        "STOCK_EMPTY",

        // Auctions
        "AUCTION_STARTED",
        "AUCTION_ENDED",
        "AUCTION_WON",
        "AUCTION_UNSOLD",
      ],

      required: true,
    },

    // =================================================
    // Title
    // =================================================

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    // =================================================
    // Message
    // =================================================

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    // =================================================
    // Related Order
    // =================================================

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },

    // =================================================
    // Related Product
    // =================================================

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },

    // =================================================
    // Related Auction
    // =================================================

    auction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
      default: null,
    },

    // =================================================
    // Read Status
    // =================================================

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
// Indexes
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

notificationSchema.index({
  recipient: 1,
  type: 1,
  product: 1,
  createdAt: -1,
});

notificationSchema.index({
  recipient: 1,
  type: 1,
  auction: 1,
  createdAt: -1,
});

// =====================================================
// Export
// =====================================================

module.exports = mongoose.model("Notification", notificationSchema);
