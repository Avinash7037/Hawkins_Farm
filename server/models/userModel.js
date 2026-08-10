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
    // Account Status
    // ===================================================

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
