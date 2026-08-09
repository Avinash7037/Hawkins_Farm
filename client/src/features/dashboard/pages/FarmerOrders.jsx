import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchFarmerOrders } from "../orderThunks";
import OrderTable from "../components/OrderTable";

function FarmerOrders() {
  const dispatch = useDispatch();

  const { orders, loading } = useSelector((state) => state.farmerOrders);

  useEffect(() => {
    dispatch(fetchFarmerOrders());
  }, [dispatch]);

  return (
    <section className="space-y-6">
      <h1 className="text-4xl font-bold">Orders</h1>

      <OrderTable orders={orders} loading={loading} />
    </section>
  );
}

export default FarmerOrders;
