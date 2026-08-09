import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchFarmerDashboard } from "../dashboardThunks";
import DashboardCard from "../components/DashboardCard";

import { fetchUnreadCount } from "../../chat/chatThunks";

function FarmerDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { dashboard, loading, error } = useSelector((state) => state.dashboard);

  const { unreadMessages } = useSelector((state) => state.chat);

  // =====================================================
  // Fetch Dashboard
  // =====================================================

  useEffect(() => {
    dispatch(fetchFarmerDashboard());
  }, [dispatch]);

  // =====================================================
  // Fetch Unread Messages
  // =====================================================

  useEffect(() => {
    dispatch(fetchUnreadCount());
  }, [dispatch]);

  // =====================================================
  // Loading
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">Loading Dashboard...</p>
      </div>
    );
  }

  // =====================================================
  // Error
  // =====================================================

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-xl bg-red-50 p-5 text-red-600">{error}</div>
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      {/* =================================================
          Header
      ================================================= */}

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Farmer Dashboard</h1>

        <p className="mt-2 text-gray-600">
          Manage your products, orders, revenue, and customer conversations.
        </p>
      </div>

      {/* =================================================
          Stats Cards
      ================================================= */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard title="Products" value={dashboard.totalProducts} />

        <DashboardCard
          title="Active Products"
          value={dashboard.activeProducts}
        />

        <DashboardCard title="Orders" value={dashboard.totalOrders} />

        <DashboardCard title="Revenue" value={`₹${dashboard.totalRevenue}`} />
      </div>

      {/* =================================================
          More Stats
      ================================================= */}

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <DashboardCard title="Pending Orders" value={dashboard.pendingOrders} />

        <DashboardCard
          title="Delivered Orders"
          value={dashboard.deliveredOrders}
        />

        <DashboardCard
          title="Average Rating"
          value={`${dashboard.averageRating} ⭐`}
        />
      </div>

      {/* =================================================
          Messages
      ================================================= */}

      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900">Messages</h2>

              {unreadMessages > 0 && (
                <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-emerald-600 px-2 text-sm font-bold text-white">
                  {unreadMessages}
                </span>
              )}
            </div>

            <p className="mt-2 text-gray-500">
              View and reply to conversations with buyers.
            </p>

            {unreadMessages > 0 ? (
              <p className="mt-2 text-sm font-medium text-emerald-600">
                You have {unreadMessages} unread{" "}
                {unreadMessages === 1 ? "message" : "messages"}.
              </p>
            ) : (
              <p className="mt-2 text-sm text-gray-500">No unread messages.</p>
            )}
          </div>

          <button
            type="button"
            onClick={() => navigate("/farmer/messages")}
            className="rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            View Messages
          </button>
        </div>
      </div>

      {/* =================================================
          Recent Orders
      ================================================= */}

      <div className="mt-10 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-2xl font-bold">Recent Orders</h2>

        {dashboard.recentOrders.length === 0 ? (
          <p className="text-gray-500">No recent orders.</p>
        ) : (
          <div className="space-y-4">
            {dashboard.recentOrders.map((order) => (
              <div
                key={order._id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <h3 className="font-semibold">{order.product?.name}</h3>

                  <p className="text-sm text-gray-500">
                    Buyer: {order.buyer?.name}
                  </p>

                  <p className="text-sm">Quantity: {order.quantity}</p>
                </div>

                <div className="text-right">
                  <p className="font-bold">₹{order.totalPrice}</p>

                  <p className="text-sm text-orange-600">{order.orderStatus}</p>

                  <p className="text-sm text-green-600">
                    {order.paymentStatus}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default FarmerDashboard;
