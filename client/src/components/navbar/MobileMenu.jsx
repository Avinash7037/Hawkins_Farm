import { X } from "lucide-react";
import { Link } from "react-router-dom";
import NavLinks from "./NavLinks";

function MobileMenu({ open, setOpen }) {
  if (!open) return null;

  return (
    <div className="md:hidden bg-white border-t shadow-lg">
      <div className="flex justify-end p-4">
        <button onClick={() => setOpen(false)}>
          <X />
        </button>
      </div>

      <div className="px-6 pb-6 flex flex-col gap-2">
        <NavLinks mobile onClick={() => setOpen(false)} />

        <Link
          to="/login"
          className="mt-4 text-center border border-emerald-600 rounded-xl py-3 font-semibold text-emerald-600"
          onClick={() => setOpen(false)}
        >
          Login
        </Link>

        <Link
          to="/register"
          className="mt-2 text-center bg-emerald-600 rounded-xl py-3 text-white font-semibold hover:bg-emerald-700 transition"
          onClick={() => setOpen(false)}
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}

export default MobileMenu;
