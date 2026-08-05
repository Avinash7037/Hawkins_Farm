import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { fetchProduct } from "../productThunks";

function ProductDetails() {
  const { id } = useParams();

  const dispatch = useDispatch();

  const { product, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProduct(id));
  }, [dispatch, id]);

  if (loading) {
    return <div className="py-20 text-center text-lg">Loading product...</div>;
  }

  if (error) {
    return <div className="py-20 text-center text-red-500">{error}</div>;
  }

  if (!product) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid gap-12 lg:grid-cols-2">
        {/* Image */}

        <img
          src={
            product.images?.[0]?.url ||
            "https://placehold.co/700x500?text=No+Image"
          }
          alt={product.name}
          className="w-full rounded-2xl object-cover shadow-lg"
        />

        {/* Details */}

        <div>
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-1 text-sm text-emerald-700">
            {product.category}
          </span>

          <h1 className="mt-4 text-5xl font-bold">{product.name}</h1>

          <p className="mt-6 text-gray-600 leading-8">{product.description}</p>

          <h2 className="mt-8 text-4xl font-bold text-emerald-600">
            ₹{product.price}
          </h2>

          <div className="mt-8 space-y-3 text-gray-600">
            <p>
              <strong>Quantity:</strong> {product.quantity} {product.unit}
            </p>

            <p>
              <strong>Location:</strong> {product.location}
            </p>

            <p>
              <strong>Freshness:</strong> {product.freshness}
            </p>

            <p>
              <strong>Farmer:</strong> {product.farmer?.name}
            </p>
          </div>

          <button className="mt-10 rounded-xl bg-emerald-600 px-8 py-4 font-semibold text-white hover:bg-emerald-700 transition">
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;
