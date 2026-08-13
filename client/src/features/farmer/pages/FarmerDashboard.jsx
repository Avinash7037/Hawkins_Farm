import WeatherCard from "../../weather/components/WeatherCard";

// =====================================================
// Farmer Dashboard
// =====================================================

function FarmerDashboard() {
  return (
    <main
      className="
        min-h-screen
        bg-gray-50
        px-4
        py-8
        transition-colors
        duration-300
        dark:bg-gray-950
        sm:px-6
        lg:px-8
      "
    >
      <div className="mx-auto max-w-7xl">
        {/* =================================================
            Dashboard Header
        ================================================= */}

        <div className="mb-8">
          <h1
            className="
              text-3xl
              font-bold
              text-gray-900
              dark:text-white
            "
          >
            Farmer Dashboard
          </h1>

          <p
            className="
              mt-2
              text-gray-500
              dark:text-gray-400
            "
          >
            Manage your farm activities and check current weather conditions.
          </p>
        </div>

        {/* =================================================
            Weather
        ================================================= */}

        <WeatherCard />
      </div>
    </main>
  );
}

export default FarmerDashboard;
