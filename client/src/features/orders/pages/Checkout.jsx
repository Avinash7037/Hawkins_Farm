import { useEffect, useState } from "react";

import { useForm, useWatch } from "react-hook-form";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import DeliveryForm from "../components/DeliveryForm";
import PaymentMethod from "../components/PaymentMethod";
import CheckoutSummary from "../components/CheckoutSummary";
import Button from "../../../components/common/Button";

import { fetchCart } from "../../cart/cartThunks";

import { createCheckout, verifyCheckout } from "../paymentThunks";

import { resetPayment } from "../paymentSlice";

function Checkout() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  // =====================================================
  // Redux
  // =====================================================

  const { loading, error } = useSelector((state) => state.payment);

  const { cart, totalPrice } = useSelector((state) => state.cart);

  const { user } = useSelector((state) => state.auth);

  // =====================================================
  // Form
  // =====================================================

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      paymentMethod: "ONLINE",
      deliveryAddress: "",
    },
  });

  // =====================================================
  // Selected Payment Method
  // =====================================================

  const selectedMethod = useWatch({
    control,
    name: "paymentMethod",
    defaultValue: "ONLINE",
  });

  // =====================================================
  // Fetch Cart
  // =====================================================

  useEffect(() => {
    dispatch(fetchCart());

    return () => {
      dispatch(resetPayment());
    };
  }, [dispatch]);

  // =====================================================
  // Redirect Empty Cart
  // =====================================================

  useEffect(() => {
    if (!cart.length && !loading) {
      navigate("/cart", {
        replace: true,
      });
    }
  }, [cart, loading, navigate]);

  // =====================================================
  // Load Razorpay
  // =====================================================

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");

      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  // =====================================================
  // Submit
  // =====================================================

  const onSubmit = async (data) => {
    // -------------------------------------------------
    // Cart Validation
    // -------------------------------------------------

    if (!cart.length) {
      alert("Your cart is empty.");

      navigate("/cart");

      return;
    }

    // -------------------------------------------------
    // Payment Method Validation
    // -------------------------------------------------

    if (!["ONLINE", "COD"].includes(data.paymentMethod)) {
      alert("Please select a valid payment method.");

      return;
    }

    // =================================================
    // COD
    // =================================================

    if (data.paymentMethod === "COD") {
      const result = await dispatch(
        createCheckout({
          deliveryAddress: data.deliveryAddress,

          paymentMethod: "COD",
        }),
      );

      if (createCheckout.fulfilled.match(result)) {
        alert("Order placed successfully with Cash on Delivery.");

        navigate("/orders", {
          replace: true,
        });
      }

      return;
    }

    // =================================================
    // ONLINE
    // =================================================

    const razorpayLoaded = await loadRazorpay();

    if (!razorpayLoaded) {
      alert(
        "Unable to load Razorpay. Please check your internet connection and try again.",
      );

      return;
    }

    // -------------------------------------------------
    // Create Online Checkout
    // -------------------------------------------------

    const checkoutResult = await dispatch(
      createCheckout({
        deliveryAddress: data.deliveryAddress,

        paymentMethod: "ONLINE",
      }),
    );

    if (!createCheckout.fulfilled.match(checkoutResult)) {
      return;
    }

    // -------------------------------------------------
    // Extract Razorpay Data
    // -------------------------------------------------

    const { checkoutId, razorpayOrder } = checkoutResult.payload;

    if (!checkoutId || !razorpayOrder?.id) {
      alert("Invalid payment initialization response.");

      return;
    }

    // =================================================
    // Razorpay Options
    // =================================================

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

      // =================================================
      // Success
      // =================================================

      handler: async function (response) {
        const verifyResult = await dispatch(
          verifyCheckout({
            checkoutId,

            razorpay_order_id: response.razorpay_order_id,

            razorpay_payment_id: response.razorpay_payment_id,

            razorpay_signature: response.razorpay_signature,
          }),
        );

        if (verifyCheckout.fulfilled.match(verifyResult)) {
          alert("Payment successful! Your order has been placed.");

          navigate("/orders", {
            replace: true,
          });
        }
      },

      // =================================================
      // Modal
      // =================================================

      modal: {
        ondismiss: function () {
          console.log("Razorpay payment window closed");
        },
      },
    };

    // =================================================
    // Open Razorpay
    // =================================================

    const paymentObject = new window.Razorpay(options);

    // =================================================
    // Payment Failure
    // =================================================

    paymentObject.on("payment.failed", function (response) {
      console.error("Razorpay Payment Failed:", response.error);

      alert(response.error?.description || "Payment failed. Please try again.");
    });

    paymentObject.open();
  };

  // =====================================================
  // Loading
  // =====================================================

  if (!cart.length && loading) {
    return (
      <section className="p-6">
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </section>
    );
  }

  // =====================================================
  // Render
  // =====================================================

  return (
    <section className="p-6">
      {/* =================================================
          Header
      ================================================= */}

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Checkout</h1>

        <p className="mt-2 text-gray-500">
          Enter your delivery details and choose your payment method.
        </p>
      </div>

      {/* =================================================
          Error
      ================================================= */}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="font-medium text-red-700">{error}</p>
        </div>
      )}

      {/* =================================================
          Form
      ================================================= */}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-10 lg:grid-cols-3"
      >
        {/* =================================================
            Left
        ================================================= */}

        <div className="space-y-8 lg:col-span-2">
          <DeliveryForm register={register} errors={errors} />

          <PaymentMethod register={register} selectedMethod={selectedMethod} />
        </div>

        {/* =================================================
            Right
        ================================================= */}

        <div className="space-y-6">
          <CheckoutSummary totalPrice={totalPrice} />

          <Button
            type="submit"
            loading={loading}
            disabled={loading || !cart.length}
          >
            {loading
              ? "Processing..."
              : selectedMethod === "COD"
                ? "Place COD Order"
                : "Pay Now"}
          </Button>
        </div>
      </form>
    </section>
  );
}

export default Checkout;
