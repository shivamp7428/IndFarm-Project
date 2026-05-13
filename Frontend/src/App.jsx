import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { AIChatbot } from "./components/AIChatbot";
import AuthPage from "./components/AuthPage";
import Home from "./page/Home";
import Footer from "./components/Footer";
import Detail from "./page/Detail";
import ScrollToTop from "./components/ScrollToTop";
import FarmerProfile from "./page/FarmerProfile";
import CartPage from "./page/Cart";
import NotificationsPage from "./page/Notification";
import AboutPage from "./page/About";
import ContactPage from "./page/Contact";
import ImpactPage from "./page/Impact";
import BlogPage from "./page/Blog";
import FAQPage from "./page/FAQ";
import TermsPage from "./page/Terms";
import RefundPage from "./page/Refund";
import PrivateRoute from "./route/PrivateRoute";
import PublicRoute from "./route/PublicRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import FarmerDashboard from "./page/FarmerDashboard";
import UserDashboard from "./page/UserDashboard";
import { AuthProvider } from "./context/AuthContext";   
import Marketplace from "./page/MarketPlace";
import LoginSuccess from "./components/LoginSuccess";
import DeliveryForm from "./page/DeliveryForm";
import Checkout from "./page/CheckOut";
import MyOrders from "./page/MyOrders";
import FarmerOrder from "./page/FarmerOrders";
import OrderDetail from "./page/OrderDetail";
import FarmerHub from "./page/FarmerHub";


function App() {
  return (
    <AuthProvider>   
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login-success" element={<LoginSuccess />} />
        <Route path="/impact" element={<ImpactPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/faqs" element={<FAQPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/refund" element={<RefundPage />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/farmershub" element={<FarmerHub />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/farmerProfile/:id" element={<FarmerProfile />} />

        {/* Public Route */}
        <Route 
          path="/auth" 
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          } 
        />

        <Route 
          path="/orders" 
          element={
            <PrivateRoute>
              <MyOrders />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/notification" 
          element={
            <PrivateRoute>
              <NotificationsPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/cart" 
          element={
            <PrivateRoute>
              <CartPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/order/:id" 
          element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/farmer-dashboard/:id" 
          element={
            <ProtectedRoute allowedRoles={["farmer"]}>
              <FarmerDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/farmer/orders" 
          element={
            <ProtectedRoute allowedRoles={["farmer"]}>
              <FarmerOrder />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/user-delivery-dashboard/:userId/:deliveryPartnerId" 
          element={
            <ProtectedRoute allowedRoles={["customer", "user"]}>
              <UserDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/order-details/:orderId" 
          element={
            <ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>
          } 
        />
         <Route 
          path="/become-delivery-man/:id" 
          element={
            <ProtectedRoute allowedRoles={["customer", "user"]}>
              <DeliveryForm />
            </ProtectedRoute>
          } 
        />
      </Routes>

      <AIChatbot />
      <Footer />
    </AuthProvider>
  );
}

export default App;