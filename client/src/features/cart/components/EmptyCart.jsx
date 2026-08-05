import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

function EmptyCart() {
  return (
    <div className="py-24 text-center">
      <ShoppingCart size={70} className="mx-auto mb-6 text-gray-400" />

      <h2 className="text-3xl font-bold">Your cart is empty</h2>

      <p className="mt-3 text-gray-500">
        Browse fresh farm products and add them to your cart.
      </p>

      <Link
        to="/products"
        className="mt-8 inline-block rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

export default EmptyCart;
