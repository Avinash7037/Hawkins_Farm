const mongoose = require("mongoose");

const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");

const { createOrdersFromCart } = require("../services/orderService");

const { createNotification } = require("../services/notificationService");

const sendEmail = require("../utils/sendEmail");
const razorpay = require("../config/razorpay");

// =====================================================
// Allowed Farmer Status Transitions
// =====================================================

const farmerTransitions = {
  Pending: ["Accepted", "Rejected"],
  Accepted: ["Packed"],
  Packed: ["Shipped"],
  Shipped: ["Delivered"],
  Delivered: [],
  Rejected: [],
  Cancelled: [],
};

// =====================================================
// Send Order Status Email
// =====================================================

const sendOrderStatusEmail = async (buyerId, order) => {
  try {
    const buyer = await User.findById(buyerId);

    if (!buyer?.email) {
      return;
    }

    await sendEmail({
      to: buyer.email,

      subject: `Order Update - ${order.orderStatus} - Hawkins Farm`,

      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            padding: 20px;
          "
        >
          <h2>Hello ${buyer.name},</h2>

          <p>
            Your Hawkins Farm order has been updated.
          </p>

          <p>
            <strong>Order Status:</strong>
            ${order.orderStatus}
          </p>

          <p>
            <strong>Payment:</strong>
            ${order.paymentStatus}
          </p>

          <p>
            Thank you for shopping with
            <strong>Hawkins Farm</strong>.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Order status email failed:", error.message);
  }
};

// =====================================================
// Notification Helper
//
// Notification failure should NEVER break the order
// operation.
// =====================================================

const notifyOrderUser = async ({
  req,
  recipient,
  type,
  title,
  message,
  orderId,
}) => {
  try {
    const io = req.app.get("io");

    await createNotification({
      recipient,
      type,
      title,
      message,
      order: orderId,
      io,
    });
  } catch (error) {
    console.error("Order notification failed:", error.message);
  }
};

// =====================================================
// Get Product Name
// =====================================================

const getProductName = async (productId) => {
  try {
    const product = await Product.findById(productId).select("name");

    return product?.name || "your product";
  } catch (error) {
    console.error("Get Product Name Error:", error.message);

    return "your product";
  }
};

// =====================================================
// Buyer Places COD Order
// =====================================================

const placeOrder = async (req, res) => {
  try {
    const { deliveryAddress, paymentMethod } = req.body;

    // -------------------------------------------------
    // Only COD
    // -------------------------------------------------

    if (paymentMethod !== "COD") {
      return res.status(400).json({
        success: false,
        message: "This endpoint is only for COD orders",
      });
    }

    // -------------------------------------------------
    // Create Orders
    // -------------------------------------------------

    const orders = await createOrdersFromCart({
      buyerId: req.user._id,

      deliveryAddress,

      paymentMethod: "COD",

      paymentStatus: "Pending",
    });

    // =================================================
    // Notify Farmers
    // =================================================

    for (const order of orders) {
      await notifyOrderUser({
        req,

        recipient: order.farmer,

        type: "ORDER_PLACED",

        title: "New COD Order",

        message: "You have received a new Cash on Delivery order.",

        orderId: order._id,
      });
    }

    // -------------------------------------------------
    // Response
    // -------------------------------------------------

    return res.status(201).json({
      success: true,

      message: "COD orders created successfully",

      orders,
    });
  } catch (error) {
    console.error("Place Order Error:", error.message);

    const statusCode = error.message === "Your cart is empty" ? 400 : 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Buyer Orders
// =====================================================

const getBuyerOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      buyer: req.user._id,
    })
      .populate("product")
      .populate("farmer", "name email")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get Buyer Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Farmer Orders
// =====================================================

const getFarmerOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      farmer: req.user._id,
    })
      .populate("buyer", "name email")
      .populate("product")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get Farmer Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Get Single Order
// =====================================================

