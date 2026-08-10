const express = require("express");

const router = express.Router();

// =====================================================
// Controllers
// =====================================================

const {
  placeOrder,
  getBuyerOrders,
  getFarmerOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getAllOrdersAdmin,
} = require("../controllers/orderController");

// =====================================================
// Middleware
// =====================================================

const { protect, authorize } = require("../middleware/authMiddleware");

// =====================================================
// Buyer Routes
// =====================================================

// -----------------------------------------------------
// Place Order
//
// Used for COD order creation.
// -----------------------------------------------------

router.post("/", protect, authorize("buyer"), placeOrder);

// -----------------------------------------------------
// Get Buyer's Orders
// -----------------------------------------------------

router.get("/my-orders", protect, authorize("buyer"), getBuyerOrders);

// -----------------------------------------------------
// Cancel Buyer Order
//
// Supports:
// - COD cancellation
// - Razorpay paid-order cancellation/refund
// -----------------------------------------------------

router.put("/:id/cancel", protect, authorize("buyer"), cancelOrder);

// =====================================================
// Farmer Routes
// =====================================================

// -----------------------------------------------------
// Get Farmer Orders
// -----------------------------------------------------

router.get("/farmer-orders", protect, authorize("farmer"), getFarmerOrders);

// -----------------------------------------------------
// Update Order Status
//
// Pending
// → Accepted
// → Packed
// → Shipped
// → Delivered
// -----------------------------------------------------

router.put("/:id/status", protect, authorize("farmer"), updateOrderStatus);

// =====================================================
// Admin Routes
// =====================================================

// -----------------------------------------------------
// Get All Orders
// -----------------------------------------------------

router.get("/admin/all", protect, authorize("admin"), getAllOrdersAdmin);

// =====================================================
// Shared Routes
// =====================================================

// -----------------------------------------------------
// Get Single Order
//
// IMPORTANT:
// This must remain AFTER the more specific routes above.
// -----------------------------------------------------

router.get("/:id", protect, getOrderById);

// =====================================================
// Export
// =====================================================

module.exports = router;
