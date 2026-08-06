import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import productReducer from "../features/marketplace/productSlice";
import cartReducer from "../features/cart/cartSlice";
import orderReducer from "../features/orders/orderSlice";
import paymentReducer from "../features/orders/paymentSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    orders: orderReducer,
    payment: paymentReducer,
  },
});
