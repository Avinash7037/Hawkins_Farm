import api from "../../services/api";

export const getFarmerDashboard = async () => {
  const response = await api.get("/dashboard/farmer");
  return response.data;
};
