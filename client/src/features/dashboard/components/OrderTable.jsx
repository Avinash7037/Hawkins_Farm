import StatusDropdown from "./StatusDropdown";

function OrderTable({ orders, loading }) {
  // =====================================================
  // Loading
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[250px] items-center justify-center">
        <p className="text-gray-500">Loading orders...</p>
      </div>
    );
  }

  // =====================================================
  // Empty
  // =====================================================

  if (!orders.length) {
    return (
      <div className="flex min-h-[250px] flex-col items-center justify-center px-6 text-center">
        <div className="text-4xl">📦</div>

        <h2 className="mt-3 text-lg font-semibold text-gray-900">
          No orders found
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Orders from buyers will appear here.
        </p>
      </div>
    );
  }

  // =====================================================
  // Table
  // =====================================================

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[850px] text-left">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="p-4 text-sm font-semibold text-gray-700">Buyer</th>

            <th className="p-4 text-sm font-semibold text-gray-700">Product</th>

            <th className="p-4 text-sm font-semibold text-gray-700">Qty</th>

            <th className="p-4 text-sm font-semibold text-gray-700">Amount</th>

            <th className="p-4 text-sm font-semibold text-gray-700">Payment</th>

            <th className="p-4 text-sm font-semibold text-gray-700">Status</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr
              key={order._id}
              className="border-b transition hover:bg-gray-50 last:border-b-0"
            >
              {/* Buyer */}

              <td className="p-4">
                <div>
                  <p className="font-medium text-gray-900">
                    {order.buyer?.name || "Unknown Buyer"}
                  </p>

                  {order.buyer?.email && (
                    <p className="mt-1 text-xs text-gray-500">
                      {order.buyer.email}
                    </p>
                  )}
                </div>
              </td>

              {/* Product */}

              <td className="p-4">
                <p className="font-medium text-gray-900">
                  {order.product?.name || "Unknown Product"}
                </p>
              </td>

              {/* Quantity */}

              <td className="p-4 text-gray-700">
                {order.quantity} {order.product?.unit || ""}
              </td>

              {/* Amount */}

              <td className="p-4">
                <span className="font-semibold text-gray-900">
                  ₹{Number(order.totalPrice || 0).toLocaleString("en-IN")}
                </span>
              </td>

              {/* Payment */}

              <td className="p-4">
                <div>
                  <p className="font-medium text-gray-800">
                    {order.paymentMethod}
                  </p>

                  <p
                    className={`mt-1 text-xs font-semibold ${
                      order.paymentStatus === "Paid"
                        ? "text-green-600"
                        : "text-orange-600"
                    }`}
                  >
                    {order.paymentStatus}
                  </p>
                </div>
              </td>

              {/* Status */}

              <td className="p-4">
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
