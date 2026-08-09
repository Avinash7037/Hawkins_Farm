import StatusDropdown from "./StatusDropdown";

function OrderTable({ orders, loading }) {
  if (loading) {
    return (
      <div className="rounded-lg bg-white p-8 text-center shadow">
        Loading orders...
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="rounded-lg bg-white p-8 text-center shadow">
        No orders found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow">
      <table className="w-full">
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="p-4 text-left">Buyer</th>
            <th className="text-left">Product</th>
            <th className="text-left">Qty</th>
            <th className="text-left">Amount</th>
            <th className="text-left">Payment</th>
            <th className="text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-b">
              <td className="p-4">{order.buyer?.name}</td>

              <td>{order.product?.name}</td>

              <td>
                {order.quantity} {order.product?.unit}
              </td>

              <td>₹{order.totalPrice}</td>

              <td>{order.paymentMethod}</td>

              <td>
                <StatusDropdown order={order} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderTable;
