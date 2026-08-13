import { Leaf } from "lucide-react";
import { Link } from "react-router-dom";

function Logo() {
  return (
    <Link to="/" className="group flex items-center gap-2">
      {/* =================================================
          Logo Icon
      ================================================= */}

      <div className="rounded-xl bg-emerald-600 p-2 transition-transform duration-300 group-hover:rotate-6">
        <Leaf className="text-white" size={22} />
      </div>

      {/* =================================================
          Logo Text
      ================================================= */}

      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Hawkins Farm
        </h1>

        <p className="text-xs text-gray-500 dark:text-gray-400">
          Fresh • Local • Trusted
        </p>
      </div>
    </Link>
  );
}

export default Logo;
