import api from "../../../services/api";

export const placeOrder = async (orderData) => {
  const response = await api.post("/orders", orderData);
  return response.data;
};

export const getMyOrders = async () => {
  const response = await api.get("/orders/my-orders");
  return response.data;
};

export const getOrder = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};
