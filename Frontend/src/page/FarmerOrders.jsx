import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Truck, Info,  KeyRound, Loader2 ,ShieldCheck, CheckCircle, XCircle, Check,Clock, Zap, ShoppingBag, Phone,ExternalLink,Store,ShoppingBasket,ArrowLeft, CheckCircle2} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import AssignDelivery from "./AssignDelivery"


const FarmerOrder = () => {
  const [activeTab, setActiveTab] = useState('sales'); 
  const [salesOrders, setSalesOrders] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loadingSales, setLoadingSales] = useState(true);
  const [loadingPurchases, setLoadingPurchases] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const fetchSales = async () => {
    setLoadingSales(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/orders/farmer/${user?._id || user?.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSalesOrders(res.data.orders || []);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoadingSales(false); 
    }
  };

  const fetchPurchases = async () => {
    setLoadingPurchases(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/orders/user/${user?._id || user?.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPurchaseOrders(res.data.orders || []);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoadingPurchases(false); 
    }
  };

  useEffect(() => {
    if (user) {
      fetchSales();
      fetchPurchases();
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'purchases' && user) {
      fetchPurchases();
    }
  }, [activeTab]);

  return (
   <div className="min-h-screen bg-[#F3F4F6] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
<div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
  
  <div className="flex items-center gap-4">
    
    {/* Back Button */}
    <button
      onClick={() => navigate(-1)}
      className="group p-3 cursor-pointer transition-all"
    >
      <ArrowLeft size={20} className="text-slate-700 group-hover:-translate-x-1 transition-transform" />
    </button>

    <div>
      <h1 className="text-3xl font-black text-slate-900 tracking-tight">
        Order Management
      </h1>
    </div>
  </div>

  <div className="flex bg-white p-1.5 rounded-[1.8rem] shadow-sm border border-slate-200">
    <button 
      onClick={() => setActiveTab('sales')}
      className={`flex items-center gap-2 px-6 py-2.5 rounded-[1.4rem] text-xs font-black transition-all cursor-pointer ${
        activeTab === 'sales' 
        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100' 
        : 'text-slate-500 hover:bg-slate-50'
      }`}
    >
      <Store size={14} /> SALES ({salesOrders.length})
    </button>

    <button 
      onClick={() => setActiveTab('purchases')}
      className={`flex items-center gap-2 px-6 py-2.5 rounded-[1.4rem] text-xs font-black transition-all cursor-pointer ${
        activeTab === 'purchases' 
        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100' 
        : 'text-slate-500 hover:bg-slate-50'
      }`}
    >
      <ShoppingBasket size={14} /> MY PURCHASES ({purchaseOrders.length})
    </button>
  </div>
</div>

        {/* Content Toggle */}
        <AnimatePresence mode="wait">
          {activeTab === 'sales' ? (
            <motion.div 
              key="sales-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {loadingSales ? (
                <div className="flex flex-col items-center justify-center py-20">
                   <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                   <p className="font-black text-[10px] text-slate-400 uppercase tracking-widest">Loading Sales...</p>
                </div>
              ) : salesOrders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                   <p className="font-black text-slate-400 uppercase tracking-widest">No Sales Orders Yet</p>
                </div>
              ) : salesOrders.map(order => (
                <SalesCard key={order._id} order={order} refresh={fetchSales} token={token} />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="purchases-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {loadingPurchases ? (
                <div className="h-screen flex items-center justify-center font-bold text-slate-400">Loading Orders...</div>
              ) : purchaseOrders.length > 0 ? (
                purchaseOrders.map((order) => (
                  <PurchaseOrderCard 
                    key={order._id} 
                    order={order} 
                    navigate={navigate} 
                  />
                ))
              ) : (
                <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
                  <ShoppingBag className="mx-auto text-slate-300 mb-4" size={48} />
                  <p className="text-slate-500 font-bold">No orders found yet.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const PurchaseOrderCard = ({ order, navigate }) => {
  const [productDetails, setProductDetails] = useState({});
  const [fetching, setFetching] = useState(false);
  const [cancelling, setCancelling] = useState(false);

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

  const statusSteps = ["placed","accepted","packed","shipped","out_for_delivery","delivered"];
  const currentStep = statusSteps.indexOf(order.orderStatus);

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
      // Refresh purchases
      window.location.reload(); // Simple refresh for purchases tab
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
            {statusSteps.map((step, i) => {
                 const labels = {
                 placed: "Order Placed",
                 accepted: "Accepted",
                 packed: "Packed",
                 shipped: "Shipped",
                 out_for_delivery: "Out For Delivery",
                  delivered: "Delivered"
              };

  return (
    <div
      key={step}
      className="relative z-10 flex flex-col items-center flex-1 min-w-[70px]"
    >
      <div
        className={`w-7 h-7 rounded-full border-[3.5px] border-white shadow-md transition-all duration-500 flex items-center justify-center
        ${
          i <= currentStep
            ? "bg-emerald-500 scale-110"
            : "bg-slate-300"
        }`}
      />

      <span
        className={`text-[10px] md:text-xs font-black uppercase pt-4 tracking-[0.5px] text-center whitespace-nowrap transition-colors
        ${
          i <= currentStep
            ? "text-emerald-600"
            : "text-slate-400"
        }`}
      >
        {labels[step]}
      </span>
    </div>
  );
})}
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
                  <XCircle size={18} /> {cancelling ? "..." : "Cancel"}
                </button>
              )}

              {!isCancelled && (
                 order.orderStatus === "delivered" ? (
                <button disabled
                className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-200 text-slate-500 rounded-2xl font-black text-sm cursor-not-allowed"
                 >
                <CheckCircle2 size={18} /> Order Completed
               </button>
             ) : (
               <button 
                 onClick={() => navigate("/track-delivery", { state: { order } })}
                 className="flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-emerald-200"
                >
                <MapPin size={18} /> Track Live
              </button>
             )
          )}
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

const SalesCard = ({ order, refresh, token }) => {
  const [updating, setUpdating] = useState(false);
  const [productDetails, setProductDetails] = useState({});
  const [fetching, setFetching] = useState(false);
  
  // Modal States
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState("");

  // Logic Steps
  const statusSteps = ["placed", "accepted", "packed", "shipped", "out_for_delivery", "delivered"];

const currentStepIndex = statusSteps.indexOf(order.orderStatus);
  const nextStep = statusSteps[currentStepIndex + 1];
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
              details[p.product] = res.data.data || res.data;
            } catch (e) { console.error("Error fetching product:", p.product); }
          })
        );
        setProductDetails(details);
      } catch (err) { console.error(err); } finally { setFetching(false); }
    };
    fetchLiveDetails();
  }, [order._id]);

  const handleActionTrigger = async () => {
  if (!nextStep) return;
  if (nextStep === "delivered") {
    setShowOtpModal(true);
    return;
  }
  if (nextStep === "packed") {
    console.log("OPENING ASSIGN MODAL");
    setShowAssignModal(true);
    return;
  }
  await updateOrderStatus(nextStep);
};

  useEffect(() => {
}, [showAssignModal]);

  const updateOrderStatus = async (action) => {
    setUpdating(true);
    try {
      const endpointMap = {
       accepted: "accept",
       packed: "pack",
       shipped: "pickup",
        out_for_delivery: "out-for-delivery",  
       delivered: "deliver",
       cancel: "cancel"
      };
      const endpoint = endpointMap[action] || action;

      const res = await axios.put(
        `http://localhost:5000/api/orders/${endpoint}/${order._id}`, 
        { otp: action === 'delivered' ? otpInput : undefined },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Order ${action.replace(/_/g, ' ')} successfully!`);
      setShowOtpModal(false);
      setOtpInput("");
      refresh(); 
    } catch (err) {
      console.error("Update Error:", err);
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setUpdating(false);
    }
  };
  // --- Logic Fix End ---

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + " hr ago";
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval + " min ago";
    return "just now";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-[2.8rem] shadow-xl shadow-slate-200/60 border border-slate-50 overflow-hidden transition-all mb-6 relative"
    >
      <Toaster />
      
      {/* Assign Delivery Modal */}
      {showAssignModal && (
        <AssignDelivery 
          isOpen={showAssignModal} 
          onClose={() => setShowAssignModal(false)} 
          orderId={order._id} 
        />
      )}

      {/* OTP Verification Modal */}
      <AnimatePresence>
        {showOtpModal && (
          <div className="fixed inset-0 z-[110] bg-slate-900/40 backdrop-blur-sm flex justify-center items-center p-4">
            <motion.div initial={{y: 20, opacity:0}} animate={{y:0, opacity:1}} exit={{y:20, opacity:0}} className="bg-white p-8 rounded-[2.5rem] w-full max-w-sm shadow-2xl">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                  <KeyRound size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-800">Verify Delivery</h3>
                <input 
                  type="text" 
                  maxLength={6}
                  placeholder="OTP"
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-center text-2xl font-black outline-none focus:border-emerald-500"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                />
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowOtpModal(false)} className="flex-1 py-4 font-bold text-slate-400">Cancel</button>
                  <button 
                    onClick={() => updateOrderStatus('delivered')}
                    disabled={updating || otpInput.length < 4}
                    className="flex-[2] py-4 font-black bg-emerald-500 text-white rounded-2xl shadow-lg disabled:opacity-50"
                  >
                    {updating ? 'Verifying...' : 'Confirm'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AAPKA OLD UI START */}
      <div className={`px-10 py-4 flex justify-between items-center border-b ${isCancelled ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${isCancelled ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`} />
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isCancelled ? 'text-red-500' : 'text-emerald-600'}`}>
            Stage: {order.orderStatus.replace(/_/g, ' ')}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Clock size={10} className="text-emerald-500" />
            <span className="text-[9px] font-black uppercase tracking-widest">{formatTimeAgo(order.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="p-10 flex flex-col md:flex-row gap-10 items-center">
        <div className="flex-1 flex flex-col gap-6 border-r border-slate-100 pr-4 w-full">
          <div className="flex gap-4">
            <div className="h-16 w-16 rounded-[1.5rem] bg-slate-50 flex items-center justify-center shadow-inner shrink-0 overflow-hidden border border-slate-100">
              <img src={order.shippingAddress?.profileImage || "https://ui-avatars.com/api/?name="+order.shippingAddress?.fullName} alt="user" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="text-xl font-black text-slate-800 leading-none mb-1 tracking-tight">{order.shippingAddress?.fullName}</h3>
              <div className="flex items-start gap-1.5 text-slate-400">
                <MapPin size={12} className="text-sky-500 shrink-0 mt-0.5" />
                <p className="text-[10px] font-bold leading-relaxed">{order.shippingAddress?.address}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50">
            {order.products?.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 rounded-[2rem] transition-all">
                <img src={productDetails[item.product]?.productImageUrl} className="w-14 h-14 object-cover rounded-full ring-4 ring-slate-50" />
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-700">{productDetails[item.product]?.name || "Loading..."}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">Qty: {item.quantity}</span>
                    <span className="text-[10px] font-black text-emerald-600">₹{item.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-64 space-y-3">
          <div className="flex justify-between text-sm font-black text-slate-400">
            <span>Product Price</span>
            <span className="text-slate-800">₹{order.totalProductPrice}</span>
          </div>
          <div className="flex justify-between text-sm font-black text-slate-400">
            <span>Delivery Charge</span>
            <span className="text-emerald-600">+₹{order.deliveryCharge}</span>
          </div>
          <div className="h-[1px] bg-slate-100 my-2" />
          <div className="bg-gradient-to-br from-emerald-50/50 to-sky-50/50 p-4 rounded-3xl border border-emerald-100/50">
            <div className="flex justify-between items-end">
              <span className="text-sm font-black text-emerald-600 mb-1">Final Payout</span>
              <span className="text-xl font-black text-slate-900 tracking-tighter">₹{order.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-10 pb-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        {isCancelled ? (
          <button disabled className="flex items-center justify-center gap-3 py-4.5 bg-slate-200 text-slate-400 rounded-[1.8rem] font-black text-sm tracking-widest cursor-not-allowed col-span-3">
            <XCircle size={18} /> ORDER CANCELLED
          </button>
        ) : (
          <>
            {order.orderStatus === "placed" ? (
              <div className="flex gap-2 col-span-1">
                <button
                  onClick={() => updateOrderStatus('accepted')}
                  disabled={updating}
                  className="flex-[3] flex items-center justify-center gap-2 py-4.5 bg-orange-500 text-white rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                >
                  <Check size={18} /> {updating ? '...' : 'Accept Order'}
                </button>
                <button
                  onClick={() => updateOrderStatus('cancel')}
                  disabled={updating}
                  className="flex-1 flex items-center justify-center bg-red-50 text-red-500 rounded-[1.8rem] border border-red-100 transition-all"
                >
                  <XCircle size={20} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleActionTrigger}
                disabled={updating || !nextStep || order.orderStatus === 'delivered'}
                className="flex items-center cursor-pointer justify-center gap-3 py-4.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[1.8rem] font-black text-sm tracking-widest transition-all disabled:opacity-30 active:scale-95 shadow-lg shadow-emerald-100"
              >
                <Zap size={16} />
                {updating ? "Processing..." : nextStep ? `Mark ${nextStep.replace(/_/g, ' ')}` : "Order Completed"}
              </button>
            )}

            <button
              onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${order.shippingAddress?.address}`)}
              className="flex items-center cursor-pointer justify-center gap-2 py-4.5 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-100 rounded-[1.8rem] font-black text-sm tracking-widest transition-all"
            >
              <MapPin size={18} /> Track Live
            </button>

            <button className="flex items-center cursor-pointer justify-center gap-2 py-4.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-[1.8rem] font-black text-sm tracking-widest border border-slate-200 transition-all">
              <ExternalLink size={18} /> Details
            </button>
          </>
        )}
      </div>

      <div className="px-10 py-5 bg-slate-50/80 border-t border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <ShieldCheck size={16} className={order.paymentStatus === 'completed' ? 'text-emerald-500' : 'text-orange-400'} />
          <span className="text-[10px] font-black tracking-[0.2em] text-slate-400">Payment: 
            <span className={order.paymentStatus === 'completed' ? 'text-emerald-600' : 'text-orange-500'}> {order.paymentStatus}</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default FarmerOrder;