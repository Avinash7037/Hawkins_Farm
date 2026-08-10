const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

// =====================================================
// Add Item To Cart
// =====================================================

const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;

    const quantity = Number(req.body.quantity ?? 1);

    // =================================================
    // Validate Product ID
    // =================================================

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // =================================================
    // Validate Quantity
    // =================================================

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive integer",
      });
    }

    // =================================================
    // Find Product
    // =================================================

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // =================================================
    // Check Availability
    // =================================================

    if (!product.isAvailable || product.quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "This product is currently unavailable",
      });
    }

    // =================================================
    // Check Requested Quantity
    // =================================================

    if (quantity > product.quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.quantity} ${product.unit || "units"} available`,
      });
    }

    // =================================================
    // Find Existing Cart Item
    // =================================================

    const existingCartItem = await Cart.findOne({
      buyer: req.user._id,
      product: productId,
    });

    // =================================================
    // Existing Item
    // =================================================

    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + quantity;

      // -----------------------------------------------
      // Prevent Quantity From Exceeding Stock
      // -----------------------------------------------

      if (newQuantity > product.quantity) {
        return res.status(400).json({
          success: false,
          message: `You can only have up to ${product.quantity} ${product.unit || "units"} of this product in your cart`,
        });
      }

      existingCartItem.quantity = newQuantity;

      await existingCartItem.save();

      return res.status(200).json({
        success: true,
        message: "Cart updated successfully",
        cart: existingCartItem,
      });
    }

    // =================================================
    // Create New Cart Item
    // =================================================

    const cart = await Cart.create({
      buyer: req.user._id,
      product: productId,
      quantity,
    });

    // =================================================
    // Response
    // =================================================

    return res.status(201).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    console.error("Add To Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Get Cart
// =====================================================

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

    // =================================================
    // Remove Invalid / Deleted Products From Response
    // =================================================

    const validCart = cart.filter((item) => item.product);

    // =================================================
    // Calculate Totals
    // =================================================

    let totalItems = 0;

    let totalPrice = 0;

    validCart.forEach((item) => {
      const quantity = Number(item.quantity) || 0;

      const price = Number(item.product.price) || 0;

      totalItems += quantity;

      totalPrice += price * quantity;
    });

    // =================================================
    // Response
    // =================================================

    return res.status(200).json({
      success: true,
      totalItems,
      totalPrice,
      cart: validCart,
    });
  } catch (error) {
    console.error("Get Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Update Cart Quantity
// =====================================================

const updateCartQuantity = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);

    // =================================================
    // Cart Item Not Found
    // =================================================

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    // =================================================
    // Verify Ownership
    // =================================================

    if (cart.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // =================================================
    // Validate Quantity
    // =================================================

    const quantity = Number(req.body.quantity);

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive integer",
      });
    }

    // =================================================
    // Find Product
    // =================================================

    const product = await Product.findById(cart.product);

    if (!product) {
      // Product no longer exists.
      // Remove stale cart item.

      await cart.deleteOne();

      return res.status(404).json({
        success: false,
        message: "Product no longer exists and was removed from your cart",
      });
    }

    // =================================================
    // Check Availability
    // =================================================

    if (!product.isAvailable || product.quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "This product is currently unavailable",
      });
    }

    // =================================================
    // Check Stock
    // =================================================

    if (quantity > product.quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.quantity} ${product.unit || "units"} available`,
      });
    }

    // =================================================
    // Update Quantity
    // =================================================

    cart.quantity = quantity;

    await cart.save();

    // =================================================
    // Response
    // =================================================

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart,
    });
  } catch (error) {
    console.error("Update Cart Quantity Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Remove Cart Item
// =====================================================

const removeCartItem = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);

    // =================================================
    // Cart Item Not Found
    // =================================================

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    // =================================================
    // Verify Ownership
    // =================================================

    if (cart.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // =================================================
    // Delete
    // =================================================

    await cart.deleteOne();

    // =================================================
    // Response
    // =================================================

    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error) {
    console.error("Remove Cart Item Error:", error);

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
  addToCart,
  getCart,
  updateCartQuantity,
  removeCartItem,
};
