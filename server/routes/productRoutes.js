const express = require("express");

const router = express.Router();

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protect, authorize } = require("../middleware/authMiddleware");
router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", protect, authorize("farmer"), createProduct);
router.put("/:id", protect, authorize("farmer"), updateProduct);
router.delete("/:id", protect, authorize("farmer"), deleteProduct);

module.exports = router;
