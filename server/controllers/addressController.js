const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const Address = require("../models/addressModel");

// =====================================================
// Get My Addresses
// =====================================================

const getMyAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({
    user: req.user._id,
  }).sort({
    isDefault: -1,
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    count: addresses.length,
    addresses,
  });
});

// =====================================================
// Add Address
// =====================================================

const addAddress = asyncHandler(async (req, res) => {
  const {
    fullName,
    phone,
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    isDefault,
  } = req.body;

  // ===================================================
  // Validate Required Fields
  // ===================================================

  if (
    !fullName?.trim() ||
    !phone?.trim() ||
    !addressLine1?.trim() ||
    !city?.trim() ||
    !state?.trim() ||
    !postalCode?.trim()
  ) {
    res.status(400);

    throw new Error(
      "Full name, phone, address, city, state and postal code are required",
    );
  }

  // ===================================================
  // Count Existing Addresses
  // ===================================================

  const addressCount = await Address.countDocuments({
    user: req.user._id,
  });

  // ===================================================
  // First Address Is Always Default
  // ===================================================

  const shouldBeDefault = addressCount === 0 || isDefault === true;

  // ===================================================
  // Remove Existing Default
  // ===================================================

  if (shouldBeDefault) {
    await Address.updateMany(
      {
        user: req.user._id,
        isDefault: true,
      },
      {
        $set: {
          isDefault: false,
        },
      },
    );
  }

  // ===================================================
  // Create Address
  // ===================================================

  const address = await Address.create({
    user: req.user._id,

    fullName: fullName.trim(),

    phone: phone.trim(),

    addressLine1: addressLine1.trim(),

    addressLine2: addressLine2?.trim() || "",

    city: city.trim(),

    state: state.trim(),

    postalCode: postalCode.trim(),

    isDefault: shouldBeDefault,
  });

  // ===================================================
  // Response
  // ===================================================

  res.status(201).json({
    success: true,
    message: "Address added successfully",
    address,
  });
});

// =====================================================
// Update Address
// =====================================================

const updateAddress = asyncHandler(async (req, res) => {
  // ===================================================
  // Validate ID
  // ===================================================

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);

    throw new Error("Invalid address ID");
  }

  // ===================================================
  // Find Address Owned By Current User
  // ===================================================

  const address = await Address.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!address) {
    res.status(404);

    throw new Error("Address not found");
  }

  // ===================================================
  // Request Data
  // ===================================================

  const {
    fullName,
    phone,
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    isDefault,
  } = req.body;

  // ===================================================
  // Validate Required Fields
  // ===================================================

  if (
    !fullName?.trim() ||
    !phone?.trim() ||
    !addressLine1?.trim() ||
    !city?.trim() ||
    !state?.trim() ||
    !postalCode?.trim()
  ) {
    res.status(400);

    throw new Error(
      "Full name, phone, address, city, state and postal code are required",
    );
  }

  // ===================================================
  // Remember Current Default Status
  // ===================================================

  const wasDefault = address.isDefault;

  // ===================================================
  // Set As Default
  // ===================================================

  if (isDefault === true) {
    await Address.updateMany(
      {
        user: req.user._id,
        _id: { $ne: address._id },
        isDefault: true,
      },
      {
        $set: {
          isDefault: false,
        },
      },
    );

    address.isDefault = true;
  }

  // ===================================================
  // Preserve Existing Default
  // ===================================================

  if (isDefault !== true && wasDefault) {
    address.isDefault = true;
  }

  // ===================================================
  // Update Fields
  // ===================================================

  address.fullName = fullName.trim();

  address.phone = phone.trim();

  address.addressLine1 = addressLine1.trim();

  address.addressLine2 = addressLine2?.trim() || "";

  address.city = city.trim();

  address.state = state.trim();

  address.postalCode = postalCode.trim();

  // ===================================================
  // Save
  // ===================================================

  await address.save();

  // ===================================================
  // Response
  // ===================================================

  res.status(200).json({
    success: true,
    message: "Address updated successfully",
    address,
  });
});

// =====================================================
// Delete Address
// =====================================================

const deleteAddress = asyncHandler(async (req, res) => {
  // ===================================================
  // Validate ID
  // ===================================================

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);

    throw new Error("Invalid address ID");
  }

  // ===================================================
  // Find Address
  // ===================================================

  const address = await Address.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!address) {
    res.status(404);

    throw new Error("Address not found");
  }

  // ===================================================
  // Remember Default Status
  // ===================================================

  const wasDefault = address.isDefault;

  // ===================================================
  // Delete
  // ===================================================

  await address.deleteOne();

  // ===================================================
  // If Default Was Deleted
  // Select Another Address
  // ===================================================

  if (wasDefault) {
    const nextAddress = await Address.findOne({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    if (nextAddress) {
      nextAddress.isDefault = true;

      await nextAddress.save();
    }
  }

  // ===================================================
  // Response
  // ===================================================

  res.status(200).json({
    success: true,
    message: "Address deleted successfully",
  });
});

// =====================================================
// Set Default Address
// =====================================================

const setDefaultAddress = asyncHandler(async (req, res) => {
  // ===================================================
  // Validate ID
  // ===================================================

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);

    throw new Error("Invalid address ID");
  }

  // ===================================================
  // Find Address
  // ===================================================

  const address = await Address.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!address) {
    res.status(404);

    throw new Error("Address not found");
  }

  // ===================================================
  // Remove Existing Default
  // ===================================================

  await Address.updateMany(
    {
      user: req.user._id,
      _id: { $ne: address._id },
      isDefault: true,
    },
    {
      $set: {
        isDefault: false,
      },
    },
  );

  // ===================================================
  // Set Selected Address As Default
  // ===================================================

  address.isDefault = true;

  await address.save();

  // ===================================================
  // Response
  // ===================================================

  res.status(200).json({
    success: true,
    message: "Default address updated successfully",
    address,
  });
});

// =====================================================
// Exports
// =====================================================

module.exports = {
  getMyAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
