const express = require("express");

const router = express.Router();

// =====================================================
// Controllers
// =====================================================

const {
  createPaymentOrder,
  verifyPayment,
} = require("../controllers/paymentController");

// =====================================================
// Middleware
// =====================================================

const { protect, authorize } = require("../middleware/authMiddleware");

// =====================================================
// Test Route
// =====================================================

router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Payment routes are working",
  });
});

// =====================================================
// Create Checkout
//
// Supports:
// - ONLINE
// - COD
// =====================================================

router.post("/create-order", protect, authorize("buyer"), createPaymentOrder);

// =====================================================
// Verify Razorpay Payment
//
// ONLINE payments only.
// COD does not use this endpoint.
// =====================================================

router.post("/verify", protect, authorize("buyer"), verifyPayment);

// =====================================================
// Export
// =====================================================

module.exports = router;
