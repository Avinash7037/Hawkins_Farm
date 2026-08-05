const {
  createOrdersFromCart,
  clearBuyerCart,
  sendOrderConfirmationEmail,
} = require("./orderService");

const completeCheckout = async ({
  buyerId,
  deliveryAddress,
  paymentMethod,
}) => {
  const orders = await createOrdersFromCart({
    buyerId,
    deliveryAddress,
    paymentMethod,
  });

  await clearBuyerCart(buyerId);

  await sendOrderConfirmationEmail(buyerId, orders.length);

  return orders;
};

module.exports = {
  completeCheckout,
};
