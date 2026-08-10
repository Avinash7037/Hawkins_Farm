import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchAllAdminProducts,
  changeAdminProductStatus,
} from "../adminThunks";

function AdminProducts() {
  const dispatch = useDispatch();

  const {
    products,
    productsLoading,
    productsError,
    updatingProduct,
    updateProductError,
  } = useSelector((state) => state.admin);

  // =====================================================
  // Fetch Products
  // =====================================================

  useEffect(() => {
    dispatch(fetchAllAdminProducts());
  }, [dispatch]);

  // =====================================================
  // Change Product Status
  // =====================================================

  const handleStatusChange = (product) => {
    const nextStatus = !product.isAvailable;

    const action = nextStatus ? "activate" : "deactivate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} "${product.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    dispatch(
      changeAdminProductStatus({
        id: product._id,
        isAvailable: nextStatus,
      }),
    );
  };

  // =====================================================
  // Loading
  // =====================================================

  if (productsLoading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
          <p className="text-gray-500">Loading products...</p>
        </div>
      </section>
    );
  }

  // =====================================================
  // Render
  // =====================================================

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      {/* =================================================
          Header
      ================================================= */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>

        <p className="mt-2 text-gray-600">
          View and manage products listed by farmers.
        </p>
      </div>

      {/* =================================================
          Errors
      ================================================= */}

      {productsError && (
        <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-600">
          {productsError}
        </div>
      )}

      {updateProductError && (
        <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-600">
          {updateProductError}
        </div>
      )}

      {/* =================================================
          Summary
      ================================================= */}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Products</p>

          <p className="mt-2 text-3xl font-bold">{products.length}</p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Available</p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {products.filter((product) => product.isAvailable).length}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Unavailable</p>

          <p className="mt-2 text-3xl font-bold text-red-600">
            {products.filter((product) => !product.isAvailable).length}
          </p>
        </div>
      </div>

      {/* =================================================
          Products Table
      ================================================= */}

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">
                  Product
                </th>

                <th className="p-4 text-left text-sm font-semibold text-gray-700">
                  Farmer
                </th>

                <th className="p-4 text-left text-sm font-semibold text-gray-700">
                  Category
                </th>

                <th className="p-4 text-left text-sm font-semibold text-gray-700">
                  Price
                </th>

                <th className="p-4 text-left text-sm font-semibold text-gray-700">
                  Quantity
                </th>

                <th className="p-4 text-left text-sm font-semibold text-gray-700">
                  Rating
                </th>

                <th className="p-4 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>

                <th className="p-4 text-center text-sm font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product._id}
                    className="border-t transition hover:bg-gray-50"
                  >
                    {/* Product */}

                    <td className="p-4">
                      <p className="font-medium text-gray-900">
                        {product.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {product.location}
                      </p>
                    </td>

                    {/* Farmer */}

                    <td className="p-4">
                      <p className="font-medium text-gray-800">
                        {product.farmer?.name || "Unknown"}
                      </p>

                      {product.farmer?.email && (
                        <p className="mt-1 text-xs text-gray-500">
                          {product.farmer.email}
                        </p>
                      )}
                    </td>

                    {/* Category */}

                    <td className="p-4 text-gray-700">{product.category}</td>

                    {/* Price */}

                    <td className="p-4 font-semibold text-gray-900">
                      ₹{Number(product.price || 0).toLocaleString("en-IN")}
                    </td>

                    {/* Quantity */}

                    <td className="p-4 text-gray-700">
                      {product.quantity} {product.unit}
                    </td>

                    {/* Rating */}

                    <td className="p-4">
                      <span className="font-medium">
                        {product.rating || 0} ⭐
                      </span>

                      <p className="text-xs text-gray-500">
                        ({product.numReviews || 0} reviews)
                      </p>
                    </td>

                    {/* Status */}

                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          product.isAvailable
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </td>

                    {/* Action */}

                    <td className="p-4 text-center">
                      <button
                        type="button"
                        disabled={updatingProduct}
                        onClick={() => handleStatusChange(product)}
                        className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                          product.isAvailable
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-green-600 hover:bg-green-700"
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default AdminProducts;
