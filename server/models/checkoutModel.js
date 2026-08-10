const mongoose = require("mongoose");

// =====================================================
// Checkout Item Schema
// =====================================================

const checkoutItemSchema = new mongoose.Schema(
  {
    cartItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  },
);

// =====================================================
// Checkout Schema
// =====================================================

const checkoutSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    deliveryAddress: {
      type: String,
      required: true,
      trim: true,
    },

    // =================================================
    // Payment Method
    // =================================================

    paymentMethod: {
      type: String,
      enum: ["ONLINE", "COD"],
      default: "ONLINE",
    },

    // =================================================
    // Checkout Items
    // =================================================

    items: {
      type: [checkoutItemSchema],

      required: true,

      validate: {
        validator: (items) => Array.isArray(items) && items.length > 0,

        message: "Checkout must contain at least one item",
      },
    },

    // =================================================
    // Total
    // =================================================

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    // =================================================
    // Razorpay
    // =================================================

    razorpayOrderId: {
      type: String,
      default: "",
      index: true,
    },

    razorpayPaymentId: {
      type: String,
      default: "",
    },

    paymentSignature: {
      type: String,
      default: "",
    },

    // =================================================
    // Payment Status
    // =================================================

    paymentStatus: {
      type: String,

      enum: ["Pending", "Paid", "Failed", "Refunded"],

      default: "Pending",
    },

    // =================================================
    // Checkout Completion
    // =================================================

    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Checkout", checkoutSchema);
