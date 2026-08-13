import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Check,
  Clock3,
  Package,
  Truck,
  CircleCheck,
  XCircle,
  MapPin,
  CreditCard,
  Star,
} from "lucide-react";

import { fetchOrderById, cancelBuyerOrder } from "../orderThunks";

import { clearSelectedOrder } from "../orderSlice";

function OrderDetails() {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    selectedOrder,
    detailsLoading,
    detailsError,
    cancelling,
    cancelError,
  } = useSelector((state) => state.orders);

  // =====================================================
  // Fetch Order
  // =====================================================

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id));
    }

    return () => {
      dispatch(clearSelectedOrder());
    };
  }, [dispatch, id]);

  // =====================================================
  // Status Configuration
  // =====================================================

  const statuses = [
    {
      value: "Pending",
      label: "Order Placed",
      description: "Your order has been placed successfully.",
      icon: Clock3,
    },

    {
      value: "Accepted",
      label: "Accepted",
      description: "The farmer has accepted your order.",
      icon: Check,
    },

    {
      value: "Packed",
      label: "Packed",
      description: "Your order has been packed and is ready to ship.",
      icon: Package,
    },

    {
      value: "Shipped",
      label: "Shipped",
      description: "Your order is on the way.",
      icon: Truck,
    },

    {
      value: "Delivered",
      label: "Delivered",
      description: "Your order has been delivered successfully.",
      icon: CircleCheck,
    },
  ];

  // =====================================================
  // Status Colors
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
  // Format Date
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // Format Date + Time
  // =====================================================

  const formatDateTime = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =====================================================
  // Find History Entry
  // =====================================================

  const getHistoryEntry = (status) => {
    if (!Array.isArray(selectedOrder?.statusHistory)) {
      return null;
    }

    return selectedOrder.statusHistory.find((entry) => entry.status === status);
  };

  // =====================================================
  // Cancel Order
  // =====================================================

  const handleCancelOrder = async () => {
    if (!selectedOrder?._id) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?",
    );

    if (!confirmed) {
      return;
    }

    await dispatch(cancelBuyerOrder(selectedOrder._id));
  };

  // =====================================================
  // Loading
  // =====================================================

  if (detailsLoading) {
    return (
      <section className="min-h-screen bg-gray-50 p-6 dark:bg-gray-950">
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600 dark:border-emerald-950 dark:border-t-emerald-500" />

            <p className="mt-4 text-gray-500 dark:text-gray-400">
              Loading order details...
            </p>
          </div>
        </div>
      </section>
    );
  }

  // =====================================================
  // Error
  // =====================================================

  if (detailsError) {
    return (
      <section className="min-h-screen bg-gray-50 p-6 dark:bg-gray-950">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            <p className="font-semibold">Unable to load order</p>

            <p className="mt-1 text-sm">{detailsError}</p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/orders")}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            <ArrowLeft size={17} />
            Back to Orders
          </button>
        </div>
      </section>
    );
  }

  // =====================================================
  // Order Not Found
  // =====================================================

  if (!selectedOrder) {
    return (
      <section className="min-h-screen bg-gray-50 p-6 dark:bg-gray-950">
        <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="text-4xl">📦</div>

          <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
            Order not found
          </h2>

          <button
            type="button"
            onClick={() => navigate("/orders")}
            className="mt-6 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            Back to Orders
          </button>
        </div>
      </section>
    );
  }

  const order = selectedOrder;

  const product = order.product;
  const farmer = order.farmer;

  const currentStatusIndex = statuses.findIndex(
    (status) => status.value === order.orderStatus,
  );

  const isCancelled = order.orderStatus === "Cancelled";
  const isRejected = order.orderStatus === "Rejected";

  const canReview = order.orderStatus === "Delivered";

  const canCancel =
    order.orderStatus === "Pending" && order.paymentStatus === "Pending";

  // =====================================================
  // Render
  // =====================================================

  return (
    <section className="min-h-screen bg-gray-50 p-4 text-gray-900 dark:bg-gray-950 dark:text-gray-100 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* =================================================
            Header
        ================================================= */}

        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate("/orders")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
          >
            <ArrowLeft size={17} />
            Back to Orders
          </button>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                Order Details
              </p>

              <h1 className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
                #{String(order._id).slice(-8).toUpperCase()}
              </h1>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Placed on {formatDateTime(order.createdAt)}
              </p>
            </div>

            <span
              className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold ${getStatusClass(
                order.orderStatus,
              )}`}
            >
              {order.orderStatus}
            </span>
          </div>
        </div>

        {/* =================================================
            Main Order Card
        ================================================= */}

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {/* =================================================
              Product
          ================================================= */}

          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row">
              {/* Product Image */}

              <div className="h-56 w-full shrink-0 overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 sm:h-64 lg:h-56 lg:w-64">
                {product?.images?.[0]?.url ? (
                  <img
                    src={product.images[0].url}
                    alt={product.name || "Product"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Package
                      size={40}
                      className="text-gray-400 dark:text-gray-500"
                    />
                  </div>
                )}
              </div>

              {/* Product Information */}

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      {product?.category || "Agricultural Product"}
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                      {product?.name || "Product"}
                    </h2>

                    {product?.description && (
                      <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400">
                        {product.description}
                      </p>
                    )}
                  </div>

                  <div className="sm:text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Total Amount
                    </p>

                    <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      ₹{Number(order.totalPrice || 0).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* Product Details */}

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Quantity
                    </p>

                    <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                      {order.quantity} {product?.unit || ""}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Price
                    </p>

                    <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                      ₹
                      {Number(
                        order.price || product?.price || 0,
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Farmer
                    </p>

                    <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                      {farmer?.name || "Unknown Farmer"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Location
                    </p>

                    <p className="mt-1 flex items-center gap-1 font-semibold text-gray-900 dark:text-white">
                      <MapPin size={15} className="text-gray-400" />
                      {product?.location || "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                Status Timeline
            ================================================= */}

            {!isCancelled && !isRejected && (
              <div className="mt-10 border-t border-gray-100 pt-8 dark:border-gray-800">
                <div className="mb-7">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Order Status
                  </h2>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Track the progress of your order.
                  </p>
                </div>

                {/* Desktop Timeline */}

                <div className="hidden md:block">
                  <div className="relative">
                    {/* Background line */}

                    <div className="absolute left-[10%] right-[10%] top-6 h-1 rounded-full bg-gray-200 dark:bg-gray-700" />

                    {/* Progress line */}

                    <div
                      className="absolute left-[10%] top-6 h-1 rounded-full bg-emerald-500 transition-all duration-500"
                      style={{
                        width:
                          currentStatusIndex <= 0
                            ? "0%"
                            : `${
                                (currentStatusIndex / (statuses.length - 1)) *
                                80
                              }%`,
                      }}
                    />

                    <div className="relative grid grid-cols-5">
                      {statuses.map((status, index) => {
                        const Icon = status.icon;

                        const completed = currentStatusIndex >= index;

                        const isCurrent = currentStatusIndex === index;

                        const historyEntry = getHistoryEntry(status.value);

                        return (
                          <div
                            key={status.value}
                            className="flex flex-col items-center text-center"
                          >
                            <div
                              className={`flex h-12 w-12 items-center justify-center rounded-full border-4 border-white shadow-sm dark:border-gray-900 ${
                                completed
                                  ? "bg-emerald-600 text-white"
                                  : "bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500"
                              } ${
                                isCurrent
                                  ? "ring-4 ring-emerald-100 dark:ring-emerald-950"
                                  : ""
                              }`}
                            >
                              {completed ? (
                                <Icon size={20} />
                              ) : (
                                <span className="text-sm font-bold">
                                  {index + 1}
                                </span>
                              )}
                            </div>

                            <p
                              className={`mt-3 text-sm font-semibold ${
                                completed
                                  ? "text-gray-900 dark:text-white"
                                  : "text-gray-400 dark:text-gray-600"
                              }`}
                            >
                              {status.label}
                            </p>

                            {historyEntry?.changedAt ? (
                              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                {formatDateTime(historyEntry.changedAt)}
                              </p>
                            ) : (
                              <p className="mt-1 text-xs text-gray-400 dark:text-gray-600">
                                Awaiting
                              </p>
                            )}

                            {isCurrent && (
                              <span className="mt-2 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                                Current Status
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Mobile Timeline */}

                <div className="md:hidden">
                  <div className="space-y-0">
                    {statuses.map((status, index) => {
                      const Icon = status.icon;

                      const completed = currentStatusIndex >= index;

                      const isCurrent = currentStatusIndex === index;

                      const historyEntry = getHistoryEntry(status.value);

                      return (
                        <div
                          key={status.value}
                          className="relative flex gap-4 pb-8 last:pb-0"
                        >
                          {index < statuses.length - 1 && (
                            <div
                              className={`absolute left-5 top-10 h-full w-0.5 ${
                                currentStatusIndex > index
                                  ? "bg-emerald-500"
                                  : "bg-gray-200 dark:bg-gray-700"
                              }`}
                            />
                          )}

                          <div
                            className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                              completed
                                ? "bg-emerald-600 text-white"
                                : "bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500"
                            } ${
                              isCurrent
                                ? "ring-4 ring-emerald-100 dark:ring-emerald-950"
                                : ""
                            }`}
                          >
                            {completed ? (
                              <Icon size={18} />
                            ) : (
                              <span className="text-xs font-bold">
                                {index + 1}
                              </span>
                            )}
                          </div>

                          <div className="pt-1">
                            <p
                              className={`font-semibold ${
                                completed
                                  ? "text-gray-900 dark:text-white"
                                  : "text-gray-400 dark:text-gray-600"
                              }`}
                            >
                              {status.label}
                            </p>

                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                              {status.description}
                            </p>

                            {historyEntry?.changedAt && (
                              <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                                {formatDateTime(historyEntry.changedAt)}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* =================================================
                Cancelled / Rejected
            ================================================= */}

            {(isCancelled || isRejected) && (
              <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/30">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
                    <XCircle size={22} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-red-800 dark:text-red-300">
                      {isRejected ? "Order Rejected" : "Order Cancelled"}
                    </h3>

                    <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                      {isRejected
                        ? "The farmer has rejected this order."
                        : "This order has been cancelled."}
                    </p>

                    {getHistoryEntry(order.orderStatus)?.changedAt && (
                      <p className="mt-2 text-xs text-red-600 dark:text-red-500">
                        {formatDateTime(
                          getHistoryEntry(order.orderStatus).changedAt,
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* =================================================
                Order Information
            ================================================= */}

            <div className="mt-10 grid gap-6 border-t border-gray-100 pt-8 dark:border-gray-800 lg:grid-cols-2">
              {/* Shipping */}

              <div className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                    <MapPin size={20} />
                  </div>

                  <div>
                    <h2 className="font-bold text-gray-900 dark:text-white">
                      Shipping Information
                    </h2>

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Delivery details
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Farmer
                    </p>

                    <p className="mt-1 font-medium text-gray-800 dark:text-gray-200">
                      {farmer?.name || "Unknown Farmer"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Location
                    </p>

                    <p className="mt-1 font-medium text-gray-800 dark:text-gray-200">
                      {product?.location || "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment */}

              <div className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                    <CreditCard size={20} />
                  </div>

                  <div>
                    <h2 className="font-bold text-gray-900 dark:text-white">
                      Payment Information
                    </h2>

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Payment details
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-gray-500 dark:text-gray-400">
                      Method
                    </span>

                    <span className="font-semibold text-gray-900 dark:text-white">
                      {order.paymentMethod || "COD"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-gray-500 dark:text-gray-400">
                      Status
                    </span>

                    <span
                      className={`font-semibold ${
                        order.paymentStatus === "Paid"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : order.paymentStatus === "Refunded"
                            ? "text-blue-600 dark:text-blue-400"
                            : order.paymentStatus === "Failed"
                              ? "text-red-600 dark:text-red-400"
                              : "text-orange-600 dark:text-orange-400"
                      }`}
                    >
                      {order.paymentStatus || "Pending"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-3 dark:border-gray-800">
                    <span className="text-gray-500 dark:text-gray-400">
                      Total
                    </span>

                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      ₹{Number(order.totalPrice || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                Review
            ================================================= */}

            {canReview && (
              <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5 dark:border-yellow-900/60 dark:bg-yellow-950/30">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Star
                        size={20}
                        className="fill-yellow-500 text-yellow-500"
                      />

                      <h3 className="font-semibold text-yellow-900 dark:text-yellow-300">
                        Enjoyed your purchase?
                      </h3>
                    </div>

                    <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-400">
                      Share your experience with other Hawkins Farm buyers.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/products/${product?._id}?orderId=${order._id}`)
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-yellow-600"
                  >
                    <Star size={16} fill="currentColor" />
                    Rate Product
                  </button>
                </div>
              </div>
            )}

            {/* =================================================
                Cancel Error
            ================================================= */}

            {cancelError && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                {cancelError}
              </div>
            )}

            {/* =================================================
                Cancel Order
            ================================================= */}

            {canCancel && (
              <div className="mt-6 flex flex-col gap-4 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    Want to cancel this order?
                  </p>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    This order can be cancelled because it has not yet been
                    accepted by the farmer.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={cancelling}
                  onClick={handleCancelOrder}
                  className="rounded-xl border border-red-300 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-800 dark:bg-gray-900 dark:text-red-400 dark:hover:bg-red-950/40"
                >
                  {cancelling ? "Cancelling..." : "Cancel Order"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default OrderDetails;
