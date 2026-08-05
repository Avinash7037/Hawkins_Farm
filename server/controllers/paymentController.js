const crypto = require("crypto");

const razorpay = require("../config/razorpay");
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");

// Will be used after the checkout refactor
const { completeCheckout } = require("../services/checkoutService");

const createPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Prevent duplicate payment
    if (order.paymentStatus === "Paid") {
      return res.status(400).json({
        success: false,
        message: "Order is already paid",
      });
    }

    const options = {
      amount: order.totalPrice * 100,
      currency: "INR",
      receipt: order._id.toString(),
    };

    const razorpayOrder = await razorpay.orders.create(options);

    order.razorpayOrderId = razorpayOrder.id;

    await order.save();

    res.status(200).json({
      success: true,
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

    const order = await Order.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.paymentStatus = "Paid";
    order.paymentMethod = "ONLINE";
    order.razorpayPaymentId = razorpay_payment_id;
    order.paymentSignature = razorpay_signature;

    await order.save();

    // Send payment success email
    const buyer = await User.findById(order.buyer);

    if (buyer) {
      try {
        await sendEmail({
          to: buyer.email,
          subject: "Payment Successful - Hawkins Farm",
          html: `
            <div style="font-family: Arial, sans-serif; padding:20px;">
              <h2>Payment Successful 🎉</h2>

              <p>Hello <strong>${buyer.name}</strong>,</p>

              <p>Your payment has been received successfully.</p>

              <h3>Payment Details</h3>

              <ul>
                <li><strong>Order ID:</strong> ${order._id}</li>
                <li><strong>Payment ID:</strong> ${razorpay_payment_id}</li>
                <li><strong>Amount:</strong> ₹${order.totalPrice}</li>
                <li><strong>Status:</strong> Paid</li>
              </ul>

              <p>Your order is now being processed by the farmer.</p>

              <br>

              <p>Thank you for choosing <strong>Hawkins Farm</strong>.</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.log("Email Error:", emailError.message);
      }
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
};
