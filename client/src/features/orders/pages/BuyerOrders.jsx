import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchMyOrders } from "../orderThunks";

function BuyerOrders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orders, loading, error } = useSelector((state) => state.orders);

  // =====================================================
  // Fetch Orders
  // =====================================================

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  // =====================================================
  // Open Order Details
  // =====================================================

  const handleOpenOrder = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  // =====================================================
  // Status Badge
  // =====================================================

  const getStatusClass = (status) => {
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
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =====================================================
  // Loading
  // =====================================================

  if (loading) {
    return (
      <section className="p-6">
        <div className="flex min-h-[300px] items-center justify-center">
          <p className="text-gray-500">Loading your orders...</p>
        </div>
      </section>
    );
  }

  // =====================================================
  // Error
  // =====================================================

  if (error) {
    return (
      <section className="p-6">
        <div className="rounded-xl bg-red-50 p-5 text-red-600">{error}</div>
      </section>
    );
  }

  // =====================================================
  // Render
  // =====================================================

  return (
    <section className="p-6">
      {/* =================================================
          Header
      ================================================= */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>

        <p className="mt-2 text-gray-600">Track your Hawkins Farm orders.</p>
      </div>

      {/* =================================================
          Empty State
      ================================================= */}

      {orders.length === 0 ? (
        <div className="rounded-2xl border bg-white p-12 text-center shadow-sm">
          <div className="text-5xl">📦</div>

          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            No orders yet
          </h2>

          <p className="mt-2 text-gray-500">
            Your orders will appear here after you make a purchase.
          </p>

          <button
            type="button"
            onClick={() => navigate("/products")}
            className="mt-6 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            Browse Products
          </button>
        </div>
      ) : (
        /* =================================================
            Orders
        ================================================= */

        <div className="space-y-5">
          {orders.map((order) => {
            const product = order.product;
            const farmer = order.farmer;

            return (
              <div
                key={order._id}
                className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                {/* =========================================
                    Main Order Information
                ========================================= */}

                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  {/* Product */}

                  <div className="flex min-w-0 gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                      {product?.images?.[0]?.url ? (
                        <img
                          src={product.images[0].url}
                          alt={product.name || "Product"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl">🌾</span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h2 className="truncate font-semibold text-gray-900">
                        {product?.name || "Product"}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        Farmer: {farmer?.name || "Farmer"}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Quantity: {order.quantity} {product?.unit || ""}
                      </p>
                    </div>
                  </div>

                  {/* Status */}

                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                        order.orderStatus,
                      )}`}
                    >
                      {order.orderStatus}
                    </span>

                    <span
                      className={`text-sm font-semibold ${
                        order.paymentStatus === "Paid"
                          ? "text-green-600"
                          : "text-orange-600"
                      }`}
                    >
                      {order.paymentMethod} · {order.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* =========================================
                    Bottom Information
                ========================================= */}

                <div className="mt-5 flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Order Date</p>

                    <p className="font-medium text-gray-800">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Total</p>

                    <p className="text-lg font-bold text-gray-900">
                      ₹{Number(order.totalPrice || 0).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenOrder(order._id)}
                    className="rounded-xl border border-emerald-600 px-5 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default BuyerOrders;
