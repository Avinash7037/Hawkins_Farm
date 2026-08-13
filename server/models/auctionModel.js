const mongoose = require("mongoose");

// =====================================================
// Bid Schema
// =====================================================

const bidSchema = new mongoose.Schema(
  {
    // =================================================
    // Buyer
    // =================================================

    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // =================================================
    // Buyer Name Snapshot
    // =================================================

    buyerName: {
      type: String,
      required: true,
      trim: true,
    },

    // =================================================
    // Bid Amount
    //
    // Price per unit
    // =================================================

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    // =================================================
    // Bid Time
    // =================================================

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: true,
  },
);

// =====================================================
// Auction Schema
// =====================================================

const auctionSchema = new mongoose.Schema(
  {
    // =================================================
    // Product
    // =================================================

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    // =================================================
    // Farmer
    // =================================================

    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // =================================================
    // Product Name Snapshot
    //
    // Keeps auction information stable even if the
    // product name changes later.
    // =================================================

    cropName: {
      type: String,
      required: true,
      trim: true,
    },

    // =================================================
    // Quantity
    // =================================================

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    // =================================================
    // Unit
    // =================================================

    unit: {
      type: String,
      default: "kg",
      trim: true,
    },

    // =================================================
    // Base Price
    //
    // Starting price per unit.
    // =================================================

    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    // =================================================
    // Current Price
    //
    // Highest bid per unit.
    // =================================================

    currentPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    // =================================================
    // Highest Bidder
    // =================================================

    highestBidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    highestBidderName: {
      type: String,
      default: "",
      trim: true,
    },

    // =================================================
    // Bid Count
    // =================================================

    bidCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // =================================================
    // Auction Status
    // =================================================

    status: {
      type: String,
      enum: ["LIVE", "ENDED", "CANCELLED"],
      default: "LIVE",
      index: true,
    },

    // =================================================
    // Timing
    // =================================================

    startsAt: {
      type: Date,
      required: true,
    },

    endsAt: {
      type: Date,
      required: true,
      index: true,
    },

    durationMinutes: {
      type: Number,
      required: true,
      min: 1,
    },

    // =================================================
    // Bids
    // =================================================

    bids: {
      type: [bidSchema],
      default: [],
    },

    // =================================================
    // Auction Result
    // =================================================

    result: {
      status: {
        type: String,
        enum: ["SOLD", "UNSOLD", null],
        default: null,
      },

      winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },

      winningPrice: {
        type: Number,
        default: null,
      },

      totalValue: {
        type: Number,
        default: null,
      },

      endedAt: {
        type: Date,
        default: null,
      },
    },

    // =================================================
    // Cancellation
    // =================================================

    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// =====================================================
// Indexes
// =====================================================

auctionSchema.index({
  status: 1,
  endsAt: 1,
});

auctionSchema.index({
  farmer: 1,
  createdAt: -1,
});

auctionSchema.index({
  product: 1,
  createdAt: -1,
});

// =====================================================
// Model
// =====================================================

module.exports = mongoose.model("Auction", auctionSchema);
