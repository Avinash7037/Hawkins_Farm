import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../features/home/pages/Home";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Marketplace from "../features/marketplace/pages/Marketplace";
import BuyerDashboard from "../features/buyer/pages/BuyerDashboard";
import FarmerDashboard from "../features/farmer/pages/FarmerDashboard";
import AdminDashboard from "../features/admin/pages/AdminDashboard";
import NotFound from "../features/notFound/pages/NotFound";
import ProductDetails from "../features/marketplace/pages/ProductDetails";
import Cart from "../features/cart/pages/Cart";
import Checkout from "../features/orders/pages/Checkout";
import MyOrders from "../features/orders/pages/MyOrders";

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
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/buyer" element={<BuyerDashboard />} />
      <Route path="/farmer" element={<FarmerDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
