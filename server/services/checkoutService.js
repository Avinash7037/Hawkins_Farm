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
  // Create orders
  const orders = await createOrdersFromCart({
    buyerId,
    deliveryAddress,
    paymentMethod,
  });

  // Clear buyer cart
  await clearBuyerCart(buyerId);

  // Send email (don't fail checkout if email fails)
  try {
    await sendOrderConfirmationEmail(buyerId, orders.length);
  } catch (error) {
    console.error("Order confirmation email failed:", error.message);
  }

  return orders;
};

module.exports = {
  completeCheckout,
};
