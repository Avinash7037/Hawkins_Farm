const Product = require("../models/productModel");
const Order = require("../models/orderModel");

const getFarmerDashboard = async (req, res) => {
  try {
    const farmerId = req.user._id;

    // Total Products
    const totalProducts = await Product.countDocuments({
      farmer: farmerId,
    });

    // Farmer Orders
    const orders = await Order.find({
      farmer: farmerId,
    });

    const totalOrders = orders.length;

    const pendingOrders = orders.filter(
      (order) => order.orderStatus === "Pending",
    ).length;

    const deliveredOrders = orders.filter(
      (order) => order.orderStatus === "Delivered",
    ).length;

    const totalRevenue = orders
      .filter((order) => order.orderStatus === "Delivered")
      .reduce((sum, order) => sum + order.totalPrice, 0);

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

    res.status(200).json({
      success: true,
      dashboard: {
        totalProducts,
        totalOrders,
        pendingOrders,
        deliveredOrders,
        totalRevenue,
        averageRating,
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
};
