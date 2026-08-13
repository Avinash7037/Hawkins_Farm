import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

import { ArrowLeft, Gavel, Package, Clock, IndianRupee } from "lucide-react";

import { fetchFarmerProducts } from "../../dashboard/productThunks";

import { createNewAuction } from "../auctionThunks";

// =====================================================
// Create Auction
// =====================================================

function CreateAuction() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  // ===================================================
  // Product ID From URL
  // ===================================================

  const productIdFromUrl = searchParams.get("productId");

  // ===================================================
  // Farmer Products
  // ===================================================

  const { products = [], loading: productsLoading } = useSelector(
    (state) => state.dashboard,
  );

  // ===================================================
  // Fetch Farmer Products
  // ===================================================

  useEffect(() => {
    dispatch(fetchFarmerProducts());
  }, [dispatch]);

  // ===================================================
  // Auction State
  // ===================================================

  const [productId, setProductId] = useState(productIdFromUrl || "");

  const [quantity, setQuantity] = useState("");

  const [basePrice, setBasePrice] = useState("");

  const [durationMinutes, setDurationMinutes] = useState("10");

  const [error, setError] = useState("");

  const [submitting, setSubmitting] = useState(false);

  // ===================================================
  // Automatically Select Product From URL
  // ===================================================

  useEffect(() => {
    if (!productIdFromUrl) {
      return;
    }

    setProductId(productIdFromUrl);
    setQuantity("");
    setError("");
  }, [productIdFromUrl]);

  // ===================================================
  // Selected Product
  // ===================================================

  const selectedProduct = useMemo(() => {
    return products.find((product) => product._id === productId) || null;
  }, [products, productId]);

  // ===================================================
  // Quantity
  // ===================================================

  const quantityNumber = Number(quantity);

  const availableQuantity = Number(selectedProduct?.quantity || 0);

  const quantityExceedsStock =
    selectedProduct && quantity !== "" && quantityNumber > availableQuantity;

  // ===================================================
  // Product Selection
  // ===================================================

  const handleProductChange = (event) => {
    const id = event.target.value;

    setProductId(id);
    setQuantity("");
    setError("");
  };

  // ===================================================
  // Submit
  // ===================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    // -------------------------------------------------
    // Product
    // -------------------------------------------------

    if (!productId) {
      setError("Please select a product.");

      return;
    }

    if (!selectedProduct) {
      setError("Selected product could not be found.");

      return;
    }

    // -------------------------------------------------
    // Quantity
    // -------------------------------------------------

    if (!quantity || quantityNumber <= 0) {
      setError("Auction quantity must be greater than 0.");

      return;
    }

    if (quantityNumber > availableQuantity) {
      setError(
        `Auction quantity cannot exceed available stock of ${availableQuantity} ${selectedProduct.unit}.`,
      );

      return;
    }

    // -------------------------------------------------
    // Base Price
    // -------------------------------------------------

    const basePriceNumber = Number(basePrice);

    if (!basePrice || basePriceNumber <= 0) {
      setError("Base price must be greater than 0.");

      return;
    }

    // -------------------------------------------------
    // Duration
    // -------------------------------------------------

    const durationNumber = Number(durationMinutes);

    if (!durationMinutes || durationNumber < 1) {
      setError("Auction duration must be at least 1 minute.");

      return;
    }

    // -------------------------------------------------
    // Submit
    // -------------------------------------------------

    setSubmitting(true);

    try {
      const result = await dispatch(
        createNewAuction({
          productId,
          quantity: quantityNumber,
          basePrice: basePriceNumber,
          durationMinutes: durationNumber,
        }),
      ).unwrap();

      console.log("Auction created:", result);

      // =================================================
      // Get Newly Created Auction ID
      // =================================================

      const auctionId = result?.auction?._id || result?.result?.auction?._id;

      if (!auctionId) {
        setError("Auction was created, but auction ID was not returned.");

        return;
      }

      // =================================================
      // Redirect To Auction Details
      // =================================================

      navigate(`/auctions/${auctionId}`, {
        replace: true,
      });
    } catch (err) {
      setError(err || "Failed to create auction.");
    } finally {
      setSubmitting(false);
    }
  };

  // ===================================================
  // Render
  // ===================================================

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      {/* =================================================
          Header
      ================================================= */}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/farmer/products")}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <Gavel size={26} className="text-emerald-600" />

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Create Auction
            </h1>
          </div>

          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Put your product up for auction and let buyers compete.
          </p>
        </div>
      </div>

      {/* =================================================
          Error
      ================================================= */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      {/* =================================================
          Loading Products
      ================================================= */}

      {productsLoading && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
          Loading your products...
        </div>
      )}

      {/* =================================================
          Form
      ================================================= */}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-8"
      >
        <div className="space-y-6">
          {/* =================================================
              Product
          ================================================= */}

          <div>
            <label
              htmlFor="auction-product"
              className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Select Product
            </label>

            <select
              id="auction-product"
              value={productId}
              onChange={handleProductChange}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:ring-emerald-900/40"
            >
              <option value="">Select one of your products</option>

              {products.map((product) => (
                <option
                  key={product._id}
                  value={product._id}
                  disabled={Number(product.quantity) <= 0}
                >
                  {product.name} — {product.quantity} {product.unit} available
                </option>
              ))}
            </select>

            {products.length === 0 && !productsLoading && (
              <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                You don't have any products available for auction.
              </p>
            )}

            {productIdFromUrl && !selectedProduct && !productsLoading && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                The selected product could not be found in your products.
              </p>
            )}
          </div>

          {/* =================================================
              Selected Product Preview
          ================================================= */}

          {selectedProduct && (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
              <div className="flex gap-4">
                {selectedProduct.images?.[0]?.url ? (
                  <img
                    src={selectedProduct.images[0].url}
                    alt={selectedProduct.name}
                    className="h-24 w-24 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 dark:bg-gray-800">
                    <Package size={30} />
                  </div>
                )}

                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {selectedProduct.name}
                  </h2>

                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {selectedProduct.category}
                  </p>

                  <p className="mt-2 font-semibold text-emerald-700 dark:text-emerald-400">
                    Available: {selectedProduct.quantity} {selectedProduct.unit}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* =================================================
              Quantity + Base Price
          ================================================= */}

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Quantity */}

            <div>
              <label
                htmlFor="auction-quantity"
                className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Auction Quantity
              </label>

              <div className="relative">
                <input
                  id="auction-quantity"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  placeholder="Enter quantity"
                  disabled={!selectedProduct}
                  className={`w-full rounded-xl border bg-white px-4 py-3 pr-16 text-gray-900 outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-100 ${
                    quantityExceedsStock
                      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-300 focus:border-emerald-500 focus:ring-emerald-100"
                  } dark:bg-gray-800 dark:text-white dark:disabled:bg-gray-950`}
                />

                {selectedProduct && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500 dark:text-gray-400">
                    {selectedProduct.unit}
                  </span>
                )}
              </div>

              {selectedProduct && (
                <p
                  className={`mt-2 text-xs ${
                    quantityExceedsStock
                      ? "font-semibold text-red-600 dark:text-red-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {quantityExceedsStock
                    ? `Maximum available: ${availableQuantity} ${selectedProduct.unit}`
                    : `Available stock: ${availableQuantity} ${selectedProduct.unit}`}
                </p>
              )}
            </div>

            {/* Base Price */}

            <div>
              <label
                htmlFor="auction-base-price"
                className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Starting Price
              </label>

              <div className="relative">
                <IndianRupee
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="auction-base-price"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={basePrice}
                  onChange={(event) => setBasePrice(event.target.value)}
                  placeholder="Enter starting price"
                  className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:ring-emerald-900/40"
                />
              </div>

              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Price is per {selectedProduct?.unit || "unit"}.
              </p>
            </div>
          </div>

          {/* =================================================
              Duration
          ================================================= */}

          <div>
            <label
              htmlFor="auction-duration"
              className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Auction Duration
            </label>

            <div className="relative">
              <Clock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <select
                id="auction-duration"
                value={durationMinutes}
                onChange={(event) => setDurationMinutes(event.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:ring-emerald-900/40"
              >
                <option value="1">1 minute</option>

                <option value="5">5 minutes</option>

                <option value="10">10 minutes</option>

                <option value="15">15 minutes</option>

                <option value="30">30 minutes</option>

                <option value="60">1 hour</option>

                <option value="120">2 hours</option>

                <option value="360">6 hours</option>

                <option value="720">12 hours</option>

                <option value="1440">24 hours</option>
              </select>
            </div>
          </div>

          {/* =================================================
              Summary
          ================================================= */}

          {selectedProduct && (
            <div className="rounded-2xl bg-gray-50 p-5 dark:bg-gray-800">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                Auction Summary
              </h3>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Product
                  </p>

                  <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                    {selectedProduct.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Quantity
                  </p>

                  <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                    {quantity || "—"} {selectedProduct.unit}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Starting Price
                  </p>

                  <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                    {basePrice ? `₹${basePrice}` : "—"}/{selectedProduct.unit}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* =================================================
              Buttons
          ================================================= */}

          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate("/farmer/products")}
              disabled={submitting}
              className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                submitting ||
                !productId ||
                !selectedProduct ||
                quantityExceedsStock
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Gavel size={18} />

              {submitting ? "Creating Auction..." : "Create Auction"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

export default CreateAuction;
