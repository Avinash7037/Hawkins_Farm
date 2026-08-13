import { useEffect, useState } from "react";

import {
  Cloud,
  CloudRain,
  CloudSun,
  Droplets,
  Gauge,
  LocateFixed,
  MapPin,
  Search,
  Sun,
  Sunrise,
  Sunset,
  Thermometer,
  Wind,
} from "lucide-react";

import { getWeather, searchWeatherLocations } from "../services/weatherService";

// =====================================================
// Weather Code Helper
// =====================================================

const getWeatherInfo = (code) => {
  const weatherCode = Number(code);

  if (weatherCode === 0) {
    return {
      label: "Clear sky",
      icon: Sun,
    };
  }

  if ([1, 2].includes(weatherCode)) {
    return {
      label: "Partly cloudy",
      icon: CloudSun,
    };
  }

  if (weatherCode === 3) {
    return {
      label: "Overcast",
      icon: Cloud,
    };
  }

  if ([45, 48].includes(weatherCode)) {
    return {
      label: "Fog",
      icon: Cloud,
    };
  }

  if ([51, 53, 55, 56, 57].includes(weatherCode)) {
    return {
      label: "Drizzle",
      icon: CloudRain,
    };
  }

  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) {
    return {
      label: "Rain",
      icon: CloudRain,
    };
  }

  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    return {
      label: "Snow",
      icon: Cloud,
    };
  }

  if ([95, 96, 99].includes(weatherCode)) {
    return {
      label: "Thunderstorm",
      icon: CloudRain,
    };
  }

  return {
    label: "Unknown",
    icon: Cloud,
  };
};

// =====================================================
// Format Date
// =====================================================

const formatDay = (dateString) => {
  if (!dateString) {
    return "";
  }

  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
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

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
};

// =====================================================
// Weather Card
// =====================================================

