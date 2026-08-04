const express = require("express");

const router = express.Router();

const {
  createPaymentOrder,
  verifyPayment,
} = require("../controllers/paymentController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Create Razorpay Order
router.post("/create-order", protect, authorize("buyer"), createPaymentOrder);

// Verify Payment
router.post("/verify", protect, authorize("buyer"), verifyPayment);

module.exports = router;
