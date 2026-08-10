import { useEffect, useState } from "react";
import { X, Upload } from "lucide-react";

const INITIAL_FORM_DATA = {
  name: "",
  description: "",
  category: "",
  price: "",
  quantity: "",
  unit: "kg",
  location: "",
  freshness: "Fresh",
};

function AddProductModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const [images, setImages] = useState([]);

  const [previews, setPreviews] = useState([]);

  const [errors, setErrors] = useState({});

  const [submitting, setSubmitting] = useState(false);

  // =====================================================
  // Reset Form
  // =====================================================

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setImages([]);
    setPreviews([]);
    setErrors({});
    setSubmitting(false);
  };

  // =====================================================
  // Reset When Modal Opens
  // =====================================================

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // =====================================================
  // Clean Preview URLs
  // =====================================================

  useEffect(() => {
    return () => {
      previews.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [previews]);

  // =====================================================
  // Handle Text Inputs
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // =====================================================
  // Handle Images
  // =====================================================

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length === 0) {
      return;
    }

    // -------------------------------------------------
    // Maximum 5 images
    // -------------------------------------------------

    if (selectedFiles.length > 5) {
      setErrors((prev) => ({
        ...prev,
        images: "You can upload a maximum of 5 images.",
      }));

      e.target.value = "";
      return;
    }

    // -------------------------------------------------
    // Validate file types
    // -------------------------------------------------

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    const invalidFile = selectedFiles.find(
      (file) => !allowedTypes.includes(file.type),
    );

    if (invalidFile) {
      setErrors((prev) => ({
        ...prev,
        images: "Only JPG, JPEG, PNG and WEBP images are allowed.",
      }));

      e.target.value = "";
      return;
    }

    // -------------------------------------------------
    // Validate file size
    // -------------------------------------------------

    const maxSize = 5 * 1024 * 1024;

    const oversizedFile = selectedFiles.find((file) => file.size > maxSize);

    if (oversizedFile) {
      setErrors((prev) => ({
        ...prev,
        images: "Each image must be smaller than 5 MB.",
      }));

      e.target.value = "";
      return;
    }

    // -------------------------------------------------
    // Create previews
    // -------------------------------------------------

    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));

    setImages(selectedFiles);
    setPreviews(newPreviews);

    setErrors((prev) => ({
      ...prev,
      images: "",
    }));
  };

  // =====================================================
  // Validate Form
  // =====================================================

  const validateForm = () => {
    const newErrors = {};

    const name = formData.name.trim();
    const description = formData.description.trim();
    const category = formData.category.trim();
    const location = formData.location.trim();

    const price = Number(formData.price);
    const quantity = Number(formData.quantity);

    if (!name) {
      newErrors.name = "Product name is required.";
    } else if (name.length < 2) {
      newErrors.name = "Product name must be at least 2 characters.";
    }

    if (!description) {
      newErrors.description = "Description is required.";
    }

    if (!category) {
      newErrors.category = "Category is required.";
    }

    if (formData.price === "" || !Number.isFinite(price) || price < 0) {
      newErrors.price = "Enter a valid price.";
    }

    if (
      formData.quantity === "" ||
      !Number.isFinite(quantity) ||
      quantity < 0
    ) {
      newErrors.quantity = "Enter a valid quantity.";
    }

    if (!location) {
      newErrors.location = "Location is required.";
    }

    if (images.length === 0) {
      newErrors.images = "Please select at least one product image.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =====================================================
  // Submit
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    const data = new FormData();

    data.append("name", formData.name.trim());

    data.append("description", formData.description.trim());

    data.append("category", formData.category.trim());

    data.append("price", String(Number(formData.price)));

    data.append("quantity", String(Number(formData.quantity)));

    data.append("unit", formData.unit);

    data.append("location", formData.location.trim());

    data.append("freshness", formData.freshness);

    // -------------------------------------------------
    // Add images
    // -------------------------------------------------

    images.forEach((image) => {
      data.append("images", image);
    });

    setSubmitting(true);

    try {
      await onSave(data);

      // The parent closes the modal after
      // a successful Redux action.
      //
      // If the modal is still open, keep the
      // form state instead of destroying user input.
    } catch {
      // Parent/Redux handles the actual error.
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // Close
  // =====================================================

  const handleClose = () => {
    if (submitting) {
      return;
    }

    resetForm();
    onClose();
  };

  // =====================================================
  // Modal
  // =====================================================

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        {/* =================================================
            Header
        ================================================= */}

        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add Product</h2>

            <p className="mt-1 text-sm text-gray-500">
              Add a product to your Hawkins Farm marketplace.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </div>

        {/* =================================================
            Form
        ================================================= */}

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {/* Product Name */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Product Name
            </label>

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Fresh Tomatoes"
              disabled={submitting}
              className={`w-full rounded-lg border p-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 ${
                errors.name ? "border-red-400" : "border-gray-300"
              }`}
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Description */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              rows="4"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your product..."
              disabled={submitting}
              className={`w-full rounded-lg border p-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 ${
                errors.description ? "border-red-400" : "border-gray-300"
              }`}
            />

            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Category + Unit */}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Category
              </label>

              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Vegetables"
                disabled={submitting}
                className={`w-full rounded-lg border p-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 ${
                  errors.category ? "border-red-400" : "border-gray-300"
                }`}
              />

              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Unit
              </label>

              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                disabled={submitting}
                className="w-full rounded-lg border border-gray-300 p-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              >
                <option value="kg">Kilogram (kg)</option>

                <option value="g">Gram (g)</option>

                <option value="piece">Piece</option>

                <option value="dozen">Dozen</option>

                <option value="litre">Litre</option>
              </select>
            </div>
          </div>

          {/* Price + Quantity */}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Price (₹)
              </label>

              <input
                type="number"
                name="price"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                disabled={submitting}
                className={`w-full rounded-lg border p-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 ${
                  errors.price ? "border-red-400" : "border-gray-300"
                }`}
              />

              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Quantity
              </label>

              <input
                type="number"
                name="quantity"
                min="0"
                step="1"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="0"
                disabled={submitting}
                className={`w-full rounded-lg border p-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 ${
                  errors.quantity ? "border-red-400" : "border-gray-300"
                }`}
              />

              {errors.quantity && (
                <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
              )}
            </div>
          </div>

          {/* Location */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Location
            </label>

            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Nashik, Maharashtra"
              disabled={submitting}
              className={`w-full rounded-lg border p-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 ${
                errors.location ? "border-red-400" : "border-gray-300"
              }`}
            />

            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location}</p>
            )}
          </div>

          {/* Freshness */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Freshness
            </label>

            <select
              name="freshness"
              value={formData.freshness}
              onChange={handleChange}
              disabled={submitting}
              className="w-full rounded-lg border border-gray-300 p-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            >
              <option value="Fresh">Fresh</option>

              <option value="1 Day">1 Day</option>

              <option value="2 Days">2 Days</option>

              <option value="3+ Days">3+ Days</option>
            </select>
          </div>

          {/* Images */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Product Images
            </label>

            <label
              className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition hover:border-green-500 hover:bg-green-50 ${
                errors.images ? "border-red-400" : "border-gray-300"
              }`}
            >
              <Upload size={30} className="text-gray-400" />

              <span className="mt-2 font-medium text-gray-700">
                Click to select images
              </span>

              <span className="mt-1 text-sm text-gray-500">
                JPG, JPEG, PNG or WEBP • Maximum 5 images • 5 MB each
              </span>

              <input
                type="file"
                name="images"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                disabled={submitting}
                className="hidden"
              />
            </label>

            {errors.images && (
              <p className="mt-1 text-sm text-red-600">{errors.images}</p>
            )}

            {/* Image Previews */}

            {previews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
                {previews.map((preview, index) => (
                  <div
                    key={preview}
                    className="overflow-hidden rounded-lg border"
                  >
                    <img
                      src={preview}
                      alt={`Product preview ${index + 1}`}
                      className="h-24 w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* =================================================
              Actions
          ================================================= */}

          <div className="flex justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="rounded-lg bg-gray-200 px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-green-600 px-5 py-2.5 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Adding Product..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductModal;
