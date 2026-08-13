import { createSlice } from "@reduxjs/toolkit";

import {
  fetchLiveAuctions,
  fetchAuctionById,
  fetchMyAuctions,
  createNewAuction,
  placeAuctionBid,
  cancelMyAuction,
} from "./auctionThunks";

// =====================================================
// Initial State
// =====================================================

const initialState = {
  // ===================================================
  // Buyer
  // ===================================================

  liveAuctions: [],

  selectedAuction: null,

  // ===================================================
  // Farmer
  // ===================================================

  myAuctions: [],

  // ===================================================
  // Loading States
  // ===================================================

  loading: false,

  detailsLoading: false,

  creating: false,

  bidding: false,

  cancelling: false,

  // ===================================================
  // Currently Processing IDs
  // ===================================================

  cancellingAuctionId: null,

  biddingAuctionId: null,

  // ===================================================
  // Errors
  // ===================================================

  error: null,

  detailsError: null,

  createError: null,

  bidError: null,

  cancelError: null,
};

// =====================================================
// Slice
// =====================================================

const auctionSlice = createSlice({
  name: "auction",

  initialState,

  reducers: {
    // =================================================
    // Clear Selected Auction
    // =================================================

    clearSelectedAuction: (state) => {
      state.selectedAuction = null;
      state.detailsError = null;
    },

    // =================================================
    // Clear Errors
    // =================================================

    clearAuctionErrors: (state) => {
      state.error = null;
      state.detailsError = null;
      state.createError = null;
      state.bidError = null;
      state.cancelError = null;
    },

    // =================================================
    // Clear Auction State
    // =================================================

    clearAuctionState: (state) => {
      state.liveAuctions = [];
      state.selectedAuction = null;
      state.myAuctions = [];

      state.loading = false;
      state.detailsLoading = false;
      state.creating = false;
      state.bidding = false;
      state.cancelling = false;

      state.cancellingAuctionId = null;
      state.biddingAuctionId = null;

      state.error = null;
      state.detailsError = null;
      state.createError = null;
      state.bidError = null;
      state.cancelError = null;
    },

    // =================================================
    // Real-Time Bid Update
    // =================================================

    updateAuctionFromSocket: (state, action) => {
      const update = action.payload;

      if (!update?.auctionId) {
        return;
      }

      // -----------------------------------------------
      // Update selected auction
      // -----------------------------------------------

      if (
        state.selectedAuction &&
        state.selectedAuction._id === update.auctionId
      ) {
        state.selectedAuction.currentPrice = update.newPrice;

        state.selectedAuction.highestBidder = update.highestBidder || null;

        state.selectedAuction.highestBidderName =
          update.highestBidderName || "";

        state.selectedAuction.bidCount =
          update.bidCount ?? state.selectedAuction.bidCount;

        state.selectedAuction.endsAt =
          update.endsAt || state.selectedAuction.endsAt;

        if (update.bid) {
          state.selectedAuction.bids = [
            ...(state.selectedAuction.bids || []),
            update.bid,
          ];
        }
      }

      // -----------------------------------------------
      // Update live auction list
      // -----------------------------------------------

      const index = state.liveAuctions.findIndex(
        (auction) => auction._id === update.auctionId,
      );

      if (index !== -1) {
        state.liveAuctions[index].currentPrice = update.newPrice;

        state.liveAuctions[index].highestBidder = update.highestBidder || null;

        state.liveAuctions[index].highestBidderName =
          update.highestBidderName || "";

        state.liveAuctions[index].bidCount =
          update.bidCount ?? state.liveAuctions[index].bidCount;

        state.liveAuctions[index].endsAt =
          update.endsAt || state.liveAuctions[index].endsAt;
      }
    },

    // =================================================
    // Real-Time Auction Cancelled
    // =================================================

    updateAuctionCancelledFromSocket: (state, action) => {
      const { auctionId } = action.payload || {};

      if (!auctionId) {
        return;
      }

      // -----------------------------------------------
      // Update selected auction
      // -----------------------------------------------

      if (state.selectedAuction && state.selectedAuction._id === auctionId) {
        state.selectedAuction.status = "CANCELLED";
      }

      // -----------------------------------------------
      // Remove from live auctions
      // -----------------------------------------------

      state.liveAuctions = state.liveAuctions.filter(
        (auction) => auction._id !== auctionId,
      );
    },

    // =================================================
    // Real-Time Auction Ended
    // =================================================

    updateAuctionEndedFromSocket: (state, action) => {
      const { auctionId, result } = action.payload || {};

      if (!auctionId) {
        return;
      }

      if (state.selectedAuction && state.selectedAuction._id === auctionId) {
        state.selectedAuction.status = "ENDED";

        if (result) {
          state.selectedAuction.result = result;
        }
      }

      state.liveAuctions = state.liveAuctions.filter(
        (auction) => auction._id !== auctionId,
      );
    },
  },

  // =====================================================
  // Async Actions
  // =====================================================

  extraReducers: (builder) => {
    builder

      // =================================================
      // Fetch Live Auctions
      // =================================================

      .addCase(fetchLiveAuctions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchLiveAuctions.fulfilled, (state, action) => {
        state.loading = false;

        state.liveAuctions = action.payload?.auctions || [];

        state.error = null;
      })

      .addCase(fetchLiveAuctions.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || "Failed to fetch live auctions";
      })

      // =================================================
      // Fetch Single Auction
      // =================================================

      .addCase(fetchAuctionById.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })

      .addCase(fetchAuctionById.fulfilled, (state, action) => {
        state.detailsLoading = false;

        state.selectedAuction = action.payload?.auction || null;

        state.detailsError = null;
      })

      .addCase(fetchAuctionById.rejected, (state, action) => {
        state.detailsLoading = false;

        state.detailsError = action.payload || "Failed to fetch auction";
      })

      // =================================================
      // Create Auction
      // =================================================

      .addCase(createNewAuction.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })

      .addCase(createNewAuction.fulfilled, (state, action) => {
        state.creating = false;

        const auction = action.payload?.auction;

        if (auction) {
          state.myAuctions.unshift(auction);
        }

        state.createError = null;
      })

      .addCase(createNewAuction.rejected, (state, action) => {
        state.creating = false;

        state.createError = action.payload || "Failed to create auction";
      })

      // =================================================
      // Fetch Farmer Auctions
      // =================================================

      .addCase(fetchMyAuctions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchMyAuctions.fulfilled, (state, action) => {
        state.loading = false;

        state.myAuctions = action.payload?.auctions || [];

        state.error = null;
      })

      .addCase(fetchMyAuctions.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || "Failed to fetch your auctions";
      })

      // =================================================
      // Place Bid
      // =================================================

      .addCase(placeAuctionBid.pending, (state, action) => {
        state.bidding = true;
        state.biddingAuctionId = action.meta.arg?.id;
        state.bidError = null;
      })

      .addCase(placeAuctionBid.fulfilled, (state, action) => {
        state.bidding = false;
        state.biddingAuctionId = null;

        const result = action.payload?.result;

        if (!result) {
          return;
        }

        // -----------------------------------------------
        // Update selected auction
        // -----------------------------------------------

        if (
          state.selectedAuction &&
          state.selectedAuction._id === result.auctionId
        ) {
          state.selectedAuction.currentPrice = result.newPrice;

          state.selectedAuction.highestBidder = result.highestBidder || null;

          state.selectedAuction.highestBidderName =
            result.highestBidderName || "";

          state.selectedAuction.bidCount =
            result.bidCount ?? state.selectedAuction.bidCount;

          if (result.bid) {
            state.selectedAuction.bids = [
              ...(state.selectedAuction.bids || []),
              result.bid,
            ];
          }
        }

        // -----------------------------------------------
        // Update live list
        // -----------------------------------------------

        const index = state.liveAuctions.findIndex(
          (auction) => auction._id === result.auctionId,
        );

        if (index !== -1) {
          state.liveAuctions[index].currentPrice = result.newPrice;

          state.liveAuctions[index].highestBidder =
            result.highestBidder || null;

          state.liveAuctions[index].highestBidderName =
            result.highestBidderName || "";

          state.liveAuctions[index].bidCount =
            result.bidCount ?? state.liveAuctions[index].bidCount;
        }

        state.bidError = null;
      })

      .addCase(placeAuctionBid.rejected, (state, action) => {
        state.bidding = false;
        state.biddingAuctionId = null;

        state.bidError = action.payload || "Failed to place bid";
      })

      // =================================================
      // Cancel Auction
      // =================================================

      .addCase(cancelMyAuction.pending, (state, action) => {
        state.cancelling = true;
        state.cancellingAuctionId = action.meta.arg;
        state.cancelError = null;
      })

      .addCase(cancelMyAuction.fulfilled, (state, action) => {
        state.cancelling = false;
        state.cancellingAuctionId = null;

        const cancelledAuction = action.payload?.auction;

        if (!cancelledAuction) {
          return;
        }

        const index = state.myAuctions.findIndex(
          (auction) => auction._id === cancelledAuction._id,
        );

        if (index !== -1) {
          state.myAuctions[index] = cancelledAuction;
        }
      })

      .addCase(cancelMyAuction.rejected, (state, action) => {
        state.cancelling = false;
        state.cancellingAuctionId = null;

        state.cancelError = action.payload || "Failed to cancel auction";
      });
  },
});

// =====================================================
// Actions
// =====================================================

export const {
  clearSelectedAuction,
  clearAuctionErrors,
  clearAuctionState,
  updateAuctionFromSocket,
  updateAuctionCancelledFromSocket,
  updateAuctionEndedFromSocket,
} = auctionSlice.actions;

// =====================================================
// Reducer
// =====================================================

export default auctionSlice.reducer;
