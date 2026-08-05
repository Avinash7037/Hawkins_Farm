const mongoose = require("mongoose");

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
    },

    paymentMethod: {
      type: String,
      default: "ONLINE",
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    razorpayOrderId: {
      type: String,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Checkout", checkoutSchema);
