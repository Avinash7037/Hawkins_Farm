const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // =====================================================
    // Farmer
    // =====================================================

    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // =====================================================
    // Product Information
    // =====================================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    // =====================================================
    // Pricing
    // =====================================================

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // =====================================================
    // Stock
    // =====================================================

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    unit: {
      type: String,
      default: "kg",
      trim: true,
    },

    // =====================================================
    // Low Stock Settings
    // =====================================================

    lowStockThreshold: {
      type: Number,
      required: true,
      min: 1,
      default: 5,
    },

    // -----------------------------------------------------
    // Prevent repeated low-stock notifications
    //
    // false = alert can be generated
    // true  = low-stock alert already generated
    // -----------------------------------------------------

    lowStockNotified: {
      type: Boolean,
      default: false,
    },

    // =====================================================
    // Location
    // =====================================================

    location: {
      type: String,
      required: true,
      trim: true,
    },

    // =====================================================
    // Freshness
    // =====================================================

    freshness: {
      type: String,
      enum: ["Fresh", "1 Day", "2 Days", "3+ Days"],
      default: "Fresh",
    },

    // =====================================================
    // Images
    // =====================================================

    images: [
      {
        url: {
          type: String,
          required: true,
        },

        public_id: {
          type: String,
          required: true,
        },
      },
    ],

    // =====================================================
    // Availability
    // =====================================================

    isAvailable: {
      type: Boolean,
      default: true,
    },

    // =====================================================
    // Rating
    // =====================================================

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    numReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Product", productSchema);
