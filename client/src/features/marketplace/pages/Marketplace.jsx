import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchProducts } from "../productThunks";
import ProductGrid from "../components/ProductGrid";

function Marketplace() {
  const dispatch = useDispatch();

  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) {
    return <div className="py-20 text-center text-lg">Loading products...</div>;
  }

  if (error) {
    return <div className="py-20 text-center text-red-500">{error}</div>;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Marketplace</h1>

        <p className="mt-3 text-gray-500">
          Browse fresh produce directly from local farmers.
        </p>
      </div>

      <ProductGrid products={products} />
    </section>
  );
}

export default Marketplace;
