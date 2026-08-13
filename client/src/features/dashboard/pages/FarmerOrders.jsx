import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchFarmerOrders } from "../orderThunks";
import OrderTable from "../components/OrderTable";

function FarmerOrders() {
  const dispatch = useDispatch();

  const { orders, loading, error } = useSelector((state) => state.farmerOrders);

  // =====================================================
  // Fetch Farmer Orders
  // =====================================================

  useEffect(() => {
    dispatch(fetchFarmerOrders());
  }, [dispatch]);

  // =====================================================
  // Render
  // =====================================================

  return (
    <section className="bg-white p-6 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      {/* =================================================
          Header
      ================================================= */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Orders
        </h1>

        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage orders received from buyers.
        </p>
      </div>

      {/* =================================================
          Error
      ================================================= */}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-5 text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
          {error}
        </div>
      )}

      {/* =================================================
          Summary
      ================================================= */}

      {!loading && !error && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Orders */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Orders
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              {orders.length}
            </p>
          </div>

          {/* Pending */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>

            <p className="mt-2 text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              {orders.filter((order) => order.orderStatus === "Pending").length}
            </p>
          </div>

          {/* Active */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>

            <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
              {
                orders.filter((order) =>
                  ["Accepted", "Packed", "Shipped"].includes(order.orderStatus),
                ).length
              }
            </p>
          </div>

          {/* Delivered */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Delivered
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
              {
                orders.filter((order) => order.orderStatus === "Delivered")
                  .length
              }
            </p>
          </div>
        </div>
      )}

      {/* =================================================
          Orders Table
      ================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <OrderTable orders={orders} loading={loading} />
      </div>
    </section>
  );
}

export default FarmerOrders;
