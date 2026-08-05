import { useSelector } from "react-redux";

function CheckoutSummary() {
  const { totalItems, totalPrice } = useSelector((state) => state.cart);

  return (
    <div className="rounded-2xl border p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold">Order Summary</h2>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span>Total Items</span>
          <span>{totalItems}</span>
        </div>

        <div className="flex justify-between">
          <span>Delivery</span>
          <span className="text-emerald-600">FREE</span>
        </div>

        <hr />

        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>
          <span>₹{totalPrice}</span>
        </div>
      </div>
    </div>
  );
}

export default CheckoutSummary;
