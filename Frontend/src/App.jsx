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

function App() {
  return (
    <>
     <ScrollToTop/>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<AboutPage/>} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/impact" element={<ImpactPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/faqs" element={<FAQPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/refund" element={<RefundPage />} />
        <Route path="/notification" element={<NotificationsPage/>}/>
         <Route path="/cart" element={<CartPage />} />
        <Route path="/detail/:id" element={<Detail/>}/>
        <Route path="/farmer-profile/:id" element={<FarmerProfile/>} />
      </Routes>
       
      <AIChatbot />
      <Footer/>
    </>
  );
}

export default App;