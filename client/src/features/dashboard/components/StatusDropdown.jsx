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
  // Status Badge Classes
  // =====================================================

  const getStatusClasses = () => {
    switch (order.orderStatus) {
      case "Delivered":
        return `
          bg-green-100
          text-green-700

          dark:bg-green-950/60
          dark:text-green-400
        `;

      case "Rejected":
        return `
          bg-red-100
          text-red-700

          dark:bg-red-950/60
          dark:text-red-400
        `;

      case "Cancelled":
        return `
          bg-gray-100
          text-gray-600

          dark:bg-gray-800
          dark:text-gray-400
        `;

      case "Pending":
        return `
          bg-yellow-100
          text-yellow-700

          dark:bg-yellow-950/60
          dark:text-yellow-400
        `;

      case "Accepted":
        return `
          bg-blue-100
          text-blue-700

          dark:bg-blue-950/60
          dark:text-blue-400
        `;

      case "Packed":
        return `
          bg-purple-100
          text-purple-700

          dark:bg-purple-950/60
          dark:text-purple-400
        `;

      case "Shipped":
        return `
          bg-indigo-100
          text-indigo-700

          dark:bg-indigo-950/60
          dark:text-indigo-400
        `;

      default:
        return `
          bg-gray-100
          text-gray-600

          dark:bg-gray-800
          dark:text-gray-400
        `;
    }
  };

  // =====================================================
  // No Actions Available
  // =====================================================

  if (nextStatuses.length === 0) {
    return (
      <span
        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses()}`}
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
      className="
        rounded-lg
        border border-gray-300
        bg-white
        px-3 py-2
        text-sm
        font-medium
        text-gray-700
        outline-none
        transition

        focus:border-emerald-500
        focus:ring-2
        focus:ring-emerald-100

        disabled:cursor-not-allowed
        disabled:opacity-60

        dark:border-gray-600
        dark:bg-gray-800
        dark:text-gray-200
        dark:focus:border-emerald-500
        dark:focus:ring-emerald-900/50
      "
    >
      <option
        value=""
        className="
          bg-white
          text-gray-700

          dark:bg-gray-800
          dark:text-gray-200
        "
      >
        {loading ? "Updating..." : `Current: ${order.orderStatus}`}
      </option>

      {nextStatuses.map((status) => (
        <option
          key={status}
          value={status}
          className="
            bg-white
            text-gray-700

            dark:bg-gray-800
            dark:text-gray-200
          "
        >
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
