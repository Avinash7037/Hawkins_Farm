import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchFarmerOrders, updateFarmerOrderStatus } from "../orderThunks";

function Orders() {
  const dispatch = useDispatch();

  const { orders, loading } = useSelector((state) => state.dashboard);

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchFarmerOrders());
  }, [dispatch]);

  const filteredOrders = useMemo(() => {
    return (
      orders?.filter((order) => {
        const buyer = order.buyer?.name?.toLowerCase() || "";
        const product = order.product?.name?.toLowerCase() || "";

        return (
          buyer.includes(search.toLowerCase()) ||
          product.includes(search.toLowerCase())
        );
      }) || []
    );
  }, [orders, search]);

  const handleStatusChange = (id, status) => {
    dispatch(
      updateFarmerOrderStatus({
        id,
        orderStatus: status,
      }),
    );
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Farmer Orders</h1>

        <input
          type="text"
          placeholder="Search buyer/product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-72 rounded-lg border p-3"
        />
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow">
        <table className="w-full">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="p-4 text-left">Buyer</th>

              <th className="text-left">Product</th>

              <th className="text-left">Quantity</th>

              <th className="text-left">Amount</th>

              <th className="text-left">Payment</th>

              <th className="text-left">Status</th>

              <th className="text-left">Update</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-500">
                  No Orders Found
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="p-4">{order.buyer?.name}</td>

                  <td>{order.product?.name}</td>

                  <td>
                    {order.quantity} {order.product?.unit}
                  </td>

                  <td>₹{order.totalPrice}</td>

                  <td>
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-semibold ${
                        order.paymentMethod === "ONLINE"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.paymentMethod}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-semibold ${
                        order.orderStatus === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.orderStatus === "Shipped"
                            ? "bg-blue-100 text-blue-700"
                            : order.orderStatus === "Preparing"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>

                  <td>
                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="rounded border p-2"
                    >
                      <option value="Pending">Pending</option>

                      <option value="Preparing">Preparing</option>

                      <option value="Shipped">Shipped</option>

                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Orders;
