import { Routes, Route } from "react-router-dom";

import { Navbar } from "./components/Navbar";
import { AIChatbot } from "./components/AIChatbot";
import AuthPage from "./components/AuthPage";
import Home from "./page/Home";
import Footer from "./components/Footer";
import Detail from "./page/Detail";
import ScrollToTop from "./components/ScrollToTop";
import FarmerProfile from "./page/FarmerProfile";
import OrdersPage from "./page/Orders";
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

function App() {
  return (
    <AuthProvider>   
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/impact" element={<ImpactPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/faqs" element={<FAQPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/refund" element={<RefundPage />} />
        <Route path="/marketplace" element={<Marketplace />} />
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
              <OrdersPage />
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
          path="/farmer-dashboard/:id" 
          element={
            <ProtectedRoute allowedRoles={["farmer"]}>
              <FarmerDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/user-dashboard/:id" 
          element={
            <ProtectedRoute allowedRoles={["customer", "user"]}>
              <UserDashboard />
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