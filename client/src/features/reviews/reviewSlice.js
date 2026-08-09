import { createSlice } from "@reduxjs/toolkit";

import {
  fetchProductReviews,
  createReview,
  editReview,
  removeReview,
} from "./reviewThunks";

const initialState = {
  reviews: [],
  loading: false,
  submitting: false,
  error: null,
};

const reviewSlice = createSlice({
  name: "reviews",

  initialState,

  reducers: {
    clearReviewError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Fetch Reviews
      .addCase(fetchProductReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
      })

      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Review
      .addCase(createReview.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })

      .addCase(createReview.fulfilled, (state, action) => {
        state.submitting = false;

        if (action.payload.review) {
          state.reviews.unshift(action.payload.review);
        }
      })

      .addCase(createReview.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      })

      // Edit Review
      .addCase(editReview.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })

      .addCase(editReview.fulfilled, (state, action) => {
        state.submitting = false;

        const updatedReview = action.payload.review;

        const index = state.reviews.findIndex(
          (review) => review._id === updatedReview._id,
        );

        if (index !== -1) {
          state.reviews[index] = updatedReview;
        }
      })

      .addCase(editReview.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      })

      // Delete Review
      .addCase(removeReview.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })

      .addCase(removeReview.fulfilled, (state, action) => {
        state.submitting = false;

        const deletedId = action.meta.arg;

        state.reviews = state.reviews.filter(
          (review) => review._id !== deletedId,
        );
      })

      .addCase(removeReview.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      });
  },
});

export const { clearReviewError } = reviewSlice.actions;

export default reviewSlice.reducer;
