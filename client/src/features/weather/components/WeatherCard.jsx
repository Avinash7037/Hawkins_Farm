import { useEffect, useState } from "react";
import {
  Cloud,
  CloudDrizzle,
  CloudRain,
  CloudSun,
  Droplets,
  Gauge,
  MapPin,
  Navigation,
  Search,
  Sun,
  Sunrise,
  Sunset,
  Thermometer,
  Wind,
  LocateFixed,
} from "lucide-react";

import api from "../../../services/api";

// =====================================================
// Weather Code Helper
// =====================================================

const getWeatherInfo = (code) => {
  const weatherMap = {
    0: {
      label: "Clear sky",
      icon: Sun,
    },

    1: {
      label: "Mainly clear",
      icon: CloudSun,
    },

    2: {
      label: "Partly cloudy",
      icon: CloudSun,
    },

    3: {
      label: "Overcast",
      icon: Cloud,
    },

    45: {
      label: "Fog",
      icon: Cloud,
    },

    48: {
      label: "Depositing rime fog",
      icon: Cloud,
    },

    51: {
      label: "Light drizzle",
      icon: CloudDrizzle,
    },

    53: {
      label: "Moderate drizzle",
      icon: CloudDrizzle,
    },

    55: {
      label: "Dense drizzle",
      icon: CloudDrizzle,
    },

    56: {
      label: "Light freezing drizzle",
      icon: CloudDrizzle,
    },

    57: {
      label: "Dense freezing drizzle",
      icon: CloudDrizzle,
    },

    61: {
      label: "Slight rain",
      icon: CloudRain,
    },

    63: {
      label: "Moderate rain",
      icon: CloudRain,
    },

    65: {
      label: "Heavy rain",
      icon: CloudRain,
    },

    66: {
      label: "Light freezing rain",
      icon: CloudRain,
    },

    67: {
      label: "Heavy freezing rain",
      icon: CloudRain,
    },

    71: {
      label: "Slight snowfall",
      icon: Cloud,
    },

    73: {
      label: "Moderate snowfall",
      icon: Cloud,
    },

    75: {
      label: "Heavy snowfall",
      icon: Cloud,
    },

    77: {
      label: "Snow grains",
      icon: Cloud,
    },

    80: {
      label: "Slight rain showers",
      icon: CloudRain,
    },

    81: {
      label: "Moderate rain showers",
      icon: CloudRain,
    },

    82: {
      label: "Violent rain showers",
      icon: CloudRain,
    },

    85: {
      label: "Slight snow showers",
      icon: Cloud,
    },

    86: {
      label: "Heavy snow showers",
      icon: Cloud,
    },

    95: {
      label: "Thunderstorm",
      icon: CloudRain,
    },

    96: {
      label: "Thunderstorm with slight hail",
      icon: CloudRain,
    },

    99: {
      label: "Thunderstorm with heavy hail",
      icon: CloudRain,
    },
  };

  return (
    weatherMap[code] || {
      label: "Unknown conditions",
      icon: Cloud,
    }
  );
};

// =====================================================
// Format Time
// =====================================================

const formatTime = (value) => {
  if (!value) {
    return "--";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--";
  }

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
};

// =====================================================
// Format Date
// =====================================================

