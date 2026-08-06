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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-xl rounded-xl bg-white p-6">
        <h2 className="mb-6 text-2xl font-bold">Edit Product</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="w-full rounded border p-3"
          />

          <input
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category"
            className="w-full rounded border p-3"
          />

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full rounded border p-3"
          />

          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Quantity"
            className="w-full rounded border p-3"
          />

          <input
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            placeholder="Unit"
            className="w-full rounded border p-3"
          />

          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full rounded border p-3"
          />

          <textarea
            rows="4"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full rounded border p-3"
          />

          <label className="flex items-center gap-2">
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
              className="rounded bg-gray-300 px-4 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded bg-green-600 px-4 py-2 text-white"
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
