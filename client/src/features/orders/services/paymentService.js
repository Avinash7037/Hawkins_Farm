import api from "../../../services/api";

export const createPaymentOrder = async (deliveryAddress) => {
  const response = await api.post("/payments/create-order", {
    deliveryAddress,
  });

  return response.data;
};

export const verifyPayment = async (paymentData) => {
  const response = await api.post("/payments/verify", paymentData);

  return response.data;
};
