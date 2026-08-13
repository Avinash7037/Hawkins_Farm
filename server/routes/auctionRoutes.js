const express = require("express");

const router = express.Router();

// =====================================================
// Controllers
// =====================================================

const {
  createNewAuction,
  getLiveAuctions,
  getSingleAuction,
  getMyAuctions,
  createBid,
  cancel,
} = require("../controllers/auctionController");

// =====================================================
// Middleware
// =====================================================

const { protect, authorize } = require("../middleware/authMiddleware");

// =====================================================
// Public Routes
// =====================================================

// -----------------------------------------------------
// Get All Live Auctions
// -----------------------------------------------------

router.get("/live", getLiveAuctions);

// -----------------------------------------------------
// Get Single Auction
// -----------------------------------------------------

router.get("/:id", getSingleAuction);

// =====================================================
// Farmer Routes
// =====================================================

// -----------------------------------------------------
// Create Auction
// -----------------------------------------------------

router.post("/", protect, authorize("farmer"), createNewAuction);

// -----------------------------------------------------
// Get Farmer's Auctions
// -----------------------------------------------------

router.get("/farmer/my-auctions", protect, authorize("farmer"), getMyAuctions);

// -----------------------------------------------------
// Cancel Auction
// -----------------------------------------------------

router.put("/:id/cancel", protect, authorize("farmer"), cancel);

// =====================================================
// Buyer Routes
// =====================================================

// -----------------------------------------------------
// Place Bid
// -----------------------------------------------------

router.post("/:id/bid", protect, authorize("buyer"), createBid);

// =====================================================
// Export
// =====================================================

module.exports = router;
