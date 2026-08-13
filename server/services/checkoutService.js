const mongoose = require("mongoose");

const Checkout = require("../models/checkoutModel");
const Product = require("../models/productModel");

const {
  createOrdersFromCart,
  clearBuyerCart,
  sendOrderConfirmationEmail,
} = require("./orderService");

const {
  createNotification,
  createLowStockNotification,
  createStockEmptyNotification,
} = require("./notificationService");

// =====================================================
// Notify Farmers About Newly Created Orders
// =====================================================

const notifyFarmersAboutOrders = async (orders, io) => {
  if (!Array.isArray(orders) || orders.length === 0) {
    return;
  }

  for (const order of orders) {
    try {
      if (!order?.farmer) {
        console.error(
          "Cannot create order notification: farmer is missing",
          order?._id,
        );

        continue;
      }

      await createNotification({
        recipient: order.farmer,

        type: "ORDER_PLACED",

        title: "New Order Received",

        message: "You have received a new order from a buyer.",

        order: order._id,

        io,
      });
    } catch (notificationError) {
      console.error(
        "Farmer order notification failed:",
        notificationError.message,
      );
    }
  }
};

// =====================================================
// Notify Farmers About Low Stock
// =====================================================
//
// This uses an atomic claim:
//
// lowStockNotified: false
//        ↓
// lowStockNotified: true
//
// Only the first checkout that reaches the low-stock
// condition can claim the notification.
//
// This prevents repeated alerts for every purchase.
// =====================================================

const notifyFarmersAboutLowStock = async (orders, io) => {
  if (!Array.isArray(orders) || orders.length === 0) {
    return;
  }

  const processedProducts = new Set();

  for (const order of orders) {
    try {
      if (!order?.product) {
        continue;
      }

      const productId = order.product.toString();

      if (processedProducts.has(productId)) {
        continue;
      }

      processedProducts.add(productId);

      // =================================================
      // Atomically Claim Low Stock Alert
      // =================================================

      const product = await Product.findOneAndUpdate(
        {
          _id: productId,

          quantity: {
            $gt: 0,
          },

          lowStockNotified: false,

          $expr: {
            $lte: ["$quantity", "$lowStockThreshold"],
          },
        },
        {
          $set: {
            lowStockNotified: true,
          },
        },
        {
          returnDocument: "after",
        },
      );

      // -------------------------------------------------
      // Another request already claimed it
      // -------------------------------------------------

      if (!product) {
        continue;
      }

      // =================================================
      // Create Notification
      // =================================================

      try {
        await createLowStockNotification({
          farmerId: product.farmer,

          productId: product._id,

          productName: product.name,

          quantity: product.quantity,

          unit: product.unit,

          threshold: product.lowStockThreshold,

          orderId: order._id,

          io,
        });

        console.log(
          `🔔 Low stock notification created: ${product.name} - ${product.quantity} ${product.unit}`,
        );
      } catch (notificationError) {
        // -------------------------------------------------
        // Allow another checkout to retry the alert
        // -------------------------------------------------

        await Product.updateOne(
          {
            _id: product._id,

            lowStockNotified: true,
          },
          {
            $set: {
              lowStockNotified: false,
            },
          },
        );

        throw notificationError;
      }
    } catch (notificationError) {
      console.error(
        "Low stock notification failed:",
        notificationError.message,
      );
    }
  }
};

// =====================================================
// Notify Farmers About Empty Stock
// =====================================================

const notifyFarmersAboutEmptyStock = async (orders, io) => {
  if (!Array.isArray(orders) || orders.length === 0) {
    return;
  }

  const processedProducts = new Set();

  for (const order of orders) {
    try {
      if (!order?.product) {
        continue;
      }

      const productId = order.product.toString();

      if (processedProducts.has(productId)) {
        continue;
      }

      processedProducts.add(productId);

      // =================================================
      // Get Current Product
      // =================================================

      const product = await Product.findById(productId).select(
        "name quantity farmer unit",
      );

      if (!product) {
        console.error(
          "Stock notification skipped: product not found",
          productId,
        );

        continue;
      }

      // =================================================
      // Only Notify When Stock Is Zero
      // =================================================

      if (product.quantity !== 0) {
        continue;
      }

      // =================================================
      // Determine Farmer
      // =================================================

      const farmerId = product.farmer || order.farmer;

      if (!farmerId) {
        console.error(
          "Stock notification skipped: farmer not found",
          product.name,
        );

        continue;
      }

      // =================================================
      // Create Empty Stock Notification
      // =================================================

      await createStockEmptyNotification({
        farmerId,

        productId: product._id,

        productName: product.name,

        orderId: order._id,

        io,
      });

      console.log(`🔴 Stock empty notification created: ${product.name}`);
    } catch (notificationError) {
      console.error(
        "Stock empty notification failed:",
        notificationError.message,
      );
    }
  }
};

// =====================================================
// Complete Online Checkout
// =====================================================

