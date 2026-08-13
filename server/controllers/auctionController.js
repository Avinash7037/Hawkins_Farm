const mongoose = require("mongoose");

const {
  createAuction,
  getAuction,
  getAllLiveAuctions,
  getFarmerAuctions,
  placeBid,
  cancelAuction,
} = require("../services/auctionService");

// =====================================================
// Helpers
// =====================================================

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// =====================================================
// Create Auction
// =====================================================

const createNewAuction = async (req, res) => {
  try {
    const { productId, quantity, basePrice, durationMinutes } = req.body;

    // -------------------------------------------------
    // Validate Product
    // -------------------------------------------------

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    if (!isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // -------------------------------------------------
    // Socket.IO
    // -------------------------------------------------

    const io = req.app.get("io");

    // -------------------------------------------------
    // Create Auction
    // -------------------------------------------------

    const auction = await createAuction({
      farmerId: req.user._id,

      productId,

      quantity,

      basePrice,

      durationMinutes: durationMinutes === undefined ? 10 : durationMinutes,

      io,
    });

    // -------------------------------------------------
    // Response
    // -------------------------------------------------

    return res.status(201).json({
      success: true,

      message: "Auction created successfully",

      auction,
    });
  } catch (error) {
    console.error("Create auction error:", error);

    return res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};

// =====================================================
// Get All Live Auctions
// =====================================================

const getLiveAuctions = async (req, res) => {
  try {
    // -------------------------------------------------
    // Socket.IO
    // -------------------------------------------------

    const io = req.app.get("io");

    const auctions = await getAllLiveAuctions(io);

    return res.status(200).json({
      success: true,

      count: auctions.length,

      auctions,
    });
  } catch (error) {
    console.error("Get live auctions error:", error);

    return res.status(500).json({
      success: false,

      message: error.message || "Failed to fetch live auctions",
    });
  }
};

// =====================================================
// Get Single Auction
// =====================================================

const getSingleAuction = async (req, res) => {
  try {
    const { id } = req.params;

    // -------------------------------------------------
    // Validate Auction ID
    // -------------------------------------------------

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,

        message: "Invalid auction ID",
      });
    }

    // -------------------------------------------------
    // Socket.IO
    // -------------------------------------------------

    const io = req.app.get("io");

    // -------------------------------------------------
    // Get Auction
    // -------------------------------------------------

    const auction = await getAuction(id, io);

    return res.status(200).json({
      success: true,

      auction,
    });
  } catch (error) {
    console.error("Get auction error:", error);

    return res.status(404).json({
      success: false,

      message: error.message,
    });
  }
};

// =====================================================
// Get Farmer Auctions
// =====================================================

const getMyAuctions = async (req, res) => {
  try {
    const auctions = await getFarmerAuctions(req.user._id);

    return res.status(200).json({
      success: true,

      count: auctions.length,

      auctions,
    });
  } catch (error) {
    console.error("Get farmer auctions error:", error);

    return res.status(500).json({
      success: false,

      message: error.message || "Failed to fetch your auctions",
    });
  }
};

// =====================================================
// Place Bid
// =====================================================

const createBid = async (req, res) => {
  try {
    const { id } = req.params;

    const { amount } = req.body;

    // -------------------------------------------------
    // Validate Auction ID
    // -------------------------------------------------

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,

        message: "Invalid auction ID",
      });
    }

    // -------------------------------------------------
    // Place Bid
    // -------------------------------------------------

    const result = await placeBid({
      auctionId: id,

      buyerId: req.user._id,

      buyerName: req.user.name,

      amount,
    });

    // -------------------------------------------------
    // Socket.IO
    // -------------------------------------------------

    const io = req.app.get("io");

    if (io) {
      io.to(`auction:${id}`).emit("auction:bid", {
        auctionId: id,

        newPrice: result.newPrice,

        highestBidder: result.highestBidder,

        highestBidderName: result.highestBidderName,

        bidCount: result.bidCount,

        bid: result.bid,

        endsAt: result.endsAt,
      });
    }

    // -------------------------------------------------
    // Response
    // -------------------------------------------------

    return res.status(200).json({
      success: true,

      message: "Bid placed successfully",

      result,
    });
  } catch (error) {
    console.error("Place bid error:", error);

    return res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};

// =====================================================
// Cancel Auction
// =====================================================

const cancel = async (req, res) => {
  try {
    const { id } = req.params;

    // -------------------------------------------------
    // Validate Auction ID
    // -------------------------------------------------

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,

        message: "Invalid auction ID",
      });
    }

    // -------------------------------------------------
    // Cancel Auction
    // -------------------------------------------------

    const auction = await cancelAuction({
      auctionId: id,

      farmerId: req.user._id,
    });

    // -------------------------------------------------
    // Socket.IO
    // -------------------------------------------------

    const io = req.app.get("io");

    if (io) {
      io.to(`auction:${id}`).emit("auction:cancelled", {
        auctionId: id,

        status: "CANCELLED",
      });
    }

    // -------------------------------------------------
    // Response
    // -------------------------------------------------

    return res.status(200).json({
      success: true,

      message: "Auction cancelled successfully",

      auction,
    });
  } catch (error) {
    console.error("Cancel auction error:", error);

    return res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};

// =====================================================
// Export
// =====================================================

module.exports = {
  createNewAuction,

  getLiveAuctions,

  getSingleAuction,

  getMyAuctions,

  createBid,

  cancel,
};
