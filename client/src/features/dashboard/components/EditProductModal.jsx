import { useEffect, useState } from "react";

function EditProductModal({ product, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    unit: "",
    location: "",
    description: "",
    freshness: "Fresh",
    isAvailable: true,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        category: product.category || "",
        price: product.price || "",
        quantity: product.quantity || "",
        unit: product.unit || "kg",
        location: product.location || "",
        description: product.description || "",
        freshness: product.freshness || "Fresh",
        isAvailable: product.isAvailable,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(product._id, formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          Edit Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="w-full rounded border border-gray-300 bg-white p-3 text-gray-900 outline-none focus:border-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />

          <input
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category"
            className="w-full rounded border border-gray-300 bg-white p-3 text-gray-900 outline-none focus:border-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full rounded border border-gray-300 bg-white p-3 text-gray-900 outline-none focus:border-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />

          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Quantity"
            className="w-full rounded border border-gray-300 bg-white p-3 text-gray-900 outline-none focus:border-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />

          <input
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            placeholder="Unit"
            className="w-full rounded border border-gray-300 bg-white p-3 text-gray-900 outline-none focus:border-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />

          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full rounded border border-gray-300 bg-white p-3 text-gray-900 outline-none focus:border-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />

          <textarea
            rows="4"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full rounded border border-gray-300 bg-white p-3 text-gray-900 outline-none focus:border-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />

          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
            />
            Product Available
          </label>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-gray-300 px-4 py-2 text-gray-800 transition hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProductModal;
