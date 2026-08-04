const express = require("express");

const router = express.Router();

const {
  getFarmerDashboard,
  getAdminDashboard,
} = require("../controllers/dashboardController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Farmer Dashboard
router.get("/farmer", protect, authorize("farmer"), getFarmerDashboard);

// Admin Dashboard
router.get("/admin", protect, authorize("admin"), getAdminDashboard);

module.exports = router;
