import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  Search,
  Plus,
  Pencil,
  Trash2,
  PackagePlus,
  AlertTriangle,
  PackageX,
  Gavel,
} from "lucide-react";

import EditProductModal from "../components/EditProductModal";
import AddProductModal from "../components/AddProductModal";
import RestockProductModal from "../components/RestockProductModal";

import {
  fetchFarmerProducts,
  addFarmerProduct,
  editFarmerProduct,
  removeFarmerProduct,
  restockFarmerProduct,
} from "../productThunks";

function Products() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    products = [],
    loading,
    error,
  } = useSelector((state) => state.dashboard);

  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openRestockModal, setOpenRestockModal] = useState(false);

  const [predictedCrop, setPredictedCrop] = useState("");

  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  const [restockLoading, setRestockLoading] = useState(false);

  const [restockError, setRestockError] = useState("");

  // =====================================================
  // Fetch Farmer Products
  // =====================================================

  useEffect(() => {
    dispatch(fetchFarmerProducts());
  }, [dispatch]);

  // =====================================================
  // Open Add Product From Crop Prediction
  // =====================================================

  useEffect(() => {
    const crop = location.state?.predictedCrop;

    if (!crop) {
      return;
    }

    setPredictedCrop(crop);
    setOpenAddModal(true);

    window.history.replaceState({}, document.title, window.location.pathname);
  }, [location]);

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
  // Inventory Statistics
  // =====================================================

  const inventoryStats = useMemo(() => {
    return products.reduce(
      (stats, product) => {
        const quantity = Number(product.quantity) || 0;

        const threshold = Number(product.lowStockThreshold) || 5;

        if (quantity <= 0) {
          stats.outOfStock += 1;
        } else if (quantity <= threshold) {
          stats.lowStock += 1;
        } else {
          stats.inStock += 1;
        }

        return stats;
      },
      {
        inStock: 0,
        lowStock: 0,
        outOfStock: 0,
      },
    );
  }, [products]);

  // =====================================================
  // Product Status
  // =====================================================

  const getStockStatus = (product) => {
    const quantity = Number(product.quantity) || 0;

    const threshold = Number(product.lowStockThreshold) || 5;

    if (quantity <= 0) {
      return {
        label: "Out of Stock",

        className:
          "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400",

        icon: PackageX,
      };
    }

    if (quantity <= threshold) {
      return {
        label: "Low Stock",

        className:
          "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",

        icon: AlertTriangle,
      };
    }

    return {
      label: "In Stock",

      className:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",

      icon: null,
    };
  };

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
      setPredictedCrop("");
    }
  };

  // =====================================================
  // Open Restock
  // =====================================================

  const handleOpenRestock = (product) => {
    setSelectedProduct(product);
    setRestockError("");
    setOpenRestockModal(true);
  };

  // =====================================================
  // Close Restock
  // =====================================================

  const handleCloseRestock = () => {
    if (restockLoading) {
      return;
    }

    setOpenRestockModal(false);
    setSelectedProduct(null);
    setRestockError("");
  };

  // =====================================================
  // Restock Product
  // =====================================================

  const handleRestock = async (quantity) => {
    if (!selectedProduct) {
      return;
    }

    setRestockLoading(true);
    setRestockError("");

    try {
      await dispatch(
        restockFarmerProduct({
          id: selectedProduct._id,
          quantity,
        }),
      ).unwrap();

      setOpenRestockModal(false);
      setSelectedProduct(null);
    } catch (error) {
      setRestockError(error || "Failed to restock product");
    } finally {
      setRestockLoading(false);
    }
  };

  // =====================================================
  // Create Auction
  // =====================================================

  const handleCreateAuction = (product) => {
    if (!product?._id) {
      return;
    }

    const quantity = Number(product.quantity) || 0;

    // -------------------------------------------------
    // Cannot create auction without stock
    // -------------------------------------------------

    if (quantity <= 0) {
      return;
    }

    navigate(`/farmer/auctions/create?productId=${product._id}`);
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Product Inventory
          </h1>

          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Manage your products, stock levels, and availability.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setPredictedCrop("");
            setOpenAddModal(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* =================================================
          Error
      ================================================= */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
          {error}
        </div>
      )}

      {/* =================================================
          Inventory Summary
      ================================================= */}

      <div className="grid gap-4 sm:grid-cols-3">
        {/* =================================================
            In Stock
        ================================================= */}

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                In Stock
              </p>

              <p className="mt-2 text-3xl font-bold text-emerald-900 dark:text-emerald-300">
                {inventoryStats.inStock}
              </p>

              <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400">
                Products with healthy inventory
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm dark:bg-gray-800 dark:text-emerald-400">
              <PackagePlus size={21} />
            </div>
          </div>
        </div>

        {/* =================================================
            Low Stock
        ================================================= */}

        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                Low Stock
              </p>

              <p className="mt-2 text-3xl font-bold text-amber-900 dark:text-amber-300">
                {inventoryStats.lowStock}
              </p>

              <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
                Products that need attention
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-amber-600 shadow-sm dark:bg-gray-800 dark:text-amber-400">
              <AlertTriangle size={21} />
            </div>
          </div>
        </div>

        {/* =================================================
            Out of Stock
        ================================================= */}

        <div className="rounded-2xl border border-red-100 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700 dark:text-red-400">
                Out of Stock
              </p>

              <p className="mt-2 text-3xl font-bold text-red-900 dark:text-red-300">
                {inventoryStats.outOfStock}
              </p>

              <p className="mt-1 text-xs text-red-700 dark:text-red-400">
                Products unavailable for purchase
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-red-600 shadow-sm dark:bg-gray-800 dark:text-red-400">
              <PackageX size={21} />
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          Search
      ================================================= */}

      <div className="relative">
        <Search
          size={19}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
        />

        <input
          type="text"
          placeholder="Search by product, category or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:ring-emerald-900/40"
        />
      </div>

      {/* =================================================
          Product Table
      ================================================= */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1150px]">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Product
                </th>

                <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Category
                </th>

                <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Price
                </th>

                <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Stock
                </th>

                <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Status
                </th>

                <th className="p-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="p-10 text-center text-gray-500 dark:text-gray-400"
                  >
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center">
                    <p className="font-medium text-gray-700 dark:text-gray-300">
                      {search
                        ? "No matching products found."
                        : "No products found."}
                    </p>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {search
                        ? "Try a different search."
                        : "Add your first product to start selling."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product);

                  const StatusIcon = stockStatus.icon;

                  const productQuantity = Number(product.quantity) || 0;

                  const canCreateAuction = productQuantity > 0;

                  return (
                    <tr
                      key={product._id}
                      className="border-t border-gray-100 transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
                    >
                      {/* =================================================
                          Product
                      ================================================= */}

                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {product.images?.[0]?.url ? (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className="h-12 w-12 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-xs text-gray-400 dark:bg-gray-800 dark:text-gray-500">
                              No image
                            </div>
                          )}

                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {product.name}
                            </p>

                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {product.location}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* =================================================
                          Category
                      ================================================= */}

                      <td className="p-4 text-gray-700 dark:text-gray-300">
                        {product.category}
                      </td>

                      {/* =================================================
                          Price
                      ================================================= */}

                      <td className="p-4 font-medium text-gray-900 dark:text-white">
                        ₹{Number(product.price).toFixed(2)}
                      </td>

                      {/* =================================================
                          Stock
                      ================================================= */}

                      <td className="p-4">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {product.quantity} {product.unit}
                          </p>

                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Alert at {product.lowStockThreshold} {product.unit}
                          </p>
                        </div>
                      </td>

                      {/* =================================================
                          Status
                      ================================================= */}

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${stockStatus.className}`}
                        >
                          {StatusIcon && <StatusIcon size={14} />}

                          {stockStatus.label}
                        </span>
                      </td>

                      {/* =================================================
                          Actions
                      ================================================= */}

                      <td className="p-4">
                        <div className="flex flex-wrap justify-center gap-2">
                          {/* Edit */}

                          <button
                            type="button"
                            onClick={() => handleEdit(product)}
                            className="inline-flex items-center gap-1 rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
                          >
                            <Pencil size={15} />
                            Edit
                          </button>

                          {/* Restock */}

                          <button
                            type="button"
                            onClick={() => handleOpenRestock(product)}
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                          >
                            <PackagePlus size={15} />
                            Restock
                          </button>

                          {/* =================================================
                              Create Auction
                          ================================================= */}

                          <button
                            type="button"
                            disabled={!canCreateAuction}
                            onClick={() => handleCreateAuction(product)}
                            title={
                              canCreateAuction
                                ? "Create auction for this product"
                                : "Cannot create auction because this product is out of stock"
                            }
                            className="inline-flex items-center gap-1 rounded-lg bg-purple-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:bg-gray-400"
                          >
                            <Gavel size={15} />
                            Auction
                          </button>

                          {/* Delete */}

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
        initialCrop={predictedCrop}
        onClose={() => {
          setOpenAddModal(false);
          setPredictedCrop("");
        }}
        onSave={handleAddProduct}
      />

      {/* =================================================
          Restock Modal
      ================================================= */}

      <RestockProductModal
        product={selectedProduct}
        isOpen={openRestockModal}
        loading={restockLoading}
        error={restockError}
        onClose={handleCloseRestock}
        onRestock={handleRestock}
      />
    </section>
  );
}

export default Products;
