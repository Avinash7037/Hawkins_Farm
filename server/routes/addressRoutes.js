const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  getMyAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../controllers/addressController");

// =====================================================
// Address Management
// =====================================================

// Get My Addresses
router.get("/", protect, getMyAddresses);

// Add Address
router.post("/", protect, addAddress);

// Update Address
router.put("/:id", protect, updateAddress);

// Delete Address
router.delete("/:id", protect, deleteAddress);

// Set Default Address
router.put("/:id/default", protect, setDefaultAddress);

module.exports = router;
