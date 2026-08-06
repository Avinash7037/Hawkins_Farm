const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");

const createOrdersFromCart = async ({
  buyerId,
  deliveryAddress,
  paymentMethod,
}) => {
  const cartItems = await Cart.find({
    buyer: buyerId,
  }).populate("product");

  if (cartItems.length === 0) {
    throw new Error("Your cart is empty");
  }

  const orders = [];

  for (const item of cartItems) {
    const order = await Order.create({
      buyer: buyerId,
      farmer: item.product.farmer,
      product: item.product._id,
      quantity: item.quantity,
      totalPrice: item.product.price * item.quantity,
      deliveryAddress,

      // Payment
      paymentMethod,
      paymentStatus: paymentMethod === "ONLINE" ? "Paid" : "Pending",

      // Order
      orderStatus: "Pending",
    });

    orders.push(order);
  }

  return orders;
};

const clearBuyerCart = async (buyerId) => {
  await Cart.deleteMany({
    buyer: buyerId,
  });
};

const sendOrderConfirmationEmail = async (buyerId, totalOrders) => {
  const buyer = await User.findById(buyerId);

  if (!buyer) return;

  await sendEmail({
    to: buyer.email,
    subject: "Order Placed Successfully - Hawkins Farm",
    html: `
      <h2>Hello ${buyer.name},</h2>

      <p>Your order has been placed successfully.</p>

      <p><strong>Total Items:</strong> ${totalOrders}</p>

      <p>
        We'll notify you whenever the farmer updates your order status.
      </p>

      <br>

      <p>
        Thank you for shopping with
        <strong> Hawkins Farm</strong>.
      </p>
    `,
  });
};

module.exports = {
  createOrdersFromCart,
  clearBuyerCart,
  sendOrderConfirmationEmail,
};
