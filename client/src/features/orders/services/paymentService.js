import api from "../../../services/api";

export const createPaymentOrder = async (deliveryAddress) => {
  const response = await api.post("/payment/create-order", {
    deliveryAddress,
  });

  return response.data;
};

export const verifyPayment = async (paymentData) => {
  const response = await api.post("/payment/verify", paymentData);

  return response.data;
};
