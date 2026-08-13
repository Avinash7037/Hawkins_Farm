import { useEffect } from "react";
import { FileText } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchMyOrders, cancelBuyerOrder } from "../orderThunks";

function MyOrders() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { orders, loading, error, cancellingOrderId, cancelError } =
    useSelector((state) => state.orders);

  // =====================================================
  // Fetch Orders
  // =====================================================

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  // =====================================================
  // Cancel Order
  // =====================================================

  const handleCancelOrder = async (order) => {
    if (!order?._id) {
      console.error("Order ID is missing:", order);

      return;
    }

    const cancellableStatuses = ["Pending", "Accepted"];

    if (!cancellableStatuses.includes(order.orderStatus)) {
      alert("This order can no longer be cancelled.");

      return;
    }

    const isOnlinePaid =
      order.paymentMethod === "ONLINE" && order.paymentStatus === "Paid";

    let confirmationMessage;

    if (isOnlinePaid) {
      confirmationMessage =
        "This order was paid online. Cancelling it will initiate a Razorpay refund. Do you want to continue?";
    } else if (order.paymentMethod === "COD") {
      confirmationMessage =
        "Are you sure you want to cancel this Cash on Delivery order?";
    } else {
      confirmationMessage = "Are you sure you want to cancel this order?";
    }

    const confirmed = window.confirm(confirmationMessage);

    if (!confirmed) {
      return;
    }

    try {
      const result = await dispatch(cancelBuyerOrder(order._id));

      if (cancelBuyerOrder.fulfilled.match(result)) {
        const message =
          result.payload?.message || "Order cancelled successfully.";

        alert(message);

        dispatch(fetchMyOrders());
      }
    } catch (error) {
      console.error("Cancel order error:", error);
    }
  };

  // =====================================================
  // View Invoice
  // =====================================================

  const handleViewInvoice = (orderId) => {
    if (!orderId) {
      return;
    }

    navigate(`/orders/${orderId}/invoice`);
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
        return "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200";

      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  // =====================================================
  // Payment Status Classes
  // =====================================================

  const getPaymentStatusClasses = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700";

      case "Refunded":
        return "bg-blue-100 text-blue-700";

      case "Failed":
        return "bg-red-100 text-red-700";

      case "Pending":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // =====================================================
  // Payment Method Label
  // =====================================================

  const getPaymentMethodLabel = (paymentMethod) => {
    if (paymentMethod === "COD") {
      return "Cash on Delivery";
    }

    if (paymentMethod === "ONLINE") {
      return "Online Payment";
    }

    return paymentMethod || "Unknown";
  };

  // =====================================================
  // Delivery Address
  // =====================================================

  const renderDeliveryAddress = (address) => {
    if (!address) {
      return (
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          No delivery address available
        </p>
      );
    }

    if (typeof address === "object" && !Array.isArray(address)) {
      return (
        <div className="mt-2 space-y-1 text-gray-900 dark:text-gray-100">
          {address.fullName && (
            <p className="font-semibold">{address.fullName}</p>
          )}

          {address.phone && <p>{address.phone}</p>}

          {address.addressLine1 && <p>{address.addressLine1}</p>}

          {address.addressLine2 && <p>{address.addressLine2}</p>}

          <p>
            {[address.city, address.state].filter(Boolean).join(", ")}
            {address.postalCode ? ` - ${address.postalCode}` : ""}
          </p>
        </div>
      );
    }

    return (
      <p className="mt-1 text-gray-900 dark:text-gray-100">{String(address)}</p>
    );
  };

  // =====================================================
  // Loading
  // =====================================================

  if (loading) {
    return (
      <section className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />

            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Loading orders...
            </p>
          </div>
        </div>
      </section>
    );
  }

  // =====================================================
  // Error
  // =====================================================

  if (error) {
    return (
      <section className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            <p className="font-semibold">Unable to load orders</p>

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
    <section className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* =================================================
            Header
        ================================================= */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Orders
          </h1>

          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Track your Hawkins Farm orders and manage your purchases.
          </p>
        </div>

        {/* =================================================
            Cancellation Error
        ================================================= */}

        {cancelError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            {cancelError}
          </div>
        )}

        {/* =================================================
            Empty State
        ================================================= */}

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="text-4xl">📦</div>

            <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              No orders yet
            </h2>

            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Your orders will appear here after you make a purchase.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              const product = order.product;

              const farmer = order.farmer;

              const isDelivered = order.orderStatus === "Delivered";

              const isCancellable = ["Pending", "Accepted"].includes(
                order.orderStatus,
              );

              const isOnlinePaid =
                order.paymentMethod === "ONLINE" &&
                order.paymentStatus === "Paid";

              const isCancellingThisOrder = cancellingOrderId === order._id;

              return (
                <div
                  key={order._id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      {/* =================================================
                          Product
                      ================================================= */}

                      <div className="flex gap-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
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

                        <div>
                          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            {product?.name || "Product"}
                          </h2>

                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Farmer:{" "}
                            <span className="font-medium text-gray-800 dark:text-gray-200">
                              {farmer?.name || "Farmer"}
                            </span>
                          </p>

                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Quantity: {order.quantity} {product?.unit || ""}
                          </p>
                        </div>
                      </div>

                      {/* =================================================
                          Status
                      ================================================= */}

                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                            order.orderStatus,
                          )}`}
                        >
                          {order.orderStatus}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getPaymentStatusClasses(
                            order.paymentStatus,
                          )}`}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>

                    {/* =================================================
                        Payment Information
                    ================================================= */}

                    <div className="mt-5 flex flex-col gap-4 border-t border-gray-100 pt-5 dark:border-gray-800 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          Payment
                        </p>

                        <p className="mt-1 font-medium text-gray-800 dark:text-gray-200">
                          {getPaymentMethodLabel(order.paymentMethod)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          Order Date
                        </p>

                        <p className="mt-1 font-medium text-gray-800 dark:text-gray-200">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString(
                                "en-IN",
                              )
                            : "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          Total
                        </p>

                        <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                          ₹
                          {Number(order.totalPrice || 0).toLocaleString(
                            "en-IN",
                          )}
                        </p>
                      </div>
                    </div>

                    {/* =================================================
                        Delivery Address
                    ================================================= */}

                    <div className="mt-5 rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Delivery Address
                      </p>

                      {renderDeliveryAddress(order.deliveryAddress)}
                    </div>

                    {/* =================================================
                        Cancelled
                    ================================================= */}

                    {order.orderStatus === "Cancelled" && (
                      <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <p className="font-medium text-gray-700 dark:text-gray-200">
                          This order has been cancelled.
                        </p>

                        {order.cancelledAt && (
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Cancelled on{" "}
                            {new Date(order.cancelledAt).toLocaleString(
                              "en-IN",
                            )}
                          </p>
                        )}
                      </div>
                    )}

                    {/* =================================================
                        Refund Information
                    ================================================= */}

                    {order.paymentStatus === "Refunded" && (
                      <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/40">
                        <p className="font-medium text-blue-700 dark:text-blue-300">
                          Your online payment has been refunded.
                        </p>

                        <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                          The refund was initiated through Razorpay.
                        </p>
                      </div>
                    )}

                    {/* =================================================
                        Actions
                    ================================================= */}

                    <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-5 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
                      {/* Invoice */}

                      <button
                        type="button"
                        onClick={() => handleViewInvoice(order._id)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
                      >
                        <FileText size={18} />
                        View Invoice
                      </button>

                      {/* Cancel */}

                      {isCancellable && (
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                          <div className="sm:text-right">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                              Want to cancel this order?
                            </p>

                            {isOnlinePaid ? (
                              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Your paid online order will be sent for a
                                Razorpay refund.
                              </p>
                            ) : (
                              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                No payment refund is required for COD.
                              </p>
                            )}
                          </div>

                          <button
                            type="button"
                            disabled={Boolean(cancellingOrderId)}
                            onClick={() => handleCancelOrder(order)}
                            className="rounded-lg border border-red-300 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-800 dark:bg-gray-900 dark:text-red-400 dark:hover:bg-red-950/30"
                          >
                            {isCancellingThisOrder
                              ? "Cancelling..."
                              : "Cancel Order"}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* =================================================
                        No Cancellation Message
                    ================================================= */}

                    {!isCancellable &&
                      !["Cancelled", "Rejected"].includes(
                        order.orderStatus,
                      ) && (
                        <div className="mt-6 border-t border-gray-100 pt-5 dark:border-gray-800">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            This order can no longer be cancelled because it is
                            already{" "}
                            <span className="font-medium text-gray-700 dark:text-gray-200">
                              {order.orderStatus}
                            </span>
                            .
                          </p>
                        </div>
                      )}

                    {/* =================================================
                        Delivered Review
                    ================================================= */}

                    {isDelivered && product?._id && (
                      <div className="mt-6 border-t border-gray-100 pt-5 dark:border-gray-800">
                        <a
                          href={`/products/${product._id}?orderId=${order._id}`}
                          className="inline-flex rounded-xl bg-yellow-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-yellow-600"
                        >
                          Rate Product
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default MyOrders;
