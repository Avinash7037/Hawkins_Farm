import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchAdminDashboard } from "../adminThunks";

function AdminDashboard() {
  const dispatch = useDispatch();

  const { dashboard, loading, error } = useSelector((state) => state.admin);

  // =====================================================
  // Fetch Dashboard
  // =====================================================

  useEffect(() => {
    dispatch(fetchAdminDashboard());
  }, [dispatch]);

  // =====================================================
  // Loading
  // =====================================================

  if (loading) {
    return (
      <section className="p-6">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-gray-500">Loading admin dashboard...</p>
        </div>
      </section>
    );
  }

  // =====================================================
  // Error
  // =====================================================

  if (error) {
    return (
      <section className="p-6">
        <div className="rounded-xl bg-red-50 p-5 text-red-600">{error}</div>
      </section>
    );
  }

  // =====================================================
  // No Data
  // =====================================================

  if (!dashboard) {
    return null;
  }

  return (
    <section className="p-6">
      {/* =================================================
          Header
      ================================================= */}

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>

        <p className="mt-2 text-gray-600">
          Monitor users, farmers, products, orders, reviews, and platform
          revenue.
        </p>
      </div>

      {/* =================================================
          User Statistics
      ================================================= */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Users</p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {dashboard.totalUsers}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Farmers</p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {dashboard.totalFarmers}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Buyers</p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            {dashboard.totalBuyers}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Products</p>

          <p className="mt-2 text-3xl font-bold text-purple-600">
            {dashboard.totalProducts}
          </p>
        </div>
      </div>

      {/* =================================================
          Order / Review Statistics
      ================================================= */}

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Orders</p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {dashboard.totalOrders}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Reviews</p>

          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {dashboard.totalReviews}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Revenue</p>

          <p className="mt-2 text-3xl font-bold text-emerald-600">
            ₹{Number(dashboard.totalRevenue || 0).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* =================================================
          Overview
      ================================================= */}

      <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">Platform Overview</h2>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-gray-50 p-5">
            <p className="text-sm text-gray-500">Farmers</p>

            <p className="mt-1 text-xl font-bold">{dashboard.totalFarmers}</p>
          </div>

          <div className="rounded-xl bg-gray-50 p-5">
            <p className="text-sm text-gray-500">Buyers</p>

            <p className="mt-1 text-xl font-bold">{dashboard.totalBuyers}</p>
          </div>

          <div className="rounded-xl bg-gray-50 p-5">
            <p className="text-sm text-gray-500">Products</p>

            <p className="mt-1 text-xl font-bold">{dashboard.totalProducts}</p>
          </div>

          <div className="rounded-xl bg-gray-50 p-5">
            <p className="text-sm text-gray-500">Orders</p>

            <p className="mt-1 text-xl font-bold">{dashboard.totalOrders}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;
