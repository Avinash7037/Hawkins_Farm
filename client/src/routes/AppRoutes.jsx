import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

// =====================================================
// Authentication
// =====================================================

import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import ResetPassword from "../features/auth/pages/ResetPassword";

import ProtectedRoute from "../features/auth/components/ProtectedRoute";

// =====================================================
// General
// =====================================================

import Home from "../features/home/pages/Home";
import Marketplace from "../features/marketplace/pages/Marketplace";
import ProductDetails from "../features/marketplace/pages/ProductDetails";
import About from "../features/about/pages/About";

// =====================================================
// Buyer
// =====================================================

import BuyerDashboard from "../features/buyer/pages/BuyerDashboard";
import Profile from "../features/buyer/pages/Profile";
import Cart from "../features/cart/pages/Cart";
import Checkout from "../features/orders/pages/Checkout";
import MyOrders from "../features/orders/pages/MyOrders";
import Invoice from "../features/orders/pages/Invoice";

// =====================================================
// Auction
// =====================================================

import LiveAuctions from "../features/auction/pages/LiveAuctions";
import AuctionDetails from "../features/auction/pages/AuctionDetails";
import CreateAuction from "../features/auction/pages/CreateAuction";
import MyAuctions from "../features/auction/pages/MyAuctions";

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
import Notifications from "../features/notifications/pages/Notifications";

// =====================================================
// Admin
// =====================================================

import AdminDashboard from "../features/admin/pages/AdminDashboard";
import AdminUsers from "../features/admin/pages/AdminUsers";
import AdminProducts from "../features/admin/pages/AdminProducts";
import AdminOrders from "../features/admin/pages/AdminOrders";
import AdminReviews from "../features/admin/pages/AdminReviews";

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
            Authenticated Notifications
        ================================================= */}

        <Route
          element={
            <ProtectedRoute allowedRoles={["buyer", "farmer", "admin"]} />
          }
        >
          <Route path="/notifications" element={<Notifications />} />
        </Route>

        {/* =================================================
            Public Pages
        ================================================= */}

        <Route path="/" element={<Home />} />

        <Route path="/products" element={<Marketplace />} />

        <Route path="/products/:id" element={<ProductDetails />} />

        <Route path="/about" element={<About />} />

        {/* =================================================
            Buyer Protected Routes
        ================================================= */}

        <Route element={<ProtectedRoute allowedRoles={["buyer"]} />}>
          {/* Buyer Dashboard */}

          <Route path="/buyer" element={<BuyerDashboard />} />

          {/* Profile */}

          <Route path="/profile" element={<Profile />} />

          {/* Cart */}

          <Route path="/cart" element={<Cart />} />

          {/* Checkout */}

          <Route path="/checkout" element={<Checkout />} />

          {/* Orders */}

          <Route path="/orders" element={<MyOrders />} />

          {/* Invoice */}

          <Route path="/orders/:id/invoice" element={<Invoice />} />
        </Route>

        {/* =================================================
            Auction Routes
            Buyer + Farmer
        ================================================= */}

        <Route element={<ProtectedRoute allowedRoles={["buyer", "farmer"]} />}>
          {/* Live Auctions */}

          <Route path="/auctions" element={<LiveAuctions />} />

          {/* Auction Details */}

          <Route path="/auctions/:id" element={<AuctionDetails />} />
        </Route>

        {/* =================================================
            Shared Chat Routes
            Buyer + Farmer
        ================================================= */}

        <Route element={<ProtectedRoute allowedRoles={["buyer", "farmer"]} />}>
          {/* Conversation List */}

          <Route path="/chat" element={<ChatList />} />

          {/* Individual Conversation */}

          <Route path="/chat/:userId" element={<Chat />} />
        </Route>

        {/* =================================================
            Farmer Protected Routes
        ================================================= */}

        <Route element={<ProtectedRoute allowedRoles={["farmer"]} />}>
          {/* Farmer Dashboard */}

          <Route path="/farmer" element={<FarmerDashboard />} />

          <Route path="/farmer/dashboard" element={<FarmerDashboard />} />

          {/* Farmer Products */}

          <Route path="/farmer/products" element={<Products />} />

          {/* Farmer Orders */}

          <Route path="/farmer/orders" element={<Orders />} />

          {/* =================================================
              Farmer Auctions
          ================================================= */}

          <Route path="/farmer/auctions" element={<MyAuctions />} />

          <Route path="/farmer/auctions/create" element={<CreateAuction />} />

          {/* Farmer Messages */}

          <Route path="/farmer/messages" element={<ChatList />} />

          {/* Farmer Profile */}

          <Route path="/farmer/profile" element={<Profile />} />
        </Route>

        {/* =================================================
            Admin Protected Routes
        ================================================= */}

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          {/* Admin Dashboard */}

          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* Admin Users */}

          <Route path="/admin/users" element={<AdminUsers />} />

          {/* Admin Products */}

          <Route path="/admin/products" element={<AdminProducts />} />

          {/* Admin Orders */}

          <Route path="/admin/orders" element={<AdminOrders />} />

          {/* Admin Reviews */}

          <Route path="/admin/reviews" element={<AdminReviews />} />
        </Route>
      </Route>

      {/* =================================================
          Authentication
      ================================================= */}

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* =================================================
          Forgot Password
      ================================================= */}

      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* =================================================
          Reset Password
      ================================================= */}

      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* =================================================
          Not Found
      ================================================= */}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
