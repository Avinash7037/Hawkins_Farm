import api from "../../../services/api";

// =====================================================
// Get Farmer Orders
// =====================================================

export const getFarmerOrders = async () => {
  const response = await api.get("/orders/farmer-orders");

  return response.data;
};

// =====================================================
// Update Farmer Order Status
// =====================================================

export const updateOrderStatus = async ({ id, orderStatus }) => {
  console.log("Service order ID:", id, "Status:", orderStatus);

  if (!id) {
    throw new Error("Order ID is required");
  }

  if (!orderStatus) {
    throw new Error("Order status is required");
  }

  const response = await api.put(`/orders/${id}/status`, {
    orderStatus,
  });

  return response.data;
};
