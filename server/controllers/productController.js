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

const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      location,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    let query = {};

    // Search
    if (search) {
      query.name = {
        $regex: search,
        $options: "i",
      };
    }

    // Category
    if (category) {
      query.category = category;
    }

    // Location
    if (location) {
      query.location = location;
    }

    // Price
    if (minPrice || maxPrice) {
      query.price = {};

      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sorting
    let sortOption = { createdAt: -1 };

    if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    }

    if (sort === "priceLow") {
      sortOption = { price: 1 };
    }

    if (sort === "priceHigh") {
      sortOption = { price: -1 };
    }

    // Pagination
    const currentPage = Number(page);
    const pageSize = Number(limit);

    const skip = (currentPage - 1) * pageSize;

    const totalProducts = await Product.countDocuments(query);

    const products = await Product.find(query)
      .populate("farmer", "name email")
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({
      success: true,
      currentPage,
      totalPages: Math.ceil(totalProducts / pageSize),
      totalProducts,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
};