const formatDate = (value) => {
  if (!value) {
    return "--";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--";
  }

  return date.toLocaleDateString([], {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

// =====================================================
// Location Label
// =====================================================

const getLocationSubtitle = (location) => {
  if (!location) {
    return "";
  }

  return [location.state, location.country].filter(Boolean).join(", ");
};

// =====================================================
// Stat Card
// =====================================================

function WeatherStat({ icon: Icon, title, value, unit = "" }) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-gray-200
        bg-white
        p-5
        dark:border-gray-800
        dark:bg-gray-900
      "
    >
      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
        <Icon size={20} className="text-emerald-600 dark:text-emerald-400" />

        <span className="text-sm font-medium">{title}</span>
      </div>

      <p className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
        {value ?? "--"}
        {unit}
      </p>
    </div>
  );
}

// =====================================================
// Weather Card
// =====================================================

function WeatherCard() {
  // ===================================================
  // State
  // ===================================================

  const [search, setSearch] = useState("");

  const [locations, setLocations] = useState([]);

  const [selectedLocation, setSelectedLocation] = useState(null);

  const [weather, setWeather] = useState(null);

  const [loading, setLoading] = useState(false);

  const [searching, setSearching] = useState(false);

  const [locationLoading, setLocationLoading] = useState(false);

  const [error, setError] = useState("");

  // ===================================================
  // Fetch Weather
  // ===================================================

  const fetchWeather = async (location) => {
    if (location?.latitude === undefined || location?.longitude === undefined) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.get("/weather", {
        params: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
      });

      const data = response.data;

      setWeather(data);

      // ------------------------------------------------
      // Preserve location information returned by
      // geocoding, while also using backend coordinates
      // and timezone.
      // ------------------------------------------------

      setSelectedLocation((previous) => ({
        ...(previous || {}),
        ...location,
        latitude: data.location?.latitude ?? location.latitude,

        longitude: data.location?.longitude ?? location.longitude,

        timezone: data.location?.timezone ?? location.timezone ?? "",
      }));
    } catch (err) {
      console.error("Weather fetch error:", err);

      setError(
        err.response?.data?.message || "Unable to fetch weather information.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // Search Locations
  // ===================================================

  const handleSearch = async (event) => {
    event?.preventDefault();

    const cleanedSearch = search.trim();

    if (cleanedSearch.length < 2) {
      setError("Please enter at least 2 characters for the location.");

      return;
    }

    try {
      setSearching(true);
      setError("");
      setLocations([]);

      const response = await api.get("/weather/search", {
        params: {
          query: cleanedSearch,
        },
      });

      const results = response.data?.locations || [];

      setLocations(results);

      if (!results.length) {
        setError("No matching locations found.");

        return;
      }

      // ------------------------------------------------
      // Automatically select the first result.
      // ------------------------------------------------

      const firstLocation = results[0];

      setSelectedLocation(firstLocation);

      await fetchWeather(firstLocation);
    } catch (err) {
      console.error("Location search error:", err);

      setError(
        err.response?.data?.message || "Unable to search for this location.",
      );
    } finally {
      setSearching(false);
    }
  };

  // ===================================================
  // Select Search Result
  // ===================================================

  const handleSelectLocation = async (location) => {
    setLocations([]);

    setSelectedLocation(location);

    await fetchWeather(location);
  };

  // ===================================================
  // Browser Location
  // ===================================================

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError("Location services are not supported by your browser.");

      return;
    }

    setLocationLoading(true);
    setError("");
    setLocations([]);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location = {
          name: "Current Location",

          latitude: position.coords.latitude,

          longitude: position.coords.longitude,

          state: "",

          country: "",

          countryCode: "",

          timezone: "",
        };

        setSelectedLocation(location);

        await fetchWeather(location);

        setLocationLoading(false);
      },

      (geoError) => {
        console.error("Browser location error:", geoError);

        setLocationLoading(false);

        if (geoError.code === 1) {
          setError(
            "Location permission was denied. Please allow location access and try again.",
          );
        } else if (geoError.code === 2) {
          setError("Your current location could not be determined.");
        } else {
          setError("Unable to access your current location.");
        }
      },

      {
        enableHighAccuracy: true,

        timeout: 10000,

        maximumAge: 300000,
      },
    );
  };

  // ===================================================
  // Initial Weather
  // ===================================================
  //
  // Do NOT automatically request browser location.
  // The user explicitly chooses "Use My Location".
  //
  // ===================================================

  useEffect(() => {
    // Intentionally empty.
  }, []);

  // ===================================================
  // Current Weather Data
  // ===================================================

  const current = weather?.current;

  const currentUnits = weather?.currentUnits || {};

  const daily = weather?.daily;

  // ===================================================
  // Weather Information
  // ===================================================

  const currentWeatherInfo = getWeatherInfo(current?.weather_code);

  const CurrentWeatherIcon = currentWeatherInfo.icon;

  // ===================================================
  // Location Details
  // ===================================================

  const locationSubtitle = getLocationSubtitle(selectedLocation);

  const latitude = selectedLocation?.latitude ?? weather?.location?.latitude;

  const longitude = selectedLocation?.longitude ?? weather?.location?.longitude;

  const timezone =
    selectedLocation?.timezone || weather?.location?.timezone || "";

  // ===================================================
  // Render
  // ===================================================

  return (
    <section
      className="
        bg-gray-50
        px-4
        py-12
        transition-colors
        duration-300
        dark:bg-gray-950
        sm:px-6
        lg:px-8
      "
    >
      <div
        className="
          mx-auto
          max-w-7xl
          rounded-3xl
          border
          border-gray-200
          bg-white
          p-6
          shadow-sm
          dark:border-gray-800
          dark:bg-gray-900
          sm:p-8
        "
      >
        {/* =================================================
            Header
        ================================================= */}

        <div
          className="
            flex
            flex-col
            gap-5
            lg:flex-row
            lg:items-start
            lg:justify-between
          "
        >
          <div>
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-emerald-50
                  text-emerald-600
                  dark:bg-emerald-950/50
                  dark:text-emerald-400
                "
              >
                <CloudSun size={25} />
              </div>

              <div>
                <h2
                  className="
                    text-2xl
                    font-bold
                    text-gray-900
                    dark:text-white
                  "
                >
                  Weather
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Check current conditions and the upcoming forecast.
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              Current Location Button
          ================================================= */}

          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={locationLoading}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-emerald-600
              px-5
              py-3
              font-semibold
              text-emerald-600
              transition
              hover:bg-emerald-50
              disabled:cursor-not-allowed
              disabled:opacity-60
              dark:border-emerald-500
              dark:text-emerald-400
              dark:hover:bg-emerald-950/40
            "
          >
            <LocateFixed size={18} />

            {locationLoading ? "Getting Location..." : "Use My Location"}
          </button>
        </div>

        {/* =================================================
            Search
        ================================================= */}

        <form
          onSubmit={handleSearch}
          className="
            relative
            mt-8
            flex
            flex-col
            gap-3
            sm:flex-row
          "
        >
          <div className="relative flex-1">
            <Search
              size={20}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search a city or location..."
              className="
                w-full
                rounded-xl
                border
                border-gray-300
                bg-white
                py-3
                pl-12
                pr-4
                text-gray-900
                outline-none
                transition
                focus:border-emerald-500
                focus:ring-2
                focus:ring-emerald-200
                dark:border-gray-700
                dark:bg-gray-950
                dark:text-white
                dark:focus:border-emerald-500
              "
            />
          </div>

          <button
            type="submit"
            disabled={searching}
            className="
              rounded-xl
              bg-emerald-600
              px-7
              py-3
              font-semibold
              text-white
              transition
              hover:bg-emerald-700
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {searching ? "Searching..." : "Search"}
          </button>
        </form>

        {/* =================================================
            Search Results
        ================================================= */}

        {locations.length > 0 && (
          <div
            className="
              mt-3
              overflow-hidden
              rounded-xl
              border
              border-gray-200
              bg-white
              shadow-lg
              dark:border-gray-700
              dark:bg-gray-900
            "
          >
            {locations.map((location) => (
              <button
                key={location.id}
                type="button"
                onClick={() => handleSelectLocation(location)}
                className="
                  flex
                  w-full
                  items-start
                  gap-3
                  border-b
                  border-gray-100
                  px-4
                  py-3
                  text-left
                  transition
                  last:border-b-0
                  hover:bg-emerald-50
                  dark:border-gray-800
                  dark:hover:bg-gray-800
                "
              >
                <MapPin
                  size={19}
                  className="
                    mt-1
                    shrink-0
                    text-emerald-600
                    dark:text-emerald-400
                  "
                />

                <div>
                  <p
                    className="
                      font-semibold
                      text-gray-900
                      dark:text-white
                    "
                  >
                    {location.name}
                  </p>

                  <p
                    className="
                      text-sm
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    {[location.state, location.country]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* =================================================
            Error
        ================================================= */}

        {error && (
          <div
            className="
              mt-5
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-4
              py-3
              text-sm
              text-red-700
              dark:border-red-900
              dark:bg-red-950/40
              dark:text-red-300
            "
          >
            {error}
          </div>
        )}

        {/* =================================================
            Loading
        ================================================= */}

        {loading && (
          <div className="py-16 text-center">
            <div
              className="
                mx-auto
                h-10
                w-10
                animate-spin
                rounded-full
                border-4
                border-gray-200
                border-t-emerald-600
                dark:border-gray-700
                dark:border-t-emerald-400
              "
            />

            <p
              className="
                mt-4
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              Fetching current weather...
            </p>
          </div>
        )}

        {/* =================================================
            Weather Content
        ================================================= */}

        {!loading && weather?.current && (
          <>
            {/* =================================================
                Location Details
            ================================================= */}

            <div
              className="
                mt-8
                rounded-2xl
                border
                border-emerald-100
                bg-emerald-50/70
                p-5
                dark:border-emerald-900/50
                dark:bg-emerald-950/30
              "
            >
              <div className="flex items-start gap-3">
                <MapPin
                  size={22}
                  className="
                    mt-1
                    shrink-0
                    text-emerald-600
                    dark:text-emerald-400
                  "
                />

                <div className="min-w-0">
                  {/* Location Name */}

                  <h3
                    className="
                      text-lg
                      font-bold
                      text-gray-900
                      dark:text-white
                    "
                  >
                    {selectedLocation?.name || "Selected Location"}
                  </h3>

                  {/* State + Country */}

                  {locationSubtitle && (
                    <p
                      className="
                        mt-1
                        text-sm
                        text-gray-600
                        dark:text-gray-300
                      "
                    >
                      {locationSubtitle}
                    </p>
                  )}

                  {/* Coordinates */}

                  {latitude !== undefined && longitude !== undefined && (
                    <p
                      className="
                          mt-2
                          text-xs
                          text-gray-500
                          dark:text-gray-400
                        "
                    >
                      Coordinates: {Number(latitude).toFixed(4)}°,{" "}
                      {Number(longitude).toFixed(4)}°
                    </p>
                  )}

                  {/* Timezone */}

                  {timezone && (
                    <p
                      className="
                        mt-1
                        text-xs
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      Timezone: {timezone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* =================================================
                Current Weather
            ================================================= */}

            <div
              className="
                mt-6
                grid
                gap-5
                lg:grid-cols-3
              "
            >
              {/* Main Weather */}

              <div
                className="
                  rounded-2xl
                  bg-emerald-50
                  p-6
                  dark:bg-emerald-950/40
                  lg:col-span-1
                "
              >
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <MapPin size={18} />

                  <span className="font-medium">
                    {selectedLocation?.name || "Selected Location"}
                  </span>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <p
                      className="
                        text-5xl
                        font-bold
                        tracking-tight
                        text-gray-900
                        dark:text-white
                      "
                    >
                      {Math.round(current.temperature_2m)}
                      °C
                    </p>

                    <p
                      className="
                        mt-3
                        font-semibold
                        text-gray-900
                        dark:text-white
                      "
                    >
                      {currentWeatherInfo.label}
                    </p>

                    <p
                      className="
                        mt-1
                        text-sm
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      Feels like {Math.round(current.apparent_temperature)}
                      °C
                    </p>
                  </div>

                  <CurrentWeatherIcon
                    size={68}
                    strokeWidth={1.7}
                    className="
                      text-emerald-600
                      dark:text-emerald-400
                    "
                  />
                </div>
              </div>

              {/* Weather Stats */}

              <div
                className="
                  grid
                  gap-4
                  sm:grid-cols-2
                  lg:col-span-2
                "
              >
                <WeatherStat
                  icon={Droplets}
                  title="Humidity"
                  value={current.relative_humidity_2m}
                  unit={currentUnits.relative_humidity_2m || "%"}
                />

                <WeatherStat
                  icon={Wind}
                  title="Wind"
                  value={Math.round(current.wind_speed_10m)}
                  unit={currentUnits.wind_speed_10m || " km/h"}
                />

                <WeatherStat
                  icon={CloudRain}
                  title="Rain"
                  value={Number(current.rain || 0).toFixed(1)}
                  unit={currentUnits.rain || " mm"}
                />

                <WeatherStat
                  icon={Gauge}
                  title="Precipitation"
                  value={Number(current.precipitation || 0).toFixed(1)}
                  unit={currentUnits.precipitation || " mm"}
                />
              </div>
            </div>

            {/* =================================================
                Sunrise / Sunset
            ================================================= */}

            {daily?.sunrise?.[0] && daily?.sunset?.[0] && (
              <div
                className="
                    mt-6
                    grid
                    gap-4
                    md:grid-cols-2
                  "
              >
                <div
                  className="
                      flex
                      items-center
                      gap-4
                      rounded-2xl
                      border
                      border-gray-200
                      bg-white
                      p-5
                      dark:border-gray-800
                      dark:bg-gray-900
                    "
                >
                  <Sunrise size={30} className="text-orange-500" />

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Sunrise
                    </p>

                    <p className="mt-1 font-bold text-gray-900 dark:text-white">
                      {formatTime(daily.sunrise[0])}
                    </p>
                  </div>
                </div>

                <div
                  className="
                      flex
                      items-center
                      gap-4
                      rounded-2xl
                      border
                      border-gray-200
                      bg-white
                      p-5
                      dark:border-gray-800
                      dark:bg-gray-900
                    "
                >
                  <Sunset size={30} className="text-orange-500" />

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Sunset
                    </p>

                    <p className="mt-1 font-bold text-gray-900 dark:text-white">
                      {formatTime(daily.sunset[0])}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* =================================================
                7-Day Forecast
            ================================================= */}

            {daily?.time?.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center gap-2">
                  <Thermometer
                    size={20}
                    className="
                      text-emerald-600
                      dark:text-emerald-400
                    "
                  />

                  <h3
                    className="
                      text-xl
                      font-bold
                      text-gray-900
                      dark:text-white
                    "
                  >
                    7-Day Forecast
                  </h3>
                </div>

                <div
                  className="
                    mt-5
                    grid
                    gap-4
                    sm:grid-cols-2
                    lg:grid-cols-4
                    xl:grid-cols-7
                  "
                >
                  {daily.time.map((date, index) => {
                    const forecastInfo = getWeatherInfo(
                      daily.weather_code?.[index],
                    );

                    const ForecastIcon = forecastInfo.icon;

                    return (
                      <div
                        key={date}
                        className="
                            rounded-2xl
                            border
                            border-gray-200
                            bg-white
                            p-4
                            dark:border-gray-800
                            dark:bg-gray-900
                          "
                      >
                        {/* Date */}

                        <p
                          className="
                              text-sm
                              font-semibold
                              text-gray-900
                              dark:text-white
                            "
                        >
                          {formatDate(date)}
                        </p>

                        {/* Icon */}

                        <ForecastIcon
                          size={32}
                          strokeWidth={1.7}
                          className="
                              mt-5
                              text-emerald-600
                              dark:text-emerald-400
                            "
                        />

                        {/* Condition */}

                        <p
                          className="
                              mt-3
                              min-h-[40px]
                              text-xs
                              leading-5
                              text-gray-500
                              dark:text-gray-400
                            "
                        >
                          {forecastInfo.label}
                        </p>

                        {/* Temperature */}

                        <div className="mt-3 flex items-end justify-between gap-2">
                          <span
                            className="
                                text-lg
                                font-bold
                                text-gray-900
                                dark:text-white
                              "
                          >
                            {Math.round(daily.temperature_2m_max?.[index])}°
                          </span>

                          <span
                            className="
                                text-sm
                                text-gray-500
                                dark:text-gray-400
                              "
                          >
                            {Math.round(daily.temperature_2m_min?.[index])}°
                          </span>
                        </div>

                        {/* Rain Probability */}

                        {daily.precipitation_probability_max?.[index] !==
                          undefined && (
                          <p
                            className="
                                mt-3
                                text-xs
                                text-gray-500
                                dark:text-gray-400
                              "
                          >
                            Rain: {daily.precipitation_probability_max[index]}%
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* =================================================
            Initial Empty State
        ================================================= */}

        {!loading && !weather && !error && (
          <div
            className="
              mt-8
              rounded-2xl
              border
              border-dashed
              border-gray-300
              px-6
              py-14
              text-center
              dark:border-gray-700
            "
          >
            <CloudSun
              size={46}
              className="
                mx-auto
                text-emerald-600
                dark:text-emerald-400
              "
            />

            <h3
              className="
                mt-4
                text-lg
                font-semibold
                text-gray-900
                dark:text-white
              "
            >
              Check the weather for your location
            </h3>

            <p
              className="
                mx-auto
                mt-2
                max-w-md
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              Search for a city or use your current location to see current
              conditions and the 7-day forecast.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default WeatherCard;
