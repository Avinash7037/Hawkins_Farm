const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // =================================================
    // Buyer
    // =================================================

    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // =================================================
    // Farmer
    // =================================================

    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // =================================================
    // Product
    // =================================================

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // =================================================
    // Quantity
    // =================================================

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    // =================================================
    // Order Total
    // =================================================

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    // =================================================
    // Delivery Address
    // =================================================

    deliveryAddress: {
      type: String,
      required: true,
      trim: true,
    },

    // =================================================
    // Payment
    // =================================================

    paymentMethod: {
      type: String,

      enum: ["COD", "ONLINE"],

      default: "COD",
    },

    paymentStatus: {
      type: String,

      enum: ["Pending", "Paid", "Refunded", "Failed"],

      default: "Pending",
    },

    razorpayOrderId: {
      type: String,
      default: "",
    },

    razorpayPaymentId: {
      type: String,
      default: "",
    },

    // =================================================
    // Razorpay Refund
    // =================================================

    razorpayRefundId: {
      type: String,
      default: "",
    },

    refundStatus: {
      type: String,

      enum: ["Not Applicable", "Pending", "Processed", "Failed"],

      default: "Not Applicable",
    },

    // =================================================
    // Order Status
    // =================================================

    orderStatus: {
      type: String,

      enum: [
        "Pending",
        "Accepted",
        "Rejected",
        "Packed",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],

      default: "Pending",
    },

    // =================================================
    // Inventory Protection
    // =================================================

    stockRestored: {
      type: Boolean,
      default: false,
    },

    stockRestoredAt: {
      type: Date,
      default: null,
    },

    // =================================================
    // Cancellation
    // =================================================

    cancelledBy: {
      type: String,

      enum: ["Buyer", "Farmer", null],

      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Order", orderSchema);
