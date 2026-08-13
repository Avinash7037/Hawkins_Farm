import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  getLiveAuctions,
  getAuction,
  createAuction,
  getMyAuctions,
  placeBid,
  cancelAuction,
} from "./services/auctionService";

// =====================================================
// Fetch Live Auctions
// =====================================================

export const fetchLiveAuctions = createAsyncThunk(
  "auction/fetchLiveAuctions",

  async (_, thunkAPI) => {
    try {
      return await getLiveAuctions();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch live auctions",
      );
    }
  },
);

// =====================================================
// Fetch Single Auction
// =====================================================

export const fetchAuctionById = createAsyncThunk(
  "auction/fetchAuctionById",

  async (id, thunkAPI) => {
    try {
      return await getAuction(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch auction",
      );
    }
  },
);

// =====================================================
// Create Auction
// =====================================================

export const createNewAuction = createAsyncThunk(
  "auction/createNewAuction",

  async (auctionData, thunkAPI) => {
    try {
      return await createAuction(auctionData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create auction",
      );
    }
  },
);

// =====================================================
// Fetch Farmer Auctions
// =====================================================

export const fetchMyAuctions = createAsyncThunk(
  "auction/fetchMyAuctions",

  async (_, thunkAPI) => {
    try {
      return await getMyAuctions();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch your auctions",
      );
    }
  },
);

// =====================================================
// Place Bid
// =====================================================

export const placeAuctionBid = createAsyncThunk(
  "auction/placeAuctionBid",

  async ({ id, amount }, thunkAPI) => {
    try {
      return await placeBid(id, amount);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to place bid",
      );
    }
  },
);

// =====================================================
// Cancel Auction
// =====================================================

export const cancelMyAuction = createAsyncThunk(
  "auction/cancelMyAuction",

  async (id, thunkAPI) => {
    try {
      return await cancelAuction(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to cancel auction",
      );
    }
  },
);
