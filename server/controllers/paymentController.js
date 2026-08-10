const crypto = require("crypto");

const razorpay = require("../config/razorpay");

const Cart = require("../models/cartModel");
const Checkout = require("../models/checkoutModel");

const {
  completeCheckout,
  completeCODCheckout,
} = require("../services/checkoutService");

// =====================================================
// Create Checkout
// =====================================================

const createPaymentOrder = async (req, res) => {
  try {
    const { deliveryAddress, paymentMethod } = req.body;

    // =================================================
    // Validate Address
    // =================================================

    if (!deliveryAddress?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Delivery address is required",
      });
    }

    // =================================================
    // Validate Payment Method
    // =================================================

    if (!["ONLINE", "COD"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    // =================================================
    // Get Cart
    // =================================================

    const cartItems = await Cart.find({
      buyer: req.user._id,
    }).populate("product");

    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    const checkoutItems = [];

    let totalPrice = 0;

    // =================================================
    // Validate Cart
    // =================================================

    for (const item of cartItems) {
      const product = item.product;

      // -------------------------------------------------
      // Product
      // -------------------------------------------------

      if (!product) {
        return res.status(400).json({
          success: false,
          message: "One or more products in your cart are no longer available",
        });
      }

      // -------------------------------------------------
      // Availability
      // -------------------------------------------------

      if (!product.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is currently unavailable`,
        });
      }

      // -------------------------------------------------
      // Quantity
      // -------------------------------------------------

      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for ${product.name}`,
        });
      }

      // -------------------------------------------------
      // Stock
      // -------------------------------------------------

      if (item.quantity > product.quantity) {
        return res.status(400).json({
          success: false,
          message:
            `Insufficient stock for ${product.name}. ` +
            `Available quantity: ${product.quantity}`,
        });
      }

      // -------------------------------------------------
      // Price
      // -------------------------------------------------

      if (
        typeof product.price !== "number" ||
        !Number.isFinite(product.price) ||
        product.price < 0
      ) {
        return res.status(400).json({
          success: false,
          message: `Invalid price for ${product.name}`,
        });
      }

      // -------------------------------------------------
      // Price Snapshot
      // -------------------------------------------------

      const itemTotal = product.price * item.quantity;

      checkoutItems.push({
        cartItemId: item._id,

        product: product._id,

        farmer: product.farmer,

        quantity: item.quantity,

        price: product.price,

        totalPrice: Number(itemTotal.toFixed(2)),
      });

      totalPrice += itemTotal;
    }

    // =================================================
    // Validate Total
    // =================================================

    totalPrice = Number(totalPrice.toFixed(2));

    if (!Number.isFinite(totalPrice) || totalPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order amount",
      });
    }

    // =================================================
    // Create Checkout
    // =================================================

    const checkout = await Checkout.create({
      buyer: req.user._id,

      deliveryAddress: deliveryAddress.trim(),

      paymentMethod,

      items: checkoutItems,

      totalPrice,

      paymentStatus: "Pending",

      completed: false,
    });

    // =================================================
    // COD
    // =================================================

    if (paymentMethod === "COD") {
      const orders = await completeCODCheckout({
        checkoutId: checkout._id,

        // ---------------------------------------------
        // Socket.IO
        // ---------------------------------------------

        io: req.app.get("io"),
      });

      return res.status(201).json({
        success: true,

        message: "COD order placed successfully",

        checkoutId: checkout._id,

        orders,
      });
    }

    // =================================================
    // ONLINE
    // =================================================

    const amountInPaise = Math.round(totalPrice * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,

      currency: "INR",

      receipt: checkout._id.toString(),
    });

    // =================================================
    // Save Razorpay Order
    // =================================================

    checkout.razorpayOrderId = razorpayOrder.id;

    await checkout.save();

    // =================================================
    // Response
    // =================================================

    return res.status(200).json({
      success: true,

      checkoutId: checkout._id,

      razorpayOrder,
    });
  } catch (error) {
    console.error("Create Checkout Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Verify Razorpay Payment
// =====================================================

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // =================================================
    // Validate
    // =================================================

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment details are required",
      });
    }

    // =================================================
    // Find Checkout
    // =================================================

    const checkout = await Checkout.findOne({
      razorpayOrderId: razorpay_order_id,

      buyer: req.user._id,
    });

    if (!checkout) {
      return res.status(404).json({
        success: false,
        message: "Checkout not found",
      });
    }

    // =================================================
    // Validate Method
    // =================================================

    if (checkout.paymentMethod !== "ONLINE") {
      return res.status(400).json({
        success: false,
        message: "This checkout is not an online payment",
      });
    }

    // =================================================
    // Duplicate
    // =================================================

    if (checkout.completed || checkout.paymentStatus === "Paid") {
      return res.status(400).json({
        success: false,
        message: "Payment already verified",
      });
    }

    // =================================================
    // Generate Signature
    // =================================================

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // =================================================
    // Timing Safe Comparison
    // =================================================

    const generatedBuffer = Buffer.from(generatedSignature, "utf8");

    const receivedBuffer = Buffer.from(razorpay_signature, "utf8");

    if (
      generatedBuffer.length !== receivedBuffer.length ||
      !crypto.timingSafeEqual(generatedBuffer, receivedBuffer)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // =================================================
    // Fetch Razorpay Order
    // =================================================

    const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id);

    if (!razorpayOrder) {
      return res.status(400).json({
        success: false,
        message: "Razorpay order not found",
      });
    }

    // =================================================
    // Currency
    // =================================================

    if (razorpayOrder.currency !== "INR") {
      return res.status(400).json({
        success: false,
        message: "Invalid payment currency",
      });
    }

    // =================================================
    // Amount
    // =================================================

    const expectedAmount = Math.round(checkout.totalPrice * 100);

    if (Number(razorpayOrder.amount) !== expectedAmount) {
      return res.status(400).json({
        success: false,
        message: "Payment amount mismatch",
      });
    }

    // =================================================
    // Order ID
    // =================================================

    if (razorpayOrder.id !== razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: "Invalid Razorpay order",
      });
    }

    // =================================================
    // Complete Checkout
    // =================================================

    const orders = await completeCheckout({
      checkoutId: checkout._id,

      razorpayPaymentId: razorpay_payment_id,

      razorpaySignature: razorpay_signature,

      // ---------------------------------------------
      // Socket.IO
      // ---------------------------------------------

      io: req.app.get("io"),
    });

    // =================================================
    // Success
    // =================================================

    return res.status(200).json({
      success: true,

      message: "Payment verified successfully",

      orders,
    });
  } catch (error) {
    console.error("Verify Payment Error:", error.message);

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
  createPaymentOrder,
  verifyPayment,
};
