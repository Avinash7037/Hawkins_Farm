const Address = require("../models/addressModel");

// =====================================================
// Get User Addresses
// =====================================================

const getUserAddresses = async (userId) => {
  return Address.find({
    user: userId,
  }).sort({
    isDefault: -1,
    createdAt: -1,
  });
};

// =====================================================
// Clear Existing Default Address
// =====================================================

const clearDefaultAddress = async (userId) => {
  await Address.updateMany(
    {
      user: userId,
      isDefault: true,
    },
    {
      $set: {
        isDefault: false,
      },
    },
  );
};

// =====================================================
// Create Address
// =====================================================

const createAddress = async (userId, addressData) => {
  const existingAddressCount = await Address.countDocuments({
    user: userId,
  });

  const shouldBeDefault =
    addressData.isDefault === true || existingAddressCount === 0;

  if (shouldBeDefault) {
    await clearDefaultAddress(userId);
  }

  return Address.create({
    user: userId,
    fullName: addressData.fullName,
    phone: addressData.phone,
    addressLine1: addressData.addressLine1,
    addressLine2: addressData.addressLine2 || "",
    city: addressData.city,
    state: addressData.state,
    postalCode: addressData.postalCode,
    isDefault: shouldBeDefault,
  });
};

// =====================================================
// Update Address
// =====================================================

const updateAddress = async (addressId, userId, addressData) => {
  const address = await Address.findOne({
    _id: addressId,
    user: userId,
  });

  if (!address) {
    throw new Error("Address not found");
  }

  const wantsDefault = addressData.isDefault === true;

  if (wantsDefault) {
    await clearDefaultAddress(userId);
  }

  address.fullName = addressData.fullName;
  address.phone = addressData.phone;
  address.addressLine1 = addressData.addressLine1;
  address.addressLine2 = addressData.addressLine2 || "";
  address.city = addressData.city;
  address.state = addressData.state;
  address.postalCode = addressData.postalCode;

  if (wantsDefault) {
    address.isDefault = true;
  }

  return address.save();
};

// =====================================================
// Delete Address
// =====================================================

const deleteAddress = async (addressId, userId) => {
  const address = await Address.findOne({
    _id: addressId,
    user: userId,
  });

  if (!address) {
    throw new Error("Address not found");
  }

  const wasDefault = address.isDefault;

  await address.deleteOne();

  // ---------------------------------------------------
  // If Default Was Deleted
  // ---------------------------------------------------

  if (wasDefault) {
    const nextAddress = await Address.findOne({
      user: userId,
    }).sort({
      createdAt: -1,
    });

    if (nextAddress) {
      nextAddress.isDefault = true;

      await nextAddress.save();
    }
  }

  return true;
};

// =====================================================
// Set Default Address
// =====================================================

const setDefaultAddress = async (addressId, userId) => {
  const address = await Address.findOne({
    _id: addressId,
    user: userId,
  });

  if (!address) {
    throw new Error("Address not found");
  }

  await clearDefaultAddress(userId);

  address.isDefault = true;

  return address.save();
};

module.exports = {
  getUserAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
