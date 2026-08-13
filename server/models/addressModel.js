const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    // =====================================================
    // Owner
    // =====================================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // =====================================================
    // Recipient Information
    // =====================================================

    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },

    // =====================================================
    // Address
    // =====================================================

    addressLine1: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    addressLine2: {
      type: String,
      default: "",
      trim: true,
      maxlength: 200,
    },

    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    state: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    postalCode: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },

    // =====================================================
    // Default Address
    // =====================================================

    isDefault: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// =====================================================
// Indexes
// =====================================================

addressSchema.index({
  user: 1,
  isDefault: 1,
});

addressSchema.index({
  user: 1,
  createdAt: -1,
});

module.exports = mongoose.model("Address", addressSchema);
