import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Truck, Clock, MapPin, ShoppingBag, 
  ExternalLink, ChevronRight, Store 
} from 'lucide-react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Time Ago Logic (as requested)
  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return interval + " year" + (interval > 1 ? "s" : "") + " ago";
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval + " month" + (interval > 1 ? "s" : "") + " ago";
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + " day" + (interval > 1 ? "s" : "") + " ago";
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + " hr" + (interval > 1 ? "s" : "") + " ago";
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval + " min" + (interval > 1 ? "s" : "") + " ago";
    return "just now";
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/orders/user/${user?._id || user?.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrders();
  }, [token]);

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-slate-400">Loading Orders...</div>;

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black">My Orders</h1>
          </div>
          <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-200 text-xs font-bold text-slate-600">
            Total Orders: {orders.length}
          </div>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <OrderCard 
              key={order._id} 
              order={order} 
              navigate={navigate} 
              formatTimeAgo={formatTimeAgo} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const OrderCard = ({ order, navigate, formatTimeAgo }) => {
  const [productDetails, setProductDetails] = useState({});
  const [fetching, setFetching] = useState(false);

  const statusSteps = ["placed", "accepted", "packed", "shipped", "out_for_delivery", "delivered"];
  const currentStep = statusSteps.indexOf(order.orderStatus);

  useEffect(() => {
    if (Object.keys(productDetails).length > 0 || fetching) return;
    const fetchLiveDetails = async () => {
      setFetching(true);
      const details = {};
      try {
        await Promise.all(
          order.products.map(async (p) => {
            try {
              const res = await axios.get(`http://localhost:5000/api/products/${p.product}`);
              if (res.data && res.data.data) details[p.product] = res.data.data;
              else details[p.product] = res.data;
            } catch (e) { console.error("Error:", p.product); }
          })
        );
        setProductDetails(details);
      } catch (err) { console.error(err); } finally { setFetching(false); }
    };
    fetchLiveDetails();
  }, [order._id]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white overflow-hidden mb-6"
    >
<div className="px-6 pt-10 pb-8 bg-slate-50/50 border-b border-slate-100">
  {/* Horizontal Scroll Container */}
  <div className="overflow-x-auto no-scrollbar scroll-smooth pb-2">
    
    <div className="flex justify-between items-center relative 
                    min-w-[580px] sm:min-w-[620px] md:min-w-full 
                    lg:max-w-3xl mx-auto px-4 sm:px-8 md:px-12">

      {/* Background Line */}
      <div className="absolute h-[3px] bg-slate-200 left-6 right-6 top-[13px] z-0 rounded" />

      {/* Progress Line */}
      <div 
        className="absolute h-[3px] bg-emerald-500 top-[13px] z-0 rounded transition-all duration-700"
        style={{ 
          left: '24px',
          width: `calc(${Math.max(0, (currentStep / (statusSteps.length - 1))) * 100}% - 32px)` 
        }}
      />

      {statusSteps.map((step, i) => (
        <div key={step} className="relative z-10 flex flex-col items-center flex-1 min-w-[70px]">
          
          {/* Dot */}
          <div className={`w-7 h-7 rounded-full border-[3.5px] border-white shadow-md transition-all duration-500 flex items-center justify-center
            ${i <= currentStep 
              ? 'bg-emerald-500 scale-110' 
              : 'bg-slate-300'}`} 
          />

          {/* Label */}
          <span className={`text-[10px] md:text-xs font-black uppercase pt-4 tracking-[0.5px] text-center whitespace-nowrap transition-colors
            ${i <= currentStep ? 'text-emerald-600' : 'text-slate-400'}`}>
            {step.replace(/_/g, ' ')}
          </span>
        </div>
      ))}
    </div>
  </div>

  {/* Mobile Scroll Hint */}
  <div className="text-center mt-5 md:hidden">
    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-1">
      ← Swipe to view progress →
    </p>
  </div>
</div>

      <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
        
        <div className="flex items-center gap-6 w-full">
          <div 
            className="relative flex-shrink-0 cursor-pointer group"
            onClick={() => navigate(`/detail/${order.products[0]?.product}`)}
          >
            <img 
              src={productDetails[order.products[0]?.product]?.productImageUrl || "https://via.placeholder.com/150"} 
              className="w-16 h-16 object-cover rounded-full "
              alt="product"
            />
            {order.products.length > 1 && (
              <div className="absolute -bottom-2 -right-2 bg-slate-900 text-white text-[10px] px-3 py-1 rounded-full font-black">
                +{order.products.length - 1} More
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
               <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-1 py-0 rounded-full">
                  <Clock size={10} className="inline mr-1" /> {formatTimeAgo(order.createdAt)}
               </span>
            </div>
            
            <h3 
              className="text-xl font-black text-slate-800 leading-tight tracking-tight cursor-pointer  transition-colors"
              onClick={() => navigate(`/detail/${order.products[0]?.product}`)}
            >
              {productDetails[order.products[0]?.product]?.name || order.products[0]?.productName}
            </h3>
            <p className="text-slate-400 font-bold text-sm mt-1">Total Bill: <span className="text-slate-900">₹{order.totalAmount}</span></p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button 
            onClick={() => navigate(`/order-details/${order._id}`)}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-black text-sm transition-all border border-slate-200"
          >
            <ExternalLink size={18} /> View Details
          </button>

          <button 
            onClick={() => navigate("/track-delivery", { state: { order } })}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-sm transition-all  shadow-emerald-200"
          >
            <MapPin size={18} /> Track Live
          </button>
        </div>

      </div>

      <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
         <div className="flex items-center gap-2">
            <Store size={14} className="text-slate-400" />
            <span>{productDetails[order.products[0]?.product]?.farmerId?.farmName || "Farm Direct Sourced"}</span>
         </div>
         <div>OTP: <span className="text-emerald-600">{order.deliveryOTP}</span></div>
      </div>
    </motion.div>
  );
};
export default MyOrders;