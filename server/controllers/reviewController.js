const Review = require("../models/reviewModel");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");

const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if buyer purchased the product
    const purchased = await Order.findOne({
      buyer: req.user._id,
      product: productId,
      orderStatus: "Delivered",
    });

    if (!purchased) {
      return res.status(403).json({
        success: false,
        message: "You can only review delivered products you purchased",
      });
    }

    // Prevent duplicate review
    const existingReview = await Review.findOne({
      buyer: req.user._id,
      product: productId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    await Review.create({
      buyer: req.user._id,
      product: productId,
      rating,
      comment,
    });

    const reviews = await Review.find({ product: productId });

    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    product.rating = Number(averageRating.toFixed(1));
    product.numReviews = reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
    }).populate("buyer", "name");

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own review",
      });
    }

    review.rating = rating;
    review.comment = comment;

    await review.save();

    const product = await Product.findById(review.product);

    const reviews = await Review.find({
      product: review.product,
    });

    const average =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    product.rating = Number(average.toFixed(1));
    product.numReviews = reviews.length;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own review",
      });
    }

    const productId = review.product;

    await review.deleteOne();

    const reviews = await Review.find({
      product: productId,
    });

    const product = await Product.findById(productId);

    if (reviews.length === 0) {
      product.rating = 0;
      product.numReviews = 0;
    } else {
      const average =
        reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

      product.rating = Number(average.toFixed(1));
      product.numReviews = reviews.length;
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
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
