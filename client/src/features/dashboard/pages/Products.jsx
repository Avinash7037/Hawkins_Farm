import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";

import EditProductModal from "../components/EditProductModal";
import AddProductModal from "../components/AddProductModal";

import {
  fetchFarmerProducts,
  addFarmerProduct,
  editFarmerProduct,
  removeFarmerProduct,
} from "../productThunks";

function Products() {
  const dispatch = useDispatch();

  const {
    products = [],
    loading,
    error,
  } = useSelector((state) => state.dashboard);

  const [search, setSearch] = useState("");

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [openEditModal, setOpenEditModal] = useState(false);

  const [openAddModal, setOpenAddModal] = useState(false);

  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  // =====================================================
  // Fetch Farmer Products
  // =====================================================

  useEffect(() => {
    dispatch(fetchFarmerProducts());
  }, [dispatch]);

  // =====================================================
  // Filter Products
  // =====================================================

  const filteredProducts = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return products;
    }

    return products.filter((product) =>
      [product.name, product.category, product.location]
        .filter(Boolean)
        .some((value) => value.toString().toLowerCase().includes(searchValue)),
    );
  }, [products, search]);

  // =====================================================
  // Edit Product
  // =====================================================

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setOpenEditModal(true);
  };

  // =====================================================
  // Close Edit Modal
  // =====================================================

  const handleCloseEdit = () => {
    setOpenEditModal(false);
    setSelectedProduct(null);
  };

  // =====================================================
  // Delete Product
  // =====================================================

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    setDeleteLoadingId(product._id);

    try {
      await dispatch(removeFarmerProduct(product._id)).unwrap();
    } catch {
      // dashboardSlice stores the error
    } finally {
      setDeleteLoadingId(null);
    }
  };

  // =====================================================
  // Save Edited Product
  // =====================================================

  const handleSave = async (id, data) => {
    const result = await dispatch(
      editFarmerProduct({
        id,
        data,
      }),
    );

    if (editFarmerProduct.fulfilled.match(result)) {
      handleCloseEdit();
    }
  };

  // =====================================================
  // Add Product
  // =====================================================

  const handleAddProduct = async (formData) => {
    const result = await dispatch(addFarmerProduct(formData));

    if (addFarmerProduct.fulfilled.match(result)) {
      setOpenAddModal(false);
    }
  };

  // =====================================================
  // Render
  // =====================================================

  return (
    <section className="space-y-6">
      {/* =================================================
          Header
      ================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Products</h1>

          <p className="mt-1 text-gray-500">
            Manage the products you sell on Hawkins Farm.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpenAddModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* =================================================
          Error
      ================================================= */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* =================================================
          Search
      ================================================= */}

      <div className="relative">
        <Search
          size={19}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search by product, category or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
        />
      </div>

      {/* =================================================
          Product Table
      ================================================= */}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">
                  Product
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
                  Status
                </th>

                <th className="p-4 text-center text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {/* Loading */}

              {loading ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-500">
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                /* Empty */

                <tr>
                  <td colSpan="6" className="p-10 text-center">
                    <p className="font-medium text-gray-700">
                      {search
                        ? "No matching products found."
                        : "No products found."}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {search
                        ? "Try a different search."
                        : "Add your first product to start selling."}
                    </p>
                  </td>
                </tr>
              ) : (
                /* Products */

                filteredProducts.map((product) => {
                  const isAvailable =
                    Boolean(product.isAvailable) &&
                    Number(product.quantity) > 0;

                  return (
                    <tr
                      key={product._id}
                      className="border-t border-gray-100 transition hover:bg-gray-50"
                    >
                      {/* Product */}

                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {product.images?.[0]?.url ? (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                              No image
                            </div>
                          )}

                          <div>
                            <p className="font-semibold text-gray-900">
                              {product.name}
                            </p>

                            <p className="text-sm text-gray-500">
                              {product.location}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}

                      <td className="p-4 text-gray-700">{product.category}</td>

                      {/* Price */}

                      <td className="p-4 font-medium text-gray-900">
                        ₹{Number(product.price).toFixed(2)}
                      </td>

                      {/* Quantity */}

                      <td className="p-4 text-gray-700">
                        {product.quantity} {product.unit}
                      </td>

                      {/* Status */}

                      <td className="p-4">
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-medium ${
                            isAvailable
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {isAvailable ? "Active" : "Unavailable"}
                        </span>
                      </td>

                      {/* Actions */}

                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(product)}
                            className="inline-flex items-center gap-1 rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
                          >
                            <Pencil size={15} />
                            Edit
                          </button>

                          <button
                            type="button"
                            disabled={deleteLoadingId === product._id}
                            onClick={() => handleDelete(product)}
                            className="inline-flex items-center gap-1 rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Trash2 size={15} />

                            {deleteLoadingId === product._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =================================================
          Edit Modal
      ================================================= */}

      <EditProductModal
        product={selectedProduct}
        isOpen={openEditModal}
        onClose={handleCloseEdit}
        onSave={handleSave}
      />

      {/* =================================================
          Add Modal
      ================================================= */}

      <AddProductModal
        isOpen={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSave={handleAddProduct}
      />
    </section>
  );
}

export default Products;
