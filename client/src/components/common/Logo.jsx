import { Leaf } from "lucide-react";
import { Link } from "react-router-dom";

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <div className="bg-emerald-600 p-2 rounded-xl group-hover:rotate-6 transition-transform duration-300">
        <Leaf className="text-white" size={22} />
      </div>

      <div>
        <h1 className="text-xl font-bold text-gray-900">Hawkins Farm</h1>

        <p className="text-xs text-gray-500">Fresh • Local • Trusted</p>
      </div>
    </Link>
  );
}

export default Logo;
