const QRCode = require("qrcode");
const Order = require("../models/orderModel");

const generateOrderQR = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("buyer", "name email")
      .populate("farmer", "name email")
      .populate("product", "name");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const qrData = {
      orderId: order._id,
      buyer: order.buyer.name,
      farmer: order.farmer.name,
      product: order.product.name,
      quantity: order.quantity,
      totalPrice: order.totalPrice,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
    };

    const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));

    res.status(200).json({
      success: true,
      qrCode,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  generateOrderQR,
};
