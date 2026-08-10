import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

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

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id));
    }

    return () => {
      dispatch(clearSelectedOrder());
    };
  }, [dispatch, id]);

  // =====================================================
  // Order Status Colors
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
  // Order Timeline
  // =====================================================

  const statuses = ["Pending", "Accepted", "Packed", "Shipped", "Delivered"];

  const getStatusIndex = (status) => {
    return statuses.indexOf(status);
  };

  // =====================================================
  // Cancel Order
  // =====================================================

  const handleCancelOrder = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?",
    );

    if (!confirmed) {
      return;
    }

    const result = await dispatch(cancelBuyerOrder(order._id));

    if (cancelBuyerOrder.fulfilled.match(result)) {
      // Order state is already updated by Redux.
      // No need to fetch the order again.
      return;
    }
  };

  // =====================================================
  // Loading
  // =====================================================

  if (detailsLoading) {
    return (
      <section className="p-6">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-gray-500">Loading order details...</p>
        </div>
      </section>
    );
  }

  // =====================================================
  // Error
  // =====================================================

  if (detailsError) {
    return (
      <section className="p-6">
        <div className="rounded-xl bg-red-50 p-5 text-red-600">
          {detailsError}
        </div>

        <button
          type="button"
          onClick={() => navigate("/orders")}
          className="mt-5 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
        >
          Back to Orders
        </button>
      </section>
    );
  }

  // =====================================================
  // Order Not Found
  // =====================================================

  if (!selectedOrder) {
    return (
      <section className="p-6">
        <div className="rounded-2xl border bg-white p-12 text-center shadow-sm">
          <div className="text-4xl">📦</div>

          <h2 className="mt-4 text-xl font-semibold">Order not found</h2>

          <button
            type="button"
            onClick={() => navigate("/orders")}
            className="mt-6 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
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

  const currentStatusIndex = getStatusIndex(order.orderStatus);

  const canReview = order.orderStatus === "Delivered";

  // =====================================================
  // Simple MVP Cancellation Rule
  //
  // Buyer can cancel ONLY:
  //
  // orderStatus   = Pending
  // paymentStatus = Pending
  // =====================================================

  const canCancel =
    order.orderStatus === "Pending" && order.paymentStatus === "Pending";

  return (
    <section className="p-6">
      {/* =================================================
          Header
      ================================================= */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate("/orders")}
            className="mb-3 text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            ← Back to Orders
          </button>

          <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>

          <p className="mt-1 text-sm text-gray-500">Order ID: {order._id}</p>
        </div>

        <span
          className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${getStatusClass(
            order.orderStatus,
          )}`}
        >
          {order.orderStatus}
        </span>
      </div>

      {/* =================================================
          Product Card
      ================================================= */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="flex h-40 w-full items-center justify-center overflow-hidden rounded-xl bg-gray-100 md:w-40">
            {product?.images?.[0]?.url ? (
              <img
                src={product.images[0].url}
                alt={product.name || "Product"}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-5xl">🌾</span>
            )}
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {product?.name || "Product"}
            </h2>

            <p className="mt-2 text-gray-500">
              Farmer:{" "}
              <span className="font-medium text-gray-800">
                {farmer?.name || "Farmer"}
              </span>
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-gray-500">Quantity</p>

                <p className="mt-1 font-semibold">
                  {order.quantity} {product?.unit || ""}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Total</p>

                <p className="mt-1 text-xl font-bold">
                  ₹{Number(order.totalPrice || 0).toLocaleString("en-IN")}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Ordered</p>

                <p className="mt-1 font-semibold">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          Order Timeline
      ================================================= */}

      {!["Rejected", "Cancelled"].includes(order.orderStatus) && (
        <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Order Progress</h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-5">
            {statuses.map((status, index) => {
              const completed = currentStatusIndex >= index;

              return (
                <div key={status} className="relative text-center">
                  <div
                    className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                      completed
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {completed ? "✓" : index + 1}
                  </div>

                  <p
                    className={`mt-2 text-sm font-medium ${
                      completed ? "text-emerald-700" : "text-gray-400"
                    }`}
                  >
                    {status}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =================================================
          Delivery + Payment
      ================================================= */}

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Delivery */}

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            Delivery Information
          </h2>

          <p className="mt-4 text-sm text-gray-500">Delivery Address</p>

          <p className="mt-1 leading-6 text-gray-800">
            {order.deliveryAddress}
          </p>
        </div>

        {/* Payment */}

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            Payment Information
          </h2>

          <div className="mt-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Method</span>

              <span className="font-semibold">{order.paymentMethod}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>

              <span
                className={
                  order.paymentStatus === "Paid"
                    ? "font-semibold text-green-600"
                    : "font-semibold text-orange-600"
                }
              >
                {order.paymentStatus}
              </span>
            </div>

            <div className="flex justify-between border-t pt-3">
              <span className="font-semibold">Total</span>

              <span className="text-xl font-bold">
                ₹{Number(order.totalPrice || 0).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          Cancellation Error
      ================================================= */}

      {cancelError && (
        <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600">
          {cancelError}
        </div>
      )}

      {/* =================================================
          Actions
      ================================================= */}

      <div className="mt-6 flex flex-wrap gap-3">
        {/* Cancel Order */}

        {canCancel && (
          <button
            type="button"
            onClick={handleCancelOrder}
            disabled={cancelling}
            className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelling ? "Cancelling..." : "Cancel Order"}
          </button>
        )}

        {/* Review */}

        {canReview && product?._id && (
          <button
            type="button"
            onClick={() =>
              navigate(`/products/${product._id}/review?orderId=${order._id}`)
            }
            className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            ⭐ Review Product
          </button>
        )}

        {/* Back */}

        <button
          type="button"
          onClick={() => navigate("/orders")}
          className="rounded-xl border px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
        >
          Back to Orders
        </button>
      </div>
    </section>
  );
}

export default OrderDetails;
