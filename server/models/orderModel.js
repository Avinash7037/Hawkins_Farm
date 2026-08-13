const mongoose = require("mongoose");

// =====================================================
// Order Status History Schema
// =====================================================

const orderStatusHistorySchema = new mongoose.Schema(
  {
    status: {
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

      required: true,
    },

    changedAt: {
      type: Date,

      default: Date.now,

      required: true,
    },
  },
  {
    _id: false,
  },
);

// =====================================================
// Order Schema
// =====================================================

const orderSchema = new mongoose.Schema(
  {
    // =================================================
    // Buyer
    // =================================================

    buyer: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,

      index: true,
    },

    // =================================================
    // Farmer
    // =================================================

    farmer: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,

      index: true,
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
    // Delivery Address Snapshot
    // =================================================

    deliveryAddress: {
      fullName: {
        type: String,

        required: true,

        trim: true,
      },

      phone: {
        type: String,

        required: true,

        trim: true,
      },

      addressLine1: {
        type: String,

        required: true,

        trim: true,
      },

      addressLine2: {
        type: String,

        default: "",

        trim: true,
      },

      city: {
        type: String,

        required: true,

        trim: true,
      },

      state: {
        type: String,

        required: true,

        trim: true,
      },

      postalCode: {
        type: String,

        required: true,

        trim: true,
      },
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

    // =================================================
    // Razorpay Order
    // =================================================

    razorpayOrderId: {
      type: String,

      default: "",
    },

    // =================================================
    // Razorpay Payment
    // =================================================

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

      index: true,
    },

    // =================================================
    // Order Status History
    // =================================================

    statusHistory: {
      type: [orderStatusHistorySchema],

      default: () => [
        {
          status: "Pending",

          changedAt: new Date(),
        },
      ],
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

// =====================================================
// Indexes
// =====================================================

orderSchema.index({
  buyer: 1,
  createdAt: -1,
});

orderSchema.index({
  farmer: 1,
  createdAt: -1,
});

orderSchema.index({
  orderStatus: 1,
  createdAt: -1,
});

// =====================================================
// Model
// =====================================================

module.exports = mongoose.model("Order", orderSchema);
