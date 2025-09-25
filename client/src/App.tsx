/** @format */

import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Authentication Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";

// Customer Pages
import HomePage from "./pages/customer/HomePage";
import ProductListPage from "./pages/customer/ProductListPage";
import ProductDetailPage from "./pages/customer/ProductDetailPage";
import CartPage from "./pages/customer/CartPage";
import CheckoutPage from "./pages/customer/CheckoutPage";
import OrderTrackingPage from "./pages/customer/OrderTrackingPage";
import ProfilePage from "./pages/customer/ProfilePage";
import WishlistPage from "./pages/customer/WishlistPage";

// Seller Pages
import SellerDashboardPage from "./pages/seller/SellerDashboardPage";
import SellerProductsPage from "./pages/seller/SellerProductsPage";
import AddProductPage from "./pages/seller/AddProductPage";
import SellerOrdersPage from "./pages/seller/SellerOrdersPage";
import SellerProfilePage from "./pages/seller/SellerProfilePage";

// Admin Pages
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import ManageUsersPage from "./pages/admin/ManageUsersPage";
import ManageSellersPage from "./pages/admin/ManageSellersPage";
import ManageOrdersPage from "./pages/admin/ManageOrdersPage";
import ReportsPage from "./pages/admin/ReportsPage";
import BannerManagementPage from "./pages/admin/BannerManagementPage";

// Shared Pages
import AboutPage from "./pages/shared/AboutPage";
import ContactPage from "./pages/shared/ContactPage";
import TermsAndConditionsPage from "./pages/shared/TermsAndConditionsPage";
import PrivacyPolicyPage from "./pages/shared/PrivacyPolicyPage";
import FAQPage from "./pages/shared/FAQPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Main Homepage */}
            <Route path="/" element={<HomePage />} />

            {/* Authentication Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Customer Routes */}
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders/:id" element={<OrderTrackingPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/wishlist" element={<WishlistPage />} />

            {/* Seller Routes */}
            <Route path="/seller/dashboard" element={<SellerDashboardPage />} />
            <Route path="/seller/products" element={<SellerProductsPage />} />
            <Route path="/seller/add-product" element={<AddProductPage />} />
            <Route path="/seller/orders" element={<SellerOrdersPage />} />
            <Route path="/seller/profile" element={<SellerProfilePage />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<ManageUsersPage />} />
            <Route path="/admin/sellers" element={<ManageSellersPage />} />
            <Route path="/admin/orders" element={<ManageOrdersPage />} />
            <Route path="/admin/reports" element={<ReportsPage />} />
            <Route path="/admin/banners" element={<BannerManagementPage />} />

            {/* Shared Pages */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/terms" element={<TermsAndConditionsPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/faq" element={<FAQPage />} />

            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;