import { MapPin, Plus, Check } from "lucide-react";

// =====================================================
// Delivery Form
// =====================================================

function DeliveryForm({
  addresses = [],
  selectedAddress,
  onSelectAddress,
  onAddAddress,
  loading = false,
  error = null,
}) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      {/* =================================================
          Header
      ================================================= */}

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Delivery Address</h2>

          <p className="mt-1 text-sm text-gray-500">
            Select an address for this order.
          </p>
        </div>

        <MapPin size={24} className="text-emerald-600" />
      </div>

      {/* =================================================
          Loading
      ================================================= */}

      {loading && (
        <div className="rounded-xl bg-gray-50 p-5 text-center">
          <p className="text-sm text-gray-500">Loading saved addresses...</p>
        </div>
      )}

      {/* =================================================
          Error
      ================================================= */}

      {!loading && error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* =================================================
          Saved Addresses
      ================================================= */}

      {!loading && addresses.length > 0 && (
        <div className="space-y-4">
          {addresses.map((address) => {
            const isSelected = selectedAddress?._id === address._id;

            return (
              <button
                key={address._id}
                type="button"
                onClick={() => onSelectAddress(address)}
                className={`relative w-full rounded-xl border p-4 text-left transition ${
                  isSelected
                    ? "border-emerald-600 bg-emerald-50 ring-2 ring-emerald-100"
                    : "border-gray-200 hover:border-emerald-400 hover:bg-gray-50"
                }`}
              >
                {/* =================================================
                    Selected Indicator
                ================================================= */}

                {isSelected && (
                  <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white">
                    <Check size={15} />
                  </span>
                )}

                {/* =================================================
                    Default Badge
                ================================================= */}

                {address.isDefault && (
                  <span className="mb-2 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Default
                  </span>
                )}

                {/* =================================================
                    Name
                ================================================= */}

                <p className="font-semibold text-gray-900">
                  {address.fullName}
                </p>

                {/* =================================================
                    Phone
                ================================================= */}

                <p className="mt-1 text-sm text-gray-600">{address.phone}</p>

                {/* =================================================
                    Address
                ================================================= */}

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {address.addressLine1}
                  {address.addressLine2 && (
                    <>
                      <br />
                      {address.addressLine2}
                    </>
                  )}
                  <br />
                  {address.city}, {address.state} - {address.postalCode}
                </p>
              </button>
            );
          })}
        </div>
      )}

      {/* =================================================
          No Saved Addresses
      ================================================= */}

      {!loading && addresses.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
          <MapPin size={36} className="mx-auto mb-3 text-gray-300" />

          <p className="font-medium text-gray-700">No saved addresses</p>

          <p className="mt-1 text-sm text-gray-500">
            Add an address before placing your order.
          </p>
        </div>
      )}

      {/* =================================================
          Add New Address
      ================================================= */}

      <button
        type="button"
        onClick={onAddAddress}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-600 px-4 py-3 font-semibold text-emerald-600 transition hover:bg-emerald-50"
      >
        <Plus size={18} />
        Add New Address
      </button>
    </div>
  );
}

export default DeliveryForm;
