import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Loader2, ArrowLeft, Clock, CheckCircle2, 
  XCircle, MapPin, Store, Package, Bell, 
  Check, User, IndianRupee,
  ExternalLink
} from "lucide-react";

const UserDeliveryDashboard = () => {
  const navigate = useNavigate();
  const { deliveryPartnerId } = useParams();
  const token = localStorage.getItem("token");

  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatTimeAgo = (date) => {
    if (!date) return "N/A";
    const d = typeof date === 'object' && date.$date ? new Date(date.$date) : new Date(date);
    const seconds = Math.floor((new Date() - d) / 1000);
    let interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + "d ago";
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + "hr ago";
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval + "min ago";
    return "just now";
  };

  const fetchOrders = useCallback(async () => {
    if (!deliveryPartnerId) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/delivery/${deliveryPartnerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data.orders || []);
    } catch (err) { console.log(err); }
  }, [deliveryPartnerId, token]);

  const fetchRequests = useCallback(async () => {
    if (!deliveryPartnerId) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/delivery-request/partner/${deliveryPartnerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(res.data.requests || []);
    } catch (err) { console.log(err); }
  }, [deliveryPartnerId, token]);

  const acceptRequest = async (id) => {
    await axios.put(`http://localhost:5000/api/delivery-request/accept/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
    fetchRequests(); fetchOrders();
  };

  const rejectRequest = async (id) => {
    await axios.put(`http://localhost:5000/api/delivery-request/reject/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
    fetchRequests();
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchOrders(), fetchRequests()]);
      setLoading(false);
    };
    load();
    const interval = setInterval(() => { fetchOrders(); fetchRequests(); }, 5000);
    return () => clearInterval(interval);
  }, [fetchOrders, fetchRequests]);

  const handleTrackOnMap = (data) => {
    if (!data) {
      alert("Address data not found!");
      return;
    }
    const lat = data.latitude || data.lat;
    const lng = data.longitude || data.lng;
    const fullAddress = data.address || data.fullName || "";
    const city = data.city || "";

    if (lat && lng) {
      const mapUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      window.open(mapUrl, "_blank");
    } else if (fullAddress) {
      const encodedAddress = encodeURIComponent(`${fullAddress}, ${city}`);
      const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
      window.open(mapUrl, "_blank");
    } else {
      alert("No valid address or coordinates found.");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
      </div>
    );
  }

  const completedOrders = orders.filter(o => o.deliveryStatus === "delivered");

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 lg:p-10 font-sans">
      
      {/* Header Section */}
      <div className="max-w-5xl mx-auto flex items-center justify-between mb-8 md:mb-10">
        <div className="flex items-center gap-3 md:gap-4">
          <button onClick={() => navigate(-1)} className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <ArrowLeft className="text-slate-600" size={20} />
          </button>
          <div>
            <h1 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight">Delivery Hub</h1>
            <p className="text-slate-400 font-bold text-[10px] md:text-sm tracking-wide uppercase">Partner Dashboard</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-10 md:space-y-12">
        
        {/* Active Requests Section */}
        <section>
          <h2 className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 md:mb-6 flex items-center gap-2">
            <Bell size={14} className="text-amber-500" /> Active Requests
          </h2>
          <div className="grid gap-4 md:gap-6">
            {requests.map(req => {
              const order = req.orderId;
              if (order?.deliveryStatus === "delivered") return null;

              return (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} key={req._id} className="bg-white rounded-3xl md:rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-white overflow-hidden">
                  <div className="p-5 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-4 md:gap-6 w-full">
                      <div className="w-14 h-14 md:w-16 md:h-16 bg-slate-50 rounded-full flex items-center justify-center border-2 md:border-4 border-slate-50 relative shrink-0">
                        <img src={req.farmerId?.img || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="farmer" className="w-full h-full object-cover rounded-full" />
                        <div className="absolute -bottom-1 -right-1 bg-amber-500 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                          <Store size={10} className="text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-slate-100 text-slate-600 text-[9px] md:text-[10px] font-black px-2 md:px-2.5 py-1 rounded-full flex items-center gap-1">
                            <Clock size={10} /> {formatTimeAgo(req.createdAt)}
                          </span>
                        </div>
                        <h3 className="text-lg md:text-2xl font-black text-slate-800 leading-tight truncate">{req.farmerId?.fullName || "Farmer Request"}</h3>
                        <p className="text-slate-400 font-bold text-xs md:text-sm mt-1">Pickup: {req.deliveryTime || "ASAP"}</p>
                      </div>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto md:pl-5 shrink-0">
                      <button 
                        onClick={() => {
                          const id = req.orderId?._id || req.orderId; // Check for nested object
                      if (id) {
                          navigate(`/order-details/${id}`);
                          } else {
                           console.error("Order ID not found in request:", req);
                           }
                         }} 
                         className="flex-1 md:flex-none px-4 md:px-6 py-3 md:py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl md:rounded-2xl font-black text-xs md:text-sm transition-all border border-slate-200 uppercase flex items-center justify-center gap-2"
                        >
                       <ExternalLink size={16} /> <span className="md:inline">Details</span>
                       </button>
                      {req.status === "pending" ? (
                        <div className="flex gap-2 flex-[2] md:flex-none">
                          <button 
                            onClick={() => acceptRequest(req._id)} 
                            className="flex-1 px-4 md:px-8 py-3 md:py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl md:rounded-2xl font-black text-xs md:text-sm transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 uppercase"
                          >
                            <Check size={18} /> Accept
                          </button>
                          <button 
                            onClick={() => rejectRequest(req._id)} 
                            className="p-3 md:p-4 bg-red-50 text-red-500 rounded-xl md:rounded-2xl hover:bg-red-100 border border-red-100 transition-all"
                          >
                            <XCircle size={20} />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleTrackOnMap(req.orderId?.shippingAddress || req.farmerId)}
                          className="flex-[2] md:flex-none px-6 md:px-10 py-3 md:py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl md:rounded-2xl font-black text-xs md:text-sm transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 uppercase"
                        >
                          <MapPin size={18} /> Track
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="px-6 md:px-10 py-3 md:py-4 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <span>Order Status: {req.status}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Completed Shipments Section */}
        <section>
          <h2 className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 md:mb-6 flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-500" /> Completed Shipments
          </h2>
          <div className="grid gap-4 md:gap-6">
            {completedOrders.map(order => (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={order._id} className="bg-white rounded-3xl md:rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-white overflow-hidden">
                <div className="p-5 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex items-center gap-4 md:gap-6 w-full">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-emerald-50 rounded-full flex items-center justify-center border-2 md:border-4 border-emerald-50 shrink-0">
                      <User className="text-emerald-500" size={22} md:size={26} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-emerald-100 text-emerald-700 text-[9px] md:text-[10px] font-black px-2 py-1 rounded-full uppercase flex items-center gap-1">
                           <Clock size={10} /> {formatTimeAgo(order.deliveredAt)}
                        </span>
                      </div>
                      <h3 className="text-lg md:text-2xl font-black text-slate-800 leading-tight truncate">{order.shippingAddress?.fullName}</h3>
                      <p className="text-slate-400 font-bold text-xs md:text-sm mt-1 truncate">{order.shippingAddress?.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full md:w-auto gap-6 md:gap-12 md:pl-5">
                    <div className="text-left md:text-right">
                      <p className="text-[9px] md:text-[10px] font-black text-slate-300 uppercase mb-1 tracking-widest">Earnings</p>
                      <p className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-1">
                        <IndianRupee size={16} strokeWidth={3} />
                        {order.totalAmount}
                      </p>
                    </div>
                    <div className="bg-emerald-50 text-emerald-600 p-3 md:p-4 rounded-xl md:rounded-2xl border border-emerald-100">
                       <CheckCircle2 size={20} md:size={24} strokeWidth={2.5} />
                    </div>
                  </div>
                </div>
                <div className="px-6 md:px-10 py-3 md:py-4 bg-emerald-50/20 border-t border-emerald-50 flex justify-between items-center text-[9px] md:text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">
                  <span>Successfully Delivered</span>
                  <span className="text-slate-400">#{order._id.slice(-6).toUpperCase()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserDeliveryDashboard;