import { useEffect, useState } from "react";
import { useWatch, useForm } from "react-hook-form";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import DeliveryForm from "../components/DeliveryForm";
import PaymentMethod from "../components/PaymentMethod";
import CheckoutSummary from "../components/CheckoutSummary";
import Button from "../../../components/common/Button";

import { fetchCart } from "../../cart/cartThunks";

import { fetchAddresses } from "../../address/addressThunks";

import { createCheckout, verifyCheckout } from "../paymentThunks";

import { resetPayment } from "../paymentSlice";

// =====================================================
// Checkout
// =====================================================

function Checkout() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  // =====================================================
  // Selected Address
  // =====================================================

  const [selectedAddress, setSelectedAddress] = useState(null);

  // =====================================================
  // Redux
  // =====================================================

  const { loading: paymentLoading, error: paymentError } = useSelector(
    (state) => state.payment,
  );

  const { cart, totalPrice } = useSelector((state) => state.cart);

  const {
    addresses,
    loading: addressLoading,
    error: addressError,
  } = useSelector((state) => state.addresses);

  const { user } = useSelector((state) => state.auth);

  // =====================================================
  // Form
  // =====================================================

  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      paymentMethod: "ONLINE",
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
  // Fetch Cart + Addresses
  // =====================================================

  useEffect(() => {
    dispatch(fetchCart());

    dispatch(fetchAddresses());

    return () => {
      dispatch(resetPayment());
    };
  }, [dispatch]);

  // =====================================================
  // Select Default Address
  // =====================================================

  useEffect(() => {
    if (!selectedAddress && addresses.length > 0) {
      const defaultAddress =
        addresses.find((address) => address.isDefault) || addresses[0];

      setSelectedAddress(defaultAddress);
    }
  }, [addresses, selectedAddress]);

  // =====================================================
  // Redirect Empty Cart
  // =====================================================

  useEffect(() => {
    if (!cart.length && !paymentLoading) {
      navigate("/cart", {
        replace: true,
      });
    }
  }, [cart, paymentLoading, navigate]);

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
  // Add New Address
  // =====================================================

  const handleAddAddress = () => {
    navigate("/profile");
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
    // Address Validation
    // -------------------------------------------------

    if (!selectedAddress) {
      alert("Please select a delivery address.");

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
    // Delivery Address Snapshot
    // =================================================
    //
    // We intentionally create a new object instead of
    // sending the Redux object directly.
    //
    // This becomes the immutable address snapshot stored
    // with the order.
    //

    const deliveryAddress = {
      fullName: selectedAddress.fullName,

      phone: selectedAddress.phone,

      addressLine1: selectedAddress.addressLine1,

      addressLine2: selectedAddress.addressLine2 || "",

      city: selectedAddress.city,

      state: selectedAddress.state,

      postalCode: selectedAddress.postalCode,
    };

    // =================================================
    // COD
    // =================================================

    if (data.paymentMethod === "COD") {
      const result = await dispatch(
        createCheckout({
          deliveryAddress,

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
        deliveryAddress,

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

  if (!cart.length && paymentLoading) {
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
          Select your delivery address and choose your payment method.
        </p>
      </div>

      {/* =================================================
          Payment Error
      ================================================= */}

      {paymentError && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="font-medium text-red-700">{paymentError}</p>
        </div>
      )}

      {/* =================================================
          Address Error
      ================================================= */}

      {addressError && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="font-medium text-red-700">{addressError}</p>

          <button
            type="button"
            onClick={handleAddAddress}
            className="mt-2 text-sm font-semibold text-red-700 underline"
          >
            Manage your addresses
          </button>
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
          {/* =================================================
              Delivery Address
          ================================================= */}

          <DeliveryForm
            addresses={addresses}
            selectedAddress={selectedAddress}
            onSelectAddress={setSelectedAddress}
            onAddAddress={handleAddAddress}
            loading={addressLoading}
            error={addressError}
          />

          {/* =================================================
              Payment Method
          ================================================= */}

          <PaymentMethod register={register} selectedMethod={selectedMethod} />
        </div>

        {/* =================================================
            Right
        ================================================= */}

        <div className="space-y-6">
          <CheckoutSummary totalPrice={totalPrice} />

          <Button
            type="submit"
            loading={paymentLoading}
            disabled={paymentLoading || !cart.length || !selectedAddress}
          >
            {paymentLoading
              ? "Processing..."
              : selectedMethod === "COD"
                ? "Place COD Order"
                : "Pay Now"}
          </Button>

          {/* =================================================
              Address Reminder
          ================================================= */}

          {!selectedAddress && (
            <p className="text-center text-sm text-gray-500">
              Select a delivery address to continue.
            </p>
          )}
        </div>
      </form>
    </section>
  );
}

export default Checkout;
