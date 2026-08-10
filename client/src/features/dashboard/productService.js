import api from "../../services/api";

// =====================================================
// Get Farmer Products
// =====================================================

export const getFarmerProducts = async () => {
  const response = await api.get("/products/farmer/my-products");

  return response.data;
};

// =====================================================
// Create Product
// =====================================================

export const createProduct = async (formData) => {
  const response = await api.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// =====================================================
// Update Product
// =====================================================

export const updateProduct = async ({ id, data }) => {
  const response = await api.put(`/products/${id}`, data);

  return response.data;
};

// =====================================================
// Delete Product
// =====================================================

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);

  return response.data;
};
