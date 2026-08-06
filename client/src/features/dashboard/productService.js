import api from "../../services/api";

export const getFarmerProducts = async () => {
  const response = await api.get("/products/farmer/my-products");
  return response.data;
};
