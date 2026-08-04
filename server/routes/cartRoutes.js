const express = require("express");

const router = express.Router();

const { addToCart } = require("../controllers/cartController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, authorize("buyer"), addToCart);

module.exports = router;
