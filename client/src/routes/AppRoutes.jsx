import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

// =====================================================
// Authentication
// =====================================================

import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";

// =====================================================
// General
// =====================================================

import Home from "../features/home/pages/Home";
import Marketplace from "../features/marketplace/pages/Marketplace";
import ProductDetails from "../features/marketplace/pages/ProductDetails";

// =====================================================
// Buyer
// =====================================================

import BuyerDashboard from "../features/buyer/pages/BuyerDashboard";
import Cart from "../features/cart/pages/Cart";
import Checkout from "../features/orders/pages/Checkout";
import MyOrders from "../features/orders/pages/MyOrders";

// =====================================================
// Chat
// =====================================================

import Chat from "../features/chat/pages/Chat";
import ChatList from "../features/chat/pages/ChatList";

// =====================================================
// Farmer
// =====================================================

import FarmerDashboard from "../features/dashboard/pages/FarmerDashboard";
import Products from "../features/dashboard/pages/Products";
import Orders from "../features/dashboard/pages/Orders";

// =====================================================
// Admin
// =====================================================

import AdminDashboard from "../features/admin/pages/AdminDashboard";
import AdminUsers from "../features/admin/pages/AdminUsers";
import AdminProducts from "../features/admin/pages/AdminProducts";
import AdminOrders from "../features/admin/pages/AdminOrders";

// =====================================================
// Not Found
// =====================================================

import NotFound from "../features/notFound/pages/NotFound";

// =====================================================
// App Routes
// =====================================================

function AppRoutes() {
  return (
    <Routes>
      {/* =================================================
          Main Layout
      ================================================= */}

      <Route element={<MainLayout />}>
        {/* =================================================
            Public Pages
        ================================================= */}

        <Route path="/" element={<Home />} />

        <Route path="/products" element={<Marketplace />} />

        <Route path="/products/:id" element={<ProductDetails />} />

        {/* =================================================
            Buyer Protected Routes
        ================================================= */}

        <Route element={<ProtectedRoute allowedRoles={["buyer"]} />}>
          <Route path="/buyer" element={<BuyerDashboard />} />

          <Route path="/cart" element={<Cart />} />

          <Route path="/checkout" element={<Checkout />} />

          <Route path="/orders" element={<MyOrders />} />
        </Route>

        {/* =================================================
            Farmer Protected Routes
        ================================================= */}

        <Route element={<ProtectedRoute allowedRoles={["farmer"]} />}>
          <Route path="/farmer" element={<FarmerDashboard />} />

          <Route path="/farmer/dashboard" element={<FarmerDashboard />} />

          <Route path="/farmer/products" element={<Products />} />

          <Route path="/farmer/orders" element={<Orders />} />

          <Route path="/farmer/messages" element={<ChatList />} />
        </Route>

        {/* =================================================
            Admin Protected Routes
        ================================================= */}

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          <Route path="/admin/users" element={<AdminUsers />} />

          <Route path="/admin/products" element={<AdminProducts />} />

          <Route path="/admin/orders" element={<AdminOrders />} />
        </Route>

        {/* =================================================
            Chat
        ================================================= */}

        <Route path="/chat/:userId" element={<Chat />} />
      </Route>

      {/* =================================================
          Authentication
      ================================================= */}

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* =================================================
          Not Found
      ================================================= */}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
