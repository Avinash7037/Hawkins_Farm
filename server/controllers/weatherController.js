// =====================================================
// Weather Controller
// =====================================================

// Open-Meteo does not require an API key for normal
// non-commercial use.
//
// Documentation:
// https://open-meteo.com/en/docs
// https://open-meteo.com/en/docs/geocoding-api
// =====================================================

// =====================================================
// Helpers
// =====================================================

const isValidCoordinate = (value, min, max) => {
  const number = Number(value);

  return Number.isFinite(number) && number >= min && number <= max;
};

// =====================================================
// Search Location
// =====================================================
//
// GET /api/weather/search?query=Prayagraj
//
// Used to convert a location name into latitude +
// longitude.
// =====================================================

const searchLocation = async (req, res) => {
  try {
    const query = String(req.query.query || "").trim();

    if (query.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Please enter at least 2 characters for the location.",
      });
    }

    const url = new URL("https://geocoding-api.open-meteo.com/v1/search");

    url.searchParams.set("name", query);
    url.searchParams.set("count", "8");
    url.searchParams.set("language", "en");
    url.searchParams.set("format", "json");

    console.log("Weather location API URL:", url.toString());

    const response = await fetch(url);

    console.log("Open-Meteo geocoding status:", response.status);

    const responseText = await response.text();

    console.log("Open-Meteo geocoding response:", responseText);

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        message: "Open-Meteo location service returned an error.",
        status: response.status,
        details: responseText,
      });
    }

    const data = JSON.parse(responseText);

    const locations = (data.results || []).map((location) => ({
      id: location.id,
      name: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
      country: location.country || "",
      countryCode: location.country_code || "",
      state: location.admin1 || "",
      timezone: location.timezone || "",
    }));

    return res.status(200).json({
      success: true,
      locations,
    });
  } catch (error) {
    console.error("Weather location search error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to search for weather locations.",
    });
  }
};

// =====================================================
// Get Weather
// =====================================================
//
// GET /api/weather?latitude=...&longitude=...
//
// Returns:
// - Current temperature
// - Feels like temperature
// - Humidity
// - Precipitation
// - Rain
// - Wind
// - Weather condition
// - Sunrise
// - Sunset
// - 7-day forecast
// =====================================================

const getWeather = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    // =================================================
    // Validate Coordinates
    // =================================================

    if (!isValidCoordinate(latitude, -90, 90)) {
      return res.status(400).json({
        success: false,
        message: "Invalid latitude.",
      });
    }

    if (!isValidCoordinate(longitude, -180, 180)) {
      return res.status(400).json({
        success: false,
        message: "Invalid longitude.",
      });
    }

    const lat = Number(latitude);
    const lon = Number(longitude);

    // =================================================
    // Open-Meteo URL
    // =================================================

    const url = new URL("https://api.open-meteo.com/v1/forecast");

    url.searchParams.set("latitude", lat.toString());

    url.searchParams.set("longitude", lon.toString());

    // =================================================
    // Current Weather
    // =================================================

    url.searchParams.set(
      "current",
      [
        "temperature_2m",
        "relative_humidity_2m",
        "apparent_temperature",
        "is_day",
        "precipitation",
        "rain",
        "weather_code",
        "wind_speed_10m",
        "wind_direction_10m",
      ].join(","),
    );

    // =================================================
    // Daily Forecast
    // =================================================

    url.searchParams.set(
      "daily",
      [
        "weather_code",
        "temperature_2m_max",
        "temperature_2m_min",
        "precipitation_sum",
        "precipitation_probability_max",
        "wind_speed_10m_max",
        "sunrise",
        "sunset",
      ].join(","),
    );

    // =================================================
    // Units & Forecast Configuration
    // =================================================

    url.searchParams.set("forecast_days", "7");
    url.searchParams.set("temperature_unit", "celsius");
    url.searchParams.set("wind_speed_unit", "kmh");
    url.searchParams.set("precipitation_unit", "mm");
    url.searchParams.set("timezone", "auto");

    // =================================================
    // Request Weather
    // =================================================

    console.log("Weather API URL:", url.toString());

    const response = await fetch(url);

    console.log("Open-Meteo status:", response.status);

    // Read response as text first so we can see
    // the actual Open-Meteo error if something fails.
    const responseText = await response.text();

    console.log("Open-Meteo response:", responseText);

    // =================================================
    // Handle Open-Meteo Error
    // =================================================

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        message: "Open-Meteo weather service returned an error.",
        status: response.status,
        details: responseText,
      });
    }

    // =================================================
    // Parse Response
    // =================================================

    const data = JSON.parse(responseText);

    // =================================================
    // Send Weather Response
    // =================================================

    return res.status(200).json({
      success: true,

      location: {
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone,
      },

      current: data.current || null,

      currentUnits: data.current_units || {},

      daily: data.daily || null,

      dailyUnits: data.daily_units || {},
    });
  } catch (error) {
    console.error("Get weather error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch weather information.",
    });
  }
};

// =====================================================
// Export
// =====================================================

module.exports = {
  searchLocation,
  getWeather,
};
