import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  Package,
  ShoppingCart,
  Star,
  Store,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";

import { fetchAdminDashboard } from "../adminThunks";

// =====================================================
// Helpers
// =====================================================

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getOrderStatusClass = (status) => {
  switch (status) {
    case "Pending":
      return "bg-amber-50 dark:bg-amber-950/40 text-amber-700 ring-amber-200";

    case "Accepted":
      return "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 ring-blue-200";

    case "Packed":
      return "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 ring-purple-200";

    case "Shipped":
      return "bg-indigo-50 text-indigo-700 ring-indigo-200";

    case "Delivered":
      return "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 ring-emerald-200";

    case "Rejected":
      return "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 ring-red-200";

    case "Cancelled":
      return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 ring-gray-200";

    default:
      return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 ring-gray-200";
  }
};

const getPaymentClass = (status) => {
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

// =====================================================
// KPI Card
// =====================================================

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClass = "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
  trend,
}) {
  return (
    <div className="group rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            {value}
          </p>

          {subtitle && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={21} />
        </div>
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <ArrowUpRight size={14} />
          {trend}
        </div>
      )}
    </div>
  );
}

// =====================================================
// Order Status Card
// =====================================================

function OrderStatusCard({ label, value, icon: Icon, className }) {
  return (
    <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>

          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>

        <div className={`rounded-lg p-2 ${className}`}>
          <Icon size={17} />
        </div>
      </div>
    </div>
  );
}

// =====================================================
// Revenue Chart
// =====================================================

