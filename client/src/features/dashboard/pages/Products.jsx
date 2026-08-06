import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchFarmerProducts } from "../productThunks";

function Products() {
  const dispatch = useDispatch();

  const { products, loading } = useSelector((state) => state.dashboard);

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchFarmerProducts());
  }, [dispatch]);

  const farmerProducts =
    products?.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Products</h1>

        <button className="rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700">
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
                    <button className="rounded bg-blue-500 px-3 py-1 text-white">
                      Edit
                    </button>

                    <button className="rounded bg-red-500 px-3 py-1 text-white">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Products;
