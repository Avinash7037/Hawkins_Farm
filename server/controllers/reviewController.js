const Review = require("../models/reviewModel");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");

// =====================================================
// Add Review
// =====================================================

const addReview = async (req, res) => {
  try {
    const { productId, orderId, rating, comment } = req.body;

    // Validate required fields
    if (!productId || !orderId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Product, order, rating and comment are required",
      });
    }

    // Validate rating
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

    // Find product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Find order belonging to the logged-in buyer
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

    // Only delivered orders can be reviewed
    if (order.orderStatus !== "Delivered") {
      return res.status(403).json({
        success: false,
        message: "You can only review delivered products",
      });
    }

    // Prevent duplicate review for the same order
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

    // Create review
    const review = await Review.create({
      buyer: req.user._id,
      product: productId,
      order: orderId,
      rating: numericRating,
      comment: comment.trim(),
    });

    // Recalculate product rating
    const reviews = await Review.find({
      product: productId,
    });

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);

    const averageRating =
      reviews.length === 0 ? 0 : totalRating / reviews.length;

    product.rating = Number(averageRating.toFixed(1));
    product.numReviews = reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review,
      rating: product.rating,
      numReviews: product.numReviews,
    });
  } catch (error) {
    // Handle duplicate index error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this order",
      });
    }

    console.error("Add Review Error:", error);

    res.status(500).json({
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
    const reviews = await Review.find({
      product: req.params.productId,
    })
      .populate("buyer", "name")
      .populate("product", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get Product Reviews Error:", error);

    res.status(500).json({
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

    // Validate rating
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

    if (!comment || !comment.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment is required",
      });
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Only review owner can update
    if (review.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own review",
      });
    }

    review.rating = numericRating;
    review.comment = comment.trim();

    await review.save();

    // Recalculate product rating
    const reviews = await Review.find({
      product: review.product,
    });

    const totalRating = reviews.reduce(
      (sum, currentReview) => sum + currentReview.rating,
      0,
    );

    const averageRating =
      reviews.length === 0 ? 0 : totalRating / reviews.length;

    const product = await Product.findById(review.product);

    if (product) {
      product.rating = Number(averageRating.toFixed(1));

      product.numReviews = reviews.length;

      await product.save();
    }

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review,
      rating: product?.rating || 0,
      numReviews: product?.numReviews || 0,
    });
  } catch (error) {
    console.error("Update Review Error:", error);

    res.status(500).json({
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
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Only review owner can delete
    if (review.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own review",
      });
    }

    const productId = review.product;

    await review.deleteOne();

    // Recalculate product rating
    const reviews = await Review.find({
      product: productId,
    });

    const product = await Product.findById(productId);

    if (product) {
      if (reviews.length === 0) {
        product.rating = 0;
        product.numReviews = 0;
      } else {
        const totalRating = reviews.reduce(
          (sum, currentReview) => sum + currentReview.rating,
          0,
        );

        const averageRating = totalRating / reviews.length;

        product.rating = Number(averageRating.toFixed(1));

        product.numReviews = reviews.length;
      }

      await product.save();
    }

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      rating: product?.rating || 0,
      numReviews: product?.numReviews || 0,
    });
  } catch (error) {
    console.error("Delete Review Error:", error);

    res.status(500).json({
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
};
