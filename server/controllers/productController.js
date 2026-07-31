const Product = require("../models/productModel");

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      quantity,
      unit,
      location,
      freshness,
      images,
    } = req.body;

    const product = await Product.create({
      farmer: req.user._id,
      name,
      description,
      category,
      price,
      quantity,
      unit,
      location,
      freshness,
      images,
    });

    res.status(201).json({
      message: "Product Added Successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createProduct,
};
