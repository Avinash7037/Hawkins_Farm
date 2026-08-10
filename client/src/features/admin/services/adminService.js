import api from "../../../services/api";

// =====================================================
// Admin Dashboard
// =====================================================

export const getAdminDashboard = async () => {
  const response = await api.get("/dashboard/admin");

  return response.data;
};

// =====================================================
// Users
// =====================================================

export const getAllUsers = async () => {
  const response = await api.get("/users/admin/users");

  return response.data;
};

export const updateUserStatus = async (id, isActive) => {
  const response = await api.put(`/users/admin/users/${id}/status`, {
    isActive,
  });

  return response.data;
};

// =====================================================
// Products
// =====================================================

export const getAllAdminProducts = async () => {
  const response = await api.get("/products/admin/all");

  return response.data;
};

export const updateAdminProductStatus = async (id, isAvailable) => {
  const response = await api.put(`/products/admin/${id}/status`, {
    isAvailable,
  });

  return response.data;
};

// =====================================================
// Admin Orders
// =====================================================

export const getAllAdminOrders = async () => {
  const response = await api.get("/orders/admin/all");

  return response.data;
};
