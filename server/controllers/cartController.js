const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;

    const quantity = Number(req.body.quantity) || 1;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const existingCartItem = await Cart.findOne({
      buyer: req.user._id,
      product: productId,
    });

    if (existingCartItem) {
      existingCartItem.quantity += quantity;

      await existingCartItem.save();

      return res.status(200).json({
        success: true,
        message: "Cart updated successfully",
        cart: existingCartItem,
      });
    }

    const cart = await Cart.create({
      buyer: req.user._id,
      product: productId,
      quantity,
    });

    res.status(201).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCart = async (req, res) => {
  try {
    const cart = await Cart.find({
      buyer: req.user._id,
    }).populate({
      path: "product",
      populate: {
        path: "farmer",
        select: "name email",
      },
    });

    let totalPrice = 0;

    cart.forEach((item) => {
      totalPrice += item.product.price * item.quantity;
    });

    res.status(200).json({
      success: true,
      totalItems: cart.length,
      totalPrice,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCartQuantity = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    if (cart.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const quantity = Number(req.body.quantity);

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    cart.quantity = quantity;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const removeCartItem = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    if (cart.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await cart.deleteOne();

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartQuantity,
  removeCartItem,
};
