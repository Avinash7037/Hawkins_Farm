import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";

import Logo from "../common/Logo";
import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";

import { logout } from "../../features/auth/authSlice";
import NotificationBell from "../../features/notifications/components/NotificationBell";

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

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* =================================================
            Logo
        ================================================= */}

        <Logo />

        {/* =================================================
            Desktop Navigation
        ================================================= */}

        <nav className="hidden items-center gap-8 md:flex">
          <NavLinks />

          {!user ? (
            <>
              {/* =========================================
                  Guest User
              ========================================= */}

              <Link
                to="/login"
                className="font-medium text-gray-700 transition hover:text-emerald-600"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              {/* =========================================
                  Notification Bell
              ========================================= */}

              <NotificationBell />

              {/* =========================================
                  Logged-in User
              ========================================= */}

              <span className="font-medium text-gray-700">Hi, {user.name}</span>

              {/* =========================================
                  Logout
              ========================================= */}

              <button
                type="button"
                onClick={handleLogout}
                className="font-medium text-red-600 transition hover:text-red-700"
              >
                Logout
              </button>
            </>
          )}
        </nav>

        {/* =================================================
            Mobile Menu Button
        ================================================= */}

        <button
          type="button"
          className="rounded-lg p-2 transition hover:bg-gray-100 md:hidden"
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
