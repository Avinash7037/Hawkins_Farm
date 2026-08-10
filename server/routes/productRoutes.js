const express = require("express");

const router = express.Router();

const {
  createProduct,
  getProducts,
  getFarmerProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllProductsAdmin,
  updateProductStatusAdmin,
} = require("../controllers/productController");

const { protect, authorize } = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

// =====================================================
// Marketplace Products
// =====================================================

router.get("/", getProducts);

// =====================================================
// Admin Product Management
// =====================================================

// Get all products including unavailable products
router.get("/admin/all", protect, authorize("admin"), getAllProductsAdmin);

// Activate / deactivate product
router.put(
  "/admin/:id/status",
  protect,
  authorize("admin"),
  updateProductStatusAdmin,
);

// =====================================================
// Farmer Products
// =====================================================

router.get(
  "/farmer/my-products",
  protect,
  authorize("farmer"),
  getFarmerProducts,
);

// =====================================================
// Single Product
// =====================================================

router.get("/:id", getProductById);

// =====================================================
// Create Product
// =====================================================

router.post(
  "/",
  protect,
  authorize("farmer"),
  upload.array("images", 5),
  createProduct,
);

// =====================================================
// Update Product
// =====================================================

router.put("/:id", protect, authorize("farmer"), updateProduct);

// =====================================================
// Delete Product
// =====================================================

router.delete("/:id", protect, authorize("farmer"), deleteProduct);

module.exports = router;
