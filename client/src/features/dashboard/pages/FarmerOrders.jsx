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
    <section className="p-6">
      {/* =================================================
          Header
      ================================================= */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>

        <p className="mt-2 text-gray-600">
          Manage orders received from buyers.
        </p>
      </div>

      {/* =================================================
          Error
      ================================================= */}

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 p-5 text-red-600">
          {error}
        </div>
      )}

      {/* =================================================
          Summary
      ================================================= */}

      {!loading && !error && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Orders</p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {orders.length}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Pending</p>

            <p className="mt-2 text-3xl font-bold text-yellow-600">
              {orders.filter((order) => order.orderStatus === "Pending").length}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Active</p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {
                orders.filter((order) =>
                  ["Accepted", "Packed", "Shipped"].includes(order.orderStatus),
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Delivered</p>

            <p className="mt-2 text-3xl font-bold text-green-600">
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

      <div className="rounded-2xl border bg-white shadow-sm">
        <OrderTable orders={orders} loading={loading} />
      </div>
    </section>
  );
}

export default FarmerOrders;
