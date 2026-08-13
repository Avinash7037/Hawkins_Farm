import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  Package,
  PackageCheck,
  PackageX,
  RefreshCw,
  Store,
  Star,
  AlertTriangle,
  UserRound,
} from "lucide-react";

import {
  fetchAllAdminProducts,
  changeAdminProductStatus,
} from "../adminThunks";

function AdminProducts() {
  const dispatch = useDispatch();

  const {
    products = [],
    productsLoading,
    productsError,
    updatingProduct,
    updateProductError,
  } = useSelector((state) => state.admin);

  // =====================================================
  // Local State
  // =====================================================

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // =====================================================
  // Fetch Products
  // =====================================================

  useEffect(() => {
    dispatch(fetchAllAdminProducts());
  }, [dispatch]);

  // =====================================================
  // Statistics
  // =====================================================

  const statistics = useMemo(() => {
    const total = products.length;

    const available = products.filter((product) => product.isAvailable).length;

    const unavailable = products.filter(
      (product) => !product.isAvailable,
    ).length;

    const outOfStock = products.filter(
      (product) => Number(product.quantity) <= 0,
    ).length;

    const lowStock = products.filter(
      (product) =>
        Number(product.quantity) > 0 &&
        Number(product.quantity) <= Number(product.lowStockThreshold || 5),
    ).length;

    return {
      total,
      available,
      unavailable,
      outOfStock,
      lowStock,
    };
  }, [products]);

  // =====================================================
  // Categories
  // =====================================================

  const categories = useMemo(() => {
    return [
      ...new Set(products.map((product) => product.category).filter(Boolean)),
    ].sort((a, b) => a.localeCompare(b));
  }, [products]);

  // =====================================================
  // Filter Products
  // =====================================================

  const filteredProducts = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !searchValue ||
        product.name?.toLowerCase().includes(searchValue) ||
        product.category?.toLowerCase().includes(searchValue) ||
        product.location?.toLowerCase().includes(searchValue) ||
        product.farmer?.name?.toLowerCase().includes(searchValue) ||
        product.farmer?.email?.toLowerCase().includes(searchValue);

      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "available" && product.isAvailable) ||
        (statusFilter === "unavailable" && !product.isAvailable) ||
        (statusFilter === "outOfStock" && Number(product.quantity) <= 0) ||
        (statusFilter === "lowStock" &&
          Number(product.quantity) > 0 &&
          Number(product.quantity) <= Number(product.lowStockThreshold || 5));

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, search, categoryFilter, statusFilter]);

  // =====================================================
  // Change Product Status
  // =====================================================

  const handleStatusChange = async (product) => {
    const nextStatus = !product.isAvailable;

    const action = nextStatus ? "activate" : "deactivate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} "${product.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await dispatch(
        changeAdminProductStatus({
          id: product._id,
          isAvailable: nextStatus,
        }),
      ).unwrap();
    } catch {
      // Redux stores the error.
    }
  };

  // =====================================================
  // Refresh
  // =====================================================

  const handleRefresh = () => {
    dispatch(fetchAllAdminProducts());
  };

  // =====================================================
  // Stock Status
  // =====================================================

  const getStockStatus = (product) => {
    const quantity = Number(product.quantity || 0);

    if (quantity <= 0) {
      return {
        label: "Out of stock",
        className: "bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300",
      };
    }

    const threshold = Number(product.lowStockThreshold || 5);

    if (quantity <= threshold) {
      return {
        label: "Low stock",
        className: "bg-amber-100 dark:bg-amber-950/50 text-amber-700",
      };
    }

    return {
      label: "In stock",
      className: "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300",
    };
  };

  // =====================================================
  // Loading
  // =====================================================

  if (productsLoading && products.length === 0) {
    return (
      <section className="space-y-6">
        <div>
          <div className="h-9 w-72 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />

          <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-2xl border bg-white dark:bg-gray-900"
            />
          ))}
        </div>

        <div className="h-96 animate-pulse rounded-2xl border bg-white dark:bg-gray-900" />
      </section>
    );
  }

  // =====================================================
  // Render
  // =====================================================

  return (
    <section className="space-y-7">
      {/* =================================================
          Header
      ================================================= */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300">
              <Package size={23} />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Product Management
              </h1>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Monitor and manage products listed by Hawkins Farm farmers.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={productsLoading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 shadow-sm transition hover:bg-gray-50 dark:hover:bg-gray-800/50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={productsLoading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* =================================================
          Errors
      ================================================= */}

      {productsError && (
        <div className="rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 p-4 text-sm font-medium text-red-700 dark:text-red-300">
          {productsError}
        </div>
      )}

      {updateProductError && (
        <div className="rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 p-4 text-sm font-medium text-red-700 dark:text-red-300">
          {updateProductError}
        </div>
      )}

      {/* =================================================
          Main Statistics
      ================================================= */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total */}

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Products
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {statistics.total}
              </p>

              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Products listed on platform
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <Package size={21} />
            </div>
          </div>
        </div>

        {/* Available */}

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Available</p>

              <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {statistics.available}
              </p>

              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Currently visible to buyers
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300">
              <PackageCheck size={21} />
            </div>
          </div>
        </div>

        {/* Unavailable */}

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Unavailable</p>

              <p className="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">
                {statistics.unavailable}
              </p>

              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Hidden from marketplace
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300">
              <PackageX size={21} />
            </div>
          </div>
        </div>

        {/* Stock Alerts */}

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Stock Alerts</p>

              <p className="mt-2 text-3xl font-bold text-amber-600 dark:text-amber-400">
                {statistics.lowStock + statistics.outOfStock}
              </p>

              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {statistics.outOfStock} out of stock · {statistics.lowStock} low
                stock
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-700">
              <AlertTriangle size={21} />
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          Filters
      ================================================= */}

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_190px_190px]">
          {/* Search */}

          <div className="relative">
            <Search
              size={19}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search product, farmer, category..."
              className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 py-3 pl-11 pr-4 text-sm text-gray-900 dark:text-white outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          {/* Category */}

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 outline-none transition focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-emerald-100"
          >
            <option value="all">All Categories</option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Status */}

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 outline-none transition focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-emerald-100"
          >
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
            <option value="lowStock">Low Stock</option>
            <option value="outOfStock">Out of Stock</option>
          </select>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {filteredProducts.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {products.length}
            </span>{" "}
            products
          </p>

          {(search || categoryFilter !== "all" || statusFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategoryFilter("all");
                setStatusFilter("all");
              }}
              className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 transition hover:text-emerald-800"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* =================================================
          Products Table
      ================================================= */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
        <div className="border-b border-gray-100 dark:border-gray-800 px-5 py-4">
          <h2 className="font-bold text-gray-900 dark:text-white">All Products</h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Review product listings, stock levels, ratings, and marketplace
            availability.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1150px]">
            <thead className="bg-gray-50 dark:bg-gray-800/60">
              <tr>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Product
                </th>

                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Farmer
                </th>

                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Category
                </th>

                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Price
                </th>

                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Stock
                </th>

                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Rating
                </th>

                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Availability
                </th>

                <th className="p-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-14 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500">
                      <Package size={25} />
                    </div>

                    <p className="mt-4 font-semibold text-gray-800 dark:text-gray-200">
                      No products found
                    </p>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const stock = getStockStatus(product);

                  return (
                    <tr
                      key={product._id}
                      className="border-t border-gray-100 dark:border-gray-800 transition hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      {/* Product */}

                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                            {product.images?.[0]?.url ? (
                              <img
                                src={product.images[0].url}
                                alt={product.name || "Product"}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Package size={20} className="text-gray-400 dark:text-gray-500" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-[220px] truncate font-semibold text-gray-900 dark:text-white">
                              {product.name}
                            </p>

                            <p className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                              <Store size={12} />

                              {product.location || "Location unavailable"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Farmer */}

                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                            <UserRound size={16} />
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-[170px] truncate font-medium text-gray-800 dark:text-gray-200">
                              {product.farmer?.name || "Unknown Farmer"}
                            </p>

                            {product.farmer?.email && (
                              <p className="max-w-[170px] truncate text-xs text-gray-500 dark:text-gray-400">
                                {product.farmer.email}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}

                      <td className="p-4">
                        <span className="inline-flex rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
                          {product.category || "Uncategorized"}
                        </span>
                      </td>

                      {/* Price */}

                      <td className="p-4">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          ₹{Number(product.price || 0).toLocaleString("en-IN")}
                        </p>

                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          per {product.unit || "unit"}
                        </p>
                      </td>

                      {/* Stock */}

                      <td className="p-4">
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                          {Number(product.quantity || 0).toLocaleString(
                            "en-IN",
                          )}{" "}
                          {product.unit || ""}
                        </p>

                        <span
                          className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${stock.className}`}
                        >
                          {stock.label}
                        </span>
                      </td>

                      {/* Rating */}

                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <Star
                            size={15}
                            className="fill-yellow-400 text-yellow-400"
                          />

                          <span className="font-semibold text-gray-800 dark:text-gray-200">
                            {Number(product.rating || 0).toFixed(1)}
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {product.numReviews || 0}{" "}
                          {product.numReviews === 1 ? "review" : "reviews"}
                        </p>
                      </td>

                      {/* Availability */}

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                            product.isAvailable
                              ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300"
                              : "bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              product.isAvailable
                                ? "bg-emerald-500"
                                : "bg-red-500"
                            }`}
                          />

                          {product.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </td>

                      {/* Action */}

                      <td className="p-4 text-right">
                        <button
                          type="button"
                          disabled={updatingProduct}
                          onClick={() => handleStatusChange(product)}
                          className={`rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${
                            product.isAvailable
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-emerald-600 hover:bg-emerald-700"
                          }`}
                        >
                          {updatingProduct
                            ? "Updating..."
                            : product.isAvailable
                              ? "Deactivate"
                              : "Activate"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default AdminProducts;