const completeCheckout = async ({
  checkoutId,
  razorpayPaymentId,
  razorpaySignature,
  io = null,
}) => {
  const session = await mongoose.startSession();

  let orders = [];

  try {
    // =================================================
    // Start Transaction
    // =================================================

    session.startTransaction();

    // =================================================
    // Get Checkout
    // =================================================

    const checkout = await Checkout.findById(checkoutId).session(session);

    if (!checkout) {
      throw new Error("Checkout not found");
    }

    // =================================================
    // Validate Buyer
    // =================================================

    if (!checkout.buyer) {
      throw new Error("Checkout buyer information is missing");
    }

    // =================================================
    // Prevent Duplicate Completion
    // =================================================

    if (checkout.paymentStatus === "Paid") {
      throw new Error("Payment already completed");
    }

    // =================================================
    // Validate Payment Details
    // =================================================

    if (!razorpayPaymentId) {
      throw new Error("Razorpay payment ID is required");
    }

    if (!razorpaySignature) {
      throw new Error("Razorpay payment signature is required");
    }

    // =================================================
    // Validate Payment Method
    // =================================================

    if (checkout.paymentMethod !== "ONLINE") {
      throw new Error("This checkout is not an online payment");
    }

    // =================================================
    // Validate Checkout Status
    // =================================================

    if (checkout.paymentStatus !== "Pending") {
      throw new Error(
        `Checkout cannot be completed because payment status is ${checkout.paymentStatus}`,
      );
    }

    // =================================================
    // Validate Checkout Items
    // =================================================

    if (!Array.isArray(checkout.items) || checkout.items.length === 0) {
      throw new Error("Checkout contains no products");
    }

    // =================================================
    // Validate Razorpay Order ID
    // =================================================

    if (!checkout.razorpayOrderId) {
      throw new Error("Razorpay order ID is missing");
    }

    // =================================================
    // Create Orders
    // =================================================

    orders = await createOrdersFromCart({
      buyerId: checkout.buyer,

      deliveryAddress: checkout.deliveryAddress,

      paymentMethod: checkout.paymentMethod,

      paymentStatus: "Paid",

      checkoutItems: checkout.items,

      razorpayOrderId: checkout.razorpayOrderId,

      razorpayPaymentId,

      session,
    });

    // =================================================
    // Clear Original Cart Items
    // =================================================

    const cartItemIds = checkout.items.map((item) => item.cartItemId);

    await clearBuyerCart(checkout.buyer, session, cartItemIds);

    // =================================================
    // Mark Checkout Paid
    // =================================================

    checkout.paymentStatus = "Paid";

    checkout.razorpayPaymentId = razorpayPaymentId;

    checkout.paymentSignature = razorpaySignature;

    if (Object.prototype.hasOwnProperty.call(checkout, "completed")) {
      checkout.completed = true;
    }

    await checkout.save({
      session,
    });

    // =================================================
    // Commit Transaction
    // =================================================

    await session.commitTransaction();

    // =================================================
    // Notifications
    // =================================================

    await notifyFarmersAboutOrders(orders, io);

    await notifyFarmersAboutLowStock(orders, io);

    await notifyFarmersAboutEmptyStock(orders, io);

    // =================================================
    // Confirmation Email
    // =================================================

    try {
      await sendOrderConfirmationEmail(checkout.buyer, orders.length);
    } catch (emailError) {
      console.error("Order confirmation email failed:", emailError.message);
    }

    return orders;
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
// Complete COD Checkout
// =====================================================

const completeCODCheckout = async ({ checkoutId, io = null }) => {
  const session = await mongoose.startSession();

  let orders = [];

  try {
    // =================================================
    // Start Transaction
    // =================================================

    session.startTransaction();

    // =================================================
    // Get Checkout
    // =================================================

    const checkout = await Checkout.findById(checkoutId).session(session);

    if (!checkout) {
      throw new Error("Checkout not found");
    }

    // =================================================
    // Validate Buyer
    // =================================================

    if (!checkout.buyer) {
      throw new Error("Checkout buyer information is missing");
    }

    // =================================================
    // Validate Payment Method
    // =================================================

    if (checkout.paymentMethod !== "COD") {
      throw new Error("This checkout is not a COD order");
    }

    // =================================================
    // Prevent Duplicate Completion
    // =================================================

    if (checkout.paymentStatus !== "Pending") {
      throw new Error(
        `Checkout cannot be completed because payment status is ${checkout.paymentStatus}`,
      );
    }

    // =================================================
    // Validate Items
    // =================================================

    if (!Array.isArray(checkout.items) || checkout.items.length === 0) {
      throw new Error("Checkout contains no products");
    }

    // =================================================
    // Create COD Orders
    // =================================================

    orders = await createOrdersFromCart({
      buyerId: checkout.buyer,

      deliveryAddress: checkout.deliveryAddress,

      paymentMethod: "COD",

      paymentStatus: "Pending",

      checkoutItems: null,

      razorpayOrderId: "",

      razorpayPaymentId: "",

      session,
    });

    // =================================================
    // Clear Original Cart Items
    // =================================================

    const cartItemIds = checkout.items.map((item) => item.cartItemId);

    await clearBuyerCart(checkout.buyer, session, cartItemIds);

    // =================================================
    // Mark Checkout Completed
    // =================================================

    if (Object.prototype.hasOwnProperty.call(checkout, "completed")) {
      checkout.completed = true;
    }

    await checkout.save({
      session,
    });

    // =================================================
    // Commit Transaction
    // =================================================

    await session.commitTransaction();

    // =================================================
    // Notify Farmers
    // =================================================

    await notifyFarmersAboutOrders(orders, io);

    // -------------------------------------------------
    // LOW STOCK
    // -------------------------------------------------

    await notifyFarmersAboutLowStock(orders, io);

    // -------------------------------------------------
    // EMPTY STOCK
    // -------------------------------------------------

    await notifyFarmersAboutEmptyStock(orders, io);

    // =================================================
    // Confirmation Email
    // =================================================

    try {
      await sendOrderConfirmationEmail(checkout.buyer, orders.length);
    } catch (emailError) {
      console.error("COD confirmation email failed:", emailError.message);
    }

    return orders;
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
// Export
// =====================================================

module.exports = {
  completeCheckout,

  completeCODCheckout,
};
