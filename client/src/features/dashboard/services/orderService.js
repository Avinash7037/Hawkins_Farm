import api from "../../../services/api";

export const getFarmerOrders = async () => {
  const response = await api.get("/orders/farmer-orders");
  return response.data;
};

export const updateOrderStatus = async ({ id, orderStatus }) => {
  const response = await api.put(`/orders/${id}/status`, {
    orderStatus,
  });

  return response.data;
};
