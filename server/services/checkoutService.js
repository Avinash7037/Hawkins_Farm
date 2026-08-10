const mongoose = require("mongoose");

const Checkout = require("../models/checkoutModel");

const {
  createOrdersFromCart,
  clearBuyerCart,
  sendOrderConfirmationEmail,
} = require("./orderService");

const { createNotification } = require("./notificationService");

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
      // -------------------------------------------------
      // Notification failure must NOT break the order.
      // -------------------------------------------------

      console.error(
        "Farmer order notification failed:",
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
    // Validate Buyer Checkout
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

      razorpayPaymentId: razorpayPaymentId,

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

    // If your Checkout model has this field,
    // mark the checkout completed.

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
    //
    // IMPORTANT:
    // Notification happens AFTER the transaction
    // commits. Therefore a notification failure
    // cannot roll back the successful order.
    // =================================================

    await notifyFarmersAboutOrders(orders, io);

    // =================================================
    // Confirmation Email
    // =================================================

    try {
      await sendOrderConfirmationEmail(checkout.buyer, orders.length);
    } catch (emailError) {
      console.error("Order confirmation email failed:", emailError.message);
    }

    // =================================================
    // Return Orders
    // =================================================

    return orders;
  } catch (error) {
    // =================================================
    // Rollback Transaction
    // =================================================

    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    throw error;
  } finally {
    // =================================================
    // Close Session
    // =================================================

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
    //
    // Payment remains Pending because the buyer
    // pays when the order is delivered.
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
    //
    // COD payment is still Pending.
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

    // =================================================
    // Confirmation Email
    // =================================================

    try {
      await sendOrderConfirmationEmail(checkout.buyer, orders.length);
    } catch (emailError) {
      console.error("COD confirmation email failed:", emailError.message);
    }

    // =================================================
    // Return Orders
    // =================================================

    return orders;
  } catch (error) {
    // =================================================
    // Rollback Transaction
    // =================================================

    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    throw error;
  } finally {
    // =================================================
    // Close Session
    // =================================================

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
