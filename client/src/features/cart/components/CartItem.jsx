import { Minus, Plus, Trash2 } from "lucide-react";

import { useDispatch } from "react-redux";

import { updateItemQuantity, deleteCartItem } from "../cartThunks";

function CartItem({ item }) {
  const dispatch = useDispatch();

  const product = item?.product;

  // =====================================================
  // Invalid Product Protection
  // =====================================================

  if (!product) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold text-red-700">Product unavailable</h2>

            <p className="mt-1 text-sm text-red-600">
              This product is no longer available.
            </p>
          </div>

          <button
            type="button"
            onClick={() => dispatch(deleteCartItem(item._id))}
            className="rounded-lg bg-red-600 p-2 text-white transition hover:bg-red-700"
            aria-label="Remove unavailable product"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // Product Image
  // =====================================================

  const image =
    product.images?.[0]?.url || "https://placehold.co/120x120?text=No+Image";

  // =====================================================
  // Stock
  // =====================================================

  const availableQuantity = Number(product.quantity) || 0;

  const isAvailable = product.isAvailable === true && availableQuantity > 0;

  const canIncrease = isAvailable && item.quantity < availableQuantity;

  // =====================================================
  // Increase
  // =====================================================

  const increase = () => {
    if (!canIncrease) {
      return;
    }

    dispatch(
      updateItemQuantity({
        id: item._id,
        quantity: item.quantity + 1,
      }),
    );
  };

  // =====================================================
  // Decrease
  // =====================================================

  const decrease = () => {
    if (item.quantity <= 1) {
      return;
    }

    dispatch(
      updateItemQuantity({
        id: item._id,
        quantity: item.quantity - 1,
      }),
    );
  };

  // =====================================================
  // Remove
  // =====================================================

  const remove = () => {
    dispatch(deleteCartItem(item._id));
  };

  // =====================================================
  // Item Total
  // =====================================================

  const itemTotal = Number(product.price || 0) * Number(item.quantity || 0);

  // =====================================================
  // Render
  // =====================================================

  return (
    <article className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        {/* =================================================
            Product Image
        ================================================= */}

        <img
          src={image}
          alt={product.name || "Product"}
          className="h-24 w-24 rounded-xl object-cover"
        />

        {/* =================================================
            Product Information
        ================================================= */}

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-xl font-semibold text-gray-900">
            {product.name}
          </h2>

          <p className="mt-1 text-gray-600">
            ₹{Number(product.price || 0).toLocaleString("en-IN")}
            {" / "}
            {product.unit || "unit"}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Farmer: {product.farmer?.name || "Unknown"}
          </p>

          {/* Availability */}

          {isAvailable ? (
            <p className="mt-2 text-sm font-medium text-green-600">
              {availableQuantity} {product.unit || "units"} available
            </p>
          ) : (
            <p className="mt-2 text-sm font-medium text-red-600">
              Currently unavailable
            </p>
          )}
        </div>

        {/* =================================================
            Quantity Controls
        ================================================= */}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={decrease}
            disabled={item.quantity <= 1}
            className="rounded-lg border p-2 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            <Minus size={18} />
          </button>

          <span className="w-10 text-center font-semibold">
            {item.quantity}
          </span>

          <button
            type="button"
            onClick={increase}
            disabled={!canIncrease}
            className="rounded-lg border p-2 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Increase quantity"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* =================================================
            Item Total
        ================================================= */}

        <div className="min-w-[100px] text-right">
          <p className="text-lg font-bold text-gray-900">
            ₹{itemTotal.toLocaleString("en-IN")}
          </p>
        </div>

        {/* =================================================
            Remove
        ================================================= */}

        <button
          type="button"
          onClick={remove}
          className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 hover:text-red-700"
          aria-label={`Remove ${product.name}`}
        >
          <Trash2 size={22} />
        </button>
      </div>

      {/* =================================================
          Stock Warning
      ================================================= */}

      {isAvailable && item.quantity >= availableQuantity && (
        <div className="mt-4 rounded-lg bg-orange-50 px-4 py-3 text-sm font-medium text-orange-700">
          You have reached the maximum available stock for this product.
        </div>
      )}

      {!isAvailable && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          This product is no longer available. Please remove it before checkout.
        </div>
      )}
    </article>
  );
}

export default CartItem;
