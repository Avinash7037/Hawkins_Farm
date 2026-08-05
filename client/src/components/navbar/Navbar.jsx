import { useState } from "react";
import { Menu } from "lucide-react";

import Logo from "../common/Logo";
import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";
import { Link } from "react-router-dom";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between">
          <Logo />

          <nav className="hidden md:flex items-center gap-8">
            <NavLinks />

            <Link
              to="/login"
              className="font-medium text-gray-700 hover:text-emerald-600 transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-semibold transition"
            >
              Get Started
            </Link>
          </nav>

          <button className="md:hidden" onClick={() => setOpen(!open)}>
            <Menu size={28} />
          </button>
        </div>
      </div>

      <MobileMenu open={open} setOpen={setOpen} />
    </header>
  );
}

export default Navbar;