function RevenueChart({ data = [] }) {
  const chartData = useMemo(() => {
    if (!data.length) {
      return [];
    }

    return data.slice(-30);
  }, [data]);

  const maxRevenue = Math.max(
    ...chartData.map((item) => Number(item.revenue || 0)),
    1,
  );

  if (!chartData.length) {
    return (
      <div className="flex h-72 items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800/60 text-sm text-gray-500 dark:text-gray-400">
        No revenue data available for this period.
      </div>
    );
  }

  return (
    <div>
      <div className="flex h-72 items-end gap-1 overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-800/60 px-3 pb-4 pt-6 sm:gap-2">
        {chartData.map((item) => {
          const revenue = Number(item.revenue || 0);

          const height = Math.max(
            revenue === 0 ? 3 : (revenue / maxRevenue) * 100,
            3,
          );

          return (
            <div
              key={item.date}
              className="group flex h-full flex-1 items-end"
              title={`${formatDate(item.date)} — ${formatCurrency(revenue)}`}
            >
              <div
                className="w-full rounded-t-md bg-emerald-500 transition-all duration-200 group-hover:bg-emerald-600"
                style={{
                  height: `${height}%`,
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
        <span>{formatDate(chartData[0]?.date)}</span>

        <span>{formatDate(chartData[chartData.length - 1]?.date)}</span>
      </div>
    </div>
  );
}

// =====================================================
// Admin Dashboard
// =====================================================

function AdminDashboard() {
  const dispatch = useDispatch();

  const { dashboard, dashboardLoading, error } = useSelector(
    (state) => state.admin,
  );

  const [period, setPeriod] = useState("30d");

  // =====================================================
  // Fetch Dashboard
  // =====================================================

  useEffect(() => {
    dispatch(fetchAdminDashboard(period));
  }, [dispatch, period]);

  // =====================================================
  // Loading
  // =====================================================

  if (dashboardLoading && !dashboard) {
    return (
      <section className="space-y-6">
        <div className="animate-pulse">
          <div className="h-9 w-72 rounded-lg bg-gray-200 dark:bg-gray-700" />

          <div className="mt-3 h-5 w-96 max-w-full rounded bg-gray-100 dark:bg-gray-800" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-36 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800"
            />
          ))}
        </div>

        <div className="h-96 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />
      </section>
    );
  }

  // =====================================================
  // Error
  // =====================================================

  if (error && !dashboard) {
    return (
      <section>
        <div className="rounded-2xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 text-red-600 dark:text-red-400" size={21} />

            <div>
              <h2 className="font-semibold text-red-800 dark:text-red-200">
                Unable to load admin dashboard
              </h2>

              <p className="mt-1 text-sm text-red-700 dark:text-red-300">{error}</p>

              <button
                type="button"
                onClick={() => dispatch(fetchAdminDashboard(period))}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!dashboard) {
    return null;
  }

  const {
    totalUsers = 0,
    totalFarmers = 0,
    totalBuyers = 0,
    activeUsers = 0,
    inactiveUsers = 0,

    totalProducts = 0,
    activeProducts = 0,
    unavailableProducts = 0,
    outOfStockProducts = 0,
    lowStockProducts = 0,

    totalOrders = 0,
    pendingOrders = 0,
    acceptedOrders = 0,
    packedOrders = 0,
    shippedOrders = 0,
    deliveredOrders = 0,
    rejectedOrders = 0,
    cancelledOrders = 0,

    totalReviews = 0,
    averageRating = 0,
    ratingDistribution = [],

    totalRevenue = 0,
    averageOrderValue = 0,

    analytics = {},
    topProducts = [],
    topFarmers = [],
    recentOrders = [],
  } = dashboard;

  const {
    periodRevenue = 0,
    periodOrders = 0,
    revenueByPeriod = [],
  } = analytics;

  const periodLabel = {
    "7d": "Last 7 days",
    "30d": "Last 30 days",
    "3m": "Last 3 months",
    all: "All time",
  }[period];

  // =====================================================
  // Render
  // =====================================================

  return (
    <section className="space-y-7">
      {/* =================================================
          Header
      ================================================= */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            <Activity size={16} />
            Platform Overview
          </div>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Admin Dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400 sm:text-base">
            Monitor marketplace performance, users, orders, inventory, revenue,
            and customer activity from one place.
          </p>
        </div>

        {/* Period Selector */}

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-1 shadow-sm">
          <div className="flex items-center gap-1">
            {[
              ["7d", "7 Days"],
              ["30d", "30 Days"],
              ["3m", "3 Months"],
              ["all", "All Time"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setPeriod(value)}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition sm:px-4 ${
                  period === value
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* =================================================
          KPI Cards
      ================================================= */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          subtitle="Paid orders"
          icon={TrendingUp}
          iconClass="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
        />

        <StatCard
          title="Total Orders"
          value={totalOrders}
          subtitle={`${periodOrders} in ${periodLabel.toLowerCase()}`}
          icon={ShoppingCart}
          iconClass="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
        />

        <StatCard
          title="Total Users"
          value={totalUsers}
          subtitle={`${activeUsers} active accounts`}
          icon={Users}
          iconClass="bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400"
        />

        <StatCard
          title="Total Products"
          value={totalProducts}
          subtitle={`${activeProducts} currently active`}
          icon={Package}
          iconClass="bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400"
        />

        <StatCard
          title="Period Revenue"
          value={formatCurrency(periodRevenue)}
          subtitle={periodLabel}
          icon={BarChart3}
          iconClass="bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400"
        />

        <StatCard
          title="Average Order"
          value={formatCurrency(averageOrderValue)}
          subtitle="Per paid order"
          icon={Store}
          iconClass="bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400"
        />

        <StatCard
          title="Average Rating"
          value={`${averageRating} / 5`}
          subtitle={`${totalReviews} total reviews`}
          icon={Star}
          iconClass="bg-yellow-50 dark:bg-yellow-950/40 text-yellow-600 dark:text-yellow-400"
        />

        <StatCard
          title="Low Stock"
          value={lowStockProducts}
          subtitle={`${outOfStockProducts} products out of stock`}
          icon={AlertTriangle}
          iconClass="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400"
        />
      </div>

      {/* =================================================
          Revenue + Order Status
      ================================================= */}

      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        {/* Revenue */}

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Revenue Overview
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Paid order revenue for {periodLabel.toLowerCase()}.
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400">Period Revenue</p>

              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(periodRevenue)}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <RevenueChart data={revenueByPeriod} />
          </div>
        </div>

        {/* Order Status */}

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Order Status</h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Current order distribution across the platform.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <OrderStatusCard
              label="Pending"
              value={pendingOrders}
              icon={Clock3}
              className="bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400"
            />

            <OrderStatusCard
              label="Accepted"
              value={acceptedOrders}
              icon={CheckCircle2}
              className="bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"
            />

            <OrderStatusCard
              label="Packed"
              value={packedOrders}
              icon={Package}
              className="bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400"
            />

            <OrderStatusCard
              label="Shipped"
              value={shippedOrders}
              icon={ShoppingCart}
              className="bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600"
            />

            <OrderStatusCard
              label="Delivered"
              value={deliveredOrders}
              icon={CheckCircle2}
              className="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400"
            />

            <OrderStatusCard
              label="Rejected"
              value={rejectedOrders}
              icon={XCircle}
              className="bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400"
            />

            <OrderStatusCard
              label="Cancelled"
              value={cancelledOrders}
              icon={XCircle}
              className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
            />

            <OrderStatusCard
              label="Completion"
              value={
                totalOrders
                  ? `${Math.round((deliveredOrders / totalOrders) * 100)}%`
                  : "0%"
              }
              icon={TrendingUp}
              className="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400"
            />
          </div>
        </div>
      </div>

      {/* =================================================
          Marketplace Health
      ================================================= */}

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm sm:p-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Marketplace Health
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Quick overview of users, inventory, and platform activity.
          </p>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Farmers</span>

              <Users size={17} className="text-emerald-600 dark:text-emerald-400" />
            </div>

            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {totalFarmers}
            </p>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Registered farmers</p>
          </div>

          <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Buyers</span>

              <ShoppingCart size={17} className="text-blue-600 dark:text-blue-400" />
            </div>

            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {totalBuyers}
            </p>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Registered buyers</p>
          </div>

          <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Inventory</span>

              <Package size={17} className="text-orange-600 dark:text-orange-400" />
            </div>

            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {activeProducts}
            </p>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Active products</p>
          </div>

          <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Unavailable</span>

              <AlertTriangle size={17} className="text-red-600 dark:text-red-400" />
            </div>

            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {unavailableProducts}
            </p>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Products unavailable</p>
          </div>
        </div>
      </div>

      {/* =================================================
          Top Products + Top Farmers
      ================================================= */}

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Top Products */}

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Top Products</h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Best-performing products by quantity sold.
              </p>
            </div>

            <Package size={20} className="text-emerald-600 dark:text-emerald-400" />
          </div>

          <div className="mt-5 space-y-3">
            {topProducts.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                No product sales data available.
              </p>
            ) : (
              topProducts.map((product, index) => (
                <div
                  key={product._id}
                  className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-800 p-3"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-sm font-bold text-emerald-700 dark:text-emerald-300">
                    {index + 1}
                  </div>

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name || "Product"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package size={18} className="text-gray-400 dark:text-gray-500" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                      {product.name || "Product"}
                    </p>

                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {product.totalOrders || 0} orders ·{" "}
                      {product.totalQuantity || 0} {product.unit || "units"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {formatCurrency(product.revenue)}
                    </p>

                    <p className="text-xs text-gray-400 dark:text-gray-500">Revenue</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Farmers */}

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Top Farmers</h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Farmers ranked by marketplace sales.
              </p>
            </div>

            <Store size={20} className="text-emerald-600 dark:text-emerald-400" />
          </div>

          <div className="mt-5 space-y-3">
            {topFarmers.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                No farmer sales data available.
              </p>
            ) : (
              topFarmers.map((farmer, index) => (
                <div
                  key={farmer._id}
                  className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-800 p-3"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/40 text-sm font-bold text-blue-700 dark:text-blue-300">
                    {index + 1}
                  </div>

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50 font-bold text-emerald-700 dark:text-emerald-300">
                    {(farmer.name || "F").charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                      {farmer.name || "Farmer"}
                    </p>

                    <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
                      {farmer.email || "No email"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {formatCurrency(farmer.revenue)}
                    </p>

                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {farmer.totalOrders || 0} orders
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* =================================================
          Reviews + Inventory
      ================================================= */}

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Reviews */}

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Customer Reviews
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Overall marketplace review performance.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-yellow-50 dark:bg-yellow-950/40 px-3 py-2">
              <Star size={18} className="fill-yellow-400 text-yellow-500 dark:text-yellow-400" />

              <span className="font-bold text-gray-900 dark:text-white">{averageRating}</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const item = ratingDistribution.find(
                (entry) => Number(entry.rating) === rating,
              );

              const count = item?.count || 0;

              const percentage =
                totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

              return (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex w-12 items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                    {rating}
                    <Star
                      size={13}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  </div>

                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className="h-full rounded-full bg-yellow-400 transition-all"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>

                  <span className="w-12 text-right text-xs text-gray-500 dark:text-gray-400">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Inventory */}

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Inventory Health
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Monitor product availability and stock levels.
            </p>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Active Products
                </span>

                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {activeProducts}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{
                    width: `${
                      totalProducts ? (activeProducts / totalProducts) * 100 : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">Low Stock</span>

                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  {lowStockProducts}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className="h-full rounded-full bg-amber-400"
                  style={{
                    width: `${
                      totalProducts
                        ? Math.min(
                            (lowStockProducts / totalProducts) * 100,
                            100,
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">Out of Stock</span>

                <span className="font-semibold text-red-600 dark:text-red-400">
                  {outOfStockProducts}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className="h-full rounded-full bg-red-500"
                  style={{
                    width: `${
                      totalProducts
                        ? Math.min(
                            (outOfStockProducts / totalProducts) * 100,
                            100,
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 p-4">
                <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                  Available
                </p>

                <p className="mt-1 text-2xl font-bold text-emerald-800 dark:text-emerald-200">
                  {activeProducts}
                </p>
              </div>

              <div className="rounded-xl bg-red-50 dark:bg-red-950/40 p-4">
                <p className="text-xs font-medium text-red-700 dark:text-red-300">Unavailable</p>

                <p className="mt-1 text-2xl font-bold text-red-800 dark:text-red-200">
                  {unavailableProducts}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          Recent Orders
      ================================================= */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
        <div className="flex flex-col gap-2 border-b border-gray-100 dark:border-gray-800 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Orders</h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Latest marketplace transactions.
            </p>
          </div>

          <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs font-semibold text-gray-600 dark:text-gray-400">
            Latest {recentOrders.length}
          </span>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-500 dark:text-gray-400">
            No orders available.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead className="bg-gray-50 dark:bg-gray-800/60">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Order
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Buyer
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Farmer
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Amount
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Payment
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Status
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="transition hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-5 py-4">
                      <p className="font-mono text-xs font-semibold text-gray-700 dark:text-gray-300">
                        #{String(order._id).slice(-8).toUpperCase()}
                      </p>

                      <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                        {order.product?.name || "Product"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {order.buyer?.name || "Buyer"}
                      </p>

                      <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                        {order.buyer?.email || "—"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {order.farmer?.name || "Farmer"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {formatCurrency(order.totalPrice)}
                      </p>

                      <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                        Qty: {order.quantity}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        {order.paymentMethod}
                      </p>

                      <p
                        className={`mt-1 text-xs font-semibold ${getPaymentClass(
                          order.paymentStatus,
                        )}`}
                      >
                        {order.paymentStatus}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getOrderStatusClass(
                          order.orderStatus,
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminDashboard;
