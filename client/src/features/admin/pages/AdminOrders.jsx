import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchAllAdminOrders } from "../adminThunks";

function AdminOrders() {
  const dispatch = useDispatch();

  const { orders, ordersLoading, ordersError } = useSelector(
    (state) => state.admin,
  );

  // =====================================================
  // Fetch Orders
  // =====================================================

  useEffect(() => {
    dispatch(fetchAllAdminOrders());
  }, [dispatch]);

  // =====================================================
  // Loading
  // =====================================================

  if (ordersLoading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
          <p className="text-gray-500">Loading orders...</p>
        </div>
      </section>
    );
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
        <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>

        <p className="mt-2 text-gray-600">
          Monitor all orders placed on Hawkins Farm.
        </p>
      </div>

      {/* =================================================
          Error
      ================================================= */}

      {ordersError && (
        <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-600">
          {ordersError}
        </div>
      )}

      {/* =================================================
          Summary
      ================================================= */}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Orders</p>

          <p className="mt-2 text-3xl font-bold">{orders.length}</p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Pending</p>

          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {orders.filter((order) => order.orderStatus === "Pending").length}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Delivered</p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {orders.filter((order) => order.orderStatus === "Delivered").length}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Cancelled / Rejected</p>

          <p className="mt-2 text-3xl font-bold text-red-600">
            {
              orders.filter((order) =>
                ["Cancelled", "Rejected"].includes(order.orderStatus),
              ).length
            }
          </p>
        </div>
      </div>

      {/* =================================================
          Orders Table
      ================================================= */}

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">
                  Buyer
                </th>

                <th className="p-4 text-left text-sm font-semibold text-gray-700">
                  Farmer
                </th>

                <th className="p-4 text-left text-sm font-semibold text-gray-700">
                  Product
                </th>

                <th className="p-4 text-left text-sm font-semibold text-gray-700">
                  Qty
                </th>

                <th className="p-4 text-left text-sm font-semibold text-gray-700">
                  Amount
                </th>

                <th className="p-4 text-left text-sm font-semibold text-gray-700">
                  Payment
                </th>

                <th className="p-4 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-t transition hover:bg-gray-50"
                  >
                    {/* Buyer */}

                    <td className="p-4">
                      <p className="font-medium text-gray-900">
                        {order.buyer?.name || "Unknown Buyer"}
                      </p>

                      {order.buyer?.email && (
                        <p className="mt-1 text-xs text-gray-500">
                          {order.buyer.email}
                        </p>
                      )}
                    </td>

                    {/* Farmer */}

                    <td className="p-4">
                      <p className="font-medium text-gray-900">
                        {order.farmer?.name || "Unknown Farmer"}
                      </p>

                      {order.farmer?.email && (
                        <p className="mt-1 text-xs text-gray-500">
                          {order.farmer.email}
                        </p>
                      )}
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
                      <p className="font-medium text-gray-800">
                        {order.paymentMethod || "-"}
                      </p>

                      <p
                        className={`mt-1 text-xs font-semibold ${
                          order.paymentStatus === "Paid"
                            ? "text-green-600"
                            : "text-orange-600"
                        }`}
                      >
                        {order.paymentStatus || "Pending"}
                      </p>
                    </td>

                    {/* Status */}

                    <td className="p-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          order.orderStatus === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : order.orderStatus === "Rejected" ||
                                order.orderStatus === "Cancelled"
                              ? "bg-red-100 text-red-700"
                              : order.orderStatus === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default AdminOrders;
