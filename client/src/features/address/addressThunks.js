import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  getMyAddresses,
  addAddress as addAddressRequest,
  updateAddress as updateAddressRequest,
  deleteAddress as deleteAddressRequest,
  setDefaultAddress as setDefaultAddressRequest,
} from "./services/addressService";

// =====================================================
// Fetch Addresses
// =====================================================

export const fetchAddresses = createAsyncThunk(
  "addresses/fetchAddresses",

  async (_, thunkAPI) => {
    try {
      return await getMyAddresses();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch addresses",
      );
    }
  },
);

// =====================================================
// Add Address
// =====================================================

export const addAddress = createAsyncThunk(
  "addresses/addAddress",

  async (addressData, thunkAPI) => {
    try {
      return await addAddressRequest(addressData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add address",
      );
    }
  },
);

// =====================================================
// Update Address
// =====================================================

export const updateAddress = createAsyncThunk(
  "addresses/updateAddress",

  async ({ id, addressData }, thunkAPI) => {
    try {
      return await updateAddressRequest(id, addressData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update address",
      );
    }
  },
);

// =====================================================
// Delete Address
// =====================================================

export const deleteAddress = createAsyncThunk(
  "addresses/deleteAddress",

  async (id, thunkAPI) => {
    try {
      return await deleteAddressRequest(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete address",
      );
    }
  },
);

// =====================================================
// Set Default Address
// =====================================================

export const setDefaultAddress = createAsyncThunk(
  "addresses/setDefaultAddress",

  async (id, thunkAPI) => {
    try {
      return await setDefaultAddressRequest(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to set default address",
      );
    }
  },
);
