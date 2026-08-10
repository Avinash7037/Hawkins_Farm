import api from "../../../services/api";

// =====================================================
// Create Checkout / Payment Order
// =====================================================

export const createPaymentOrder = async ({
  deliveryAddress,
  paymentMethod,
}) => {
  const response = await api.post("/payments/create-order", {
    deliveryAddress,
    paymentMethod,
  });

  return response.data;
};

// =====================================================
// Verify Razorpay Payment
// =====================================================

export const verifyPayment = async ({
  checkoutId,
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) => {
  const response = await api.post("/payments/verify", {
    checkoutId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });

  return response.data;
};
