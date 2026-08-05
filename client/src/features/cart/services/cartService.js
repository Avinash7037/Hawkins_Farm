import api from "../../../services/api";

export const getCart = async () => {
  const response = await api.get("/cart");
  return response.data;
};

export const addToCart = async (data) => {
  const response = await api.post("/cart", data);
  return response.data;
};

export const updateCartQuantity = async ({ id, quantity }) => {
  const response = await api.put(`/cart/${id}`, {
    quantity,
  });

  return response.data;
};

export const removeCartItem = async (id) => {
  const response = await api.delete(`/cart/${id}`);
  return response.data;
};
