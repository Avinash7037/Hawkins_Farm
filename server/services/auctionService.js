const mongoose = require("mongoose");

const Auction = require("../models/auctionModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");

const {
  createAuctionStartedNotification,
  createAuctionWonNotification,
  createAuctionEndedNotification,
  createAuctionUnsoldNotification,
} = require("./notificationService");

// =====================================================
// Constants
// =====================================================

const MIN_DURATION_MINUTES = 1;

const MAX_DURATION_MINUTES = 24 * 60;

const MIN_BID_INCREMENT = 1;

// =====================================================
// Helpers
// =====================================================

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const normalizeId = (id) => {
  return id?.toString();
};

// =====================================================
// Create Auction
// =====================================================

const createAuction = async ({
  farmerId,
  productId,
  quantity,
  basePrice,
  durationMinutes = 10,
  io = null,
}) => {
  if (!isValidObjectId(farmerId)) {
    throw new Error("Invalid farmer ID");
  }

  if (!isValidObjectId(productId)) {
    throw new Error("Invalid product ID");
  }

  if (quantity === undefined || quantity === null || Number(quantity) <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  const auctionQuantity = Number(quantity);

  if (!Number.isFinite(auctionQuantity)) {
    throw new Error("Quantity must be a valid number");
  }

  if (basePrice === undefined || basePrice === null || Number(basePrice) <= 0) {
    throw new Error("Base price must be greater than 0");
  }

  const auctionBasePrice = Number(basePrice);

  if (!Number.isFinite(auctionBasePrice)) {
    throw new Error("Base price must be a valid number");
  }

  const duration = Number(durationMinutes);

  if (
    !Number.isInteger(duration) ||
    duration < MIN_DURATION_MINUTES ||
    duration > MAX_DURATION_MINUTES
  ) {
    throw new Error(
      `Auction duration must be between ${MIN_DURATION_MINUTES} and ${MAX_DURATION_MINUTES} minutes`,
    );
  }

  // =================================================
  // Transaction
  // =================================================

  const session = await mongoose.startSession();

  try {
    let createdAuction;

    await session.withTransaction(async () => {
      // -------------------------------------------------
      // Product
      // -------------------------------------------------

      const product = await Product.findById(productId)
        .session(session)
        .select("farmer name quantity unit price isAvailable");

      if (!product) {
        throw new Error("Product not found");
      }

      // -------------------------------------------------
      // Ownership
      // -------------------------------------------------

      if (normalizeId(product.farmer) !== normalizeId(farmerId)) {
        throw new Error("You can only create an auction for your own product");
      }

      // -------------------------------------------------
      // Availability
      // -------------------------------------------------

      if (!product.isAvailable) {
        throw new Error("This product is currently unavailable");
      }

      // -------------------------------------------------
      // Quantity
      // -------------------------------------------------

      if (auctionQuantity > product.quantity) {
        throw new Error(
          `Only ${product.quantity} ${product.unit || "units"} available`,
        );
      }

      // -------------------------------------------------
      // Reserve Stock
      // -------------------------------------------------

      const updatedProduct = await Product.findOneAndUpdate(
        {
          _id: productId,

          farmer: farmerId,

          quantity: {
            $gte: auctionQuantity,
          },

          isAvailable: true,
        },

        {
          $inc: {
            quantity: -auctionQuantity,
          },
        },

        {
          new: true,

          session,
        },
      );

      if (!updatedProduct) {
        throw new Error("Unable to reserve product stock. Please try again.");
      }

      // -------------------------------------------------
      // Timing
      // -------------------------------------------------

      const now = new Date();

      const endsAt = new Date(now.getTime() + duration * 60 * 1000);

      // -------------------------------------------------
      // Create Auction
      // -------------------------------------------------

      const auctions = await Auction.create(
        [
          {
            product: product._id,

            farmer: farmerId,

            cropName: product.name,

            quantity: auctionQuantity,

            unit: product.unit || "kg",

            basePrice: auctionBasePrice,

            currentPrice: auctionBasePrice,

            highestBidder: null,

            highestBidderName: "",

            bidCount: 0,

            status: "LIVE",

            startsAt: now,

            endsAt,

            durationMinutes: duration,

            bids: [],

            result: {
              status: null,

              winner: null,

              winningPrice: null,

              totalValue: null,

              endedAt: null,
            },

            cancelledAt: null,
          },
        ],

        {
          session,
        },
      );

      createdAuction = auctions[0];
    });

    // =================================================
    // Populate
    // =================================================

    const populatedAuction = await Auction.findById(createdAuction._id)
      .populate(
        "product",
        "name description category price quantity unit images location freshness",
      )
      .populate("farmer", "name email phone farmName");

    // =================================================
    // Notify Buyers
    // =================================================

    try {
      const buyers = await User.find({
        role: "buyer",

        isActive: true,
      }).select("_id");

      if (buyers.length > 0) {
        await Promise.all(
          buyers.map((buyer) =>
            createAuctionStartedNotification({
              buyerId: buyer._id,

              auctionId: populatedAuction._id,

              productId: populatedAuction.product?._id,

              productName: populatedAuction.cropName,

              quantity: populatedAuction.quantity,

              unit: populatedAuction.unit,

              basePrice: populatedAuction.basePrice,

              io,
            }),
          ),
        );
      }

      console.log(`🔔 Auction notification sent to ${buyers.length} buyers`);
    } catch (notificationError) {
      console.error("Auction notification error:", notificationError.message);
    }

    return populatedAuction;
  } finally {
    await session.endSession();
  }
};

// =====================================================
// Get Single Auction
// =====================================================

const getAuction = async (auctionId, io = null) => {
  if (!isValidObjectId(auctionId)) {
    throw new Error("Invalid auction ID");
  }

  let auction = await Auction.findById(auctionId)
    .populate(
      "product",
      "name description category price quantity unit images location freshness",
    )
    .populate("farmer", "name email phone farmName")
    .populate("highestBidder", "name email")
    .populate("bids.buyer", "name")
    .populate("result.winner", "name email");

  if (!auction) {
    throw new Error("Auction not found");
  }

  // -------------------------------------------------
  // Automatically Close Expired
  // -------------------------------------------------

  if (auction.status === "LIVE" && new Date() >= new Date(auction.endsAt)) {
    await endAuction(auctionId, io);

    auction = await Auction.findById(auctionId)
      .populate(
        "product",
        "name description category price quantity unit images location freshness",
      )
      .populate("farmer", "name email phone farmName")
      .populate("highestBidder", "name email")
      .populate("bids.buyer", "name")
      .populate("result.winner", "name email");
  }

  return auction;
};

// =====================================================
// Get All Live Auctions
// =====================================================

const getAllLiveAuctions = async (io = null) => {
  const expiredAuctions = await Auction.find({
    status: "LIVE",

    endsAt: {
      $lte: new Date(),
    },
  }).select("_id");

  // -------------------------------------------------
  // End Expired Auctions
  // -------------------------------------------------

  for (const auction of expiredAuctions) {
    try {
      await endAuction(auction._id, io);
    } catch (error) {
      console.error(
        `Failed to end expired auction ${auction._id}:`,
        error.message,
      );
    }
  }

  // -------------------------------------------------
  // Remaining Live Auctions
  // -------------------------------------------------

  return Auction.find({
    status: "LIVE",

    endsAt: {
      $gt: new Date(),
    },
  })
    .sort({
      endsAt: 1,

      createdAt: -1,
    })
    .populate(
      "product",
      "name category price quantity unit images location freshness",
    )
    .populate("farmer", "name farmName")
    .populate("highestBidder", "name");
};

// =====================================================
// Get Farmer Auctions
// =====================================================

const getFarmerAuctions = async (farmerId) => {
  if (!isValidObjectId(farmerId)) {
    throw new Error("Invalid farmer ID");
  }

  return Auction.find({
    farmer: farmerId,
  })
    .sort({
      createdAt: -1,
    })
    .populate("product", "name category price quantity unit images")
    .populate("highestBidder", "name email")
    .populate("result.winner", "name email");
};

// =====================================================
// Place Bid
// =====================================================

const placeBid = async ({ auctionId, buyerId, buyerName, amount }) => {
  if (!isValidObjectId(auctionId)) {
    throw new Error("Invalid auction ID");
  }

  if (!isValidObjectId(buyerId)) {
    throw new Error("Invalid buyer ID");
  }

  if (typeof buyerName !== "string" || !buyerName.trim()) {
    throw new Error("Invalid buyer name");
  }

  if (amount === undefined || amount === null || Number(amount) <= 0) {
    throw new Error("Bid amount must be greater than 0");
  }

  const bidAmount = Number(amount);

  if (!Number.isFinite(bidAmount)) {
    throw new Error("Bid amount must be a valid number");
  }

  const auction = await Auction.findById(auctionId);

  if (!auction) {
    throw new Error("Auction not found");
  }

  if (auction.status !== "LIVE") {
    throw new Error(`Auction is ${auction.status}`);
  }

  if (new Date() >= new Date(auction.endsAt)) {
    throw new Error("Auction has already ended");
  }

  // -------------------------------------------------
  // Farmer Cannot Bid
  // -------------------------------------------------

  if (normalizeId(auction.farmer) === normalizeId(buyerId)) {
    throw new Error("Farmer cannot bid on own auction");
  }

  // -------------------------------------------------
  // Minimum Bid
  // -------------------------------------------------

  const minimumBid = Number(auction.currentPrice) + MIN_BID_INCREMENT;

  if (bidAmount < minimumBid) {
    throw new Error(`Bid must be at least ₹${minimumBid}`);
  }

  // =================================================
  // Bid
  // =================================================

  const bid = {
    buyer: buyerId,

    buyerName: buyerName.trim(),

    amount: bidAmount,

    createdAt: new Date(),
  };

  const updatedAuction = await Auction.findOneAndUpdate(
    {
      _id: auctionId,

      status: "LIVE",

      endsAt: {
        $gt: new Date(),
      },

      currentPrice: {
        $lt: bidAmount,
      },
    },

    {
      $set: {
        currentPrice: bidAmount,

        highestBidder: buyerId,

        highestBidderName: buyerName.trim(),
      },

      $inc: {
        bidCount: 1,
      },

      $push: {
        bids: bid,
      },
    },

    {
      new: true,
    },
  );

  // -------------------------------------------------
  // Race Condition
  // -------------------------------------------------

  if (!updatedAuction) {
    const latestAuction = await Auction.findById(auctionId);

    if (!latestAuction) {
      throw new Error("Auction not found");
    }

    if (latestAuction.status !== "LIVE") {
      throw new Error(`Auction is ${latestAuction.status}`);
    }

    if (new Date() >= new Date(latestAuction.endsAt)) {
      throw new Error("Auction has already ended");
    }

    throw new Error(
      `Bid must be at least ₹${
        Number(latestAuction.currentPrice) + MIN_BID_INCREMENT
      }`,
    );
  }

  return {
    auctionId: updatedAuction._id,

    newPrice: updatedAuction.currentPrice,

    highestBidder: updatedAuction.highestBidder,

    highestBidderName: updatedAuction.highestBidderName,

    bidCount: updatedAuction.bidCount,

    bid: {
      buyer: buyerId,

      buyerName: buyerName.trim(),

      amount: bidAmount,

      createdAt: bid.createdAt,
    },

    endsAt: updatedAuction.endsAt,
  };
};

// =====================================================
// End Auction
// =====================================================

const endAuction = async (auctionId, io = null) => {
  if (!isValidObjectId(auctionId)) {
    throw new Error("Invalid auction ID");
  }

  const session = await mongoose.startSession();

  try {
    let result = null;

    let shouldNotify = false;

    await session.withTransaction(async () => {
      // -----------------------------------------------
      // Find Auction
      // -----------------------------------------------

      const auction = await Auction.findById(auctionId).session(session);

      if (!auction) {
        throw new Error("Auction not found");
      }

      // -----------------------------------------------
      // Already Finished
      // -----------------------------------------------

      if (auction.status !== "LIVE") {
        result = {
          auctionId: auction._id,

          status: auction.result?.status || auction.status,

          winner: auction.result?.winner || auction.highestBidder || null,

          winningPrice: auction.result?.winningPrice || null,

          totalValue: auction.result?.totalValue || null,

          endedAt: auction.result?.endedAt || auction.cancelledAt || null,

          cropName: auction.cropName,

          quantity: auction.quantity,

          unit: auction.unit,

          farmerId: auction.farmer,

          productId: auction.product,

          winnerName: auction.highestBidderName || null,

          totalBids: auction.bidCount || 0,
        };

        return;
      }

      // -----------------------------------------------
      // Determine Winner
      // -----------------------------------------------

      const hasWinner = auction.highestBidder !== null;

      const endedAt = new Date();

      // =================================================
      // SOLD
      // =================================================

      if (hasWinner) {
        const winningPrice = Number(auction.currentPrice);

        const totalValue = Number(
          (winningPrice * Number(auction.quantity)).toFixed(2),
        );

        auction.status = "ENDED";

        auction.result = {
          status: "SOLD",

          winner: auction.highestBidder,

          winningPrice,

          totalValue,

          endedAt,
        };

        await auction.save({
          session,
        });

        result = {
          auctionId: auction._id,

          status: "SOLD",

          cropName: auction.cropName,

          quantity: auction.quantity,

          unit: auction.unit,

          winningPrice,

          winner: auction.highestBidder,

          winnerName: auction.highestBidderName,

          farmerId: auction.farmer,

          productId: auction.product,

          totalValue,

          totalBids: auction.bidCount,

          endedAt,
        };

        shouldNotify = true;
      }

      // =================================================
      // UNSOLD
      // =================================================
      else {
        // -----------------------------------------------
        // Restore Reserved Stock
        // -----------------------------------------------

        await Product.findByIdAndUpdate(
          auction.product,

          {
            $inc: {
              quantity: auction.quantity,
            },

            $set: {
              isAvailable: true,
            },
          },

          {
            session,
          },
        );

        auction.status = "ENDED";

        auction.result = {
          status: "UNSOLD",

          winner: null,

          winningPrice: null,

          totalValue: null,

          endedAt,
        };

        await auction.save({
          session,
        });

        result = {
          auctionId: auction._id,

          status: "UNSOLD",

          cropName: auction.cropName,

          quantity: auction.quantity,

          unit: auction.unit,

          farmerId: auction.farmer,

          productId: auction.product,

          totalBids: auction.bidCount,

          endedAt,
        };

        shouldNotify = true;
      }
    });

    // ===================================================
    // IMPORTANT:
    // Transaction has successfully committed.
    // Notifications happen AFTER the transaction.
    // ===================================================

    if (shouldNotify && result) {
      try {
        // =================================================
        // SOLD
        // =================================================

        if (result.status === "SOLD") {
          // -------------------------------------------------
          // Notify Winner
          // -------------------------------------------------

          await createAuctionWonNotification({
            buyerId: result.winner,

            auctionId: result.auctionId,

            productId: result.productId,

            productName: result.cropName,

            quantity: result.quantity,

            unit: result.unit,

            winningPrice: result.winningPrice,

            totalValue: result.totalValue,

            io,
          });

          // -------------------------------------------------
          // Notify Farmer
          // -------------------------------------------------

          await createAuctionEndedNotification({
            farmerId: result.farmerId,

            auctionId: result.auctionId,

            productId: result.productId,

            productName: result.cropName,

            quantity: result.quantity,

            unit: result.unit,

            winningPrice: result.winningPrice,

            totalValue: result.totalValue,

            winnerName: result.winnerName,

            totalBids: result.totalBids,

            io,
          });
        }

        // =================================================
        // UNSOLD
        // =================================================

        if (result.status === "UNSOLD") {
          await createAuctionUnsoldNotification({
            farmerId: result.farmerId,

            auctionId: result.auctionId,

            productId: result.productId,

            productName: result.cropName,

            quantity: result.quantity,

            unit: result.unit,

            totalBids: result.totalBids,

            io,
          });
        }
      } catch (notificationError) {
        // -------------------------------------------------
        // Auction completion must NOT fail because
        // notification failed.
        // -------------------------------------------------

        console.error(
          "Auction completion notification error:",
          notificationError.message,
        );
      }
    }

    return result;
  } finally {
    await session.endSession();
  }
};

// =====================================================
// Cancel Auction
// =====================================================

const cancelAuction = async ({ auctionId, farmerId }) => {
  if (!isValidObjectId(auctionId)) {
    throw new Error("Invalid auction ID");
  }

  if (!isValidObjectId(farmerId)) {
    throw new Error("Invalid farmer ID");
  }

  const session = await mongoose.startSession();

  try {
    let result;

    await session.withTransaction(async () => {
      const auction = await Auction.findById(auctionId).session(session);

      if (!auction) {
        throw new Error("Auction not found");
      }

      if (normalizeId(auction.farmer) !== normalizeId(farmerId)) {
        throw new Error("You can only cancel your own auction");
      }

      if (auction.status !== "LIVE") {
        throw new Error(`Auction is already ${auction.status}`);
      }

      // -------------------------------------------------
      // Restore Stock
      // -------------------------------------------------

      await Product.findByIdAndUpdate(
        auction.product,

        {
          $inc: {
            quantity: auction.quantity,
          },

          $set: {
            isAvailable: true,
          },
        },

        {
          session,
        },
      );

      // -------------------------------------------------
      // Cancel
      // -------------------------------------------------

      auction.status = "CANCELLED";

      auction.cancelledAt = new Date();

      await auction.save({
        session,
      });

      result = auction;
    });

    // -------------------------------------------------
    // Populate
    // -------------------------------------------------

    const populatedAuction = await Auction.findById(result._id)
      .populate("product", "name category price quantity unit images")
      .populate("farmer", "name email phone farmName");

    return populatedAuction;
  } finally {
    await session.endSession();
  }
};

// =====================================================
// End All Expired Auctions
// =====================================================

const endExpiredAuctions = async (io = null) => {
  const expiredAuctions = await Auction.find({
    status: "LIVE",

    endsAt: {
      $lte: new Date(),
    },
  }).select("_id");

  const results = [];

  for (const auction of expiredAuctions) {
    try {
      const result = await endAuction(auction._id, io);

      results.push(result);
    } catch (error) {
      console.error(`Failed to end auction ${auction._id}:`, error.message);
    }
  }

  return results;
};

// =====================================================
// Export
// =====================================================

module.exports = {
  createAuction,

  getAuction,

  getAllLiveAuctions,

  getFarmerAuctions,

  placeBid,

  endAuction,

  endExpiredAuctions,

  cancelAuction,
};
