import api from "../../../services/api";

// =====================================================
// Get Products
// =====================================================

export const getProducts = async (params = {}) => {
  const response = await api.get("/products", {
    params,
  });

  return response.data;
};

// =====================================================
// Get Single Product
// =====================================================

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);

  return response.data;
};
