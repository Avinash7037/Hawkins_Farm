import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchMyOrders, cancelBuyerOrder } from "../orderThunks";

function MyOrders() {
  const dispatch = useDispatch();

  const { orders, loading, error, cancelling, cancelError } = useSelector(
    (state) => state.orders,
  );

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

    // -------------------------------------------------
    // Check Cancellation Eligibility
    // -------------------------------------------------

    const cancellableStatuses = ["Pending", "Accepted"];

    if (!cancellableStatuses.includes(order.orderStatus)) {
      alert("This order can no longer be cancelled.");

      return;
    }

    // -------------------------------------------------
    // Confirmation Message
    // -------------------------------------------------

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

    // -------------------------------------------------
    // Confirm
    // -------------------------------------------------

    const confirmed = window.confirm(confirmationMessage);

    if (!confirmed) {
      return;
    }

    // -------------------------------------------------
    // Cancel Order
    // -------------------------------------------------

    try {
      const result = await dispatch(cancelBuyerOrder(order._id));

      if (cancelBuyerOrder.fulfilled.match(result)) {
        const message =
          result.payload?.message || "Order cancelled successfully.";

        alert(message);

        // -------------------------------------------------
        // Refresh Orders
        // -------------------------------------------------

        dispatch(fetchMyOrders());
      }
    } catch (error) {
      console.error("Cancel order error:", error);
    }
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
        return "bg-gray-100 text-gray-700";
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
  // Loading
  // =====================================================

  if (loading) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </section>
    );
  }

  // =====================================================
  // Error
  // =====================================================

  if (error) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <p className="font-medium text-red-700">{error}</p>
        </div>
      </section>
    );
  }

  // =====================================================
  // Render
  // =====================================================

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      {/* =================================================
          Header
      ================================================= */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>

        <p className="mt-2 text-gray-600">
          Track and manage your Hawkins Farm orders.
        </p>
      </div>

      {/* =================================================
          Cancellation Error
      ================================================= */}

      {cancelError && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="font-medium text-red-700">{cancelError}</p>
        </div>
      )}

      {/* =================================================
          Empty Orders
      ================================================= */}

      {!orders || orders.length === 0 ? (
        <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">No Orders Yet</h2>

          <p className="mt-2 text-gray-500">
            Your orders will appear here after you place an order.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const isCancellable = ["Pending", "Accepted"].includes(
              order.orderStatus,
            );

            const isOnlinePaid =
              order.paymentMethod === "ONLINE" &&
              order.paymentStatus === "Paid";

            const isCancellingThisOrder =
              cancelling &&
              order._id === orders.find((item) => item._id === order._id)?._id;

            return (
              <div
                key={order._id}
                className="rounded-2xl border bg-white p-6 shadow-sm"
              >
                {/* =================================================
                    Order Header
                ================================================= */}

                <div className="flex flex-col gap-4 border-b pb-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {order.product?.name || "Unknown Product"}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Order ID: {order._id}
                    </p>
                  </div>

                  {/* Status */}

                  <span
                    className={`inline-flex w-fit rounded-full px-3 py-1 text-sm font-semibold ${getStatusClasses(
                      order.orderStatus,
                    )}`}
                  >
                    {order.orderStatus || "Unknown"}
                  </span>
                </div>

                {/* =================================================
                    Order Information
                ================================================= */}

                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Quantity */}

                  <div>
                    <p className="text-sm text-gray-500">Quantity</p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {order.quantity} {order.product?.unit || ""}
                    </p>
                  </div>

                  {/* Total */}

                  <div>
                    <p className="text-sm text-gray-500">Total</p>

                    <p className="mt-1 font-semibold text-gray-900">
                      ₹{Number(order.totalPrice || 0).toLocaleString("en-IN")}
                    </p>
                  </div>

                  {/* Payment Method */}

                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {getPaymentMethodLabel(order.paymentMethod)}
                    </p>
                  </div>

                  {/* Payment Status */}

                  <div>
                    <p className="text-sm text-gray-500">Payment Status</p>

                    <span
                      className={`mt-1 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getPaymentStatusClasses(
                        order.paymentStatus,
                      )}`}
                    >
                      {order.paymentStatus || "Pending"}
                    </span>
                  </div>
                </div>

                {/* =================================================
                    Delivery Address
                ================================================= */}

                {order.deliveryAddress && (
                  <div className="mt-6 rounded-xl bg-gray-50 p-4">
                    <p className="text-sm font-medium text-gray-500">
                      Delivery Address
                    </p>

                    <p className="mt-1 text-gray-900">
                      {order.deliveryAddress}
                    </p>
                  </div>
                )}

                {/* =================================================
                    Cancellation Information
                ================================================= */}

                {order.orderStatus === "Cancelled" && (
                  <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <p className="font-medium text-gray-700">
                      This order has been cancelled.
                    </p>

                    {order.cancelledAt && (
                      <p className="mt-1 text-sm text-gray-500">
                        Cancelled on{" "}
                        {new Date(order.cancelledAt).toLocaleString("en-IN")}
                      </p>
                    )}
                  </div>
                )}

                {/* =================================================
                    Refund Information
                ================================================= */}

                {order.paymentStatus === "Refunded" && (
                  <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
                    <p className="font-medium text-blue-700">
                      Your online payment has been refunded.
                    </p>

                    <p className="mt-1 text-sm text-blue-600">
                      The refund was initiated through Razorpay.
                    </p>
                  </div>
                )}

                {/* =================================================
                    Cancel Button
                ================================================= */}

                {isCancellable && (
                  <div className="mt-6 flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Want to cancel this order?
                      </p>

                      {isOnlinePaid ? (
                        <p className="mt-1 text-xs text-gray-500">
                          Your paid online order will be sent for a Razorpay
                          refund.
                        </p>
                      ) : (
                        <p className="mt-1 text-xs text-gray-500">
                          No payment refund is required for COD.
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={cancelling || isCancellingThisOrder}
                      onClick={() => handleCancelOrder(order)}
                      className="rounded-lg border border-red-300 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isCancellingThisOrder ? "Cancelling..." : "Cancel Order"}
                    </button>
                  </div>
                )}

                {/* =================================================
                    No Cancellation Message
                ================================================= */}

                {!isCancellable &&
                  !["Cancelled", "Rejected"].includes(order.orderStatus) && (
                    <div className="mt-6 border-t pt-5">
                      <p className="text-sm text-gray-500">
                        This order can no longer be cancelled because it is
                        already{" "}
                        <span className="font-medium">{order.orderStatus}</span>
                        .
                      </p>
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default MyOrders;
