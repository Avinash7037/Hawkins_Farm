import { useDispatch, useSelector } from "react-redux";

import { updateFarmerOrderStatus } from "../orderThunks";

function StatusDropdown({ order }) {
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.dashboard);

  // =====================================================
  // Determine Allowed Next Statuses
  // =====================================================

  const getNextStatuses = () => {
    switch (order.orderStatus) {
      case "Pending":
        return ["Accepted", "Rejected"];

      case "Accepted":
        return ["Packed"];

      case "Packed":
        return ["Shipped"];

      case "Shipped":
        return ["Delivered"];

      case "Delivered":
      case "Rejected":
      case "Cancelled":
        return [];

      default:
        return [];
    }
  };

  const nextStatuses = getNextStatuses();

  // =====================================================
  // Handle Status Change
  // =====================================================

  const handleChange = (e) => {
    const newStatus = e.target.value;

    if (!newStatus) {
      return;
    }

    dispatch(
      updateFarmerOrderStatus({
        id: order._id,
        orderStatus: newStatus,
      }),
    );
  };

  // =====================================================
  // No Actions Available
  // =====================================================

  if (nextStatuses.length === 0) {
    return (
      <span
        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
          order.orderStatus === "Delivered"
            ? "bg-green-100 text-green-700"
            : order.orderStatus === "Rejected"
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-600"
        }`}
      >
        {order.orderStatus}
      </span>
    );
  }

  // =====================================================
  // Render
  // =====================================================

  return (
    <select
      value=""
      onChange={handleChange}
      disabled={loading}
      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <option value="">
        {loading ? "Updating..." : `Current: ${order.orderStatus}`}
      </option>

      {nextStatuses.map((status) => (
        <option key={status} value={status}>
          {status === "Accepted"
            ? "Accept Order"
            : status === "Rejected"
              ? "Reject Order"
              : `Mark ${status}`}
        </option>
      ))}
    </select>
  );
}

export default StatusDropdown;
