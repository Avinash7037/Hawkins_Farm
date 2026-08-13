import { useState } from "react";
import { Menu } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import Logo from "../common/Logo";
import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";

import { logout } from "../../features/auth/authSlice";
import NotificationBell from "../../features/notifications/components/NotificationBell";
import ThemeToggle from "../common/ThemeToggle";

function Navbar() {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  // =====================================================
  // Logout
  // =====================================================

  const handleLogout = () => {
    dispatch(logout());

    setOpen(false);
  };

  // =====================================================
  // Profile Path
  // =====================================================

  const profilePath = user?.role === "farmer" ? "/farmer/profile" : "/profile";

  // =====================================================
  // Render
  // =====================================================

  return (
    <header
      className="
        border-b border-gray-200
        bg-white
        transition-colors duration-300
        dark:border-gray-800
        dark:bg-gray-950
      "
    >
      <div
        className="
          mx-auto
          flex
          w-full
          max-w-[1600px]
          items-center
          px-4
          py-4
          sm:px-6
          lg:px-8
        "
      >
        {/* =================================================
            Logo
        ================================================= */}

        <div className="shrink-0">
          <Logo />
        </div>

        {/* =================================================
            Desktop Navigation
        ================================================= */}

        <nav
          className="
            ml-12
            hidden
            min-w-0
            flex-1
            items-center
            justify-between
            md:flex
          "
        >
          {/* =================================================
              Main Navigation
          ================================================= */}

          <div className="flex min-w-0 items-center gap-5 lg:gap-6">
            <NavLinks />
          </div>

          {/* =================================================
              Right Side Actions
          ================================================= */}

          <div className="ml-6 flex shrink-0 items-center gap-5">
            {/* =================================================
                Theme Toggle
            ================================================= */}

            <ThemeToggle />

            {!user ? (
              <>
                {/* =================================================
                    Login
                ================================================= */}

                <Link
                  to="/login"
                  className="
                    whitespace-nowrap
                    font-medium
                    text-gray-700
                    transition
                    hover:text-emerald-600
                    dark:text-gray-300
                    dark:hover:text-emerald-400
                  "
                >
                  Login
                </Link>

                {/* =================================================
                    Get Started
                ================================================= */}

                <Link
                  to="/register"
                  className="
                    whitespace-nowrap
                    rounded-xl
                    bg-emerald-600
                    px-5
                    py-3
                    font-semibold
                    text-white
                    transition
                    hover:bg-emerald-700
                  "
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                {/* =================================================
                    Notification Bell
                ================================================= */}

                <NotificationBell />

                {/* =================================================
                    Profile
                ================================================= */}

                <Link
                  to={profilePath}
                  className="
                    whitespace-nowrap
                    font-medium
                    text-gray-700
                    transition
                    hover:text-emerald-600
                    dark:text-gray-300
                    dark:hover:text-emerald-400
                  "
                >
                  Hi, {user.name}
                </Link>

                {/* =================================================
                    Logout
                ================================================= */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    whitespace-nowrap
                    font-medium
                    text-red-600
                    transition
                    hover:text-red-700
                    dark:text-red-400
                    dark:hover:text-red-300
                  "
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </nav>

        {/* =================================================
            Mobile Menu Button
        ================================================= */}

        <button
          type="button"
          className="
            ml-auto
            rounded-lg
            p-2
            text-gray-700
            transition
            hover:bg-gray-100
            dark:text-gray-200
            dark:hover:bg-gray-800
            md:hidden
          "
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          <Menu size={28} />
        </button>
      </div>

      {/* =================================================
          Mobile Menu
      ================================================= */}

      <MobileMenu
        open={open}
        setOpen={setOpen}
        user={user}
        onLogout={handleLogout}
      />
    </header>
  );
}

export default Navbar;
