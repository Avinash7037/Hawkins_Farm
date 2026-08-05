import { Link } from "react-router-dom";

function CartSummary({ totalItems, totalPrice }) {
  return (
    <div className="rounded-2xl border p-6 shadow-sm">
      <h2 className="text-2xl font-bold">Order Summary</h2>

      <div className="mt-6 space-y-4">
        <div className="flex justify-between">
          <span>Total Items</span>

          <span>{totalItems}</span>
        </div>

        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>

          <span>₹{totalPrice}</span>
        </div>
      </div>

      <Link
        to="/checkout"
        className="mt-8 block rounded-xl bg-emerald-600 py-3 text-center font-semibold text-white transition hover:bg-emerald-700"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
}

export default CartSummary;
