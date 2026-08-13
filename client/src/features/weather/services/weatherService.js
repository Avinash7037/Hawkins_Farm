import api from "../../../services/api";

// =====================================================
// Search Weather Locations
// =====================================================

export const searchWeatherLocations = async (query) => {
  const response = await api.get("/weather/search", {
    params: {
      query,
    },
  });

  return response.data;
};

// =====================================================
// Get Weather
// =====================================================

export const getWeather = async (latitude, longitude) => {
  const response = await api.get("/weather", {
    params: {
      latitude,
      longitude,
    },
  });

  return response.data;
};
