import { Outlet } from "react-router-dom";

import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";

// =====================================================
// Hawkins AI
// =====================================================

import HawkinsChatbot from "../features/ai/components/HawkinsChatbot";

// =====================================================
// Main Layout
// =====================================================

function MainLayout() {
  return (
    <div
      className="
        min-h-screen
        bg-white
        text-gray-900
        transition-colors
        duration-300
        dark:bg-gray-950
        dark:text-gray-100
      "
    >
      {/* =================================================
          Navbar
      ================================================= */}

      <Navbar />

      {/* =================================================
          Main Content
      ================================================= */}

      <main
        className="
          min-h-[calc(100vh-80px)]
          bg-white
          transition-colors
          duration-300
          dark:bg-gray-950
        "
      >
        <Outlet />
      </main>

      {/* =================================================
          Footer
      ================================================= */}

      <Footer />

      {/* =================================================
          Hawkins Farm AI Chatbot
      ================================================= */}

      <HawkinsChatbot />
    </div>
  );
}

export default MainLayout;
