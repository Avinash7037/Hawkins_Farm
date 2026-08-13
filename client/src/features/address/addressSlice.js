import { createSlice } from "@reduxjs/toolkit";

import {
  fetchAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "./addressThunks";

// =====================================================
// Initial State
// =====================================================

const initialState = {
  addresses: [],

  loading: false,

  adding: false,

  updating: false,

  deleting: false,

  settingDefault: false,

  error: null,

  addError: null,

  updateError: null,

  deleteError: null,

  defaultError: null,
};

// =====================================================
// Address Slice
// =====================================================

const addressSlice = createSlice({
  name: "addresses",

  initialState,

  reducers: {
    // =================================================
    // Clear Errors
    // =================================================

    clearAddressErrors: (state) => {
      state.error = null;

      state.addError = null;

      state.updateError = null;

      state.deleteError = null;

      state.defaultError = null;
    },

    // =================================================
    // Clear Addresses
    // =================================================

    clearAddresses: (state) => {
      state.addresses = [];

      state.error = null;

      state.addError = null;

      state.updateError = null;

      state.deleteError = null;

      state.defaultError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =================================================
      // Fetch Addresses
      // =================================================

      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;

        state.error = null;
      })

      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;

        state.addresses = action.payload?.addresses || [];

        state.error = null;
      })

      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || "Failed to fetch addresses";
      })

      // =================================================
      // Add Address
      // =================================================

      .addCase(addAddress.pending, (state) => {
        state.adding = true;

        state.addError = null;
      })

      .addCase(addAddress.fulfilled, (state, action) => {
        state.adding = false;

        const newAddress = action.payload?.address;

        if (newAddress) {
          // -------------------------------------------------
          // If New Address Is Default
          // Remove Default From Existing Addresses
          // -------------------------------------------------

          if (newAddress.isDefault) {
            state.addresses = state.addresses.map((address) => ({
              ...address,
              isDefault: false,
            }));
          }

          state.addresses.unshift(newAddress);
        }

        state.addError = null;
      })

      .addCase(addAddress.rejected, (state, action) => {
        state.adding = false;

        state.addError = action.payload || "Failed to add address";
      })

      // =================================================
      // Update Address
      // =================================================

      .addCase(updateAddress.pending, (state) => {
        state.updating = true;

        state.updateError = null;
      })

      .addCase(updateAddress.fulfilled, (state, action) => {
        state.updating = false;

        const updatedAddress = action.payload?.address;

        if (!updatedAddress) {
          return;
        }

        // -------------------------------------------------
        // If Updated Address Is Default
        // Remove Default From Others
        // -------------------------------------------------

        if (updatedAddress.isDefault) {
          state.addresses = state.addresses.map((address) => ({
            ...address,
            isDefault: address._id === updatedAddress._id,
          }));
        }

        const index = state.addresses.findIndex(
          (address) => address._id === updatedAddress._id,
        );

        if (index !== -1) {
          state.addresses[index] = updatedAddress;
        }

        state.updateError = null;
      })

      .addCase(updateAddress.rejected, (state, action) => {
        state.updating = false;

        state.updateError = action.payload || "Failed to update address";
      })

      // =================================================
      // Delete Address
      // =================================================

      .addCase(deleteAddress.pending, (state) => {
        state.deleting = true;

        state.deleteError = null;
      })

      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.deleting = false;

        const deletedId = action.meta.arg;

        state.addresses = state.addresses.filter(
          (address) => address._id !== deletedId,
        );

        // -------------------------------------------------
        // Backend Automatically Promotes Another Address
        // To Default If Necessary.
        //
        // Refreshing here guarantees Redux matches MongoDB.
        // -------------------------------------------------

        state.deleteError = null;
      })

      .addCase(deleteAddress.rejected, (state, action) => {
        state.deleting = false;

        state.deleteError = action.payload || "Failed to delete address";
      })

      // =================================================
      // Set Default Address
      // =================================================

      .addCase(setDefaultAddress.pending, (state) => {
        state.settingDefault = true;

        state.defaultError = null;
      })

      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.settingDefault = false;

        const updatedAddress = action.payload?.address;

        if (!updatedAddress) {
          return;
        }

        state.addresses = state.addresses.map((address) => ({
          ...address,

          isDefault: address._id === updatedAddress._id,
        }));

        state.defaultError = null;
      })

      .addCase(setDefaultAddress.rejected, (state, action) => {
        state.settingDefault = false;

        state.defaultError = action.payload || "Failed to set default address";
      });
  },
});

// =====================================================
// Actions
// =====================================================

export const { clearAddressErrors, clearAddresses } = addressSlice.actions;

// =====================================================
// Reducer
// =====================================================

export default addressSlice.reducer;
