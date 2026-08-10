const express = require("express");

const router = express.Router();

const {
  addReview,
  getProductReviews,
  updateReview,
  deleteReview,
  getAllAdminReviews,
  deleteAdminReview,
} = require("../controllers/reviewController");

const { protect, authorize } = require("../middleware/authMiddleware");

// =====================================================
// Public
// =====================================================

router.get("/product/:productId", getProductReviews);

// =====================================================
// Admin
// IMPORTANT:
// These routes must come BEFORE /:id
// =====================================================

router.get("/admin/all", protect, authorize("admin"), getAllAdminReviews);

router.delete("/admin/:id", protect, authorize("admin"), deleteAdminReview);

// =====================================================
// Buyer
// =====================================================

router.post("/", protect, authorize("buyer"), addReview);

router.put("/:id", protect, authorize("buyer"), updateReview);

router.delete("/:id", protect, authorize("buyer"), deleteReview);

module.exports = router;
