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

export const createProduct = async (formData) => {
  const response = await api.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
