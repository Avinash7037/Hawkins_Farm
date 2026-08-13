const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Review = require("../models/reviewModel");

// =====================================================
// Helper - Get Period Start
// =====================================================

const getPeriodStart = (period) => {
  const now = new Date();

  if (period === "7d") {
    const date = new Date(now);
    date.setDate(date.getDate() - 7);
    return date;
  }

  if (period === "30d") {
    const date = new Date(now);
    date.setDate(date.getDate() - 30);
    return date;
  }

  if (period === "3m") {
    const date = new Date(now);
    date.setMonth(date.getMonth() - 3);
    return date;
  }

  return null;
};

// =====================================================
// Helper - Format Date Label
// =====================================================

const formatDateLabel = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};

// =====================================================
// Farmer Dashboard
// =====================================================

const getFarmerDashboard = async (req, res) => {
  try {
    const farmerId = req.user._id;

    // =================================================
    // Period
    // =================================================

    const requestedPeriod = req.query.period || "30d";

    const allowedPeriods = ["7d", "30d", "3m", "all"];

    const period = allowedPeriods.includes(requestedPeriod)
      ? requestedPeriod
      : "30d";

    const periodStart = getPeriodStart(period);

    const now = new Date();

    // =================================================
    // Products
    // =================================================

    const [totalProducts, activeProducts, products] = await Promise.all([
      Product.countDocuments({
        farmer: farmerId,
      }),

      Product.countDocuments({
        farmer: farmerId,
        isAvailable: true,
      }),

      Product.find({
        farmer: farmerId,
      }).select("name rating numReviews"),
    ]);

    // =================================================
    // Orders
    // =================================================

    const orders = await Order.find({
      farmer: farmerId,
    })
      .populate("buyer", "name email")
      .populate("product", "name images price unit")
      .sort({
        createdAt: -1,
      });

    // =================================================
    // Basic Order Statistics
    // =================================================

    const totalOrders = orders.length;

    const pendingOrders = orders.filter(
      (order) => order.orderStatus === "Pending",
    ).length;

    const deliveredOrders = orders.filter(
      (order) => order.orderStatus === "Delivered",
    ).length;

    // =================================================
    // Total Revenue
    //
    // Only actually paid orders contribute to revenue.
    // Cancelled and rejected orders are ignored.
    // =================================================

    const revenueOrders = orders.filter(
      (order) =>
        order.paymentStatus === "Paid" &&
        !["Cancelled", "Rejected"].includes(order.orderStatus),
    );

    const totalRevenue = revenueOrders.reduce(
      (sum, order) => sum + Number(order.totalPrice || 0),
      0,
    );

    // =================================================
    // Rating Statistics
    // =================================================

    let totalRating = 0;
    let ratedProducts = 0;

    products.forEach((product) => {
      if (product.numReviews > 0) {
        totalRating += Number(product.rating || 0);
        ratedProducts++;
      }
    });

    const averageRating =
      ratedProducts === 0
        ? 0
        : Number((totalRating / ratedProducts).toFixed(1));

    // =================================================
    // Recent Orders
    // =================================================

    const recentOrders = orders.slice(0, 5);

    // =================================================
    // PERIOD ANALYTICS
    // =================================================

    const periodOrders = periodStart
      ? orders.filter((order) => new Date(order.createdAt) >= periodStart)
      : orders;

    // -------------------------------------------------
    // Valid Sales
    //
    // Cancelled and rejected orders do not count as
    // actual sales.
    // -------------------------------------------------

    const periodSales = periodOrders.filter(
      (order) => !["Cancelled", "Rejected"].includes(order.orderStatus),
    );

    // -------------------------------------------------
    // Paid Sales
    //
    // Revenue is calculated only from paid orders.
    // -------------------------------------------------

    const periodPaidOrders = periodSales.filter(
      (order) => order.paymentStatus === "Paid",
    );

    // =================================================
    // Period Revenue
    // =================================================

    const analyticsRevenue = periodPaidOrders.reduce(
      (sum, order) => sum + Number(order.totalPrice || 0),
      0,
    );

    // =================================================
    // Total Units Sold
    // =================================================

    const totalUnitsSold = periodSales.reduce(
      (sum, order) => sum + Number(order.quantity || 0),
      0,
    );

    // =================================================
    // Average Order Value
    // =================================================

    const averageOrderValue =
      periodPaidOrders.length === 0
        ? 0
        : Number((analyticsRevenue / periodPaidOrders.length).toFixed(2));

    // =================================================
    // Revenue By Period
    // =================================================

    const revenueMap = new Map();

    periodPaidOrders.forEach((order) => {
      const date = new Date(order.createdAt);

      const key = date.toISOString().split("T")[0];

      const current = revenueMap.get(key) || {
        revenue: 0,
        orders: 0,
      };

      current.revenue += Number(order.totalPrice || 0);

      current.orders += 1;

      revenueMap.set(key, current);
    });

    const revenueByPeriod = [];

    // -------------------------------------------------
    // Generate dates for fixed periods
    // -------------------------------------------------

    if (periodStart) {
      const cursor = new Date(periodStart);

      cursor.setHours(0, 0, 0, 0);

      const endDate = new Date(now);

      endDate.setHours(0, 0, 0, 0);

      while (cursor <= endDate) {
        const key = cursor.toISOString().split("T")[0];

        const data = revenueMap.get(key) || {
          revenue: 0,
          orders: 0,
        };

        revenueByPeriod.push({
          date: key,
          label: formatDateLabel(cursor),
          revenue: Number(data.revenue.toFixed(2)),
          orders: data.orders,
        });

        cursor.setDate(cursor.getDate() + 1);
      }
    } else {
      // -------------------------------------------------
      // All Time
      //
      // For all-time analytics, group by month instead
      // of creating hundreds of daily bars.
      // -------------------------------------------------

      const monthlyMap = new Map();

      periodPaidOrders.forEach((order) => {
        const date = new Date(order.createdAt);

        const year = date.getFullYear();

        const month = date.getMonth();

        const key = `${year}-${String(month + 1).padStart(2, "0")}`;

        const current = monthlyMap.get(key) || {
          revenue: 0,
          orders: 0,
        };

        current.revenue += Number(order.totalPrice || 0);

        current.orders += 1;

        monthlyMap.set(key, current);
      });

      monthlyMap.forEach((value, key) => {
        const [year, month] = key.split("-").map(Number);

        const date = new Date(year, month - 1, 1);

        revenueByPeriod.push({
          date: key,

          label: date.toLocaleDateString("en-IN", {
            month: "short",
            year: "numeric",
          }),

          revenue: Number(value.revenue.toFixed(2)),

          orders: value.orders,
        });
      });

      revenueByPeriod.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    // =================================================
    // Top Products
    // =================================================

    const productMap = new Map();

    periodSales.forEach((order) => {
      const productId = order.product?._id
        ? order.product._id.toString()
        : order.product?.toString();

      if (!productId) {
        return;
      }

      const current = productMap.get(productId) || {
        productId,
        name: order.product?.name || "Unknown Product",
        unitsSold: 0,
        revenue: 0,
        orders: 0,
      };

      current.unitsSold += Number(order.quantity || 0);

      current.revenue += Number(order.totalPrice || 0);

      current.orders += 1;

      productMap.set(productId, current);
    });

    const topProducts = Array.from(productMap.values())
      .sort((a, b) => {
        if (b.revenue !== a.revenue) {
          return b.revenue - a.revenue;
        }

        return b.unitsSold - a.unitsSold;
      })
      .slice(0, 5)
      .map((product) => ({
        ...product,

        revenue: Number(product.revenue.toFixed(2)),
      }));

    // =================================================
    // Order Status Breakdown
    // =================================================

    const orderStatusBreakdown = {
      Pending: 0,
      Accepted: 0,
      Packed: 0,
      Shipped: 0,
      Delivered: 0,
      Rejected: 0,
      Cancelled: 0,
    };

    periodOrders.forEach((order) => {
      if (
        Object.prototype.hasOwnProperty.call(
          orderStatusBreakdown,
          order.orderStatus,
        )
      ) {
        orderStatusBreakdown[order.orderStatus]++;
      }
    });

    // =================================================
    // Response
    // =================================================

    return res.status(200).json({
      success: true,

      dashboard: {
        // =================================================
        // Basic Dashboard
        // =================================================

        totalProducts,

        activeProducts,

        totalOrders,

        pendingOrders,

        deliveredOrders,

        totalRevenue: Number(totalRevenue.toFixed(2)),

        averageRating,

        recentOrders,

        // =================================================
        // Farmer Analytics
        // =================================================

        analytics: {
          period,

          analyticsRevenue: Number(analyticsRevenue.toFixed(2)),

          totalUnitsSold,

          averageOrderValue,

          periodOrders: periodOrders.length,

          paidOrders: periodPaidOrders.length,

          revenueByPeriod,

          topProducts,

          orderStatusBreakdown,
        },
      },
    });
  } catch (error) {
    console.error("Farmer dashboard error:", error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// =====================================================
// Admin Dashboard
// =====================================================

const getAdminDashboard = async (req, res) => {
  try {
    // =================================================
    // Period
    // =================================================

    const requestedPeriod = req.query.period || "30d";

    const allowedPeriods = ["7d", "30d", "3m", "all"];

    const period = allowedPeriods.includes(requestedPeriod)
      ? requestedPeriod
      : "30d";

    let periodStart = null;

    const now = new Date();

    if (period === "7d") {
      periodStart = new Date(now);
      periodStart.setDate(periodStart.getDate() - 7);
    }

    if (period === "30d") {
      periodStart = new Date(now);
      periodStart.setDate(periodStart.getDate() - 30);
    }

    if (period === "3m") {
      periodStart = new Date(now);
      periodStart.setMonth(periodStart.getMonth() - 3);
    }

    // =================================================
    // User Statistics
    // =================================================

    const [totalUsers, totalFarmers, totalBuyers, activeUsers, inactiveUsers] =
      await Promise.all([
        User.countDocuments(),

        User.countDocuments({
          role: "farmer",
        }),

        User.countDocuments({
          role: "buyer",
        }),

        User.countDocuments({
          isActive: true,
        }),

        User.countDocuments({
          isActive: false,
        }),
      ]);

    // =================================================
    // Product Statistics
    // =================================================

    const [
      totalProducts,
      activeProducts,
      unavailableProducts,
      outOfStockProducts,
      lowStockProducts,
    ] = await Promise.all([
      Product.countDocuments(),

      Product.countDocuments({
        isAvailable: true,
      }),

      Product.countDocuments({
        isAvailable: false,
      }),

      Product.countDocuments({
        quantity: {
          $lte: 0,
        },
      }),

      Product.countDocuments({
        quantity: {
          $gt: 0,
        },

        $expr: {
          $lte: ["$quantity", "$lowStockThreshold"],
        },
      }),
    ]);

    // =================================================
    // All Orders
    // =================================================

    const allOrders = await Order.find({})
      .populate("buyer", "name email")
      .populate("farmer", "name email")
      .populate("product", "name images price unit")
      .sort({
        createdAt: -1,
      });

    const totalOrders = allOrders.length;

    // =================================================
    // Order Status Statistics
    // =================================================

    const pendingOrders = allOrders.filter(
      (order) => order.orderStatus === "Pending",
    ).length;

    const acceptedOrders = allOrders.filter(
      (order) => order.orderStatus === "Accepted",
    ).length;

    const packedOrders = allOrders.filter(
      (order) => order.orderStatus === "Packed",
    ).length;

    const shippedOrders = allOrders.filter(
      (order) => order.orderStatus === "Shipped",
    ).length;

    const deliveredOrders = allOrders.filter(
      (order) => order.orderStatus === "Delivered",
    ).length;

    const rejectedOrders = allOrders.filter(
      (order) => order.orderStatus === "Rejected",
    ).length;

    const cancelledOrders = allOrders.filter(
      (order) => order.orderStatus === "Cancelled",
    ).length;

    // =================================================
    // Revenue
    // =================================================

    const paidOrders = allOrders.filter(
      (order) => order.paymentStatus === "Paid",
    );

    const totalRevenue = paidOrders.reduce(
      (sum, order) => sum + Number(order.totalPrice || 0),
      0,
    );

    const averageOrderValue =
      paidOrders.length === 0
        ? 0
        : Number((totalRevenue / paidOrders.length).toFixed(2));

    // =================================================
    // Period Orders
    // =================================================

    const periodOrders = periodStart
      ? allOrders.filter((order) => new Date(order.createdAt) >= periodStart)
      : allOrders;

    const periodPaidOrders = periodOrders.filter(
      (order) => order.paymentStatus === "Paid",
    );

    const periodRevenue = periodPaidOrders.reduce(
      (sum, order) => sum + Number(order.totalPrice || 0),
      0,
    );

    const periodOrderCount = periodOrders.length;

    // =================================================
    // Revenue By Day
    // =================================================

    const revenueMap = new Map();

    periodPaidOrders.forEach((order) => {
      const date = new Date(order.createdAt).toISOString().split("T")[0];

      const current = revenueMap.get(date) || {
        revenue: 0,
        orders: 0,
      };

      current.revenue += Number(order.totalPrice || 0);
      current.orders += 1;

      revenueMap.set(date, current);
    });

    const revenueByPeriod = [];

    if (periodStart) {
      const cursor = new Date(periodStart);

      cursor.setHours(0, 0, 0, 0);

      const endDate = new Date(now);

      endDate.setHours(0, 0, 0, 0);

      while (cursor <= endDate) {
        const date = cursor.toISOString().split("T")[0];

        const data = revenueMap.get(date) || {
          revenue: 0,
          orders: 0,
        };

        revenueByPeriod.push({
          date,
          revenue: Number(data.revenue.toFixed(2)),
          orders: data.orders,
        });

        cursor.setDate(cursor.getDate() + 1);
      }
    } else {
      revenueMap.forEach((value, date) => {
        revenueByPeriod.push({
          date,
          revenue: Number(value.revenue.toFixed(2)),
          orders: value.orders,
        });
      });

      revenueByPeriod.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    // =================================================
    // Review Statistics
    // =================================================

    const totalReviews = await Review.countDocuments();

    const ratingStats = await Review.aggregate([
      {
        $group: {
          _id: null,
          averageRating: {
            $avg: "$rating",
          },
        },
      },
    ]);

    const averageRating =
      ratingStats.length === 0
        ? 0
        : Number(ratingStats[0].averageRating.toFixed(1));

    // =================================================
    // Rating Distribution
    // =================================================

    const ratingDistribution = await Review.aggregate([
      {
        $group: {
          _id: "$rating",
          count: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          _id: -1,
        },
      },
    ]);

    const formattedRatingDistribution = [5, 4, 3, 2, 1].map((rating) => {
      const found = ratingDistribution.find((item) => item._id === rating);

      return {
        rating,
        count: found?.count || 0,
      };
    });

    // =================================================
    // Top Products
    // =================================================

    const topProducts = await Order.aggregate([
      {
        $match: {
          orderStatus: {
            $nin: ["Cancelled", "Rejected"],
          },
        },
      },

      {
        $group: {
          _id: "$product",

          totalQuantity: {
            $sum: "$quantity",
          },

          totalOrders: {
            $sum: 1,
          },

          revenue: {
            $sum: "$totalPrice",
          },
        },
      },

      {
        $sort: {
          totalQuantity: -1,
        },
      },

      {
        $limit: 5,
      },

      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },

      {
        $unwind: {
          path: "$product",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          _id: 1,

          name: "$product.name",

          image: {
            $arrayElemAt: ["$product.images.url", 0],
          },

          unit: "$product.unit",

          totalQuantity: 1,

          totalOrders: 1,

          revenue: 1,
        },
      },
    ]);

    // =================================================
    // Top Farmers
    // =================================================

    const topFarmers = await Order.aggregate([
      {
        $match: {
          orderStatus: {
            $nin: ["Cancelled", "Rejected"],
          },
        },
      },

      {
        $group: {
          _id: "$farmer",

          totalOrders: {
            $sum: 1,
          },

          totalQuantity: {
            $sum: "$quantity",
          },

          revenue: {
            $sum: "$totalPrice",
          },
        },
      },

      {
        $sort: {
          revenue: -1,
        },
      },

      {
        $limit: 5,
      },

      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "farmer",
        },
      },

      {
        $unwind: {
          path: "$farmer",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          _id: 1,

          name: "$farmer.name",

          email: "$farmer.email",

          totalOrders: 1,

          totalQuantity: 1,

          revenue: 1,
        },
      },
    ]);

    // =================================================
    // Recent Orders
    // =================================================

    const recentOrders = allOrders.slice(0, 8);

    // =================================================
    // Response
    // =================================================

    res.status(200).json({
      success: true,

      dashboard: {
        totalUsers,
        totalFarmers,
        totalBuyers,
        activeUsers,
        inactiveUsers,

        totalProducts,
        activeProducts,
        unavailableProducts,
        outOfStockProducts,
        lowStockProducts,

        totalOrders,
        pendingOrders,
        acceptedOrders,
        packedOrders,
        shippedOrders,
        deliveredOrders,
        rejectedOrders,
        cancelledOrders,

        totalReviews,
        averageRating,
        ratingDistribution: formattedRatingDistribution,

        totalRevenue: Number(totalRevenue.toFixed(2)),
        averageOrderValue,

        analytics: {
          period,
          periodRevenue: Number(periodRevenue.toFixed(2)),
          periodOrders: periodOrderCount,
          revenueByPeriod,
        },

        topProducts,
        topFarmers,

        recentOrders,
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Exports
// =====================================================

module.exports = {
  getFarmerDashboard,
  getAdminDashboard,
};
