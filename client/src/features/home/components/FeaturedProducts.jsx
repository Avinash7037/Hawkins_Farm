import { Link } from "react-router-dom";
import ProductCard from "../../marketplace/components/ProductCard";
import useProducts from "../../marketplace/hooks/useProducts";

function FeaturedProducts() {
  const { products, loading, error } = useProducts({
    limit: 6,
    sort: "newest",
  });

  if (loading) {
    return (
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12">Featured Products</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="h-[420px] rounded-3xl bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-red-600 text-xl">{error}</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-14">
          <div>
            <h2 className="text-4xl font-bold">Featured Products</h2>

            <p className="mt-3 text-gray-600">
              Fresh products directly from verified farmers.
            </p>
          </div>

          <Link
            to="/products"
            className="text-emerald-600 font-semibold hover:underline"
          >
            View All →
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center text-gray-500">
            No products available.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
