import { useEffect } from "react";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { fetchOrderById } from "../orderThunks";

// =====================================================
// Invoice
// =====================================================

function Invoice() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { id } = useParams();

  // =====================================================
  // Redux
  // =====================================================

  const { selectedOrder, detailsLoading, detailsError } = useSelector(
    (state) => state.orders,
  );

  const { user } = useSelector((state) => state.auth);

  // =====================================================
  // Fetch Order
  // =====================================================

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id));
    }
  }, [dispatch, id]);

  // =====================================================
  // Print Invoice
  // =====================================================

  const handlePrint = () => {
    window.print();
  };

  // =====================================================
  // Back
  // =====================================================

  const handleBack = () => {
    navigate("/orders");
  };

  // =====================================================
  // Format Currency
  // =====================================================

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
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
      month: "long",
      year: "numeric",
    });
  };

  // =====================================================
  // Payment Method
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
  // Status Class
  // =====================================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Accepted":
        return "bg-blue-100 text-blue-700";

      case "Packed":
        return "bg-purple-100 text-purple-700";

      case "Shipped":
        return "bg-indigo-100 text-indigo-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      case "Cancelled":
        return "bg-gray-200 text-gray-700";

      case "Pending":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // =====================================================
  // Payment Status Class
  // =====================================================

  const getPaymentStatusClass = (status) => {
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
  // Loading
  // =====================================================

  if (detailsLoading) {
    return (
      <section className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />

            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Loading invoice...
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
      <section className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/40">
            <h2 className="font-semibold text-red-700 dark:text-red-300">
              Unable to load invoice
            </h2>

            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {detailsError}
            </p>

            <button
              type="button"
              onClick={handleBack}
              className="mt-5 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </section>
    );
  }

  // =====================================================
  // Missing Order
  // =====================================================

  if (!selectedOrder) {
    return (
      <section className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Invoice not found
            </h2>

            <p className="mt-2 text-gray-500 dark:text-gray-400">
              We couldn't find the requested order.
            </p>

            <button
              type="button"
              onClick={handleBack}
              className="mt-5 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </section>
    );
  }

  // =====================================================
  // Order Data
  // =====================================================

  const order = selectedOrder;

  const product = order.product || {};

  const buyer = order.buyer || user || {};

  const farmer = order.farmer || {};

  const address = order.deliveryAddress || {};

  const invoiceNumber = `HF-${String(order._id).slice(-8).toUpperCase()}`;

  // =====================================================
  // Render
  // =====================================================

  return (
    <>
      {/* =================================================
          Action Bar
      ================================================= */}

      <div className="invoice-actions border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 print:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <ArrowLeft size={18} />
            Back to Orders
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <Printer size={18} />
              Print
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <Download size={18} />
              Save as PDF
            </button>
          </div>
        </div>
      </div>

      {/* =================================================
          Invoice
      ================================================= */}

      <section className="invoice-page min-h-screen bg-gray-100 px-4 py-8 dark:bg-gray-950 sm:px-6 lg:px-8">
        <div className="invoice-container mx-auto max-w-5xl bg-white p-6 shadow-lg dark:bg-gray-900 sm:p-10">
          {/* =================================================
              Header
          ================================================= */}

          <div className="flex flex-col gap-6 border-b border-gray-200 pb-8 dark:border-gray-700 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-2xl">
                  🚜
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Hawkins Farm
                  </h1>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Farm Fresh Products
                  </p>
                </div>
              </div>

              <p className="mt-4 max-w-md text-sm text-gray-500 dark:text-gray-400">
                Fresh farm products delivered directly from farmers to your
                doorstep.
              </p>
            </div>

            <div className="sm:text-right">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                INVOICE
              </h2>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Invoice No:{" "}
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {invoiceNumber}
                </span>
              </p>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Order ID:{" "}
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {order._id}
                </span>
              </p>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Date:{" "}
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {formatDate(order.createdAt)}
                </span>
              </p>
            </div>
          </div>

          {/* =================================================
              Buyer / Farmer / Delivery
          ================================================= */}

          <div className="grid gap-8 border-b border-gray-200 py-8 dark:border-gray-700 md:grid-cols-3">
            {/* Buyer */}

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Billed To
              </p>

              <div className="mt-3 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {address.fullName || buyer.name || "Buyer"}
                </p>

                {buyer.email && <p>{buyer.email}</p>}

                {address.phone && <p>{address.phone}</p>}
              </div>
            </div>

            {/* Farmer */}

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Farmer
              </p>

              <div className="mt-3 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {farmer.name || "Farmer"}
                </p>

                {farmer.email && <p>{farmer.email}</p>}
              </div>
            </div>

            {/* Delivery */}

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Delivery Address
              </p>

              <div className="mt-3 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                {address.addressLine1 && <p>{address.addressLine1}</p>}

                {address.addressLine2 && <p>{address.addressLine2}</p>}

                <p>
                  {[address.city, address.state].filter(Boolean).join(", ")}
                </p>

                {address.postalCode && <p>{address.postalCode}</p>}
              </div>
            </div>
          </div>

          {/* =================================================
              Order Status / Payment
          ================================================= */}

          <div className="grid gap-4 py-6 sm:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Order Status
              </p>

              <span
                className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                  order.orderStatus,
                )}`}
              >
                {order.orderStatus}
              </span>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Payment Method
              </p>

              <p className="mt-2 font-semibold text-gray-800 dark:text-gray-200">
                {getPaymentMethodLabel(order.paymentMethod)}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Payment Status
              </p>

              <span
                className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getPaymentStatusClass(
                  order.paymentStatus,
                )}`}
              >
                {order.paymentStatus}
              </span>
            </div>
          </div>

          {/* =================================================
              Product Table
          ================================================= */}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse">
              <thead>
                <tr className="border-y border-gray-200 bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                  <th className="px-4 py-4 font-semibold">Product</th>

                  <th className="px-4 py-4 text-center font-semibold">
                    Quantity
                  </th>

                  <th className="px-4 py-4 text-right font-semibold">
                    Unit Price
                  </th>

                  <th className="px-4 py-4 text-right font-semibold">Amount</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                        {product?.images?.[0]?.url ? (
                          <img
                            src={product.images[0].url}
                            alt={product.name || "Product"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xl">
                            🌾
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {product.name || "Product"}
                        </p>

                        {product.category && (
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {product.category}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-5 text-center text-sm text-gray-700 dark:text-gray-300">
                    {order.quantity} {product.unit || ""}
                  </td>

                  <td className="px-4 py-5 text-right text-sm text-gray-700 dark:text-gray-300">
                    {formatCurrency(
                      order.quantity
                        ? order.totalPrice / order.quantity
                        : order.totalPrice,
                    )}
                  </td>

                  <td className="px-4 py-5 text-right font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(order.totalPrice)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* =================================================
              Total
          ================================================= */}

          <div className="flex justify-end border-b border-gray-200 py-6 dark:border-gray-700">
            <div className="w-full max-w-sm space-y-3">
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Subtotal</span>

                <span>{formatCurrency(order.totalPrice)}</span>
              </div>

              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Delivery Charges</span>

                <span>₹0</span>
              </div>

              <div className="flex justify-between border-t border-gray-200 pt-3 text-lg font-bold text-gray-900 dark:border-gray-700 dark:text-white">
                <span>Total</span>

                <span>{formatCurrency(order.totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* =================================================
              Online Payment Details
          ================================================= */}

          {order.paymentMethod === "ONLINE" && (
            <div className="border-b border-gray-200 py-6 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Payment Details
              </h3>

              <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                {order.razorpayPaymentId && (
                  <p>
                    Payment ID:{" "}
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {order.razorpayPaymentId}
                    </span>
                  </p>
                )}

                {order.razorpayOrderId && (
                  <p>
                    Razorpay Order ID:{" "}
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {order.razorpayOrderId}
                    </span>
                  </p>
                )}

                {order.paymentStatus === "Refunded" &&
                  order.razorpayRefundId && (
                    <p>
                      Refund ID:{" "}
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {order.razorpayRefundId}
                      </span>
                    </p>
                  )}
              </div>
            </div>
          )}

          {/* =================================================
              Footer
          ================================================= */}

          <div className="pt-8 text-center">
            <p className="font-semibold text-gray-900 dark:text-white">
              Thank you for choosing Hawkins Farm! 🌱
            </p>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              This is a computer-generated invoice and does not require a
              signature.
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Hawkins Farm • Fresh Products • Direct from Farmers
            </p>
          </div>
        </div>
      </section>

      {/* =================================================
          Print Styles
      ================================================= */}

      <style>
        {`
          @media print {
            @page {
              size: A4;
              margin: 12mm;
            }

            html,
            body {
              background: white !important;
            }

            .invoice-page {
              min-height: auto !important;
              padding: 0 !important;
              background: white !important;
            }

            .invoice-container {
              max-width: none !important;
              padding: 0 !important;
              box-shadow: none !important;
              background: white !important;
            }

            .invoice-actions {
              display: none !important;
            }

            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        `}
      </style>
    </>
  );
}

export default Invoice;
