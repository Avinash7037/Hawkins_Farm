import { X } from "lucide-react";
import { Link } from "react-router-dom";

import NavLinks from "./NavLinks";
import ThemeToggle from "../common/ThemeToggle";

// =====================================================
// Mobile Menu
// =====================================================

function MobileMenu({ open, setOpen, user, onLogout }) {
  if (!open) {
    return null;
  }

  // =====================================================
  // Profile Path
  // =====================================================

  const profilePath = user?.role === "farmer" ? "/farmer/profile" : "/profile";

  return (
    <div
      className="
        border-t
        border-gray-200
        bg-white
        transition-colors duration-300
        dark:border-gray-800
        dark:bg-gray-950
        md:hidden
      "
    >
      {/* =================================================
          Close Button
      ================================================= */}

      <div className="flex justify-end px-6 pt-4">
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close navigation menu"
          className="
            text-gray-700
            transition
            hover:text-emerald-600
            dark:text-gray-300
            dark:hover:text-emerald-400
          "
        >
          <X size={26} />
        </button>
      </div>

      {/* =================================================
          Navigation Links
      ================================================= */}

      <div className="px-6 pb-6">
        <NavLinks mobile onClick={() => setOpen(false)} />

        {/* =================================================
            Theme
        ================================================= */}

        <div
          className="
            mt-4
            flex items-center justify-between
            border-t
            border-gray-200
            pt-4
            dark:border-gray-800
          "
        >
          <div>
            <p className="font-medium text-gray-800 dark:text-gray-200">
              Theme
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Switch between light and dark mode
            </p>
          </div>

          <ThemeToggle />
        </div>

        {/* =================================================
            Guest Actions
        ================================================= */}

        {!user ? (
          <>
            <Link
              to="/login"
              className="
                mt-4 block
                rounded-xl
                border border-emerald-600
                py-3
                text-center
                font-semibold
                text-emerald-600
                transition
                hover:bg-emerald-50
                dark:border-emerald-500
                dark:text-emerald-400
                dark:hover:bg-emerald-950/40
              "
              onClick={() => setOpen(false)}
            >
              Login
            </Link>

            <Link
              to="/register"
              className="
                mt-2 block
                rounded-xl
                bg-emerald-600
                py-3
                text-center
                font-semibold
                text-white
                transition
                hover:bg-emerald-700
              "
              onClick={() => setOpen(false)}
            >
              Get Started
            </Link>
          </>
        ) : (
          <>
            {/* =================================================
                Logged-in User
            ================================================= */}

            <div
              className="
                mt-4
                border-t
                border-gray-200
                pt-4
                dark:border-gray-800
              "
            >
              <p className="text-center font-medium text-gray-700 dark:text-gray-200">
                Hi, {user.name}
              </p>

              <p className="mt-1 text-center text-sm capitalize text-gray-500 dark:text-gray-400">
                {user.role}
              </p>
            </div>

            {/* =================================================
                Profile
            ================================================= */}

            <Link
              to={profilePath}
              onClick={() => setOpen(false)}
              className="
                mt-4 block
                rounded-xl
                border border-emerald-600
                py-3
                text-center
                font-semibold
                text-emerald-600
                transition
                hover:bg-emerald-50
                dark:border-emerald-500
                dark:text-emerald-400
                dark:hover:bg-emerald-950/40
              "
            >
              Profile
            </Link>

            {/* =================================================
                Logout
            ================================================= */}

            <button
              type="button"
              onClick={onLogout}
              className="
                mt-2 block
                w-full
                rounded-xl
                border border-red-600
                py-3
                text-center
                font-semibold
                text-red-600
                transition
                hover:bg-red-50
                dark:border-red-500
                dark:text-red-400
                dark:hover:bg-red-950/40
              "
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default MobileMenu;
