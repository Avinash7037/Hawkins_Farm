const mongoose = require("mongoose");

const Review = require("../models/reviewModel");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");

// =====================================================
// Helpers
// =====================================================

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// =====================================================
// Recalculate Product Rating
// =====================================================

const recalculateProductRating = async (productId) => {
  const reviews = await Review.find({
    product: productId,
  }).select("rating");

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);

  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

  const rating = Number(averageRating.toFixed(1));

  const product = await Product.findById(productId);

  if (!product) {
    return {
      rating: 0,
      numReviews: reviews.length,
    };
  }

  product.rating = rating;
  product.numReviews = reviews.length;

  await product.save();

  return {
    rating: product.rating,
    numReviews: product.numReviews,
  };
};

// =====================================================
// Add Review
// =====================================================

const addReview = async (req, res) => {
  try {
    const { productId, orderId, rating, comment } = req.body;

    // -------------------------------------------------
    // Required Fields
    // -------------------------------------------------

    if (
      !productId ||
      !orderId ||
      rating === undefined ||
      rating === null ||
      !comment?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Product, order, rating and comment are required",
      });
    }

    // -------------------------------------------------
    // Validate Product ID
    // -------------------------------------------------

    if (!isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID",
      });
    }

    // -------------------------------------------------
    // Validate Order ID
    // -------------------------------------------------

    if (!isValidObjectId(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Order ID",
      });
    }

    // -------------------------------------------------
    // Validate Rating
    // -------------------------------------------------

    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // -------------------------------------------------
    // Validate Comment
    // -------------------------------------------------

    const trimmedComment = comment.trim();

    if (trimmedComment.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Comment must contain at least 2 characters",
      });
    }

    // -------------------------------------------------
    // Find Product
    // -------------------------------------------------

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // -------------------------------------------------
    // Find Buyer's Order For This Product
    // -------------------------------------------------

    const order = await Order.findOne({
      _id: orderId,
      buyer: req.user._id,
      product: productId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or product does not belong to this order",
      });
    }

    // -------------------------------------------------
    // Only Delivered Orders Can Be Reviewed
    // -------------------------------------------------

    if (order.orderStatus !== "Delivered") {
      return res.status(403).json({
        success: false,
        message: "You can only review delivered products",
      });
    }

    // -------------------------------------------------
    // Prevent Duplicate Review
    // -------------------------------------------------

    const existingReview = await Review.findOne({
      buyer: req.user._id,
      order: orderId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this order",
      });
    }

    // -------------------------------------------------
    // Create Review
    // -------------------------------------------------

    const review = await Review.create({
      buyer: req.user._id,
      product: productId,
      order: orderId,
      rating: numericRating,
      comment: trimmedComment,
    });

    // -------------------------------------------------
    // Recalculate Product Rating
    // -------------------------------------------------

    const ratingData = await recalculateProductRating(productId);

    // -------------------------------------------------
    // Response
    // -------------------------------------------------

    return res.status(201).json({
      success: true,
      message: "Review added successfully",
      review,
      rating: ratingData.rating,
      numReviews: ratingData.numReviews,
    });
  } catch (error) {
    // -------------------------------------------------
    // Duplicate Index Protection
    // -------------------------------------------------

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this order",
      });
    }

    console.error("Add Review Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Get Product Reviews
// =====================================================

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    // -------------------------------------------------
    // Validate Product ID
    // -------------------------------------------------

    if (!isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID",
      });
    }

    // -------------------------------------------------
    // Make Sure Product Exists
    // -------------------------------------------------

    const product = await Product.findById(productId).select("_id");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // -------------------------------------------------
    // Get Reviews
    // -------------------------------------------------

    const reviews = await Review.find({
      product: productId,
    })
      .populate("buyer", "name")
      .populate("product", "name")
      .sort({
        createdAt: -1,
      });

    // -------------------------------------------------
    // Response
    // -------------------------------------------------

    return res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get Product Reviews Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Update Review
// =====================================================

const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const { id } = req.params;

    // -------------------------------------------------
    // Validate Review ID
    // -------------------------------------------------

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Review ID",
      });
    }

    // -------------------------------------------------
    // Validate Rating
    // -------------------------------------------------

    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // -------------------------------------------------
    // Validate Comment
    // -------------------------------------------------

    if (!comment?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment is required",
      });
    }

    const trimmedComment = comment.trim();

    if (trimmedComment.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Comment must contain at least 2 characters",
      });
    }

    // -------------------------------------------------
    // Find Review
    // -------------------------------------------------

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // -------------------------------------------------
    // Ownership
    // -------------------------------------------------

    if (review.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own review",
      });
    }

    // -------------------------------------------------
    // Update
    // -------------------------------------------------

    review.rating = numericRating;
    review.comment = trimmedComment;

    await review.save();

    // -------------------------------------------------
    // Recalculate Rating
    // -------------------------------------------------

    const ratingData = await recalculateProductRating(review.product);

    // -------------------------------------------------
    // Response
    // -------------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review,
      rating: ratingData.rating,
      numReviews: ratingData.numReviews,
    });
  } catch (error) {
    console.error("Update Review Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Delete Review
// =====================================================

const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    // -------------------------------------------------
    // Validate Review ID
    // -------------------------------------------------

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Review ID",
      });
    }

    // -------------------------------------------------
    // Find Review
    // -------------------------------------------------

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // -------------------------------------------------
    // Ownership
    // -------------------------------------------------

    if (review.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own review",
      });
    }

    // -------------------------------------------------
    // Save Product ID Before Delete
    // -------------------------------------------------

    const productId = review.product;

    // -------------------------------------------------
    // Delete Review
    // -------------------------------------------------

    await review.deleteOne();

    // -------------------------------------------------
    // Recalculate Rating
    // -------------------------------------------------

    const ratingData = await recalculateProductRating(productId);

    // -------------------------------------------------
    // Response
    // -------------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      rating: ratingData.rating,
      numReviews: ratingData.numReviews,
    });
  } catch (error) {
    console.error("Delete Review Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Export
// =====================================================

// =====================================================
// Get All Reviews - Admin
// =====================================================

const getAllAdminReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate("buyer", "name email")
      .populate("product", "name price unit")
      .populate("order", "quantity totalPrice orderStatus")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get All Admin Reviews Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Delete Review - Admin
// =====================================================

const deleteAdminReview = async (req, res) => {
  try {
    const { id } = req.params;

    // -------------------------------------------------
    // Validate Review ID
    // -------------------------------------------------

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Review ID",
      });
    }

    // -------------------------------------------------
    // Find Review
    // -------------------------------------------------

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // -------------------------------------------------
    // Save Product ID
    // -------------------------------------------------

    const productId = review.product;

    // -------------------------------------------------
    // Delete Review
    // -------------------------------------------------

    await review.deleteOne();

    // -------------------------------------------------
    // Recalculate Product Rating
    // -------------------------------------------------

    const ratingData = await recalculateProductRating(productId);

    // -------------------------------------------------
    // Response
    // -------------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully by admin",
      reviewId: id,
      rating: ratingData.rating,
      numReviews: ratingData.numReviews,
    });
  } catch (error) {
    console.error("Delete Admin Review Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  addReview,
  getProductReviews,
  updateReview,
  deleteReview,
  getAllAdminReviews,
  deleteAdminReview,
};
