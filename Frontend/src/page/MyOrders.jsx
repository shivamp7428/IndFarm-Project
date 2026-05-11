import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Truck, Clock, MapPin, ShoppingBag, 
  ExternalLink, ChevronRight, Store, ArrowLeft, Trash2 
} from 'lucide-react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

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

  useEffect(() => {
    if (user) fetchOrders();
  }, [token]);

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-slate-400">Loading Orders...</div>;

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section with Back Button */}
        <div className="mb-8 flex justify-between items-end">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="group p-3 cursor-pointer transition-all"
            >
              <ArrowLeft size={20} className="text-slate-600 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-900">My Orders</h1>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Manage your deliveries</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-200 text-xs font-bold text-slate-600">
            Total Orders: {orders.length}
          </div>
        </div>

        <div className="space-y-6">
          {orders.length > 0 ? (
            orders.map((order) => (
              <OrderCard 
                key={order._id} 
                order={order} 
                navigate={navigate} 
                formatTimeAgo={formatTimeAgo} 
                refreshOrders={fetchOrders}
              />
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
              <ShoppingBag className="mx-auto text-slate-300 mb-4" size={48} />
              <p className="text-slate-500 font-bold">No orders found yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const OrderCard = ({ order, navigate, formatTimeAgo, refreshOrders }) => {
  const [productDetails, setProductDetails] = useState({});
  const [fetching, setFetching] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const statusSteps = ["placed", "accepted", "packed", "shipped", "out_for_delivery", "delivered"];
  const currentStep = statusSteps.indexOf(order.orderStatus);

  // Logic States
  const isCancellable = order.orderStatus === "placed";
  const isCancelled = order.orderStatus === "cancelled";

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
            } catch (e) { console.error("Error fetching product:", p.product); }
          })
        );
        setProductDetails(details);
      } catch (err) { console.error(err); } finally { setFetching(false); }
    };
    fetchLiveDetails();
  }, [order._id]);

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    setCancelling(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/orders/cancel/${order._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      refreshOrders(); 
    } catch (err) {
      alert(err.response?.data?.message || "Error cancelling order.");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white overflow-hidden mb-6 ${isCancelled ? 'opacity-80' : ''}`}
    >
      {/* Progress Tracker Section (Hidden if Cancelled) */}
      {!isCancelled && (
        <div className="px-6 pt-10 pb-8 bg-slate-50/50 border-b border-slate-100">
          <div className="overflow-x-auto no-scrollbar scroll-smooth pb-2">
            <div className="flex justify-between items-center relative min-w-[580px] md:min-w-full lg:max-w-3xl mx-auto px-4 md:px-12">
              <div className="absolute h-[3px] bg-slate-200 left-6 right-6 top-[13px] z-0 rounded" />
              <div 
                className="absolute h-[3px] bg-emerald-500 top-[13px] z-0 rounded transition-all duration-700"
                style={{ 
                  left: '24px',
                  width: `calc(${Math.max(0, (currentStep / (statusSteps.length - 1))) * 100}% - 32px)` 
                }}
              />
              {statusSteps.map((step, i) => (
                <div key={step} className="relative z-10 flex flex-col items-center flex-1 min-w-[70px]">
                  <div className={`w-7 h-7 rounded-full border-[3.5px] border-white shadow-md transition-all duration-500 flex items-center justify-center
                    ${i <= currentStep ? 'bg-emerald-500 scale-110' : 'bg-slate-300'}`} 
                  />
                  <span className={`text-[10px] md:text-xs font-black uppercase pt-4 tracking-[0.5px] text-center whitespace-nowrap transition-colors
                    ${i <= currentStep ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {step.replace(/_/g, ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cancelled Banner */}
      {isCancelled && (
        <div className="bg-red-50 py-3 px-8 border-b border-red-100 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-600 text-[10px] font-black uppercase tracking-widest">This order was cancelled</span>
        </div>
      )}

      <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6 w-full">
          <div className="relative flex-shrink-0 cursor-pointer" onClick={() => navigate(`/detail/${order.products[0]?.product}`)}>
            <img 
             src={productDetails[order.products[0]?.product]?.productImageUrl || "https://via.placeholder.com/150"} 
             className="w-16 h-16 object-cover rounded-full ring-4 ring-slate-50" 
             alt="product"
           />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
               <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-2 py-1 rounded-full flex items-center gap-1">
                  <Clock size={10} /> {formatTimeAgo(order.createdAt)}
               </span>
            </div>
            <h3 className="text-xl font-black text-slate-800 leading-tight tracking-tight">
              {productDetails[order.products[0]?.product]?.name || order.products[0]?.productName}
            </h3>
            <p className="text-slate-400 font-bold text-sm mt-1">Total Bill: <span className="text-slate-900">₹{order.totalAmount}</span></p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {isCancelled ? (
            <button 
              onClick={() => navigate(`/detail/${order.products[0]?.product}`)}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-emerald-200"
            >
              <ShoppingBag size={18} /> Reorder Now
            </button>
          ) : (
            <>
              {isCancellable && (
                <button 
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl font-black text-sm transition-all border border-red-100 disabled:opacity-50"
                >
                  <Trash2 size={18} /> {cancelling ? "..." : "Cancel"}
                </button>
              )}

              <button 
                onClick={() => navigate("/track-delivery", { state: { order } })}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-emerald-200"
              >
                <MapPin size={18} /> Track Live
              </button>
            </>
          )}

          <button
  onClick={() => {
    if (!isCancelled) {
      navigate(`/order-details/${order._id}`);
    }
  }}
  disabled={isCancelled}
  className={`flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-black text-sm transition-all border
    ${
      isCancelled
        ? "bg-slate-200 text-slate-400 border-slate-200 cursor-not-allowed"
        : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
    }`}
>
  <ExternalLink size={18} />
  {isCancelled ? "Blocked" : "Details"}
</button>
        </div>
      </div>

      <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <Store size={14} />
            <span>{productDetails[order.products[0]?.product]?.farmerId?.farmName || "Farm Direct Sourced"}</span>
          </div>
          {!isCancelled && <div>OTP : <span className="text-emerald-600">{order.deliveryOTP}</span></div>}
      </div>
    </motion.div>
  );
};

export default MyOrders;