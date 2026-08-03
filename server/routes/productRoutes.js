const express = require("express");

const router = express.Router();

const {
  createProduct,
  getProducts,
} = require("../controllers/productController");

const { protect, authorize } = require("../middleware/authMiddleware");
router.get("/", getProducts);
router.post("/", protect, authorize("farmer"), createProduct);

module.exports = router;
