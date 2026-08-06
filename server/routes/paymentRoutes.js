const express = require("express");

const router = express.Router();

const {
  createPaymentOrder,
  verifyPayment,
} = require("../controllers/paymentController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Payment routes are working",
  });
});

// Create Razorpay Order
router.post("/create-order", protect, authorize("buyer"), createPaymentOrder);

// Verify Payment
router.post("/verify", protect, authorize("buyer"), verifyPayment);

module.exports = router;
