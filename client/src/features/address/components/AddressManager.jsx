import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Star,
  X,
  CheckCircle,
} from "lucide-react";

import {
  fetchAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../addressThunks";

// =====================================================
// Empty Form
// =====================================================

const emptyForm = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  isDefault: false,
};

// =====================================================
// Address Manager
// =====================================================

function AddressManager() {
  const dispatch = useDispatch();

  const {
    addresses,
    loading,
    adding,
    updating,
    deleting,
    settingDefault,
    error,
    addError,
    updateError,
    deleteError,
    defaultError,
  } = useSelector((state) => state.addresses);

  // =====================================================
  // Local State
  // =====================================================

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [formError, setFormError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  // =====================================================
  // Fetch Addresses
  // =====================================================

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  // =====================================================
  // Clear Messages
  // =====================================================

  const clearMessages = () => {
    setFormError("");

    setSuccessMessage("");
  };

  // =====================================================
  // Open Add Form
  // =====================================================

  const handleAddClick = () => {
    clearMessages();

    setEditingId(null);

    setForm(emptyForm);

    setShowForm(true);
  };

  // =====================================================
  // Open Edit Form
  // =====================================================

  const handleEditClick = (address) => {
    clearMessages();

    setEditingId(address._id);

    setForm({
      fullName: address.fullName || "",
      phone: address.phone || "",
      addressLine1: address.addressLine1 || "",
      addressLine2: address.addressLine2 || "",
      city: address.city || "",
      state: address.state || "",
      postalCode: address.postalCode || "",
      isDefault: Boolean(address.isDefault),
    });

    setShowForm(true);
  };

  // =====================================================
  // Close Form
  // =====================================================

  const handleCloseForm = () => {
    setShowForm(false);

    setEditingId(null);

    setForm(emptyForm);

    setFormError("");
  };

  // =====================================================
  // Input Change
  // =====================================================

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,

      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =====================================================
  // Validate Form
  // =====================================================

  const validateForm = () => {
    if (!form.fullName.trim()) {
      return "Full name is required.";
    }

    if (!form.phone.trim()) {
      return "Phone number is required.";
    }

    if (!form.addressLine1.trim()) {
      return "Address is required.";
    }

    if (!form.city.trim()) {
      return "City is required.";
    }

    if (!form.state.trim()) {
      return "State is required.";
    }

    if (!form.postalCode.trim()) {
      return "Postal code is required.";
    }

    if (form.fullName.trim().length < 2) {
      return "Full name must contain at least 2 characters.";
    }

    if (form.phone.trim().length < 7) {
      return "Please enter a valid phone number.";
    }

    if (form.postalCode.trim().length < 4) {
      return "Please enter a valid postal code.";
    }

    return "";
  };

  // =====================================================
  // Submit Address
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    clearMessages();

    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);

      return;
    }

    const addressData = {
      fullName: form.fullName.trim(),

      phone: form.phone.trim(),

      addressLine1: form.addressLine1.trim(),

      addressLine2: form.addressLine2.trim(),

      city: form.city.trim(),

      state: form.state.trim(),

      postalCode: form.postalCode.trim(),

      isDefault: form.isDefault,
    };

    try {
      if (editingId) {
        const result = await dispatch(
          updateAddress({
            id: editingId,
            addressData,
          }),
        ).unwrap();

        setSuccessMessage(result?.message || "Address updated successfully.");
      } else {
        const result = await dispatch(addAddress(addressData)).unwrap();

        setSuccessMessage(result?.message || "Address added successfully.");
      }

      handleCloseForm();
    } catch (errorMessage) {
      setFormError(
        errorMessage ||
          (editingId ? "Failed to update address." : "Failed to add address."),
      );
    }
  };

  // =====================================================
  // Delete Address
  // =====================================================

  const handleDelete = async (address) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the address for ${address.fullName}?`,
    );

    if (!confirmed) {
      return;
    }

    clearMessages();

    try {
      const result = await dispatch(deleteAddress(address._id)).unwrap();

      setSuccessMessage(result?.message || "Address deleted successfully.");
    } catch (errorMessage) {
      setSuccessMessage("");

      setFormError(errorMessage || "Failed to delete address.");
    }
  };

  // =====================================================
  // Set Default Address
  // =====================================================

  const handleSetDefault = async (address) => {
    if (address.isDefault) {
      return;
    }

    clearMessages();

    try {
      const result = await dispatch(setDefaultAddress(address._id)).unwrap();

      setSuccessMessage(
        result?.message || "Default address updated successfully.",
      );
    } catch (errorMessage) {
      setFormError(errorMessage || "Failed to set default address.");
    }
  };

  // =====================================================
  // Loading
  // =====================================================

  if (loading) {
    return (
      <div className="mt-8 rounded-2xl border border-gray-700 bg-gray-900 p-7 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-900/60">
            <MapPin size={24} className="text-emerald-400" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-100">My Addresses</h2>

            <p className="mt-1 text-gray-400">
              Loading your saved addresses...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // Render
  // =====================================================

  return (
    <div className="mt-8 rounded-2xl border border-gray-700 bg-gray-900 p-7 shadow-sm">
      {/* =================================================
          Header
      ================================================= */}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-900/60">
            <MapPin size={24} className="text-emerald-400" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-100">My Addresses</h2>

            <p className="mt-1 text-gray-400">
              Manage your saved delivery addresses.
            </p>
          </div>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={handleAddClick}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            <Plus size={18} />
            Add Address
          </button>
        )}
      </div>

      {/* =================================================
          Errors
      ================================================= */}

      {(error ||
        addError ||
        updateError ||
        deleteError ||
        defaultError ||
        formError) && (
        <div className="mt-6 rounded-xl border border-red-800 bg-red-950/40 p-4 text-sm text-red-300">
          {formError ||
            addError ||
            updateError ||
            deleteError ||
            defaultError ||
            error}
        </div>
      )}

      {/* =================================================
          Success
      ================================================= */}

      {successMessage && (
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-800 bg-emerald-950/40 p-4 text-sm text-emerald-300">
          <CheckCircle size={18} />

          {successMessage}
        </div>
      )}

      {/* =================================================
          Address Form
      ================================================= */}

      {showForm && (
        <div className="mt-7 rounded-2xl border border-gray-700 bg-gray-950/40 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-100">
                {editingId ? "Edit Address" : "Add Address"}
              </h3>

              <p className="mt-1 text-sm text-gray-400">
                Enter your delivery information.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCloseForm}
              className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-gray-200"
              aria-label="Close address form"
            >
              <X size={22} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              {/* Full Name */}

              <div>
                <label
                  htmlFor="address-fullName"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Full Name
                </label>

                <input
                  id="address-fullName"
                  name="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className="w-full rounded-xl border border-gray-600 bg-gray-900 px-4 py-3 text-gray-100 outline-none transition placeholder:text-gray-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Phone */}

              <div>
                <label
                  htmlFor="address-phone"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Phone Number
                </label>

                <input
                  id="address-phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full rounded-xl border border-gray-600 bg-gray-900 px-4 py-3 text-gray-100 outline-none transition placeholder:text-gray-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Address Line 1 */}

              <div className="md:col-span-2">
                <label
                  htmlFor="address-line1"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Address Line 1
                </label>

                <input
                  id="address-line1"
                  name="addressLine1"
                  type="text"
                  value={form.addressLine1}
                  onChange={handleChange}
                  placeholder="House number, street, area"
                  className="w-full rounded-xl border border-gray-600 bg-gray-900 px-4 py-3 text-gray-100 outline-none transition placeholder:text-gray-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Address Line 2 */}

              <div className="md:col-span-2">
                <label
                  htmlFor="address-line2"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Address Line 2{" "}
                  <span className="text-gray-500">(Optional)</span>
                </label>

                <input
                  id="address-line2"
                  name="addressLine2"
                  type="text"
                  value={form.addressLine2}
                  onChange={handleChange}
                  placeholder="Landmark, apartment, etc."
                  className="w-full rounded-xl border border-gray-600 bg-gray-900 px-4 py-3 text-gray-100 outline-none transition placeholder:text-gray-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* City */}

              <div>
                <label
                  htmlFor="address-city"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  City
                </label>

                <input
                  id="address-city"
                  name="city"
                  type="text"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  className="w-full rounded-xl border border-gray-600 bg-gray-900 px-4 py-3 text-gray-100 outline-none transition placeholder:text-gray-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* State */}

              <div>
                <label
                  htmlFor="address-state"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  State
                </label>

                <input
                  id="address-state"
                  name="state"
                  type="text"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                  className="w-full rounded-xl border border-gray-600 bg-gray-900 px-4 py-3 text-gray-100 outline-none transition placeholder:text-gray-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Postal Code */}

              <div>
                <label
                  htmlFor="address-postalCode"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Postal Code
                </label>

                <input
                  id="address-postalCode"
                  name="postalCode"
                  type="text"
                  value={form.postalCode}
                  onChange={handleChange}
                  placeholder="Enter postal code"
                  className="w-full rounded-xl border border-gray-600 bg-gray-900 px-4 py-3 text-gray-100 outline-none transition placeholder:text-gray-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Default */}

              <div className="flex items-end">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-700 bg-gray-900 px-4 py-3">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={form.isDefault}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-emerald-600 focus:ring-emerald-500"
                  />

                  <span className="text-sm font-medium text-gray-300">
                    Set as default address
                  </span>
                </label>
              </div>
            </div>

            {/* Form Buttons */}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCloseForm}
                disabled={adding || updating}
                className="rounded-xl border border-gray-600 px-5 py-3 font-semibold text-gray-300 transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={adding || updating}
                className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {adding
                  ? "Adding..."
                  : updating
                    ? "Updating..."
                    : editingId
                      ? "Update Address"
                      : "Save Address"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =================================================
          Empty State
      ================================================= */}

      {!showForm && addresses.length === 0 && (
        <div className="mt-7 rounded-2xl border border-dashed border-gray-700 bg-gray-950/30 p-10 text-center">
          <MapPin size={42} className="mx-auto mb-4 text-gray-600" />

          <h3 className="text-lg font-semibold text-gray-200">
            No saved addresses
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Add a delivery address to make checkout faster.
          </p>

          <button
            type="button"
            onClick={handleAddClick}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            <Plus size={18} />
            Add Your First Address
          </button>
        </div>
      )}

      {/* =================================================
          Address List
      ================================================= */}

      {!showForm && addresses.length > 0 && (
        <div className="mt-7 grid gap-5">
          {addresses.map((address) => (
            <div
              key={address._id}
              className={`rounded-2xl border p-5 transition ${
                address.isDefault
                  ? "border-emerald-700 bg-emerald-950/20"
                  : "border-gray-700 bg-gray-950/30"
              }`}
            >
              {/* -------------------------------------------------
                  Address Header
              ------------------------------------------------- */}

              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-800">
                    <MapPin
                      size={19}
                      className={
                        address.isDefault ? "text-emerald-400" : "text-gray-400"
                      }
                    />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-gray-100">
                        {address.fullName}
                      </h3>

                      {address.isDefault && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950 px-3 py-1 text-xs font-semibold text-emerald-400">
                          <Star size={12} />
                          Default
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm text-gray-400">
                      {address.phone}
                    </p>
                  </div>
                </div>

                {/* -------------------------------------------------
                    Actions
                ------------------------------------------------- */}

                <div className="flex items-center gap-2">
                  {!address.isDefault && (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(address)}
                      disabled={settingDefault}
                      className="inline-flex items-center gap-1 rounded-lg border border-emerald-700 px-3 py-2 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-950 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Star size={14} />

                      {settingDefault ? "Updating..." : "Set Default"}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleEditClick(address)}
                    className="rounded-lg border border-gray-600 p-2 text-gray-400 transition hover:border-emerald-600 hover:text-emerald-400"
                    aria-label="Edit address"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(address)}
                    disabled={deleting}
                    className="rounded-lg border border-gray-700 p-2 text-gray-400 transition hover:border-red-700 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Delete address"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* -------------------------------------------------
                  Address Details
              ------------------------------------------------- */}

              <div className="mt-4 ml-0 rounded-xl bg-gray-900 p-4 text-sm leading-6 text-gray-400 sm:ml-[52px]">
                <p>{address.addressLine1}</p>

                {address.addressLine2 && <p>{address.addressLine2}</p>}

                <p>
                  {address.city}, {address.state} {address.postalCode}
                </p>
              </div>

              {/* -------------------------------------------------
                  Default Hint
              ------------------------------------------------- */}

              {!address.isDefault && (
                <div className="mt-4 ml-0 sm:ml-[52px]">
                  <button
                    type="button"
                    onClick={() => handleSetDefault(address)}
                    disabled={settingDefault}
                    className="text-sm font-medium text-emerald-500 transition hover:text-emerald-400 disabled:opacity-50"
                  >
                    Use this as my default delivery address
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AddressManager;
