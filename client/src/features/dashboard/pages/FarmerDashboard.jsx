import { useEffect, useState } from "react";
import {
  BarChart3,
  Package,
  ShoppingBag,
  TrendingUp,
  IndianRupee,
  MessageCircle,
  ArrowUpRight,
  Clock3,
  CheckCircle2,
  Star,
  ChevronRight,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchFarmerDashboard } from "../dashboardThunks";
import { fetchUnreadCount } from "../../chat/chatThunks";

// =====================================================
// Analytics Periods
// =====================================================

const PERIODS = [
  {
    value: "7d",
    label: "7 Days",
  },
  {
    value: "30d",
    label: "30 Days",
  },
  {
    value: "3m",
    label: "3 Months",
  },
  {
    value: "all",
    label: "All Time",
  },
];

// =====================================================
// Helpers
// =====================================================

const formatCurrency = (value) => {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
};

const formatNumber = (value) => {
  return Number(value || 0).toLocaleString("en-IN");
};

// =====================================================
// Stat Card
// =====================================================

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClass,
  iconBackground,
}) {
  return (
    <div
      className="
        group rounded-2xl
        border border-gray-200
        bg-white
        p-5
        shadow-sm
        transition duration-200
        hover:-translate-y-0.5
        hover:shadow-md

        dark:border-gray-800
        dark:bg-gray-900
        dark:hover:bg-gray-800
      "
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>

          <p className="mt-3 text-3xl font-bold tracking-tight text-gray-950 dark:text-white">
            {value}
          </p>

          {subtitle && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBackground}`}
        >
          <Icon size={21} className={iconClass} />
        </div>
      </div>
    </div>
  );
}

// =====================================================
// Farmer Dashboard
// =====================================================

function FarmerDashboard() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [period, setPeriod] = useState("30d");

  const { dashboard, loading, error } = useSelector((state) => state.dashboard);

  const { unreadMessages } = useSelector((state) => state.chat);

  // =====================================================
  // Fetch Dashboard
  // =====================================================

  useEffect(() => {
    dispatch(fetchFarmerDashboard(period));
  }, [dispatch, period]);

  // =====================================================
  // Fetch Unread Messages
  // =====================================================

  useEffect(() => {
    dispatch(fetchUnreadCount());
  }, [dispatch]);

  // =====================================================
  // Loading
  // =====================================================

  if (loading && !dashboard) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-gray-50 transition-colors duration-300 dark:bg-gray-950">
        <div className="text-center">
          <div
            className="
              mx-auto
              h-10
              w-10
              animate-spin
              rounded-full
              border-4
              border-gray-200
              border-t-emerald-600

              dark:border-gray-700
              dark:border-t-emerald-500
            "
          />

          <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // Error
  // =====================================================

  if (error && !dashboard) {
    return (
      <div className="min-h-[500px] bg-gray-50 px-4 py-16 transition-colors duration-300 dark:bg-gray-950">
        <div className="mx-auto max-w-2xl">
          <div
            className="
              rounded-2xl
              border border-red-200
              bg-red-50
              p-8
              text-center

              dark:border-red-900/50
              dark:bg-red-950/40
            "
          >
            <h2 className="text-xl font-bold text-red-800 dark:text-red-400">
              Unable to load dashboard
            </h2>

            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>

            <button
              type="button"
              onClick={() => dispatch(fetchFarmerDashboard(period))}
              className="
                mt-6
                rounded-lg
                bg-red-600
                px-5
                py-2.5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-red-700
              "
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // No Dashboard
  // =====================================================

  if (!dashboard) {
    return null;
  }

  // =====================================================
  // Analytics
  // =====================================================

  const analytics = dashboard.analytics || {
    period: "30d",
    analyticsRevenue: 0,
    totalUnitsSold: 0,
    averageOrderValue: 0,
    periodOrders: 0,
    paidOrders: 0,
    revenueByPeriod: [],
    topProducts: [],
    orderStatusBreakdown: {},
  };

  const revenueData = analytics.revenueByPeriod || [];

  const topProducts = analytics.topProducts || [];

  const maxRevenue = Math.max(
    ...revenueData.map((item) => Number(item.revenue) || 0),
    1,
  );

  // =====================================================
  // Render
  // =====================================================

  return (
    <section
      className="
        min-h-screen
        bg-[#f7f9f8]
        px-4
        py-6
        transition-colors
        duration-300

        sm:px-6
        lg:px-8

        dark:bg-gray-950
      "
    >
      <div className="mx-auto max-w-[1500px]">
        {/* =================================================
            Page Header
        ================================================= */}

        <div
          className="
            mb-8
            flex
            flex-col
            gap-5

            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />

              <span
                className="
                  text-sm
                  font-semibold
                  uppercase
                  tracking-wider
                  text-emerald-700

                  dark:text-emerald-400
                "
              >
                Farmer Overview
              </span>
            </div>

            <h1
              className="
                text-3xl
                font-bold
                tracking-tight
                text-gray-950

                sm:text-4xl

                dark:text-white
              "
            >
              Dashboard
            </h1>

            <p
              className="
                mt-2
                max-w-2xl
                text-sm
                text-gray-500

                sm:text-base

                dark:text-gray-400
              "
            >
              Monitor your farm products, orders, sales performance, and
              customer activity.
            </p>
          </div>

          {/* Quick Action */}

          <button
            type="button"
            onClick={() => navigate("/farmer/products")}
            className="
              inline-flex
              w-fit
              items-center
              gap-2
              rounded-xl
              bg-emerald-600
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-emerald-700
            "
          >
            <Package size={18} />
            Manage Products
            <ArrowUpRight size={16} />
          </button>
        </div>

        {/* =================================================
            KPI Cards
        ================================================= */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Products"
            value={formatNumber(dashboard.totalProducts)}
            subtitle="Products listed in marketplace"
            icon={Package}
            iconClass="text-emerald-600 dark:text-emerald-400"
            iconBackground="bg-emerald-50 dark:bg-emerald-950/50"
          />

          <StatCard
            title="Active Products"
            value={formatNumber(dashboard.activeProducts)}
            subtitle="Currently available for sale"
            icon={ShoppingBag}
            iconClass="text-blue-600 dark:text-blue-400"
            iconBackground="bg-blue-50 dark:bg-blue-950/50"
          />

          <StatCard
            title="Total Orders"
            value={formatNumber(dashboard.totalOrders)}
            subtitle="Orders received from buyers"
            icon={BarChart3}
            iconClass="text-violet-600 dark:text-violet-400"
            iconBackground="bg-violet-50 dark:bg-violet-950/50"
          />

          <StatCard
            title="Total Revenue"
            value={formatCurrency(dashboard.totalRevenue)}
            subtitle="Revenue from paid orders"
            icon={IndianRupee}
            iconClass="text-amber-600 dark:text-amber-400"
            iconBackground="bg-amber-50 dark:bg-amber-950/50"
          />
        </div>

        {/* =================================================
            Secondary Stats
        ================================================= */}

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div
            className="
              flex
              items-center
              gap-4
              rounded-2xl
              border
              border-gray-200
              bg-white
              px-5
              py-4
              shadow-sm

              dark:border-gray-800
              dark:bg-gray-900
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-orange-50

                dark:bg-orange-950/50
              "
            >
              <Clock3
                size={19}
                className="text-orange-600 dark:text-orange-400"
              />
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Pending Orders
              </p>

              <p className="mt-0.5 text-xl font-bold text-gray-900 dark:text-white">
                {formatNumber(dashboard.pendingOrders)}
              </p>
            </div>
          </div>

          <div
            className="
              flex
              items-center
              gap-4
              rounded-2xl
              border
              border-gray-200
              bg-white
              px-5
              py-4
              shadow-sm

              dark:border-gray-800
              dark:bg-gray-900
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-emerald-50

                dark:bg-emerald-950/50
              "
            >
              <CheckCircle2
                size={19}
                className="text-emerald-600 dark:text-emerald-400"
              />
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Delivered Orders
              </p>

              <p className="mt-0.5 text-xl font-bold text-gray-900 dark:text-white">
                {formatNumber(dashboard.deliveredOrders)}
              </p>
            </div>
          </div>

          <div
            className="
              flex
              items-center
              gap-4
              rounded-2xl
              border
              border-gray-200
              bg-white
              px-5
              py-4
              shadow-sm

              dark:border-gray-800
              dark:bg-gray-900
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-yellow-50

                dark:bg-yellow-950/50
              "
            >
              <Star size={19} className="fill-yellow-400 text-yellow-500" />
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Average Rating
              </p>

              <p className="mt-0.5 text-xl font-bold text-gray-900 dark:text-white">
                {dashboard.averageRating || 0}

                <span className="ml-1 text-sm font-medium text-gray-400 dark:text-gray-500">
                  / 5
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            Sales Analytics
        ================================================= */}

        <div
          className="
            mt-8
            rounded-2xl
            border
            border-gray-200
            bg-white
            shadow-sm

            dark:border-gray-800
            dark:bg-gray-900
          "
        >
          {/* Analytics Header */}

          <div
            className="
              flex
              flex-col
              gap-4
              border-b
              border-gray-100
              px-5
              py-5

              sm:px-6

              lg:flex-row
              lg:items-center
              lg:justify-between

              dark:border-gray-800
            "
          >
            <div>
              <div className="flex items-center gap-2">
                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    bg-emerald-50

                    dark:bg-emerald-950/50
                  "
                >
                  <TrendingUp
                    size={19}
                    className="text-emerald-600 dark:text-emerald-400"
                  />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Sales Analytics
                  </h2>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Track your sales performance
                  </p>
                </div>
              </div>
            </div>

            {/* Period Selector */}

            <div
              className="
                flex
                w-fit
                rounded-lg
                border
                border-gray-200
                bg-gray-50
                p-1

                dark:border-gray-700
                dark:bg-gray-800
              "
            >
              {PERIODS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setPeriod(item.value)}
                  className={`
                    rounded-md
                    px-3
                    py-2
                    text-xs
                    font-semibold
                    transition

                    sm:px-4

                    ${
                      period === item.value
                        ? "bg-white text-emerald-700 shadow-sm dark:bg-gray-700 dark:text-emerald-400"
                        : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    }
                  `}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Analytics Body */}

          <div className="p-5 sm:p-6">
            {/* Analytics Summary */}

            <div className="grid gap-4 sm:grid-cols-3">
              <div
                className="
                  rounded-xl
                  bg-emerald-50/70
                  p-4

                  dark:bg-emerald-950/30
                "
              >
                <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  Period Revenue
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-950 dark:text-white">
                  {formatCurrency(analytics.analyticsRevenue)}
                </p>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  From paid orders
                </p>
              </div>

              <div
                className="
                  rounded-xl
                  bg-blue-50/70
                  p-4

                  dark:bg-blue-950/30
                "
              >
                <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
                  Units Sold
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-950 dark:text-white">
                  {formatNumber(analytics.totalUnitsSold)}
                </p>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Across valid orders
                </p>
              </div>

              <div
                className="
                  rounded-xl
                  bg-orange-50/70
                  p-4

                  dark:bg-orange-950/30
                "
              >
                <p className="text-xs font-medium text-orange-700 dark:text-orange-400">
                  Average Order Value
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-950 dark:text-white">
                  {formatCurrency(analytics.averageOrderValue)}
                </p>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Per paid order
                </p>
              </div>
            </div>

            {/* =================================================
                Chart + Top Products
            ================================================= */}

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
              {/* Revenue Chart */}

              <div
                className="
                  rounded-xl
                  border
                  border-gray-100
                  bg-gray-50/60
                  p-5

                  dark:border-gray-800
                  dark:bg-gray-800/50
                "
              >
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Revenue Overview
                    </h3>

                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Paid-order revenue
                    </p>
                  </div>

                  <TrendingUp
                    size={18}
                    className="text-emerald-600 dark:text-emerald-400"
                  />
                </div>

                {revenueData.length === 0 ? (
                  <div
                    className="
                      flex
                      h-64
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-dashed
                      border-gray-200
                      bg-white

                      dark:border-gray-700
                      dark:bg-gray-900
                    "
                  >
                    <div className="text-center">
                      <BarChart3
                        size={28}
                        className="mx-auto text-gray-300 dark:text-gray-600"
                      />

                      <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                        No sales data available
                      </p>

                      <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                        Sales will appear here once paid orders are available.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg bg-white p-4 dark:bg-gray-900">
                    <div className="flex h-64 items-end gap-2 overflow-x-auto">
                      {revenueData.map((item, index) => {
                        const revenue = Number(item.revenue) || 0;

                        const height =
                          revenue === 0
                            ? 3
                            : Math.max((revenue / maxRevenue) * 100, 5);

                        return (
                          <div
                            key={`${item.date}-${index}`}
                            className="
                              group
                              flex
                              h-full
                              min-w-[28px]
                              flex-1
                              flex-col
                              justify-end
                            "
                          >
                            <div className="relative flex flex-1 items-end">
                              {/* Tooltip */}

                              <div
                                className="
                                  pointer-events-none
                                  absolute
                                  bottom-full
                                  left-1/2
                                  z-20
                                  mb-2
                                  hidden
                                  -translate-x-1/2
                                  whitespace-nowrap
                                  rounded-md
                                  bg-gray-900
                                  px-2
                                  py-1
                                  text-[10px]
                                  font-medium
                                  text-white

                                  group-hover:block

                                  dark:bg-black
                                "
                              >
                                {formatCurrency(revenue)}

                                <span className="ml-1 text-gray-300">
                                  ({item.orders}{" "}
                                  {item.orders === 1 ? "order" : "orders"})
                                </span>
                              </div>

                              {/* Bar */}

                              <div
                                className="
                                  w-full
                                  rounded-t-md
                                  bg-emerald-500
                                  transition-all
                                  duration-200
                                  group-hover:bg-emerald-600
                                "
                                style={{
                                  height: `${height}%`,
                                }}
                              />
                            </div>

                            <p
                              className="
                                mt-2
                                truncate
                                text-center
                                text-[9px]
                                text-gray-400

                                dark:text-gray-500
                              "
                            >
                              {item.label}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Top Products */}

              <div
                className="
                  rounded-xl
                  border
                  border-gray-100
                  bg-gray-50/60
                  p-5

                  dark:border-gray-800
                  dark:bg-gray-800/50
                "
              >
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Top Products
                    </h3>

                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Best performing products
                    </p>
                  </div>

                  <Package
                    size={18}
                    className="text-emerald-600 dark:text-emerald-400"
                  />
                </div>

                {topProducts.length === 0 ? (
                  <div
                    className="
                      flex
                      h-64
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-dashed
                      border-gray-200
                      bg-white

                      dark:border-gray-700
                      dark:bg-gray-900
                    "
                  >
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No product sales yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {topProducts.map((product, index) => (
                      <div
                        key={product.productId || index}
                        className="
                          flex
                          items-center
                          gap-3
                          rounded-xl
                          bg-white
                          p-3

                          dark:bg-gray-900
                        "
                      >
                        {/* Rank */}

                        <div
                          className="
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-emerald-50
                            text-xs
                            font-bold
                            text-emerald-700

                            dark:bg-emerald-950/50
                            dark:text-emerald-400
                          "
                        >
                          {index + 1}
                        </div>

                        {/* Product Info */}

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                            {product.name}
                          </p>

                          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                            {formatNumber(product.unitsSold)} units sold
                          </p>
                        </div>

                        {/* Revenue */}

                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {formatCurrency(product.revenue)}
                          </p>

                          <p className="mt-0.5 text-[10px] text-gray-400 dark:text-gray-500">
                            {product.orders}{" "}
                            {product.orders === 1 ? "order" : "orders"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* =================================================
                Order Status Summary
            ================================================= */}

            <div className="mt-6">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                Order Status
              </h3>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
                {[
                  ["Pending", "text-yellow-600"],
                  ["Accepted", "text-blue-600"],
                  ["Packed", "text-purple-600"],
                  ["Shipped", "text-indigo-600"],
                  ["Delivered", "text-emerald-600"],
                  ["Rejected", "text-red-600"],
                  ["Cancelled", "text-gray-500"],
                ].map(([status, color]) => (
                  <div
                    key={status}
                    className="
                      rounded-xl
                      border
                      border-gray-100
                      bg-gray-50
                      p-3

                      dark:border-gray-800
                      dark:bg-gray-800/50
                    "
                  >
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {status}
                    </p>

                    <p
                      className={`mt-1 text-xl font-bold ${color} dark:opacity-90`}
                    >
                      {formatNumber(
                        analytics.orderStatusBreakdown?.[status] || 0,
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            Bottom Section
        ================================================= */}

        <div className="mt-8 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          {/* =================================================
              Messages
          ================================================= */}

          <div
            className="
              rounded-2xl
              border
              border-gray-200
              bg-white
              p-6
              shadow-sm

              dark:border-gray-800
              dark:bg-gray-900
            "
          >
            <div className="flex items-start justify-between">
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-emerald-50

                  dark:bg-emerald-950/50
                "
              >
                <MessageCircle
                  size={21}
                  className="text-emerald-600 dark:text-emerald-400"
                />
              </div>

              {unreadMessages > 0 && (
                <span
                  className="
                    rounded-full
                    bg-red-50
                    px-2.5
                    py-1
                    text-xs
                    font-bold
                    text-red-600

                    dark:bg-red-950/40
                    dark:text-red-400
                  "
                >
                  {unreadMessages} unread
                </span>
              )}
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">
              Messages
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Stay connected with buyers and respond to their conversations.
            </p>

            <div
              className="
                mt-5
                rounded-xl
                bg-gray-50
                p-4

                dark:bg-gray-800
              "
            >
              {unreadMessages > 0 ? (
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  You have{" "}
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {unreadMessages}
                  </span>{" "}
                  unread {unreadMessages === 1 ? "message" : "messages"}.
                </p>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  You're all caught up. No unread messages.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => navigate("/farmer/messages")}
              className="
                mt-5
                flex
                w-full
                items-center
                justify-between
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                py-3
                text-sm
                font-semibold
                text-gray-700
                transition
                hover:border-emerald-300
                hover:text-emerald-700

                dark:border-gray-700
                dark:bg-gray-900
                dark:text-gray-300
                dark:hover:border-emerald-600
                dark:hover:text-emerald-400
              "
            >
              Open Messages
              <ChevronRight size={17} />
            </button>
          </div>

          {/* =================================================
              Recent Orders
          ================================================= */}

          <div
            className="
              rounded-2xl
              border
              border-gray-200
              bg-white
              shadow-sm

              dark:border-gray-800
              dark:bg-gray-900
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-gray-100
                px-6
                py-5

                dark:border-gray-800
              "
            >
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Recent Orders
                </h2>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Latest activity from buyers
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/farmer/orders")}
                className="
                  text-xs
                  font-semibold
                  text-emerald-600
                  hover:text-emerald-700

                  dark:text-emerald-400
                  dark:hover:text-emerald-300
                "
              >
                View all
              </button>
            </div>

            {!dashboard.recentOrders || dashboard.recentOrders.length === 0 ? (
              <div className="flex min-h-[220px] items-center justify-center px-6">
                <div className="text-center">
                  <ShoppingBag
                    size={30}
                    className="mx-auto text-gray-300 dark:text-gray-600"
                  />

                  <p className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                    No recent orders
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {dashboard.recentOrders.slice(0, 5).map((order) => (
                  <div
                    key={order._id}
                    className="
                        flex
                        items-center
                        gap-4
                        px-6
                        py-4
                        transition
                        hover:bg-gray-50

                        dark:hover:bg-gray-800/60
                      "
                  >
                    {/* Product Icon */}

                    <div
                      className="
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          bg-gray-100

                          dark:bg-gray-800
                        "
                    >
                      <Package
                        size={18}
                        className="text-gray-500 dark:text-gray-400"
                      />
                    </div>

                    {/* Order Info */}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                        {order.product?.name || "Product"}
                      </p>

                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {order.buyer?.name || "Buyer"} • Qty: {order.quantity}
                      </p>
                    </div>

                    {/* Order Amount */}

                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {formatCurrency(order.totalPrice)}
                      </p>

                      <div className="mt-1 flex items-center justify-end gap-2">
                        <span
                          className={`
                              rounded-full
                              px-2
                              py-0.5
                              text-[10px]
                              font-semibold

                              ${
                                order.orderStatus === "Delivered"
                                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                                  : order.orderStatus === "Pending"
                                    ? "bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400"
                                    : order.orderStatus === "Cancelled"
                                      ? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                                      : order.orderStatus === "Rejected"
                                        ? "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400"
                                        : "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400"
                              }
                            `}
                        >
                          {order.orderStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FarmerDashboard;
