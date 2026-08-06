import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import EditProductModal from "../components/EditProductModal";

import {
  fetchFarmerProducts,
  editFarmerProduct,
  removeFarmerProduct,
} from "../productThunks";

function Products() {
  const dispatch = useDispatch();

  const { products, loading } = useSelector((state) => state.dashboard);

  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    dispatch(fetchFarmerProducts());
  }, [dispatch]);

  const farmerProducts =
    products?.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setOpenModal(true);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) return;

    dispatch(removeFarmerProduct(id));
  };

  const handleSave = async (id, data) => {
    const result = await dispatch(
      editFarmerProduct({
        id,
        data,
      }),
    );

    if (editFarmerProduct.fulfilled.match(result)) {
      setOpenModal(false);
      setSelectedProduct(null);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Products</h1>

        <button className="rounded-lg bg-green-600 px-5 py-2 text-white transition hover:bg-green-700">
          + Add Product
        </button>
      </div>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-lg border p-3"
      />

      <div className="overflow-hidden rounded-xl border bg-white shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Product</th>
              <th className="text-left">Category</th>
              <th className="text-left">Price</th>
              <th className="text-left">Quantity</th>
              <th className="text-left">Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : farmerProducts.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              farmerProducts.map((product) => (
                <tr key={product._id} className="border-t">
                  <td className="p-4 font-medium">{product.name}</td>

                  <td>{product.category}</td>

                  <td>₹{product.price}</td>

                  <td>
                    {product.quantity} {product.unit}
                  </td>

                  <td>
                    <span
                      className={`rounded-full px-3 py-1 text-sm ${
                        product.isAvailable
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.isAvailable ? "Active" : "Unavailable"}
                    </span>
                  </td>

                  <td className="space-x-2 text-center">
                    <button
                      onClick={() => handleEdit(product)}
                      className="rounded bg-blue-500 px-3 py-1 text-white transition hover:bg-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(product._id)}
                      className="rounded bg-red-500 px-3 py-1 text-white transition hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <EditProductModal
        product={selectedProduct}
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedProduct(null);
        }}
        onSave={handleSave}
      />
    </section>
  );
}

export default Products;
