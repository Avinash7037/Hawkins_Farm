const Order = require("../models/orderModel");
const User = require("../models/userModel");

const { createOrdersFromCart } = require("../services/orderService");
const sendEmail = require("../utils/sendEmail");

// =====================================================
// Buyer Places Order
// =====================================================

const placeOrder = async (req, res) => {
  try {
    const { deliveryAddress, paymentMethod } = req.body;

    const orders = await createOrdersFromCart({
      buyerId: req.user._id,
      deliveryAddress,
      paymentMethod,
    });

    res.status(201).json({
      success: true,
      message: "Orders created successfully",
      orders,
    });
  } catch (error) {
    const statusCode = error.message === "Your cart is empty" ? 400 : 500;

    res.status(statusCode).json({
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
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
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
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
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

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
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

    // These statuses must match orderModel.js
    const validStatuses = [
      "Pending",
      "Accepted",
      "Rejected",
      "Packed",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    // Validate status
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    // Find order
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Only the farmer who owns the order can update it
    if (order.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own orders",
      });
    }

    // Update status
    order.orderStatus = orderStatus;

    await order.save();

    // Notify buyer by email
    // Email failure must NOT make the order update fail.
    try {
      const buyer = await User.findById(order.buyer);

      if (buyer) {
        await sendEmail({
          to: buyer.email,

          subject: "Order Status Updated - Hawkins Farm",

          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2>Hello ${buyer.name},</h2>

              <p>
                Your Hawkins Farm order status has been updated.
              </p>

              <h3>
                Current Status:
                ${order.orderStatus}
              </h3>

              <p>
                Thank you for shopping with
                <strong>Hawkins Farm</strong>.
              </p>
            </div>
          `,
        });
      }
    } catch (emailError) {
      console.error("Order status email failed:", emailError.message);
    }

    // Return updated order
    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  placeOrder,
  getBuyerOrders,
  getFarmerOrders,
  getOrderById,
  updateOrderStatus,
};
