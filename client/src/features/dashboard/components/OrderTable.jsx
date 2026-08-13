import StatusDropdown from "./StatusDropdown";

function OrderTable({ orders, loading }) {
  // =====================================================
  // Loading
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[250px] items-center justify-center bg-white dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">Loading orders...</p>
      </div>
    );
  }

  // =====================================================
  // Empty
  // =====================================================

  if (!orders.length) {
    return (
      <div className="flex min-h-[250px] flex-col items-center justify-center bg-white px-6 text-center dark:bg-gray-900">
        <div className="text-4xl">📦</div>

        <h2 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">
          No orders found
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Orders from buyers will appear here.
        </p>
      </div>
    );
  }

  // =====================================================
  // Table
  // =====================================================

  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-900">
      <table className="w-full min-w-[850px] text-left">
        {/* =================================================
            Table Header
        ================================================= */}

        <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
          <tr>
            <th className="p-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
              Buyer
            </th>

            <th className="p-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
              Product
            </th>

            <th className="p-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
              Qty
            </th>

            <th className="p-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
              Amount
            </th>

            <th className="p-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
              Payment
            </th>

            <th className="p-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
              Status
            </th>
          </tr>
        </thead>

        {/* =================================================
            Table Body
        ================================================= */}

        <tbody>
          {orders.map((order) => (
            <tr
              key={order._id}
              className="
                border-b border-gray-100
                transition
                hover:bg-gray-50
                last:border-b-0

                dark:border-gray-700
                dark:hover:bg-gray-800/60
              "
            >
              {/* =================================================
                  Buyer
              ================================================= */}

              <td className="p-4">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {order.buyer?.name || "Unknown Buyer"}
                  </p>

                  {order.buyer?.email && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {order.buyer.email}
                    </p>
                  )}
                </div>
              </td>

              {/* =================================================
                  Product
              ================================================= */}

              <td className="p-4">
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {order.product?.name || "Unknown Product"}
                </p>
              </td>

              {/* =================================================
                  Quantity
              ================================================= */}

              <td className="p-4 text-gray-700 dark:text-gray-300">
                {order.quantity} {order.product?.unit || ""}
              </td>

              {/* =================================================
                  Amount
              ================================================= */}

              <td className="p-4">
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  ₹{Number(order.totalPrice || 0).toLocaleString("en-IN")}
                </span>
              </td>

              {/* =================================================
                  Payment
              ================================================= */}

              <td className="p-4">
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {order.paymentMethod}
                  </p>

                  <p
                    className={`mt-1 text-xs font-semibold ${
                      order.paymentStatus === "Paid"
                        ? "text-green-600 dark:text-green-400"
                        : "text-orange-600 dark:text-orange-400"
                    }`}
                  >
                    {order.paymentStatus}
                  </p>
                </div>
              </td>

              {/* =================================================
                  Status
              ================================================= */}

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
