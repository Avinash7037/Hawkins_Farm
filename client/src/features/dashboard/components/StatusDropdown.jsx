import { useDispatch } from "react-redux";

import { updateFarmerOrderStatus } from "../orderThunks";

function StatusDropdown({ order }) {
  const dispatch = useDispatch();

  const handleChange = (e) => {
    dispatch(
      updateFarmerOrderStatus({
        id: order._id,
        orderStatus: e.target.value,
      }),
    );
  };

  return (
    <select
      value={order.orderStatus}
      onChange={handleChange}
      className="rounded border p-2"
    >
      <option value="Pending">Pending</option>
      <option value="Accepted">Accepted</option>
      <option value="Packed">Packed</option>
      <option value="Shipped">Shipped</option>
      <option value="Delivered">Delivered</option>
    </select>
  );
}

export default StatusDropdown;
