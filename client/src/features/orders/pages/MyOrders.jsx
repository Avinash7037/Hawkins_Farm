import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchMyOrders } from "../orderThunks";

function MyOrders() {
  const dispatch = useDispatch();

  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  if (loading) {
    return <div className="py-20 text-center">Loading orders...</div>;
  }

  if (error) {
    return <div className="py-20 text-center text-red-500">{error}</div>;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-10 text-4xl font-bold">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="rounded-2xl border p-6 shadow-sm">
            <h2 className="text-xl font-semibold">{order.product.name}</h2>

            <p className="mt-2">Quantity: {order.quantity}</p>

            <p>Total: ₹{order.totalPrice}</p>

            <p>Status: {order.orderStatus}</p>

            <p>Payment: {order.paymentStatus}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MyOrders;
