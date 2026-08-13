const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ===================================================
    // Name
    // ===================================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    // ===================================================
    // Email
    // ===================================================

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // ===================================================
    // Password
    // ===================================================

    password: {
      type: String,
      required: true,
    },

    // ===================================================
    // Role
    // ===================================================

    role: {
      type: String,
      enum: ["farmer", "buyer", "admin"],
      default: "buyer",
    },

    // ===================================================
    // Phone
    // ===================================================

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    // ===================================================
    // Farm Name
    // Farmer-specific
    // ===================================================

    farmName: {
      type: String,
      trim: true,
      default: "",
    },

    // ===================================================
    // Farm Description
    // Farmer-specific
    // ===================================================

    farmDescription: {
      type: String,
      trim: true,
      default: "",
    },

    // ===================================================
    // Account Status
    // ===================================================

    isActive: {
      type: Boolean,
      default: true,
    },

    // ===================================================
    // Password Reset Token
    // ===================================================

    resetPasswordToken: {
      type: String,
      default: null,
    },

    // ===================================================
    // Password Reset Token Expiry
    // ===================================================

    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
