import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../features/home/pages/Home";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Marketplace from "../features/marketplace/pages/Marketplace";
import BuyerDashboard from "../features/buyer/pages/BuyerDashboard";
import AdminDashboard from "../features/admin/pages/AdminDashboard";
import NotFound from "../features/notFound/pages/NotFound";
import ProductDetails from "../features/marketplace/pages/ProductDetails";
import Cart from "../features/cart/pages/Cart";
import Checkout from "../features/orders/pages/Checkout";
import MyOrders from "../features/orders/pages/MyOrders";
import Chat from "../features/chat/pages/Chat";

import FarmerDashboard from "../features/dashboard/pages/FarmerDashboard";
import Products from "../features/dashboard/pages/Products";
import Orders from "../features/dashboard/pages/Orders";
import ChatList from "../features/chat/pages/ChatList";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/products" element={<Marketplace />} />

        <Route path="/products/:id" element={<ProductDetails />} />

        <Route path="/cart" element={<Cart />} />

        <Route path="/checkout" element={<Checkout />} />

        <Route path="/orders" element={<MyOrders />} />
        <Route path="/chat/:userId" element={<Chat />} />
        <Route path="/farmer/messages" element={<ChatList />} />

        {/* Farmer Dashboard */}
        <Route path="/farmer/dashboard" element={<FarmerDashboard />} />

        <Route path="/farmer/products" element={<Products />} />

        <Route path="/farmer/orders" element={<Orders />} />
      </Route>

      {/* Authentication */}
      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* Dashboards */}
      <Route path="/buyer" element={<BuyerDashboard />} />

      <Route path="/farmer" element={<FarmerDashboard />} />

      <Route path="/admin" element={<AdminDashboard />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
