import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchFarmerOrders, updateFarmerOrderStatus } from "../orderThunks";

function Orders() {
  const dispatch = useDispatch();

  const { orders, loading, updating, error } = useSelector(
    (state) => state.farmerOrders,
  );

  const [search, setSearch] = useState("");

  // =====================================================
  // Fetch Farmer Orders
  // =====================================================

  useEffect(() => {
    dispatch(fetchFarmerOrders());
  }, [dispatch]);

  // =====================================================
  // Filter Orders
  // =====================================================

  const filteredOrders = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return (
      orders?.filter((order) => {
        const buyer = order.buyer?.name?.toLowerCase() || "";

        const product = order.product?.name?.toLowerCase() || "";

        return buyer.includes(searchValue) || product.includes(searchValue);
      }) || []
    );
  }, [orders, search]);

  // =====================================================
  // Handle Status Change
  // =====================================================

  const handleStatusChange = (order, status) => {
    const orderId = order?._id || order?.id || order?.orderId;

    console.log("Updating order:", order);
    console.log("Order ID:", orderId);
    console.log("New status:", status);

    if (!orderId) {
      console.error("Order ID is missing. Cannot update status.", order);
      return;
    }

    if (!status || status === order.orderStatus) {
      return;
    }

    dispatch(
      updateFarmerOrderStatus({
        id: orderId,
        orderStatus: status,
      }),
    );
  };

  // =====================================================
  // Status Classes
  // =====================================================

  const getStatusClasses = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Accepted":
        return "bg-blue-100 text-blue-700";

      case "Packed":
        return "bg-purple-100 text-purple-700";

      case "Shipped":
        return "bg-indigo-100 text-indigo-700";

      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      case "Cancelled":
        return "bg-gray-200 text-gray-700";

      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  // =====================================================
  // Allowed Next Statuses
  // =====================================================

  const getNextStatuses = (status) => {
    switch (status) {
      case "Pending":
        return ["Accepted", "Rejected"];

      case "Accepted":
        return ["Packed"];

      case "Packed":
        return ["Shipped"];

      case "Shipped":
        return ["Delivered"];

      case "Delivered":
      case "Rejected":
      case "Cancelled":
        return [];

      default:
        return [];
    }
  };

  // =====================================================
  // Render
  // =====================================================

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      {/* =================================================
          Header
      ================================================= */}

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Farmer Orders</h1>

          <p className="mt-2 text-gray-600">
            Manage orders received from buyers.
          </p>
        </div>

        <input
          type="text"
          placeholder="Search buyer/product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border bg-white p-3 outline-none focus:border-green-500 md:w-72"
        />
      </div>

      {/* =================================================
          Error
      ================================================= */}

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      {/* =================================================
          Orders Table
      ================================================= */}

      <div className="overflow-hidden rounded-xl border bg-white shadow">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px]">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="p-4 text-left">Buyer</th>

                <th className="p-4 text-left">Product</th>

                <th className="p-4 text-left">Quantity</th>

                <th className="p-4 text-left">Amount</th>

                <th className="p-4 text-left">Payment</th>

                <th className="p-4 text-left">Status</th>

                <th className="p-4 text-left">Update</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">
                    No Orders Found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const orderId = order?._id || order?.id || order?.orderId;

                  const nextStatuses = getNextStatuses(order.orderStatus);

                  return (
                    <tr key={orderId} className="border-b hover:bg-gray-50">
                      {/* Buyer */}

                      <td className="p-4">
                        <p className="font-medium text-gray-900">
                          {order.buyer?.name || "Unknown Buyer"}
                        </p>

                        {order.buyer?.email && (
                          <p className="text-xs text-gray-500">
                            {order.buyer.email}
                          </p>
                        )}
                      </td>

                      {/* Product */}

                      <td className="p-4">
                        {order.product?.name || "Unknown Product"}
                      </td>

                      {/* Quantity */}

                      <td className="p-4">
                        {order.quantity} {order.product?.unit || ""}
                      </td>

                      {/* Amount */}

                      <td className="p-4 font-semibold">
                        ₹{Number(order.totalPrice || 0).toLocaleString("en-IN")}
                      </td>

                      {/* Payment */}

                      <td className="p-4">{order.paymentMethod || "COD"}</td>

                      {/* Current Status */}

                      <td className="p-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusClasses(
                            order.orderStatus,
                          )}`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>

                      {/* Update */}

                      <td className="p-4">
                        {nextStatuses.length === 0 ? (
                          <span className="text-sm text-gray-400">
                            No actions
                          </span>
                        ) : (
                          <select
                            value=""
                            disabled={updating}
                            onChange={(e) =>
                              handleStatusChange(order, e.target.value)
                            }
                            className="rounded-lg border bg-white p-2 text-sm outline-none focus:border-green-500"
                          >
                            <option value="">
                              {updating
                                ? "Updating..."
                                : `Current: ${order.orderStatus}`}
                            </option>

                            {nextStatuses.map((status) => (
                              <option key={status} value={status}>
                                {status === "Accepted"
                                  ? "Accept Order"
                                  : status === "Rejected"
                                    ? "Reject Order"
                                    : `Mark ${status}`}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default Orders;
