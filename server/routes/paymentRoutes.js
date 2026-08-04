const express = require("express");

const router = express.Router();

const { createPaymentOrder } = require("../controllers/paymentController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/create-order", protect, authorize("buyer"), createPaymentOrder);

module.exports = router;
