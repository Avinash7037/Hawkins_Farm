import { X } from "lucide-react";

import { Link } from "react-router-dom";

import NavLinks from "./NavLinks";

// =====================================================
// Mobile Menu
// =====================================================

function MobileMenu({ open, setOpen, user, onLogout }) {
  if (!open) {
    return null;
  }

  return (
    <div className="border-t bg-white md:hidden">
      {/* =================================================
          Close Button
      ================================================= */}

      <div className="flex justify-end px-6 pt-4">
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close navigation menu"
          className="text-gray-700 transition hover:text-emerald-600"
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
            Guest Actions
        ================================================= */}

        {!user ? (
          <>
            <Link
              to="/login"
              className="mt-4 block rounded-xl border border-emerald-600 py-3 text-center font-semibold text-emerald-600 transition hover:bg-emerald-50"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>

            <Link
              to="/register"
              className="mt-2 block rounded-xl bg-emerald-600 py-3 text-center font-semibold text-white transition hover:bg-emerald-700"
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

            <div className="mt-4 border-t pt-4">
              <p className="text-center font-medium text-gray-700">
                Hi, {user.name}
              </p>

              <p className="mt-1 text-center text-sm capitalize text-gray-500">
                {user.role}
              </p>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="mt-4 block w-full rounded-xl border border-red-600 py-3 text-center font-semibold text-red-600 transition hover:bg-red-50"
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