const getOrderById = async (req, res) => {
  try {
    // -------------------------------------------------
    // Validate ID
    // -------------------------------------------------

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    // -------------------------------------------------
    // Find Order
    // -------------------------------------------------

    const order = await Order.findById(req.params.id)
      .populate("buyer", "name email")
      .populate("farmer", "name email")
      .populate("product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // -------------------------------------------------
    // Authorization
    // -------------------------------------------------

    const userId = req.user._id.toString();

    const isBuyer = order.buyer._id.toString() === userId;

    const isFarmer = order.farmer._id.toString() === userId;

    if (!isBuyer && !isFarmer) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this order",
      });
    }

    // -------------------------------------------------
    // Response
    // -------------------------------------------------

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get Order Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Farmer Updates Order Status
// =====================================================

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const { orderStatus } = req.body;

    // -------------------------------------------------
    // Validate Order ID
    // -------------------------------------------------

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    // -------------------------------------------------
    // Validate Status
    // -------------------------------------------------

    if (!orderStatus) {
      return res.status(400).json({
        success: false,
        message: "Order status is required",
      });
    }

    // -------------------------------------------------
    // Find Order
    // -------------------------------------------------

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // -------------------------------------------------
    // Farmer Ownership
    // -------------------------------------------------

    if (order.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own orders",
      });
    }

    // -------------------------------------------------
    // Validate Current Status
    // -------------------------------------------------

    if (
      !Object.prototype.hasOwnProperty.call(
        farmerTransitions,
        order.orderStatus,
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid current order status",
      });
    }

    // -------------------------------------------------
    // Validate Requested Status
    // -------------------------------------------------

    const allowedStatuses = farmerTransitions[order.orderStatus];

    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message:
          `Cannot change order from ` +
          `${order.orderStatus} to ${orderStatus}`,
      });
    }

    // -------------------------------------------------
    // Product Name
    // -------------------------------------------------

    const productName = await getProductName(order.product);

    // -------------------------------------------------
    // Update Status
    // -------------------------------------------------

    order.orderStatus = orderStatus;

    // =================================================
    // COD Becomes Paid On Delivery
    // =================================================

    if (orderStatus === "Delivered" && order.paymentMethod === "COD") {
      order.paymentStatus = "Paid";
    }

    // =================================================
    // Rejected
    // =================================================

    if (orderStatus === "Rejected") {
      order.cancelledBy = "Farmer";
      order.cancelledAt = new Date();
    }

    // -------------------------------------------------
    // Save Order
    // -------------------------------------------------

    await order.save();

    // =================================================
    // Restore Stock For Rejected Order
    // =================================================

    if (orderStatus === "Rejected") {
      await restoreOrderStock(order);
    }

    // =================================================
    // Send Email
    // =================================================

    await sendOrderStatusEmail(order.buyer, order);

    // =================================================
    // Notification
    // =================================================

    const notifications = {
      Accepted: {
        type: "ORDER_ACCEPTED",

        title: "Order Accepted",

        message:
          `Your order for ${productName} ` + "has been accepted by the farmer.",
      },

      Rejected: {
        type: "ORDER_REJECTED",

        title: "Order Rejected",

        message:
          `Your order for ${productName} ` + "has been rejected by the farmer.",
      },

      Packed: {
        type: "ORDER_PACKED",

        title: "Order Packed",

        message: `Your order for ${productName} ` + "has been packed.",
      },

      Shipped: {
        type: "ORDER_SHIPPED",

        title: "Order Shipped",

        message: `Your order for ${productName} ` + "has been shipped.",
      },

      Delivered: {
        type: "ORDER_DELIVERED",

        title: "Order Delivered",

        message: `Your order for ${productName} ` + "has been delivered.",
      },
    };

    const notification = notifications[orderStatus];

    if (notification) {
      await notifyOrderUser({
        req,

        recipient: order.buyer,

        type: notification.type,

        title: notification.title,

        message: notification.message,

        orderId: order._id,
      });
    }

    // =================================================
    // Re-fetch Updated Order
    // =================================================

    const updatedOrder = await Order.findById(order._id)
      .populate("buyer", "name email")
      .populate("farmer", "name email")
      .populate("product");

    // =================================================
    // Response
    // =================================================

    return res.status(200).json({
      success: true,

      message: "Order status updated successfully",

      order: updatedOrder,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Restore Order Stock
// =====================================================

const restoreOrderStock = async (order) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // -------------------------------------------------
    // Reload Order Inside Transaction
    // -------------------------------------------------

    const currentOrder = await Order.findById(order._id).session(session);

    if (!currentOrder) {
      throw new Error("Order not found");
    }

    // -------------------------------------------------
    // Already Restored
    // -------------------------------------------------

    if (currentOrder.stockRestored) {
      await session.commitTransaction();

      return;
    }

    // -------------------------------------------------
    // Find Product
    // -------------------------------------------------

    const product = await Product.findById(currentOrder.product).session(
      session,
    );

    if (!product) {
      throw new Error("Product no longer exists");
    }

    // -------------------------------------------------
    // Restore Quantity
    // -------------------------------------------------

    product.quantity += currentOrder.quantity;

    product.isAvailable = true;

    await product.save({
      session,
    });

    // -------------------------------------------------
    // Mark Restored
    // -------------------------------------------------

    currentOrder.stockRestored = true;

    currentOrder.stockRestoredAt = new Date();

    await currentOrder.save({
      session,
    });

    await session.commitTransaction();
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    throw error;
  } finally {
    await session.endSession();
  }
};

