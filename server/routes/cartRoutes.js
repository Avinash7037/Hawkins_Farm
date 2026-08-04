const express = require("express");

const router = express.Router();

const {
  addToCart,
  getCart,
  updateCartQuantity,
  removeCartItem,
} = require("../controllers/cartController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", protect, authorize("buyer"), getCart);

router.post("/", protect, authorize("buyer"), addToCart);

router.put("/:id", protect, authorize("buyer"), updateCartQuantity);

router.delete("/:id", protect, authorize("buyer"), removeCartItem);

module.exports = router;
