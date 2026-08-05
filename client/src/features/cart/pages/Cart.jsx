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

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  if (loading) {
    return <div className="py-20 text-center">Loading cart...</div>;
  }

  if (error) {
    return <div className="py-20 text-center text-red-500">{error}</div>;
  }

  if (!cart.length) {
    return <EmptyCart />;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-10 text-4xl font-bold">Shopping Cart</h1>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {cart.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}
        </div>

        <CartSummary totalItems={totalItems} totalPrice={totalPrice} />
      </div>
    </section>
  );
}

export default Cart;
