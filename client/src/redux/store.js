import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import productReducer from "../features/marketplace/productSlice";
import cartReducer from "../features/cart/cartSlice";
import orderReducer from "../features/orders/orderSlice";
import paymentReducer from "../features/orders/paymentSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import farmerOrdersReducer from "../features/dashboard/orderSlice";
import reviewReducer from "../features/reviews/reviewSlice";
import chatReducer from "../features/chat/chatSlice";
import adminReducer from "../features/admin/adminSlice";
import notificationReducer from "../features/notifications/notificationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    orders: orderReducer,
    payment: paymentReducer,
    dashboard: dashboardReducer,
    farmerOrders: farmerOrdersReducer,
    reviews: reviewReducer,
    chat: chatReducer,
    admin: adminReducer,
    notifications: notificationReducer,
  },
});
