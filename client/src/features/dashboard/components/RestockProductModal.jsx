import { useEffect, useState } from "react";
import { PackagePlus, X } from "lucide-react";

function RestockProductModal({
  product,
  isOpen,
  loading = false,
  error = "",
  onClose,
  onRestock,
}) {
  const [quantity, setQuantity] = useState("");

  // =====================================================
  // Reset Form
  // =====================================================

  useEffect(() => {
    if (isOpen) {
      setQuantity("");
    }
  }, [isOpen, product]);

  // =====================================================
  // Close
  // =====================================================

  if (!isOpen || !product) {
    return null;
  }

  // =====================================================
  // Submit
  // =====================================================

  const handleSubmit = (event) => {
    event.preventDefault();

    const value = Number(quantity);

    if (!Number.isInteger(value) || value <= 0) {
      return;
    }

    onRestock(value);
  };

  // =====================================================
  // Render
  // =====================================================

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900">
        {/* Header */}

        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
              <PackagePlus size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Restock Product
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Add inventory to your product
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Product */}

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-3">
              {product.images?.[0]?.url ? (
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className="h-14 w-14 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-200 text-xs text-gray-400 dark:bg-gray-700 dark:text-gray-500">
                  No image
                </div>
              )}

              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {product.name}
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Current stock:{" "}
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {product.quantity} {product.unit}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Quantity */}

          <div>
            <label
              htmlFor="restock-quantity"
              className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Quantity to add
            </label>

            <div className="relative">
              <input
                id="restock-quantity"
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                placeholder="Enter quantity"
                disabled={loading}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-16 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:ring-emerald-900/40 dark:disabled:bg-gray-700"
                autoFocus
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500 dark:text-gray-400">
                {product.unit}
              </span>
            </div>

            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Enter the number of {product.unit} you want to add to inventory.
            </p>
          </div>

          {/* Preview */}

          {Number(quantity) > 0 && Number.isInteger(Number(quantity)) && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/40">
              <p className="text-sm text-emerald-700 dark:text-emerald-400">
                New stock after restocking
              </p>

              <p className="mt-1 text-xl font-bold text-emerald-800 dark:text-emerald-300">
                {Number(product.quantity) + Number(quantity)} {product.unit}
              </p>
            </div>
          )}

          {/* Error */}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Actions */}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                loading ||
                !Number.isInteger(Number(quantity)) ||
                Number(quantity) <= 0
              }
              className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Restocking..." : "Restock Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RestockProductModal;
