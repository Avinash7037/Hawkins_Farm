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

// Buyer
router.post("/", protect, authorize("buyer"), placeOrder);

router.get("/my-orders", protect, authorize("buyer"), getBuyerOrders);

// Farmer
router.get("/farmer-orders", protect, authorize("farmer"), getFarmerOrders);

// Shared
router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, authorize("farmer"), updateOrderStatus);

module.exports = router;
