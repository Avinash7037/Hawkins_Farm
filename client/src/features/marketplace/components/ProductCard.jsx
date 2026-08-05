import { Link } from "react-router-dom";
import { MapPin, Package } from "lucide-react";

function ProductCard({ product }) {
  const image =
    product.images?.[0]?.url || "https://placehold.co/600x400?text=No+Image";

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <img
        src={image}
        alt={product.name}
        className="h-56 w-full object-cover"
      />

      <div className="space-y-4 p-5">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {product.name}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm text-gray-500">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-emerald-600">
            ₹{product.price}
          </span>

          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
            {product.category}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Package size={16} />
            {product.quantity} {product.unit}
          </div>

          <div className="flex items-center gap-1">
            <MapPin size={16} />
            {product.location}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="rounded-lg bg-yellow-100 px-3 py-1 text-sm text-yellow-700">
            {product.freshness}
          </span>

          <Link
            to={`/products/${product._id}`}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
