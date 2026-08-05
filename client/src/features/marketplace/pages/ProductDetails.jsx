import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import { fetchProduct } from "../productThunks";
import { addItemToCart } from "../../cart/cartThunks";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { product, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProduct(id));
  }, [dispatch, id]);

  const handleAddToCart = async () => {
    const result = await dispatch(
      addItemToCart({
        productId: product._id,
        quantity: 1,
      }),
    );

    if (addItemToCart.fulfilled.match(result)) {
      navigate("/cart");
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-lg">Loading product...</div>;
  }

  if (error) {
    return <div className="py-20 text-center text-red-500">{error}</div>;
  }

  if (!product) {
    return (
      <div className="py-20 text-center text-gray-500">Product not found.</div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="grid gap-12 lg:grid-cols-2">
        {/* Product Image */}
        <img
          src={
            product.images?.[0]?.url ||
            "https://placehold.co/700x500?text=No+Image"
          }
          alt={product.name}
          className="w-full rounded-2xl object-cover shadow-lg"
        />

        {/* Product Details */}
        <div>
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-1 text-sm font-medium text-emerald-700">
            {product.category}
          </span>

          <h1 className="mt-4 text-5xl font-bold text-gray-900">
            {product.name}
          </h1>

          <p className="mt-6 leading-8 text-gray-600">{product.description}</p>

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

          <button
            onClick={handleAddToCart}
            className="mt-10 rounded-xl bg-emerald-600 px-8 py-4 font-semibold text-white transition hover:bg-emerald-700"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;