// =====================================================
// Buyer Cancels Order
// =====================================================

const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // -------------------------------------------------
    // Validate Order ID
    // -------------------------------------------------

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    // -------------------------------------------------
    // Find Order
    // -------------------------------------------------

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // -------------------------------------------------
    // Buyer Ownership
    // -------------------------------------------------

    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only cancel your own orders",
      });
    }

    // -------------------------------------------------
    // Allowed Order Status
    // -------------------------------------------------

    if (!["Pending", "Accepted"].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "This order can no longer be cancelled",
      });
    }

    // =================================================
    // ONLINE + PAID
    // =================================================

    if (order.paymentMethod === "ONLINE" && order.paymentStatus === "Paid") {
      // -------------------------------------------------
      // Validate Razorpay Payment
      // -------------------------------------------------

      if (!order.razorpayPaymentId) {
        return res.status(400).json({
          success: false,
          message: "Razorpay payment information is missing",
        });
      }

      // -------------------------------------------------
      // Refund Razorpay Payment
      // -------------------------------------------------

      const refund = await razorpay.payments.refund(order.razorpayPaymentId, {
        amount: Math.round(order.totalPrice * 100),

        notes: {
          reason: "Buyer cancelled order",

          orderId: order._id.toString(),
        },
      });

      // -------------------------------------------------
      // Mark Cancelled
      // -------------------------------------------------

      order.orderStatus = "Cancelled";

      order.cancelledBy = "Buyer";

      order.cancelledAt = new Date();

      // -------------------------------------------------
      // Mark Refunded
      // -------------------------------------------------

      order.paymentStatus = "Refunded";

      // -------------------------------------------------
      // Save Refund ID
      // -------------------------------------------------

      if (
        Object.prototype.hasOwnProperty.call(
          order.toObject(),
          "razorpayRefundId",
        )
      ) {
        order.razorpayRefundId = refund.id;
      }

      await order.save();

      // -------------------------------------------------
      // Restore Stock
      // -------------------------------------------------

      await restoreOrderStock(order);

      // -------------------------------------------------
      // Notify Buyer
      // -------------------------------------------------

      await notifyOrderUser({
        req,

        recipient: order.buyer,

        type: "ORDER_REFUNDED",

        title: "Refund Initiated",

        message:
          `Your payment of ₹${order.totalPrice} ` +
          "has been refunded through Razorpay.",

        orderId: order._id,
      });

      // -------------------------------------------------
      // Notify Farmer
      // -------------------------------------------------

      await notifyOrderUser({
        req,

        recipient: order.farmer,

        type: "ORDER_CANCELLED",

        title: "Order Cancelled",

        message:
          "A buyer has cancelled an order. " +
          "The ordered stock has been returned " +
          "to inventory.",

        orderId: order._id,
      });

      // -------------------------------------------------
      // Response
      // -------------------------------------------------

      return res.status(200).json({
        success: true,

        message: "Order cancelled and refund initiated successfully",

        refundId: refund.id,

        order,
      });
    }

    // =================================================
    // COD
    // =================================================

    if (order.paymentMethod === "COD" && order.paymentStatus === "Pending") {
      // -------------------------------------------------
      // Cancel
      // -------------------------------------------------

      order.orderStatus = "Cancelled";

      order.cancelledBy = "Buyer";

      order.cancelledAt = new Date();

      await order.save();

      // -------------------------------------------------
      // Restore Stock
      // -------------------------------------------------

      await restoreOrderStock(order);

      // -------------------------------------------------
      // Notify Farmer
      // -------------------------------------------------

      await notifyOrderUser({
        req,

        recipient: order.farmer,

        type: "ORDER_CANCELLED",

        title: "Order Cancelled",

        message: "A buyer has cancelled a Cash on Delivery order.",

        orderId: order._id,
      });

      // -------------------------------------------------
      // Response
      // -------------------------------------------------

      return res.status(200).json({
        success: true,

        message: "COD order cancelled successfully",

        order,
      });
    }

    // =================================================
    // Unsupported Payment State
    // =================================================

    return res.status(400).json({
      success: false,

      message: "This order cannot be cancelled in its current payment state",
    });
  } catch (error) {
    console.error("Cancel Order Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Admin - Get All Orders
// =====================================================

const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("buyer", "name email")
      .populate("farmer", "name email")
      .populate("product")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,

      totalOrders: orders.length,

      orders,
    });
  } catch (error) {
    console.error("Get All Admin Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Export
// =====================================================

module.exports = {
  placeOrder,
  getBuyerOrders,
  getFarmerOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getAllOrdersAdmin,
};
