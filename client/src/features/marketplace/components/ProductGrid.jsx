import ProductCard from "./ProductCard";

function ProductGrid({ products = [] }) {
  // =====================================================
  // Empty State
  // =====================================================

  if (!products.length) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-2xl border bg-gray-50 px-6 text-center">
        <div>
          <div className="text-5xl">🥕</div>

          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            No products found
          </h2>

          <p className="mt-2 text-gray-500">
            Try changing your search or filters.
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // Product Grid
  // =====================================================

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;
