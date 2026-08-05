import { Link } from "react-router-dom";
import { MapPin, IndianRupee, User } from "lucide-react";

function ProductCard({ product }) {
  return (
    <div className="group overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      {/* Product Image */}

      <div className="h-56 overflow-hidden">
        <img
          src={
            product.images?.[0] || "https://placehold.co/600x400?text=No+Image"
          }
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
      </div>

      {/* Product Details */}

      <div className="p-6">
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          {product.category}
        </span>

        <h3 className="mt-4 line-clamp-1 text-xl font-bold text-gray-900">
          {product.name}
        </h3>

        <div className="mt-4 flex items-center gap-2 text-gray-500">
          <MapPin size={18} />
          <span>{product.location}</span>
        </div>

        <div className="mt-2 flex items-center gap-2 text-gray-500">
          <User size={18} />
          <span>{product.farmer?.name || "Farmer"}</span>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center text-2xl font-bold text-emerald-600">
            <IndianRupee size={22} />
            {product.price}
            <span className="ml-1 text-sm font-normal text-gray-500">
              / {product.unit}
            </span>
          </div>

          <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
            {product.freshness}
          </span>
        </div>

        <Link
          to={`/products/${product._id}`}
          className="mt-6 block rounded-xl bg-emerald-600 py-3 text-center font-semibold text-white transition hover:bg-emerald-700"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
