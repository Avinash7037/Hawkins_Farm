import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { fetchCart } from "../cartThunks";

import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
import EmptyCart from "../components/EmptyCart";

function Cart() {
  const dispatch = useDispatch();

  const { cart, totalItems, totalPrice, loading, error } = useSelector(
    (state) => state.cart,
  );

  // =====================================================
  // Fetch Cart
  // =====================================================

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // =====================================================
  // Loading
  // =====================================================

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-600" />

            <p className="mt-4 text-gray-600">Loading cart...</p>
          </div>
        </div>
      </section>
    );
  }

  // =====================================================
  // Error
  // =====================================================

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <h2 className="text-xl font-semibold text-red-700">
              Unable to load cart
            </h2>

            <p className="mt-2 text-red-600">{error}</p>

            <button
              type="button"
              onClick={() => dispatch(fetchCart())}
              className="mt-5 rounded-lg bg-red-600 px-5 py-2 font-medium text-white transition hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // =====================================================
  // Empty Cart
  // =====================================================

  if (!cart.length) {
    return <EmptyCart />;
  }

  // =====================================================
  // Render
  // =====================================================

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      {/* =================================================
          Header
      ================================================= */}

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Shopping Cart</h1>

        <p className="mt-2 text-gray-500">Review your items before checkout.</p>
      </div>

      {/* =================================================
          Cart Content
      ================================================= */}

      <div className="grid gap-10 lg:grid-cols-3">
        {/* =================================================
            Cart Items
        ================================================= */}

        <div className="space-y-5 lg:col-span-2">
          {cart.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}
        </div>

        {/* =================================================
            Summary
        ================================================= */}

        <CartSummary totalItems={totalItems} totalPrice={totalPrice} />
      </div>
    </section>
  );
}

export default Cart;
