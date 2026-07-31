const express = require("express");

const router = express.Router();

const { createProduct } = require("../controllers/productController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, authorize("farmer"), createProduct);

module.exports = router;
