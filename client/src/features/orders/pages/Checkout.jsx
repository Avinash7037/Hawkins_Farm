import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import DeliveryForm from "../components/DeliveryForm";
import PaymentMethod from "../components/PaymentMethod";
import CheckoutSummary from "../components/CheckoutSummary";
import Button from "../../../components/common/Button";

import { fetchCart } from "../../cart/cartThunks";
import { createCheckout, verifyCheckout } from "../paymentThunks";

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.payment);
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

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
    if (cart.length === 0) {
      navigate("/cart");
    }
  }, [cart, navigate]);

  const onSubmit = async (data) => {
    const checkoutResult = await dispatch(createCheckout(data.deliveryAddress));

    if (!createCheckout.fulfilled.match(checkoutResult)) {
      alert("Unable to initiate payment.");
      return;
    }

    const { razorpayOrder } = checkoutResult.payload;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,

      amount: razorpayOrder.amount,

      currency: razorpayOrder.currency,

      name: "Hawkins Farm",

      description: "Farm Fresh Products",

      order_id: razorpayOrder.id,

      prefill: {
        name: user?.name || "",

        email: user?.email || "",
      },

      theme: {
        color: "#16a34a",
      },

      handler: async function (response) {
        const verifyResult = await dispatch(
          verifyCheckout({
            razorpay_order_id: response.razorpay_order_id,

            razorpay_payment_id: response.razorpay_payment_id,

            razorpay_signature: response.razorpay_signature,
          }),
        );

        if (verifyCheckout.fulfilled.match(verifyResult)) {
          alert("Payment Successful!");

          navigate("/orders");
        } else {
          alert("Payment verification failed.");
        }
      },
    };

    const paymentObject = new window.Razorpay(options);

    paymentObject.open();
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
            Pay Now
          </Button>
        </div>
      </form>
    </section>
  );
}

export default Checkout;
