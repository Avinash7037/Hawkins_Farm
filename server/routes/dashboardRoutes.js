const express = require("express");

const router = express.Router();

const { getFarmerDashboard } = require("../controllers/dashboardController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/farmer", protect, authorize("farmer"), getFarmerDashboard);

module.exports = router;
