import api from "../../services/api";

export const getFarmerProducts = async () => {
  const response = await api.get("/products/farmer/my-products");
  return response.data;
};

export const updateProduct = async ({ id, data }) => {
  const response = await api.put(`/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};
