import { useState } from "react";

function AddProductModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    quantity: "",
    unit: "kg",
    location: "",
    freshness: "Fresh",
    images: [],
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "images") {
      setFormData((prev) => ({
        ...prev,
        images: files,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === "images") {
        Array.from(formData.images).forEach((image) => {
          data.append("images", image);
        });
      } else {
        data.append(key, formData[key]);
      }
    });

    onSave(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl rounded-xl bg-white p-6">
        <h2 className="mb-6 text-2xl font-bold">Add Product</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Product Name"
            onChange={handleChange}
            className="w-full rounded border p-3"
          />

          <textarea
            rows="4"
            name="description"
            placeholder="Description"
            onChange={handleChange}
            className="w-full rounded border p-3"
          />

          <input
            name="category"
            placeholder="Category"
            onChange={handleChange}
            className="w-full rounded border p-3"
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            onChange={handleChange}
            className="w-full rounded border p-3"
          />

          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            onChange={handleChange}
            className="w-full rounded border p-3"
          />

          <input
            name="location"
            placeholder="Location"
            onChange={handleChange}
            className="w-full rounded border p-3"
          />

          <select
            name="freshness"
            onChange={handleChange}
            className="w-full rounded border p-3"
          >
            <option>Fresh</option>
            <option>1 Day</option>
            <option>2 Days</option>
            <option>3+ Days</option>
          </select>

          <input
            type="file"
            multiple
            name="images"
            accept="image/*"
            onChange={handleChange}
          />

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
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductModal;