function WeatherCard() {
  const [query, setQuery] = useState("");

  const [locations, setLocations] = useState([]);

  const [selectedLocation, setSelectedLocation] = useState(null);

  const [weather, setWeather] = useState(null);

  const [loading, setLoading] = useState(false);

  const [searching, setSearching] = useState(false);

  const [error, setError] = useState("");

  const [locationError, setLocationError] = useState("");

  // ===================================================
  // Load Weather
  // ===================================================

  const loadWeather = async (location) => {
    if (!location) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getWeather(location.latitude, location.longitude);

      setWeather(data);

      setSelectedLocation(location);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load weather information.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // Browser Location
  // ===================================================

  const useCurrentLocation = () => {
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Location services are not supported by this browser.");

      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const location = {
            name: "Current Location",
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            country: "",
            state: "",
          };

          await loadWeather(location);
        } catch {
          setLocationError("Unable to get weather for your current location.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setLoading(false);

        setLocationError(
          "Location permission was denied. Search for your location instead.",
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  };

  // ===================================================
  // Search Locations
  // ===================================================

  const handleSearch = async (event) => {
    event.preventDefault();

    const cleanedQuery = query.trim();

    if (cleanedQuery.length < 2) {
      setError("Enter at least 2 characters to search for a location.");

      return;
    }

    try {
      setSearching(true);
      setError("");
      setLocations([]);

      const data = await searchWeatherLocations(cleanedQuery);

      const results = data.locations || [];

      if (!results.length) {
        setError("No matching locations found.");

        return;
      }

      setLocations(results);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to search for this location.",
      );
    } finally {
      setSearching(false);
    }
  };

  // ===================================================
  // Automatically Load Default Location
  // ===================================================

  useEffect(() => {
    useCurrentLocation();
  }, []);

  // ===================================================
  // Current Weather
  // ===================================================

  const current = weather?.current;

  const currentInfo = getWeatherInfo(current?.weather_code);

  const CurrentIcon = currentInfo.icon;

  // ===================================================
  // Render
  // ===================================================

  return (
    <section
      className="
        rounded-3xl
        border
        border-gray-200
        bg-white
        p-6
        shadow-sm
        transition-colors
        duration-300
        dark:border-gray-800
        dark:bg-gray-900
      "
    >
      {/* =================================================
          Header
      ================================================= */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <CloudSun
              size={28}
              className="text-emerald-600 dark:text-emerald-400"
            />

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Weather
            </h2>
          </div>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Check current conditions and the upcoming forecast.
          </p>
        </div>

        <button
          type="button"
          onClick={useCurrentLocation}
          disabled={loading}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-emerald-600
            px-4
            py-2.5
            text-sm
            font-semibold
            text-emerald-600
            transition
            hover:bg-emerald-50
            disabled:cursor-not-allowed
            disabled:opacity-50
            dark:border-emerald-500
            dark:text-emerald-400
            dark:hover:bg-emerald-950/40
          "
        >
          <LocateFixed size={17} />
          Use My Location
        </button>
      </div>

      {/* =================================================
          Search
      ================================================= */}

      <form
        onSubmit={handleSearch}
        className="mt-6 flex flex-col gap-3 sm:flex-row"
      >
        <div className="relative flex-1">
          <Search
            size={19}
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
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search a city or location..."
            className="
              w-full
              rounded-xl
              border
              border-gray-300
              bg-white
              py-3
              pl-11
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
              dark:focus:ring-emerald-900
            "
          />
        </div>

        <button
          type="submit"
          disabled={searching}
          className="
            rounded-xl
            bg-emerald-600
            px-6
            py-3
            font-semibold
            text-white
            transition
            hover:bg-emerald-700
            disabled:cursor-not-allowed
            disabled:opacity-50
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
            dark:border-gray-700
            dark:bg-gray-950
          "
        >
          {locations.map((location) => (
            <button
              key={`${location.id}-${location.latitude}-${location.longitude}`}
              type="button"
              onClick={() => {
                setLocations([]);
                setQuery(location.name);
                loadWeather(location);
              }}
              className="
                flex
                w-full
                items-center
                gap-3
                border-b
                border-gray-100
                px-4
                py-3
                text-left
                transition
                last:border-b-0
                hover:bg-gray-50
                dark:border-gray-800
                dark:hover:bg-gray-900
              "
            >
              <MapPin size={18} className="shrink-0 text-emerald-600" />

              <span>
                <span className="block font-medium text-gray-900 dark:text-white">
                  {location.name}
                </span>

                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {[location.state, location.country]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}

      {/* =================================================
          Errors
      ================================================= */}

      {(error || locationError) && (
        <div
          className="
            mt-4
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
          {error || locationError}
        </div>
      )}

      {/* =================================================
          Loading
      ================================================= */}

      {loading && !weather && (
        <div className="flex min-h-[220px] items-center justify-center">
          <div className="text-center">
            <div
              className="
                mx-auto
                h-9
                w-9
                animate-spin
                rounded-full
                border-4
                border-gray-200
                border-t-emerald-600
              "
            />

            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Loading weather...
            </p>
          </div>
        </div>
      )}

      {/* =================================================
          Weather Content
      ================================================= */}

      {weather && current && (
        <>
          {/* =================================================
              Current Weather
          ================================================= */}

          <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
            {/* Main Current Weather */}

            <div
              className="
                rounded-2xl
                bg-emerald-50
                p-6
                dark:bg-emerald-950/30
              "
            >
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <MapPin size={17} />

                <span>{selectedLocation?.name || "Selected Location"}</span>
              </div>

              <div className="mt-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-6xl font-bold text-gray-900 dark:text-white">
                    {Math.round(Number(current.temperature_2m))}
                    °C
                  </p>

                  <p className="mt-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {currentInfo.label}
                  </p>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Feels like{" "}
                    {Math.round(Number(current.apparent_temperature))}
                    °C
                  </p>
                </div>

                <CurrentIcon
                  size={72}
                  strokeWidth={1.5}
                  className="text-emerald-600 dark:text-emerald-400"
                />
              </div>
            </div>

            {/* Weather Details */}

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Droplets size={18} />

                  <span className="text-sm">Humidity</span>
                </div>

                <p className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
                  {current.relative_humidity_2m}%
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Wind size={18} />

                  <span className="text-sm">Wind</span>
                </div>

                <p className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
                  {Math.round(Number(current.wind_speed_10m))} km/h
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <CloudRain size={18} />

                  <span className="text-sm">Rain</span>
                </div>

                <p className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
                  {Number(current.rain || 0).toFixed(1)} mm
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Gauge size={18} />

                  <span className="text-sm">Precipitation</span>
                </div>

                <p className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
                  {Number(current.precipitation || 0).toFixed(1)} mm
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              Sunrise / Sunset
          ================================================= */}

          {weather.daily && (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-4 rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
                <Sunrise size={28} className="text-orange-500" />

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Sunrise
                  </p>

                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatTime(weather.daily.sunrise?.[0])}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
                <Sunset size={28} className="text-orange-500" />

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Sunset
                  </p>

                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatTime(weather.daily.sunset?.[0])}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* =================================================
              7-Day Forecast
          ================================================= */}

          {weather.daily?.time && (
            <div className="mt-7">
              <div className="mb-4 flex items-center gap-2">
                <Thermometer
                  size={20}
                  className="text-emerald-600 dark:text-emerald-400"
                />

                <h3 className="font-bold text-gray-900 dark:text-white">
                  7-Day Forecast
                </h3>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
                {weather.daily.time.map((date, index) => {
                  const info = getWeatherInfo(
                    weather.daily.weather_code?.[index],
                  );

                  const Icon = info.icon;

                  return (
                    <div
                      key={date}
                      className="
                          rounded-2xl
                          border
                          border-gray-200
                          p-4
                          dark:border-gray-800
                        "
                    >
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formatDay(date)}
                      </p>

                      <Icon
                        size={28}
                        className="my-3 text-emerald-600 dark:text-emerald-400"
                      />

                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {info.label}
                      </p>

                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-bold text-gray-900 dark:text-white">
                          {Math.round(
                            Number(weather.daily.temperature_2m_max?.[index]),
                          )}
                          °
                        </span>

                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {Math.round(
                            Number(weather.daily.temperature_2m_min?.[index]),
                          )}
                          °
                        </span>
                      </div>

                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Rain:{" "}
                        {weather.daily.precipitation_probability_max?.[index] ??
                          0}
                        %
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default WeatherCard;
