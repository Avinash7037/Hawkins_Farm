const express = require("express");

const router = express.Router();

const {
  addReview,
  getProductReviews,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Public
router.get("/product/:productId", getProductReviews);

// Buyer
router.post("/", protect, authorize("buyer"), addReview);

router.put("/:id", protect, authorize("buyer"), updateReview);

router.delete("/:id", protect, authorize("buyer"), deleteReview);

module.exports = router;
