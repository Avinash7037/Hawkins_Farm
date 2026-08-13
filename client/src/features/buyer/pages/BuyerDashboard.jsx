import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  ShoppingBag,
  ShoppingCart,
  MessageCircle,
  User,
  MapPin,
  Package,
  ArrowRight,
  Leaf,
  Clock,
  CheckCircle,
  Truck,
} from "lucide-react";

import { fetchMyOrders } from "../../orders/orderThunks";

function BuyerDashboard() {
  const dispatch = useDispatch();

  // =====================================================
  // Redux
  // =====================================================

  const { user } = useSelector((state) => state.auth);

  const { orders = [], loading: ordersLoading } = useSelector(
    (state) => state.orders,
  );

  const { items: cartItems = [] } = useSelector((state) => state.cart);

  // =====================================================
  // Fetch Orders
  // =====================================================

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  // =====================================================
  // Cart Count
  // =====================================================

  const cartCount = Array.isArray(cartItems)
    ? cartItems.reduce((total, item) => total + Number(item.quantity || 0), 0)
    : 0;

  // =====================================================
  // Order Statistics
  // =====================================================

  const totalOrders = orders.length;

  const activeOrders = orders.filter((order) =>
    ["Pending", "Accepted", "Packed", "Shipped"].includes(order.orderStatus),
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.orderStatus === "Delivered",
  ).length;

  // =====================================================
  // Recent Orders
  // =====================================================

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 3);

  // =====================================================
  // Status Classes
  // =====================================================

  const getStatusClasses = (status) => {
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

      case "Cancelled":
        return "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300";

      case "Rejected":
        return "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300";

      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // =====================================================
  // Dashboard
  // =====================================================

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      {/* =================================================
          Hero
      ================================================= */}

      <section className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            {/* Welcome */}

            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                  <Leaf size={19} />
                </div>

                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  Buyer Dashboard
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Welcome back, {user?.name || "Buyer"}!
              </h1>

              <p className="mt-3 max-w-2xl text-gray-600 dark:text-gray-400">
                Manage your orders, explore fresh products, and stay connected
                with farmers on Hawkins Farm.
              </p>
            </div>

            {/* Quick Actions */}

            <div className="flex flex-wrap gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
              >
                <ShoppingBag size={18} />
                Marketplace
              </Link>

              <Link
                to="/cart"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                <ShoppingCart size={18} />
                Cart
                {cartCount > 0 && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          Main Content
      ================================================= */}

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {/* =================================================
            Statistics
        ================================================= */}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Orders */}

          <Link
            to="/orders"
            className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                <Package size={24} />
              </div>

              <ArrowRight
                size={19}
                className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-emerald-600"
              />
            </div>

            <p className="mt-5 text-sm text-gray-500 dark:text-gray-400">
              Total Orders
            </p>

            <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
              {ordersLoading ? "—" : totalOrders}
            </p>
          </Link>

          {/* Active Orders */}

          <Link
            to="/orders"
            className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                <Truck size={24} />
              </div>

              <ArrowRight
                size={19}
                className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-blue-600"
              />
            </div>

            <p className="mt-5 text-sm text-gray-500 dark:text-gray-400">
              Active Orders
            </p>

            <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
              {ordersLoading ? "—" : activeOrders}
            </p>
          </Link>

          {/* Delivered */}

          <Link
            to="/orders"
            className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600 dark:bg-green-950/50 dark:text-green-400">
                <CheckCircle size={24} />
              </div>

              <ArrowRight
                size={19}
                className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-green-600"
              />
            </div>

            <p className="mt-5 text-sm text-gray-500 dark:text-gray-400">
              Delivered
            </p>

            <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
              {ordersLoading ? "—" : deliveredOrders}
            </p>
          </Link>

          {/* Cart */}

          <Link
            to="/cart"
            className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400">
                <ShoppingCart size={24} />
              </div>

              <ArrowRight
                size={19}
                className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-orange-600"
              />
            </div>

            <p className="mt-5 text-sm text-gray-500 dark:text-gray-400">
              Cart Items
            </p>

            <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
              {cartCount}
            </p>
          </Link>
        </div>

        {/* =================================================
            Recent Orders
        ================================================= */}

        <div className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Recent Orders
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Your latest purchases from Hawkins Farm.
              </p>
            </div>

            <Link
              to="/orders"
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              View all
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                <Package
                  size={30}
                  className="text-gray-400 dark:text-gray-500"
                />
              </div>

              <h3 className="mt-5 text-xl font-semibold text-gray-900 dark:text-white">
                No orders yet
              </h3>

              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Start shopping to see your orders here.
              </p>

              <Link
                to="/products"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
              >
                Explore Products
                <ArrowRight size={17} />
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {recentOrders.map((order) => {
                  const product = order.product;
                  const farmer = order.farmer;

                  return (
                    <Link
                      key={order._id}
                      to={`/orders/${order._id}`}
                      className="flex flex-col gap-4 p-5 transition hover:bg-gray-50 dark:hover:bg-gray-800/70 sm:flex-row sm:items-center"
                    >
                      {/* Product */}

                      <div className="flex min-w-0 flex-1 items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                          {product?.images?.[0]?.url ? (
                            <img
                              src={product.images[0].url}
                              alt={product.name || "Product"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package
                              size={20}
                              className="text-gray-400 dark:text-gray-500"
                            />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-semibold text-gray-900 dark:text-white">
                            {product?.name || "Product"}
                          </p>

                          <p className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <User size={12} />
                            {farmer?.name || "Farmer"}
                          </p>

                          {product?.location && (
                            <p className="mt-1 flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                              <MapPin size={12} />
                              {product.location}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Amount */}

                      <div className="flex items-center justify-between gap-5 sm:justify-end">
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">
                            ₹
                            {Number(order.totalPrice || 0).toLocaleString(
                              "en-IN",
                            )}
                          </p>

                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Qty: {order.quantity}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                              order.orderStatus,
                            )}`}
                          >
                            {order.orderStatus}
                          </span>

                          <ArrowRight
                            size={17}
                            className="text-gray-400 dark:text-gray-500"
                          />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* =================================================
            Marketplace CTA
        ================================================= */}

        <div className="mt-10 rounded-3xl bg-emerald-600 p-7 text-white shadow-lg sm:p-9">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Leaf size={22} />

                <span className="font-semibold">Hawkins Farm</span>
              </div>

              <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
                Looking for something fresh?
              </h2>

              <p className="mt-2 max-w-xl text-emerald-50">
                Explore fresh agricultural products from farmers on Hawkins
                Farm.
              </p>
            </div>

            <Link
              to="/products"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-emerald-700 transition hover:bg-emerald-50"
            >
              Browse Marketplace
              <ArrowRight size={19} />
            </Link>
          </div>
        </div>

        {/* =================================================
            Account Status
        ================================================= */}

        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <CheckCircle size={22} />
            </div>

            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                Account Active
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your Hawkins Farm buyer account is active.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Clock size={16} />
            Buyer Account
          </div>
        </div>
      </section>
    </main>
  );
}

export default BuyerDashboard;
