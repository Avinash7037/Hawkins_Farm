import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "hawkins-theme";

function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) === "dark";
  });

  // =====================================================
  // Apply Theme
  // =====================================================

  useEffect(() => {
    const root = document.documentElement;

    if (isDark) {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
      localStorage.setItem(STORAGE_KEY, "dark");
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
      localStorage.setItem(STORAGE_KEY, "light");
    }
  }, [isDark]);

  // =====================================================
  // Toggle Theme
  // =====================================================

  const handleToggle = () => {
    setIsDark((previous) => !previous);
  };

  // =====================================================
  // Render
  // =====================================================

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light Mode" : "Dark Mode"}
      className="
        flex h-10 w-10 items-center justify-center
        rounded-xl
        border border-gray-200
        bg-gray-100
        text-gray-700
        transition-all duration-300
        hover:bg-gray-200
        hover:text-emerald-600
        dark:border-gray-700
        dark:bg-gray-800
        dark:text-yellow-400
        dark:hover:bg-gray-700
        dark:hover:text-yellow-300
      "
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}

export default ThemeToggle;
