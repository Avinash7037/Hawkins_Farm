const mongoose = require("mongoose");

const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");

const sendEmail = require("../utils/sendEmail");

const {
  createLowStockNotification,
  createStockEmptyNotification,
} = require("./notificationService");

// =====================================================
// Create Orders From Cart / Checkout
// =====================================================

const createOrdersFromCart = async ({
  buyerId,
  deliveryAddress,
  paymentMethod,
  paymentStatus,
  checkoutItems = null,

  razorpayOrderId = "",
  razorpayPaymentId = "",

  io = null,

  session: existingSession = null,
}) => {
  let session = existingSession;

  let ownsSession = false;

  try {
    // =================================================
    // Start Transaction If Needed
    // =================================================

    if (!session) {
      session = await mongoose.startSession();

      session.startTransaction();

      ownsSession = true;
    }

    // =================================================
    // Validate Delivery Address
    // =================================================

    if (!deliveryAddress || typeof deliveryAddress !== "object") {
      throw new Error("Delivery address is required");
    }

    const requiredAddressFields = [
      "fullName",
      "phone",
      "addressLine1",
      "city",
      "state",
      "postalCode",
    ];

    for (const field of requiredAddressFields) {
      if (
        !deliveryAddress[field] ||
        typeof deliveryAddress[field] !== "string" ||
        !deliveryAddress[field].trim()
      ) {
        throw new Error(`Delivery address ${field} is required`);
      }
    }

    // =================================================
    // Create Delivery Address Snapshot
    // =================================================
    //
    // We store a copy of the address on the order.
    //
    // This is important because the buyer may later edit
    // or delete their saved address. Existing orders should
    // continue to contain the address used at checkout.
    // =================================================

    const deliveryAddressSnapshot = {
      fullName: deliveryAddress.fullName.trim(),

      phone: deliveryAddress.phone.trim(),

      addressLine1: deliveryAddress.addressLine1.trim(),

      addressLine2: deliveryAddress.addressLine2?.trim() || "",

      city: deliveryAddress.city.trim(),

      state: deliveryAddress.state.trim(),

      postalCode: deliveryAddress.postalCode.trim(),
    };

    // =================================================
    // Validate Payment Method
    // =================================================

    if (!["COD", "ONLINE"].includes(paymentMethod)) {
      throw new Error("Invalid payment method");
    }

    // =================================================
    // Validate Payment Status
    // =================================================

    if (!["Pending", "Paid"].includes(paymentStatus)) {
      throw new Error("Invalid payment status");
    }

    // =================================================
    // Determine Items
    // =================================================

    let items = [];

    // -------------------------------------------------
    // ONLINE
    // -------------------------------------------------

    if (paymentMethod === "ONLINE") {
      if (!Array.isArray(checkoutItems) || checkoutItems.length === 0) {
        throw new Error("Checkout contains no products");
      }

      items = checkoutItems.map((item) => ({
        cartItemId: item.cartItemId,
        product: item.product,
        quantity: item.quantity,
        price: item.price,
      }));
    }

    // -------------------------------------------------
    // COD
    // -------------------------------------------------
    else {
      const cartItems = await Cart.find({
        buyer: buyerId,
      })
        .session(session)
        .lean();

      if (cartItems.length === 0) {
        throw new Error("Your cart is empty");
      }

      items = cartItems.map((item) => ({
        cartItemId: item._id,
        product: item.product,
        quantity: item.quantity,
      }));
    }

    const orders = [];

    // =================================================
    // Track Stock Events
    // =================================================

    const stockEmptyItems = [];

    const lowStockItems = [];

    // =================================================
    // Process Every Item
    // =================================================

    for (const item of items) {
      // -------------------------------------------------
      // Validate Quantity
      // -------------------------------------------------

      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        throw new Error("Invalid product quantity");
      }

      // -------------------------------------------------
      // Online Snapshot Price
      // -------------------------------------------------

      let snapshotPrice = null;

      if (paymentMethod === "ONLINE") {
        snapshotPrice = Number(item.price);

        if (!Number.isFinite(snapshotPrice) || snapshotPrice < 0) {
          throw new Error("Invalid checkout product price");
        }
      }

      // =================================================
      // Atomically Reserve Stock
      // =================================================

      const product = await Product.findOneAndUpdate(
        {
          _id: item.product,

          isAvailable: true,

          quantity: {
            $gte: item.quantity,
          },
        },
        {
          $inc: {
            quantity: -item.quantity,
          },
        },
        {
          returnDocument: "after",
          session,
        },
      );

      if (!product) {
        throw new Error(
          "Product is unavailable or there is insufficient stock",
        );
      }

      // =================================================
      // Validate Product Price
      // =================================================

      if (
        typeof product.price !== "number" ||
        !Number.isFinite(product.price) ||
        product.price < 0
      ) {
        throw new Error(`Invalid price for product: ${product.name}`);
      }

      // =================================================
      // Determine Stock State
      // =================================================

      const stockBecameEmpty = product.quantity === 0;

      const stockIsLow =
        product.quantity > 0 && product.quantity <= product.lowStockThreshold;

      // =================================================
      // Update Availability
      // =================================================

      if (stockBecameEmpty) {
        product.isAvailable = false;

        await product.save({
          session,
        });
      }

      // =================================================
      // Determine Order Price
      // =================================================

      const orderPrice =
        paymentMethod === "ONLINE" ? snapshotPrice : product.price;

      // =================================================
      // Calculate Total
      // =================================================

      const totalPrice = Number((orderPrice * item.quantity).toFixed(2));

      if (!Number.isFinite(totalPrice) || totalPrice < 0) {
        throw new Error(`Invalid order total for ${product.name}`);
      }

      // =================================================
      // Create Order
      // =================================================

      const createdOrders = await Order.create(
        [
          {
            buyer: buyerId,

            farmer: product.farmer,

            product: product._id,

            quantity: item.quantity,

            totalPrice,

            // -------------------------------------------------
            // IMPORTANT:
            // Store the complete delivery address snapshot.
            // -------------------------------------------------

            deliveryAddress: deliveryAddressSnapshot,

            paymentMethod,

            paymentStatus,

            razorpayOrderId: paymentMethod === "ONLINE" ? razorpayOrderId : "",

            razorpayPaymentId:
              paymentMethod === "ONLINE" ? razorpayPaymentId : "",

            orderStatus: "Pending",
          },
        ],
        {
          session,
        },
      );

      const createdOrder = createdOrders[0];

      orders.push(createdOrder);

      // =================================================
      // Remember Empty Stock Event
      // =================================================

      if (stockBecameEmpty) {
        stockEmptyItems.push({
          farmerId: product.farmer,

          productId: product._id,

          productName: product.name,

          orderId: createdOrder._id,
        });
      }

      // =================================================
      // Remember Low Stock Event
      // =================================================

      if (stockIsLow) {
        lowStockItems.push({
          farmerId: product.farmer,

          productId: product._id,

          productName: product.name,

          quantity: product.quantity,

          unit: product.unit,

          threshold: product.lowStockThreshold,

          orderId: createdOrder._id,
        });
      }
    }

    // =================================================
    // Commit Standalone Transaction
    // =================================================

    if (ownsSession) {
      await session.commitTransaction();
    }

    // =================================================
    // Notifications
    //
    // Only send these after a standalone transaction
    // successfully commits.
    // =================================================

    if (ownsSession) {
      // -------------------------------------------------
      // Low Stock
      // -------------------------------------------------

      for (const item of lowStockItems) {
        try {
          await createLowStockNotification({
            farmerId: item.farmerId,

            productId: item.productId,

            productName: item.productName,

            quantity: item.quantity,

            unit: item.unit,

            threshold: item.threshold,

            orderId: item.orderId,

            io,
          });
        } catch (notificationError) {
          console.error(
            "Low stock notification failed:",
            notificationError.message,
          );
        }
      }

      // -------------------------------------------------
      // Empty Stock
      // -------------------------------------------------

      for (const item of stockEmptyItems) {
        try {
          await createStockEmptyNotification({
            farmerId: item.farmerId,

            productId: item.productId,

            productName: item.productName,

            orderId: item.orderId,

            io,
          });
        } catch (notificationError) {
          console.error(
            "Stock empty notification failed:",
            notificationError.message,
          );
        }
      }
    }

    return orders;
  } catch (error) {
    if (ownsSession && session?.inTransaction()) {
      await session.abortTransaction();
    }

    throw error;
  } finally {
    if (ownsSession) {
      await session.endSession();
    }
  }
};

