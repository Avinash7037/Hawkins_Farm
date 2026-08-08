const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Review = require("../models/reviewModel");

const getFarmerDashboard = async (req, res) => {
  try {
    const farmerId = req.user._id;

    // Products
    const totalProducts = await Product.countDocuments({
      farmer: farmerId,
    });

    const activeProducts = await Product.countDocuments({
      farmer: farmerId,
      isAvailable: true,
    });

    // Orders
    const orders = await Order.find({
      farmer: farmerId,
    })
      .populate("buyer", "name email")
      .populate("product", "name images")
      .sort({ createdAt: -1 });

    const totalOrders = orders.length;

    const pendingOrders = orders.filter(
      (order) => order.orderStatus === "Pending",
    ).length;

    const deliveredOrders = orders.filter(
      (order) => order.orderStatus === "Delivered",
    ).length;

    const totalRevenue = orders
      .filter((order) => order.paymentStatus === "Paid")
      .reduce((sum, order) => sum + order.totalPrice, 0);

    // Ratings
    const products = await Product.find({
      farmer: farmerId,
    });

    let totalRating = 0;
    let ratedProducts = 0;

    products.forEach((product) => {
      if (product.numReviews > 0) {
        totalRating += product.rating;
        ratedProducts++;
      }
    });

    const averageRating =
      ratedProducts === 0
        ? 0
        : Number((totalRating / ratedProducts).toFixed(1));

    // Recent Orders
    const recentOrders = orders.slice(0, 5);

    res.status(200).json({
      success: true,
      dashboard: {
        totalProducts,
        activeProducts,
        totalOrders,
        pendingOrders,
        deliveredOrders,
        totalRevenue,
        averageRating,
        recentOrders,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalFarmers = await User.countDocuments({
      role: "farmer",
    });

    const totalBuyers = await User.countDocuments({
      role: "buyer",
    });

    const totalProducts = await Product.countDocuments();

    const totalOrders = await Order.countDocuments();

    const totalReviews = await Review.countDocuments();

    const deliveredOrders = await Order.find({
      orderStatus: "Delivered",
    });

    const totalRevenue = deliveredOrders.reduce(
      (sum, order) => sum + order.totalPrice,
      0,
    );

    res.status(200).json({
      success: true,
      dashboard: {
        totalUsers,
        totalFarmers,
        totalBuyers,
        totalProducts,
        totalOrders,
        totalReviews,
        totalRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getFarmerDashboard,
  getAdminDashboard,
};
