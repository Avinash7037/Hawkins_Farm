import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Leaf className="text-emerald-600" size={30} />
            <span className="text-2xl font-bold text-gray-800">
              Hawkins Farm
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-emerald-600 transition"
            >
              Home
            </Link>

            <Link
              to="/products"
              className="text-gray-700 hover:text-emerald-600 transition"
            >
              Marketplace
            </Link>

            <Link
              to="/login"
              className="text-gray-700 hover:text-emerald-600 transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="
                bg-emerald-600
                text-white
                px-5
                py-2
                rounded-xl
                hover:bg-emerald-700
                transition
              "
            >
              Register
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
