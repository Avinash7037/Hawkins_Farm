const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");

const placeOrder = async (req, res) => {
  try {
    const { deliveryAddress, paymentMethod } = req.body;

    const cartItems = await Cart.find({
      buyer: req.user._id,
    }).populate("product");

    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    const orders = [];

    for (const item of cartItems) {
      const order = await Order.create({
        buyer: req.user._id,
        farmer: item.product.farmer,
        product: item.product._id,
        quantity: item.quantity,
        totalPrice: item.product.price * item.quantity,
        deliveryAddress,
        paymentMethod,
      });

      orders.push(order);
    }

    await Cart.deleteMany({
      buyer: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  placeOrder,
};
