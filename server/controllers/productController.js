const mongoose = require("mongoose");

const cloudinary = require("../config/cloudinary");
const Product = require("../models/productModel");

// =====================================================
// Helpers
// =====================================================

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const parsePositiveNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number) && number >= 0 ? number : null;
};

const parsePositiveInteger = (value) => {
  const number = Number(value);

  return Number.isInteger(number) && number >= 0 ? number : null;
};

// =====================================================
// Create Product
// =====================================================

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
    } = req.body;

    // -------------------------------------------------
    // Required Fields
    // -------------------------------------------------

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    if (!description?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product description is required",
      });
    }

    if (!category?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product category is required",
      });
    }

    if (!location?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product location is required",
      });
    }

    // -------------------------------------------------
    // Validate Price
    // -------------------------------------------------

    const parsedPrice = parsePositiveNumber(price);

    if (parsedPrice === null) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid non-negative number",
      });
    }

    // -------------------------------------------------
    // Validate Quantity
    // -------------------------------------------------

    const parsedQuantity = parsePositiveInteger(quantity);

    if (parsedQuantity === null) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a valid non-negative integer",
      });
    }

    // -------------------------------------------------
    // Validate Images
    // -------------------------------------------------

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required",
      });
    }

    // -------------------------------------------------
    // Cloudinary files
    //
    // multer-storage-cloudinary provides:
    //
    // file.path     -> Cloudinary image URL
    // file.filename -> Cloudinary public ID
    // -------------------------------------------------

    const images = req.files.map((file) => ({
      url: file.path,
      public_id: file.filename,
    }));

    // -------------------------------------------------
    // Create Product
    // -------------------------------------------------

    const product = await Product.create({
      farmer: req.user._id,

      name: name.trim(),

      description: description.trim(),

      category: category.trim(),

      price: parsedPrice,

      quantity: parsedQuantity,

      unit: unit?.trim() || "kg",

      location: location.trim(),

      freshness: freshness?.trim() || "Fresh",

      images,

      isAvailable: parsedQuantity > 0,
    });

    // -------------------------------------------------
    // Response
    // -------------------------------------------------

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    // -------------------------------------------------
    // Cleanup uploaded Cloudinary images if DB creation
    // fails after the upload has already completed.
    // -------------------------------------------------

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          if (file.filename) {
            await cloudinary.uploader.destroy(file.filename);
          }
        } catch (cleanupError) {
          console.error("Cloudinary cleanup failed:", cleanupError.message);
        }
      }
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Get All Products
// =====================================================

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

    // -------------------------------------------------
    // Search
    // -------------------------------------------------

    if (search?.trim()) {
      query.name = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    // -------------------------------------------------
    // Category
    // -------------------------------------------------

    if (category?.trim()) {
      query.category = category.trim();
    }

    // -------------------------------------------------
    // Location
    // -------------------------------------------------

    if (location?.trim()) {
      query.location = location.trim();
    }

    // -------------------------------------------------
    // Price Filter
    // -------------------------------------------------

    const parsedMinPrice =
      minPrice !== undefined && minPrice !== "" ? Number(minPrice) : null;

    const parsedMaxPrice =
      maxPrice !== undefined && maxPrice !== "" ? Number(maxPrice) : null;

    if (
      parsedMinPrice !== null &&
      Number.isFinite(parsedMinPrice) &&
      parsedMinPrice >= 0
    ) {
      query.price = {
        ...(query.price || {}),
        $gte: parsedMinPrice,
      };
    }

    if (
      parsedMaxPrice !== null &&
      Number.isFinite(parsedMaxPrice) &&
      parsedMaxPrice >= 0
    ) {
      query.price = {
        ...(query.price || {}),
        $lte: parsedMaxPrice,
      };
    }

    // -------------------------------------------------
    // Only available products
    // -------------------------------------------------

    query.isAvailable = true;

    // -------------------------------------------------
    // Sorting
    // -------------------------------------------------

    let sortOption = {
      createdAt: -1,
    };

    if (sort === "oldest") {
      sortOption = {
        createdAt: 1,
      };
    }

    if (sort === "priceLow") {
      sortOption = {
        price: 1,
      };
    }

    if (sort === "priceHigh") {
      sortOption = {
        price: -1,
      };
    }

    // -------------------------------------------------
    // Pagination
    // -------------------------------------------------

    const parsedPage = Number(page);
    const parsedLimit = Number(limit);

    const currentPage =
      Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

    const pageSize =
      Number.isInteger(parsedLimit) && parsedLimit > 0 && parsedLimit <= 50
        ? parsedLimit
        : 10;

    const skip = (currentPage - 1) * pageSize;

    // -------------------------------------------------
    // Count
    // -------------------------------------------------

    const totalProducts = await Product.countDocuments(query);

    const totalPages = Math.ceil(totalProducts / pageSize);

    // -------------------------------------------------
    // Products
    // -------------------------------------------------

    const products = await Product.find(query)
      .populate("farmer", "name email")
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize);

    // -------------------------------------------------
    // Response
    // -------------------------------------------------

    return res.status(200).json({
      success: true,

      currentPage,

      totalPages,

      totalProducts,

      count: products.length,

      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Get Product By ID
// =====================================================

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // -------------------------------------------------
    // Validate ID
    // -------------------------------------------------

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID",
      });
    }

    // -------------------------------------------------
    // Find Product
    // -------------------------------------------------

    const product = await Product.findById(id).populate(
      "farmer",
      "name email role",
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // -------------------------------------------------
    // Response
    // -------------------------------------------------

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Update Product
// =====================================================

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // -------------------------------------------------
    // Validate ID
    // -------------------------------------------------

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID",
      });
    }

    // -------------------------------------------------
    // Find Product
    // -------------------------------------------------

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // -------------------------------------------------
    // Ownership
    // -------------------------------------------------

    if (product.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own products",
      });
    }

    // -------------------------------------------------
    // Build Allowed Update
    // -------------------------------------------------

    const updateData = {};

    if (req.body.name !== undefined) {
      const name = req.body.name.trim();

      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Product name cannot be empty",
        });
      }

      updateData.name = name;
    }

    if (req.body.description !== undefined) {
      const description = req.body.description.trim();

      if (!description) {
        return res.status(400).json({
          success: false,
          message: "Product description cannot be empty",
        });
      }

      updateData.description = description;
    }

    if (req.body.category !== undefined) {
      const category = req.body.category.trim();

      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Product category cannot be empty",
        });
      }

      updateData.category = category;
    }

    if (req.body.price !== undefined) {
      const price = parsePositiveNumber(req.body.price);

      if (price === null) {
        return res.status(400).json({
          success: false,
          message: "Price must be a valid non-negative number",
        });
      }

      updateData.price = price;
    }

    if (req.body.quantity !== undefined) {
      const quantity = parsePositiveInteger(req.body.quantity);

      if (quantity === null) {
        return res.status(400).json({
          success: false,
          message: "Quantity must be a valid non-negative integer",
        });
      }

      updateData.quantity = quantity;

      // =================================================
      // Automatically synchronize availability
      // =================================================

      updateData.isAvailable = quantity > 0;

      // =================================================
      // Reset Low Stock Alert After Restocking
      // =================================================
      //
      // Example:
      //
      // 0 → 20
      // Reset alert state.
      //
      // 20 → 5
      // Reset alert state so the next purchase can
      // generate a new low-stock notification.
      //
      // 4 → 3
      // Keep existing alert state.
      // =================================================

      if (quantity === 0) {
        updateData.lowStockNotified = false;
      } else if (quantity > product.lowStockThreshold) {
        updateData.lowStockNotified = false;
      }
    }

    if (req.body.unit !== undefined) {
      const unit = req.body.unit.trim();

      if (!unit) {
        return res.status(400).json({
          success: false,
          message: "Unit cannot be empty",
        });
      }

      updateData.unit = unit;
    }

    if (req.body.location !== undefined) {
      const location = req.body.location.trim();

      if (!location) {
        return res.status(400).json({
          success: false,
          message: "Location cannot be empty",
        });
      }

      updateData.location = location;
    }

    if (req.body.freshness !== undefined) {
      const freshness = req.body.freshness.trim();

      if (!freshness) {
        return res.status(400).json({
          success: false,
          message: "Freshness cannot be empty",
        });
      }

      updateData.freshness = freshness;
    }

    // -------------------------------------------------
    // Update Product
    // -------------------------------------------------

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    // -------------------------------------------------
    // Response
    // -------------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Delete Product
