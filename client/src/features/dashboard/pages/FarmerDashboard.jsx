import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchFarmerDashboard } from "../dashboardThunks";
import DashboardCard from "../components/DashboardCard";

function FarmerDashboard() {
  const dispatch = useDispatch();

  const { dashboard, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchFarmerDashboard());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <h2 className="text-xl font-semibold">Loading Dashboard...</h2>
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  if (!dashboard) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-8 text-4xl font-bold">Farmer Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard title="Products" value={dashboard.totalProducts} />

        <DashboardCard
          title="Active Products"
          value={dashboard.activeProducts}
        />

        <DashboardCard title="Orders" value={dashboard.totalOrders} />

        <DashboardCard title="Revenue" value={`₹${dashboard.totalRevenue}`} />
      </div>

      {/* More Stats */}
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

      {/* Recent Orders */}
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
