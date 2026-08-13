import api from "../../services/api";

// =====================================================
// Get Farmer Dashboard
// =====================================================

export const getFarmerDashboard = async (period = "30d") => {
  const response = await api.get(`/dashboard/farmer?period=${period}`);

  return response.data;
};
