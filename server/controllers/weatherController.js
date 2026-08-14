// =====================================================
// Weather Controller
// =====================================================
//
// Open-Meteo weather service
//
// Weather data is cached in server memory to reduce
// unnecessary requests and avoid exceeding API limits.
//
// Open-Meteo free API limits:
// - < 10,000 requests/day
// - 5,000 requests/hour
// - 600 requests/minute
//
// =====================================================

// =====================================================
// Cache Configuration
// =====================================================

const WEATHER_CACHE_TTL = 15 * 60 * 1000; // 15 minutes
const LOCATION_CACHE_TTL = 30 * 60 * 1000; // 30 minutes

// =====================================================
// In-Memory Caches
// =====================================================

const weatherCache = new Map();
const locationCache = new Map();

// =====================================================
// Helpers
// =====================================================

// Validate coordinate
const isValidCoordinate = (value, min, max) => {
  const number = Number(value);

  return Number.isFinite(number) && number >= min && number <= max;
};

// Round coordinates so tiny GPS differences use the
// same weather cache.
//
// Example:
// 25.495770833457254 -> 25.5
// 81.86867508550188  -> 81.87
//
// This prevents every tiny GPS variation from creating
// a new Open-Meteo request.
const normalizeCoordinate = (value) => {
  return Number(Number(value).toFixed(2));
};

// =====================================================
// Cache Helpers
// =====================================================

const getCachedValue = (cache, key) => {
  const cached = cache.get(key);

  if (!cached) {
    return null;
  }

  const isExpired = Date.now() - cached.timestamp > cached.ttl;

  if (isExpired) {
    cache.delete(key);
    return null;
  }

  return cached.data;
};

const setCachedValue = (cache, key, data, ttl) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  });
};

// =====================================================
// Search Location
// =====================================================
//
// GET /api/weather/search?query=Prayagraj
//
// =====================================================

const searchLocation = async (req, res) => {
  try {
    const query = String(req.query.query || "")
      .trim()
      .replace(/\s+/g, " ");

    // =================================================
    // Validate Search Query
    // =================================================

    if (query.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Please enter at least 2 characters for the location.",
      });
    }

    // =================================================
    // Cache Key
    // =================================================

    const cacheKey = query.toLowerCase();

    // =================================================
    // Check Cache
    // =================================================

    const cachedLocations = getCachedValue(locationCache, cacheKey);

    if (cachedLocations) {
      console.log("Weather location cache hit:", query);

      return res.status(200).json({
        success: true,
        locations: cachedLocations,
        cached: true,
      });
    }

    // =================================================
    // Open-Meteo Geocoding URL
    // =================================================

    const url = new URL("https://geocoding-api.open-meteo.com/v1/search");

    url.searchParams.set("name", query);
    url.searchParams.set("count", "8");
    url.searchParams.set("language", "en");
    url.searchParams.set("format", "json");

    console.log("Weather location API request:", query);

    // =================================================
    // Request Open-Meteo
    // =================================================

    const response = await fetch(url);

    console.log("Open-Meteo geocoding status:", response.status);

    const responseText = await response.text();

    // =================================================
    // Handle API Error
    // =================================================

    if (!response.ok) {
      console.error("Open-Meteo geocoding error:", responseText);

      if (response.status === 429) {
        return res.status(503).json({
          success: false,
          message:
            "Weather location search is temporarily unavailable because the weather service rate limit has been reached. Please try again later.",
          status: 429,
        });
      }

      return res.status(502).json({
        success: false,
        message: "Open-Meteo location service returned an error.",
        status: response.status,
        details: responseText,
      });
    }

    // =================================================
    // Parse Response
    // =================================================

    let data;

    try {
      data = JSON.parse(responseText);
    } catch (error) {
      console.error("Invalid Open-Meteo geocoding response:", error);

      return res.status(502).json({
        success: false,
        message: "Invalid response received from weather location service.",
      });
    }

    // =================================================
    // Format Locations
    // =================================================

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

    // =================================================
    // Store In Cache
    // =================================================

    setCachedValue(locationCache, cacheKey, locations, LOCATION_CACHE_TTL);

    // =================================================
    // Response
    // =================================================

    return res.status(200).json({
      success: true,
      locations,
      cached: false,
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
//
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
//
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

    // =================================================
    // Normalize Coordinates
    // =================================================

    const lat = normalizeCoordinate(latitude);
    const lon = normalizeCoordinate(longitude);

    // =================================================
    // Cache Key
    // =================================================

    const cacheKey = `${lat},${lon}`;

    // =================================================
    // Check Weather Cache
    // =================================================

    const cachedWeather = getCachedValue(weatherCache, cacheKey);

    if (cachedWeather) {
      console.log(`Weather cache hit: ${cacheKey}`);

      return res.status(200).json({
        ...cachedWeather,
        cached: true,
      });
    }

    console.log(`Weather cache miss: ${cacheKey}`);

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
    // Configuration
    // =================================================

    url.searchParams.set("forecast_days", "7");
    url.searchParams.set("temperature_unit", "celsius");
    url.searchParams.set("wind_speed_unit", "kmh");
    url.searchParams.set("precipitation_unit", "mm");
    url.searchParams.set("timezone", "auto");

    // =================================================
    // Request Open-Meteo
    // =================================================

    console.log("Requesting Open-Meteo weather:", cacheKey);

    const response = await fetch(url);

    console.log("Open-Meteo weather status:", response.status);

    const responseText = await response.text();

    // =================================================
    // Handle Open-Meteo Error
    // =================================================

    if (!response.ok) {
      console.error("Open-Meteo weather error:", responseText);

      // ===============================================
      // Rate Limit
      // ===============================================

      if (response.status === 429) {
        return res.status(503).json({
          success: false,
          message:
            "Weather service is temporarily unavailable because the weather API rate limit has been reached. Please try again later.",
          status: 429,
        });
      }

      // ===============================================
      // Other Upstream Errors
      // ===============================================

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

    let data;

    try {
      data = JSON.parse(responseText);
    } catch (error) {
      console.error("Invalid Open-Meteo weather response:", error);

      return res.status(502).json({
        success: false,
        message: "Invalid response received from weather service.",
      });
    }

    // =================================================
    // Prepare Response
    // =================================================

    const weatherResponse = {
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
    };

    // =================================================
    // Store Weather In Cache
    // =================================================

    setCachedValue(weatherCache, cacheKey, weatherResponse, WEATHER_CACHE_TTL);

    console.log(
      `Weather cached for ${WEATHER_CACHE_TTL / 60000} minutes: ${cacheKey}`,
    );

    // =================================================
    // Response
    // =================================================

    return res.status(200).json({
      ...weatherResponse,
      cached: false,
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
