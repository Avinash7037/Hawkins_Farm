const express = require("express");

const router = express.Router();

const {
  createProduct,
  getProducts,
  getFarmerProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Marketplace Products
router.get("/", getProducts);

// Farmer Products
router.get(
  "/farmer/my-products",
  protect,
  authorize("farmer"),
  getFarmerProducts,
);

// Single Product
router.get("/:id", getProductById);

// Create Product
router.post(
  "/",
  protect,
  authorize("farmer"),
  upload.array("images", 5),
  createProduct,
);

// Update Product
router.put("/:id", protect, authorize("farmer"), updateProduct);

// Delete Product
router.delete("/:id", protect, authorize("farmer"), deleteProduct);

module.exports = router;
