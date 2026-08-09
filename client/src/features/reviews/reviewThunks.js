import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  getProductReviews,
  addReview,
  updateReview,
  deleteReview,
} from "./services/reviewService";

export const fetchProductReviews = createAsyncThunk(
  "reviews/fetchProductReviews",
  async (productId, thunkAPI) => {
    try {
      return await getProductReviews(productId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch reviews",
      );
    }
  },
);

export const createReview = createAsyncThunk(
  "reviews/createReview",
  async (reviewData, thunkAPI) => {
    try {
      return await addReview(reviewData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add review",
      );
    }
  },
);

export const editReview = createAsyncThunk(
  "reviews/editReview",
  async ({ id, data }, thunkAPI) => {
    try {
      return await updateReview(id, data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update review",
      );
    }
  },
);

export const removeReview = createAsyncThunk(
  "reviews/removeReview",
  async (id, thunkAPI) => {
    try {
      return await deleteReview(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete review",
      );
    }
  },
);
