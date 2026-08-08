const express = require("express");

const router = express.Router();

const {
  placeOrder,
  getBuyerOrders,
  getFarmerOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");

const { protect, authorize } = require("../middleware/authMiddleware");

// ---------------- Buyer ----------------

// Cash on Delivery Order
router.post("/", protect, authorize("buyer"), placeOrder);

// Buyer Orders
router.get("/my-orders", protect, authorize("buyer"), getBuyerOrders);

// ---------------- Farmer ----------------

// Farmer Orders
router.get("/farmer-orders", protect, authorize("farmer"), getFarmerOrders);

// Update Order Status
router.put("/:id/status", protect, authorize("farmer"), updateOrderStatus);

// ---------------- Shared ----------------

// Get Single Order
router.get("/:id", protect, getOrderById);

module.exports = router;