// =====================================================
// Clear Buyer Cart
// =====================================================

const clearBuyerCart = async (buyerId, session = null, cartItemIds = null) => {
  const filter = {
    buyer: buyerId,
  };

  if (Array.isArray(cartItemIds) && cartItemIds.length > 0) {
    filter._id = {
      $in: cartItemIds,
    };
  }

  await Cart.deleteMany(
    filter,
    session
      ? {
          session,
        }
      : undefined,
  );
};

// =====================================================
// Send Order Confirmation Email
// =====================================================

const sendOrderConfirmationEmail = async (buyerId, totalOrders) => {
  const buyer = await User.findById(buyerId);

  if (!buyer) {
    return;
  }

  await sendEmail({
    to: buyer.email,

    subject: "Order Placed Successfully - Hawkins Farm",

    html: `
      <div
        style="
          font-family: Arial, sans-serif;
          padding: 20px;
        "
      >
        <h2>Hello ${buyer.name},</h2>

        <p>
          Your Hawkins Farm order
          has been placed successfully.
        </p>

        <p>
          <strong>Total Orders:</strong>
          ${totalOrders}
        </p>

        <p>
          We'll notify you whenever
          the farmer updates your
          order status.
        </p>

        <br />

        <p>
          Thank you for shopping with
          <strong>Hawkins Farm</strong>.
        </p>
      </div>
    `,
  });
};

// =====================================================
// Exports
// =====================================================

module.exports = {
  createOrdersFromCart,

  clearBuyerCart,

  sendOrderConfirmationEmail,
};
