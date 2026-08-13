import { Link } from "react-router-dom";
import { MapPin, Package } from "lucide-react";

function ProductCard({ product }) {
  // =====================================================
  // Product Image
  // =====================================================

  const image =
    product.images?.[0]?.url || "https://placehold.co/600x400?text=No+Image";

  // =====================================================
  // Availability
  // =====================================================

  const isAvailable =
    product.isAvailable === true && Number(product.quantity) > 0;

  // =====================================================
  // Rating
  // =====================================================

  const rating = Number(product.rating || 0);

  // =====================================================
  // Render
  // =====================================================

  return (
    <article
      className="
        overflow-hidden
        rounded-2xl
        border border-gray-200
        bg-white
        shadow-sm
        transition
        duration-200
        hover:-translate-y-1
        hover:shadow-lg

        dark:border-gray-700
        dark:bg-gray-900
        dark:shadow-gray-950/50
        dark:hover:shadow-black/50
      "
    >
      {/* =================================================
          Product Image
      ================================================= */}

      <div
        className="
          relative
          h-52
          overflow-hidden
          bg-gray-100

          dark:bg-gray-800
        "
      >
        <img
          src={image}
          alt={product.name || "Product"}
          className="
            h-full
            w-full
            object-cover
            transition
            duration-300
            hover:scale-105
          "
          loading="lazy"
        />

        {/* =================================================
            Availability Badge
        ================================================= */}

        <div className="absolute right-3 top-3">
          {isAvailable ? (
            <span
              className="
                rounded-full
                bg-green-100
                px-3
                py-1
                text-xs
                font-semibold
                text-green-700
                shadow-sm

                dark:bg-green-950
                dark:text-green-300
              "
            >
              In Stock
            </span>
          ) : (
            <span
              className="
                rounded-full
                bg-red-100
                px-3
                py-1
                text-xs
                font-semibold
                text-red-700
                shadow-sm

                dark:bg-red-950
                dark:text-red-300
              "
            >
              Out of Stock
            </span>
          )}
        </div>

        {/* =================================================
            Category Badge
        ================================================= */}

        {product.category && (
          <div className="absolute left-3 top-3">
            <span
              className="
                rounded-full
                bg-white/90
                px-3
                py-1
                text-xs
                font-semibold
                text-gray-700
                shadow-sm
                backdrop-blur

                dark:bg-gray-900/90
                dark:text-gray-200
              "
            >
              {product.category}
            </span>
          </div>
        )}
      </div>

      {/* =================================================
          Product Content
      ================================================= */}

      <div className="space-y-4 p-5">
        {/* =================================================
            Product Name & Description
        ================================================= */}

        <div>
          <h3
            className="
              line-clamp-1
              text-xl
              font-semibold
              text-gray-900

              dark:text-gray-100
            "
          >
            {product.name}
          </h3>

          <p
            className="
              mt-2
              line-clamp-2
              min-h-[40px]
              text-sm
              leading-5
              text-gray-500

              dark:text-gray-400
            "
          >
            {product.description}
          </p>
        </div>

        {/* =================================================
            Price + Category
        ================================================= */}

        <div className="flex items-center justify-between gap-3">
          <span
            className="
              text-2xl
              font-bold
              text-emerald-600

              dark:text-emerald-400
            "
          >
            ₹{Number(product.price || 0).toLocaleString("en-IN")}
          </span>

          {product.category && (
            <span
              className="
                rounded-full
                bg-emerald-100
                px-3
                py-1
                text-xs
                font-medium
                text-emerald-700

                dark:bg-emerald-950
                dark:text-emerald-300
              "
            >
              {product.category}
            </span>
          )}
        </div>

        {/* =================================================
            Rating
        ================================================= */}

        <div className="flex items-center gap-2">
          <div className="flex text-sm text-yellow-500">
            {Array.from({
              length: 5,
            }).map((_, index) => (
              <span key={index}>{index < Math.round(rating) ? "★" : "☆"}</span>
            ))}
          </div>

          <span
            className="
              text-xs
              text-gray-500

              dark:text-gray-400
            "
          >
            {rating.toFixed(1)}
          </span>

          <span
            className="
              text-xs
              text-gray-400

              dark:text-gray-500
            "
          >
            ({product.numReviews || 0})
          </span>
        </div>

        {/* =================================================
            Quantity + Location
        ================================================= */}

        <div
          className="
            flex
            items-center
            justify-between
            gap-3
            text-sm
            text-gray-500

            dark:text-gray-400
          "
        >
          <div className="flex items-center gap-1">
            <Package size={16} />

            <span>
              {product.quantity} {product.unit || "kg"}
            </span>
          </div>

          <div className="flex min-w-0 items-center gap-1">
            <MapPin size={16} className="shrink-0" />

            <span className="truncate">{product.location}</span>
          </div>
        </div>

        {/* =================================================
            Freshness
        ================================================= */}

        {product.freshness && (
          <div>
            <span
              className="
                rounded-lg
                bg-yellow-100
                px-3
                py-1
                text-sm
                font-medium
                text-yellow-700

                dark:bg-yellow-950
                dark:text-yellow-300
              "
            >
              {product.freshness}
            </span>
          </div>
        )}

        {/* =================================================
            Actions
        ================================================= */}

        <div className="flex gap-3 pt-1">
          <Link
            to={`/products/${product._id}`}
            className="
              flex-1
              rounded-xl
              bg-emerald-600
              px-4
              py-2.5
              text-center
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-emerald-700

              dark:bg-emerald-600
              dark:hover:bg-emerald-500
            "
          >
            View Details
          </Link>
        </div>

        {/* =================================================
            Stock Message
        ================================================= */}

        {!isAvailable && (
          <p
            className="
              text-center
              text-sm
              font-medium
              text-red-600

              dark:text-red-400
            "
          >
            This product is currently unavailable.
          </p>
        )}

        {isAvailable && Number(product.quantity) <= 5 && (
          <p
            className="
              text-center
              text-xs
              font-medium
              text-orange-600

              dark:text-orange-400
            "
          >
            Only {product.quantity} {product.unit || "kg"} left
          </p>
        )}
      </div>
    </article>
  );
}

export default ProductCard;
