const express = require("express");

const router = express.Router();

// =====================================================
// Controllers
// =====================================================

const {
  searchLocation,
  getWeather,
} = require("../controllers/weatherController");

// =====================================================
// Weather Routes
// =====================================================

// Search location
//
// GET /api/weather/search?query=Prayagraj

router.get("/search", searchLocation);

// Get weather
//
// GET /api/weather?latitude=25.4358&longitude=81.8463

router.get("/", getWeather);

// =====================================================
// Export
// =====================================================

module.exports = router;
