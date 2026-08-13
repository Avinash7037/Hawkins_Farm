import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Star, Package, ChevronRight } from "lucide-react";

import { fetchMyOrders } from "../orderThunks";

function BuyerOrders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orders = [], loading, error } = useSelector((state) => state.orders);

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
  // Review Product
  // =====================================================

  const handleReviewProduct = (order) => {
    if (!order?._id || !order?.product?._id) {
      return;
    }

    navigate(`/products/${order.product._id}?orderId=${order._id}`);
  };

  // =====================================================
  // Status Badge
  // =====================================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-300";

      case "Accepted":
        return "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300";

      case "Packed":
        return "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300";

      case "Shipped":
        return "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300";

      case "Delivered":
        return "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300";

      case "Rejected":
        return "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300";

      case "Cancelled":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";

      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // =====================================================
  // Loading
  // =====================================================

  if (loading) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600 dark:border-emerald-950 dark:border-t-emerald-500" />

          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading your orders...
          </p>
        </div>
      </section>
    );
  }

  // =====================================================
  // Error
  // =====================================================

  if (error) {
    return (
      <section className="min-h-[60vh] bg-gray-50 dark:bg-gray-950">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            <p className="font-semibold">Unable to load your orders</p>

            <p className="mt-1 text-sm">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  // =====================================================
  // Render
  // =====================================================

  return (
    <section className="min-h-screen bg-gray-50 px-6 py-10 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <div className="mx-auto max-w-6xl">
        {/* =================================================
            Header
        ================================================= */}

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
              <Package size={23} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Orders
              </h1>

              <p className="mt-1 text-gray-500 dark:text-gray-400">
                Track your Hawkins Farm orders and review your purchases.
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            Empty State
        ================================================= */}

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/50">
              <Package
                size={30}
                className="text-emerald-600 dark:text-emerald-400"
              />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-gray-900 dark:text-white">
              No orders yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-gray-500 dark:text-gray-400">
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

              const isDelivered = order.orderStatus === "Delivered";

              return (
                <div
                  key={order._id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                >
                  {/* =================================================
                      Order Header
                  ================================================= */}

                  <div className="flex flex-col gap-4 border-b border-gray-100 p-5 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                        Order ID
                      </p>

                      <p className="mt-1 font-mono text-sm font-semibold text-gray-800 dark:text-gray-200">
                        #{String(order._id).slice(-8).toUpperCase()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                          order.orderStatus,
                        )}`}
                      >
                        {order.orderStatus}
                      </span>

                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "—"}
                      </span>
                    </div>
                  </div>

                  {/* =================================================
                      Order Content
                  ================================================= */}

                  <div className="p-5">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                      {/* Product */}

                      <div className="flex min-w-0 flex-1 items-center gap-4">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                          {product?.images?.[0]?.url ? (
                            <img
                              src={product.images[0].url}
                              alt={product.name || "Product"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package
                              size={25}
                              className="text-gray-400 dark:text-gray-500"
                            />
                          )}
                        </div>

                        <div className="min-w-0">
                          <h2 className="truncate text-lg font-semibold text-gray-900 dark:text-white">
                            {product?.name || "Product"}
                          </h2>

                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {product?.category || "Agricultural Product"}
                          </p>

                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Farmer:{" "}
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              {farmer?.name || "Unknown Farmer"}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Details */}

                      <div className="grid grid-cols-2 gap-5 sm:grid-cols-4 lg:min-w-[520px]">
                        <div>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            Quantity
                          </p>

                          <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                            {order.quantity} {product?.unit || ""}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            Total
                          </p>

                          <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                            ₹
                            {Number(order.totalPrice || 0).toLocaleString(
                              "en-IN",
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            Payment
                          </p>

                          <p className="mt-1 font-semibold text-gray-800 dark:text-gray-200">
                            {order.paymentMethod || "COD"}
                          </p>

                          <p
                            className={`mt-1 text-xs font-semibold ${
                              order.paymentStatus === "Paid"
                                ? "text-emerald-600 dark:text-emerald-400"
                                : order.paymentStatus === "Refunded"
                                  ? "text-blue-600 dark:text-blue-400"
                                  : "text-orange-600 dark:text-orange-400"
                            }`}
                          >
                            {order.paymentStatus || "Pending"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            Location
                          </p>

                          <p className="mt-1 truncate font-medium text-gray-800 dark:text-gray-200">
                            {product?.location || "—"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* =================================================
                        Actions
                    ================================================= */}

                    <div className="mt-6 flex flex-wrap gap-3 border-t border-gray-100 pt-5 dark:border-gray-800">
                      {isDelivered && (
                        <button
                          type="button"
                          onClick={() => handleReviewProduct(order)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-yellow-600"
                        >
                          <Star size={16} fill="currentColor" />
                          Rate Product
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleOpenOrder(order._id)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-600 px-5 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 dark:border-emerald-500 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
                      >
                        View Details
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>

                  {/* =================================================
                      Delivered Review Prompt
                  ================================================= */}

                  {isDelivered && (
                    <div className="border-t border-emerald-100 bg-emerald-50/60 px-5 py-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-semibold text-emerald-900 dark:text-emerald-300">
                            How was your experience?
                          </p>

                          <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
                            Your order has been delivered. Share your experience
                            with other Hawkins Farm buyers.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleReviewProduct(order)}
                          className="shrink-0 rounded-lg border border-emerald-600 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-500 dark:bg-gray-900 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
                        >
                          Write Review
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default BuyerOrders;