// =====================================================

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // -------------------------------------------------
    // Validate ID
    // -------------------------------------------------

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID",
      });
    }

    // -------------------------------------------------
    // Find Product
    // -------------------------------------------------

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // -------------------------------------------------
    // Ownership
    // -------------------------------------------------

    if (product.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own products",
      });
    }

    // -------------------------------------------------
    // Delete Cloudinary Images
    // -------------------------------------------------

    if (Array.isArray(product.images) && product.images.length > 0) {
      for (const image of product.images) {
        if (!image.public_id) {
          continue;
        }

        try {
          await cloudinary.uploader.destroy(image.public_id);
        } catch (cloudinaryError) {
          console.error(
            "Cloudinary image deletion failed:",
            cloudinaryError.message,
          );
        }
      }
    }

    // -------------------------------------------------
    // Delete Product
    // -------------------------------------------------

    await product.deleteOne();

    // -------------------------------------------------
    // Response
    // -------------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Product and images deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Get Farmer Products
// =====================================================

const getFarmerProducts = async (req, res) => {
  try {
    const products = await Product.find({
      farmer: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Admin - Get All Products
// =====================================================

const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("farmer", "name email role")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Admin - Update Product Availability
// =====================================================

const updateProductStatusAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { isAvailable } = req.body;

    // -------------------------------------------------
    // Validate Product ID
    // -------------------------------------------------

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID",
      });
    }

    // -------------------------------------------------
    // Validate Status
    // -------------------------------------------------

    if (typeof isAvailable !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isAvailable must be a boolean",
      });
    }

    // -------------------------------------------------
    // Find Product
    // -------------------------------------------------

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // -------------------------------------------------
    // Update Availability
    // -------------------------------------------------

    product.isAvailable = isAvailable;

    await product.save();

    // -------------------------------------------------
    // Return Updated Product
    // -------------------------------------------------

    const updatedProduct = await Product.findById(id).populate(
      "farmer",
      "name email role",
    );

    return res.status(200).json({
      success: true,

      message: isAvailable
        ? "Product activated successfully"
        : "Product deactivated successfully",

      product: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Restock Farmer Product
// =====================================================

const restockProduct = async (req, res) => {
  try {
    const farmerId = req.user._id;
    const { id } = req.params;
    const { quantity } = req.body;

    // =================================================
    // Validate Product ID
    // =================================================

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // =================================================
    // Validate Restock Quantity
    // =================================================

    const restockQuantity = Number(quantity);

    if (!Number.isInteger(restockQuantity) || restockQuantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Restock quantity must be a positive whole number",
      });
    }

    // =================================================
    // Find Farmer Product
    // =================================================

    const product = await Product.findOne({
      _id: id,
      farmer: farmerId,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // =================================================
    // Increase Stock
    // =================================================

    product.quantity += restockQuantity;

    // =================================================
    // Restore Availability
    // =================================================

    product.isAvailable = true;

    // =================================================
    // Allow Future Low-Stock Notifications
    // =================================================

    product.lowStockNotified = false;

    await product.save();

    // =================================================
    // Response
    // =================================================

    res.status(200).json({
      success: true,
      message: `${product.name} restocked successfully`,
      product,
    });
  } catch (error) {
    console.error("Restock product error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to restock product",
    });
  }
};
// =====================================================
// Export
// =====================================================

module.exports = {
  createProduct,
  getProducts,
  getFarmerProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllProductsAdmin,
  updateProductStatusAdmin,
  restockProduct
};
