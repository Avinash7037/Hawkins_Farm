import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import DeliveryForm from "../components/DeliveryForm";
import PaymentMethod from "../components/PaymentMethod";
import CheckoutSummary from "../components/CheckoutSummary";

import Button from "../../../components/common/Button";

import { createOrder } from "../orderThunks";
import { fetchCart } from "../../cart/cartThunks";

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.orders);

  const { cart } = useSelector((state) => state.cart);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      paymentMethod: "ONLINE",
    },
  });

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    if (!cart.length) {
      navigate("/cart");
    }
  }, [cart, navigate]);

  const onSubmit = async (data) => {
    const result = await dispatch(createOrder(data));

    if (createOrder.fulfilled.match(result)) {
      navigate("/orders");
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-10 text-4xl font-bold">Checkout</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-10 lg:grid-cols-3"
      >
        <div className="space-y-8 lg:col-span-2">
          <DeliveryForm register={register} errors={errors} />

          <PaymentMethod register={register} />
        </div>

        <div className="space-y-6">
          <CheckoutSummary />

          <Button type="submit" loading={loading}>
            Place Order
          </Button>
        </div>
      </form>
    </section>
  );
}

export default Checkout;
