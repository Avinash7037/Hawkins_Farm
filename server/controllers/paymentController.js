const crypto = require("crypto");

const razorpay = require("../config/razorpay");

const Cart = require("../models/cartModel");
const Checkout = require("../models/checkoutModel");

const { completeCheckout } = require("../services/checkoutService");

const createPaymentOrder = async (req, res) => {
  try {
    const { deliveryAddress } = req.body;

    const cartItems = await Cart.find({
      buyer: req.user._id,
    }).populate("product");

    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    let totalPrice = 0;

    cartItems.forEach((item) => {
      totalPrice += item.product.price * item.quantity;
    });

    const checkout = await Checkout.create({
      buyer: req.user._id,
      deliveryAddress,
      paymentMethod: "ONLINE",
      totalPrice,
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: totalPrice * 100,
      currency: "INR",
      receipt: checkout._id.toString(),
    });

    checkout.razorpayOrderId = razorpayOrder.id;

    await checkout.save();

    res.status(200).json({
      success: true,
      checkoutId: checkout._id,
      razorpayOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const verifyPayment = async (req, res) => {
  console.log("✅ verifyPayment route hit");
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    const checkout = await Checkout.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!checkout) {
      return res.status(404).json({
        success: false,
        message: "Checkout not found",
      });
    }

    if (checkout.paymentStatus === "Paid") {
      return res.status(400).json({
        success: false,
        message: "Payment already verified",
      });
    }

    checkout.paymentStatus = "Paid";
    checkout.razorpayPaymentId = razorpay_payment_id;
    checkout.paymentSignature = razorpay_signature;

    await checkout.save();

    const orders = await completeCheckout({
      buyerId: checkout.buyer,
      deliveryAddress: checkout.deliveryAddress,
      paymentMethod: checkout.paymentMethod,
    });

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      orders,
    });
  } catch (error) {
    console.error("Verify Payment Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
};
