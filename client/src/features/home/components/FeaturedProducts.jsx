import { Link } from "react-router-dom";
import ProductCard from "../../marketplace/components/ProductCard";
import useProducts from "../../marketplace/hooks/useProducts";

function FeaturedProducts() {
  const { products, loading, error } = useProducts({
    limit: 6,
    sort: "newest",
  });

  // =====================================================
  // Loading State
  // =====================================================

  if (loading) {
    return (
      <section className="bg-white py-24 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-6">
          <h2
            className="
              mb-12 text-4xl font-bold
              text-gray-900
              dark:text-white
            "
          >
            Featured Products
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="
                  h-[420px]
                  animate-pulse
                  rounded-3xl
                  bg-gray-200

                  dark:bg-gray-800
                "
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // =====================================================
  // Error State
  // =====================================================

  if (error) {
    return (
      <section className="bg-white py-24 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2
            className="
              text-xl
              text-red-600
              dark:text-red-400
            "
          >
            {error}
          </h2>
        </div>
      </section>
    );
  }

  // =====================================================
  // Main Content
  // =====================================================

  return (
    <section
      className="
        bg-gray-50 py-24
        dark:bg-gray-950
      "
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* =================================================
            Section Header
        ================================================= */}

        <div className="mb-14 flex items-center justify-between">
          <div>
            <h2
              className="
                text-4xl font-bold
                text-gray-900

                dark:text-white
              "
            >
              Featured Products
            </h2>

            <p
              className="
                mt-3
                text-gray-600

                dark:text-gray-300
              "
            >
              Fresh products directly from verified farmers.
            </p>
          </div>

          {/* =================================================
              View All
          ================================================= */}

          <Link
            to="/products"
            className="
              font-semibold
              text-emerald-600
              transition
              hover:underline

              dark:text-emerald-400
            "
          >
            View All →
          </Link>
        </div>

        {/* =================================================
            Empty State
        ================================================= */}

        {products.length === 0 ? (
          <div
            className="
              text-center
              text-gray-500

              dark:text-gray-400
            "
          >
            No products available.
          </div>
        ) : (
          /* =================================================
              Products
          ================================================= */

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedProducts;
