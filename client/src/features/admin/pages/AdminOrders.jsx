import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  ShoppingBag,
  Clock3,
  CheckCircle2,
  XCircle,
  IndianRupee,
  Package,
  Filter,
} from "lucide-react";

import { fetchAllAdminOrders } from "../adminThunks";

function AdminOrders() {
  const dispatch = useDispatch();

  const {
    orders = [],
    ordersLoading,
    ordersError,
  } = useSelector((state) => state.admin);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");

  useEffect(() => {
    dispatch(fetchAllAdminOrders());
  }, [dispatch]);

  const statistics = useMemo(() => {
    const pending = orders.filter(
      (order) => order.orderStatus === "Pending",
    ).length;

    const delivered = orders.filter(
      (order) => order.orderStatus === "Delivered",
    ).length;

    const cancelled = orders.filter((order) =>
      ["Cancelled", "Rejected"].includes(order.orderStatus),
    ).length;

    const inProgress = orders.filter((order) =>
      ["Accepted", "Packed", "Shipped"].includes(order.orderStatus),
    ).length;

    const revenue = orders
      .filter((order) => order.paymentStatus === "Paid")
      .reduce((sum, order) => sum + Number(order.totalPrice || 0), 0);

    return {
      total: orders.length,
      pending,
      delivered,
      cancelled,
      inProgress,
      revenue,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return orders.filter((order) => {
      const buyerName = order.buyer?.name?.toLowerCase() || "";
      const buyerEmail = order.buyer?.email?.toLowerCase() || "";
      const farmerName = order.farmer?.name?.toLowerCase() || "";
      const farmerEmail = order.farmer?.email?.toLowerCase() || "";
      const productName = order.product?.name?.toLowerCase() || "";
      const orderId = order._id?.toLowerCase() || "";

      const matchesSearch =
        !searchValue ||
        buyerName.includes(searchValue) ||
        buyerEmail.includes(searchValue) ||
        farmerName.includes(searchValue) ||
        farmerEmail.includes(searchValue) ||
        productName.includes(searchValue) ||
        orderId.includes(searchValue);

      const matchesStatus =
        statusFilter === "All" || order.orderStatus === statusFilter;

      const matchesPayment =
        paymentFilter === "All" || order.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, search, statusFilter, paymentFilter]);

  const getStatusClasses = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-800";

      case "Pending":
        return "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-800";

      case "Accepted":
        return "bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:ring-blue-800";

      case "Packed":
        return "bg-purple-50 text-purple-700 ring-1 ring-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:ring-purple-800";

      case "Shipped":
        return "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:ring-indigo-800";

      case "Rejected":
      case "Cancelled":
        return "bg-red-50 text-red-700 ring-1 ring-red-200 dark:bg-red-950/40 dark:text-red-300 dark:ring-red-800";

      default:
        return "bg-gray-50 text-gray-700 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700";
    }
  };

  const getPaymentClasses = (status) => {
    switch (status) {
      case "Paid":
        return "text-emerald-600 dark:text-emerald-400";

      case "Refunded":
        return "text-blue-600 dark:text-blue-400";

      case "Failed":
        return "text-red-600 dark:text-red-400";

      default:
        return "text-amber-600 dark:text-amber-400";
    }
  };

  if (ordersLoading) {
    return (
      <section className="space-y-6">
        <div>
          <div className="h-8 w-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />

          <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
            />
          ))}
        </div>

        <div className="h-96 animate-pulse rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900" />
      </section>
    );
  }

  return (
    <section className="space-y-7">
      {/* Header */}

      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
            <ShoppingBag size={22} />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Order Management
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Monitor and review all orders placed on Hawkins Farm.
            </p>
          </div>
        </div>
      </div>

      {/* Error */}

      {ordersError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {ordersError}
        </div>
      )}

      {/* Statistics */}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Orders
            </p>

            <ShoppingBag size={20} className="text-gray-400" />
          </div>

          <p className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">
            {statistics.total}
          </p>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            All orders
          </p>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm dark:border-amber-900/50 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Pending
            </p>

            <Clock3 size={20} className="text-amber-500" />
          </div>

          <p className="mt-3 text-3xl font-bold text-amber-600 dark:text-amber-400">
            {statistics.pending}
          </p>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Awaiting action
          </p>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm dark:border-blue-900/50 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              In Progress
            </p>

            <Package size={20} className="text-blue-500" />
          </div>

          <p className="mt-3 text-3xl font-bold text-blue-600 dark:text-blue-400">
            {statistics.inProgress}
          </p>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Accepted / Packed / Shipped
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm dark:border-emerald-900/50 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Delivered
            </p>

            <CheckCircle2 size={20} className="text-emerald-500" />
          </div>

          <p className="mt-3 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {statistics.delivered}
          </p>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Successfully completed
          </p>
        </div>

        <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm dark:border-purple-900/50 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Paid Revenue
            </p>

            <IndianRupee size={20} className="text-purple-500" />
          </div>

          <p className="mt-3 text-2xl font-bold text-purple-600 dark:text-purple-400">
            ₹{statistics.revenue.toLocaleString("en-IN")}
          </p>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            From paid orders
          </p>
        </div>
      </div>

      {/* Filters */}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 flex items-center gap-2">
          <Filter size={18} className="text-gray-500 dark:text-gray-400" />

          <h2 className="font-semibold text-gray-900 dark:text-white">
            Find Orders
          </h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px]">
          <div className="relative">
            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search buyer, farmer, product or order ID..."
              className="w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:bg-gray-800 dark:focus:ring-emerald-950"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:bg-gray-800 dark:focus:ring-emerald-950"
          >
            <option value="All">All Order Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Packed">Packed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Rejected">Rejected</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(event) => setPaymentFilter(event.target.value)}
            className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:bg-gray-800 dark:focus:ring-emerald-950"
          >
            <option value="All">All Payment Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Refunded">Refunded</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {filteredOrders.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {orders.length}
            </span>{" "}
            orders
          </p>

          {(search || statusFilter !== "All" || paymentFilter !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
                setPaymentFilter("All");
              }}
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-400"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Orders Table */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">
              All Orders
            </h2>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Complete platform order activity
            </p>
          </div>

          <div className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {filteredOrders.length} results
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-gray-50 dark:bg-gray-800/70">
              <tr className="border-b border-gray-200 dark:border-gray-700">
                {[
                  "Order",
                  "Buyer",
                  "Farmer",
                  "Product",
                  "Amount",
                  "Payment",
                  "Status",
                  "Date",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-5 py-16 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                      <XCircle
                        size={25}
                        className="text-gray-400 dark:text-gray-500"
                      />
                    </div>

                    <p className="mt-4 font-semibold text-gray-800 dark:text-gray-200">
                      No orders found
                    </p>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-gray-100 transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-5 py-4">
                      <p className="font-mono text-xs font-semibold text-gray-700 dark:text-gray-300">
                        #{order._id?.slice(-8).toUpperCase()}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Qty: {order.quantity} {order.product?.unit || ""}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {order.buyer?.name || "Unknown Buyer"}
                      </p>

                      <p className="mt-1 max-w-[180px] truncate text-xs text-gray-500 dark:text-gray-400">
                        {order.buyer?.email || "—"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {order.farmer?.name || "Unknown Farmer"}
                      </p>

                      <p className="mt-1 max-w-[180px] truncate text-xs text-gray-500 dark:text-gray-400">
                        {order.farmer?.email || "—"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {order.product?.name || "Unknown Product"}
                      </p>

                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {order.product?.category || "—"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        ₹{Number(order.totalPrice || 0).toLocaleString("en-IN")}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {order.paymentMethod || "—"}
                      </p>

                      <p
                        className={`mt-1 text-xs font-semibold ${getPaymentClasses(
                          order.paymentStatus,
                        )}`}
                      >
                        {order.paymentStatus || "Pending"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                          order.orderStatus,
                        )}`}
                      >
                        {order.orderStatus || "Unknown"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
                      </p>

                      {order.createdAt && (
                        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                          {new Date(order.createdAt).toLocaleTimeString(
                            "en-IN",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      )}
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
