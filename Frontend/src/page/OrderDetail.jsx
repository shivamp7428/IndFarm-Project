import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  User, Store, Truck, Phone, MapPin, 
  Package, CheckCircle2, ArrowLeft, 
  Loader2, Info, Hash, Clock, UserCheck 
} from "lucide-react";

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [farmer, setFarmer] = useState(null);
  const [deliveryMan, setDeliveryMan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSelfDelivery, setIsSelfDelivery] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFullData = async () => {
      try {
        setLoading(true);

       const orderRes = await axios.get(`${import.meta.env.VITE_API_URL}/orders/${orderId}`, {
  headers: { Authorization: `Bearer ${token}` }
});

        const orderData = orderRes.data.order || orderRes.data;
        setOrder(orderData);

        // Extract IDs safely
        const farmerId = orderData.farmer?._id || orderData.farmer;
        const deliveryId = orderData.deliveryPartner?._id || orderData.deliveryPartner;

        // Check for Self Delivery
        const selfDel = !!(farmerId && deliveryId && String(farmerId) === String(deliveryId));
        setIsSelfDelivery(selfDel);

        // Fetch Farmer Details
        if (farmerId) {
          const fRes = await axios.get(`${import.meta.env.VITE_API_URL}/auth/${farmerId}`, {
  headers: { Authorization: `Bearer ${token}` }
});
          setFarmer(fRes.data.farmer || fRes.data);
        }

        // Set Delivery Partner only if NOT self delivery
        if (orderData.deliveryPartner && !selfDel) {
          setDeliveryMan(orderData.deliveryPartner);
        }

      } catch (err) {
        console.error("Fetch Error:", err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    fetchFullData();
  }, [orderId, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-semibold">Loading order details...</p>
        </div>
      </div>
    );
  }

  const DetailCard = ({ title, icon: Icon, children, accentColor }) => (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/70 border border-slate-100 h-full flex flex-col relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-slate-100/60 to-transparent rounded-full -translate-y-1/3 translate-x-1/3 group-hover:scale-110 transition-transform duration-500" />
      
      <div className="flex items-center gap-4 mb-8">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${accentColor} shadow-inner`}>
          <Icon size={26} className="text-white" />
        </div>
        <h2 className="text-2xl font-black tracking-tighter text-slate-900">{title}</h2>
      </div>
      
      <div className="flex-1 space-y-6">{children}</div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 md:p-8 lg:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => navigate(-1)} 
              className="w-14 h-14 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center transition-all shadow-sm hover:shadow"
            >
              <ArrowLeft size={24} className="text-slate-600" />
            </button>
            
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-black tracking-tighter text-slate-900">Order Tracking</h1>
                <div className="px-4 py-1.5 bg-emerald-100 text-emerald-700 text-sm font-bold rounded-2xl flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  LIVE
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 px-5 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <Clock size={18} className="text-amber-500" />
            <span className="font-semibold text-slate-600">
              {new Date(order?.createdAt).toLocaleDateString('en-IN')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* CUSTOMER DETAIL */}
          <DetailCard title="Customer" icon={User} accentColor="from-blue-500 to-cyan-500">
            <div className="space-y-7">
              <div>
                <p className="uppercase text-xs tracking-[2px] font-bold text-slate-400 mb-1">DELIVERING TO</p>
                <p className="text-2xl font-bold text-slate-900 leading-tight">
                  {order?.shippingAddress?.fullName}
                </p>
              </div>

              <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-2xl">
                <div className="w-11 h-11 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <Phone className="text-blue-600" size={22} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Phone</p>
                  <p className="font-semibold text-slate-800">{order?.shippingAddress?.phone}</p>
                </div>
              </div>

              <div className="flex gap-4 bg-slate-50 p-5 rounded-2xl">
                <MapPin className="text-blue-600 mt-1" size={26} />
                <p className="text-slate-600 leading-relaxed font-medium">
                  {order?.shippingAddress?.address}
                </p>
              </div>

              <div className="pt-6 border-t border-dashed border-slate-200 flex justify-between items-center">
                <div>
                  <p className="uppercase text-xs font-bold text-slate-400">Payment</p>
                  <p className="font-bold text-lg text-emerald-600 mt-1">
                    {order?.paymentMethod?.toLowerCase() === "cod" ? "Cash on Delivery" : "Paid Online"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Total</p>
                  <p className="text-3xl font-black text-slate-900">₹{order?.totalAmount}</p>
                </div>
              </div>
            </div>
          </DetailCard>

          {/* FARMER INFO */}
          <DetailCard title="Farmer" icon={Store} accentColor="from-amber-500 to-orange-500">
            <div className="flex flex-col items-center text-center">
              <div 
                onClick={() => navigate(`/farmerProfile/${farmer?._id}`)}
                className="relative w-32 h-32 rounded-3xl overflow-hidden shadow-2xl shadow-amber-200/60 cursor-pointer hover:scale-105 transition-all duration-300 ring-8 ring-white"
              >
                <img 
                  src={farmer?.img || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                  alt="farmer" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent flex items-end justify-center pb-4 opacity-0 hover:opacity-100 transition-all">
                  <div className="flex items-center gap-2 text-white text-sm font-semibold">
                    <Info size={18} /> View Farm
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-2xl font-black text-slate-900">{farmer?.fullName || "N/A"}</h3>
                <p className="text-amber-600 font-bold mt-1 text-lg">{farmer?.farmName || "Organic Farm"}</p>
              </div>

              <div className="mt-8 w-full bg-slate-50 rounded-2xl p-6 text-left">
                <div className="flex items-start gap-4">
                  <MapPin className="text-amber-500 mt-1" size={24} />
                  <div>
                    <p className="font-medium text-slate-500 text-sm">Farm Location</p>
                    <p className="font-semibold text-slate-700 leading-snug mt-1">
                      {farmer?.farmLocation || "Location not available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </DetailCard>

          {/* DELIVERY PARTNER / SELF DELIVERY */}
          <DetailCard 
            title={isSelfDelivery ? "Self Delivery" : "Delivery Partner"} 
            icon={isSelfDelivery ? UserCheck : Truck} 
            accentColor={isSelfDelivery ? "from-violet-500 to-purple-600" : "from-emerald-500 to-teal-500"}
          >
            {order?.deliveryPartner ? (
              <div className="space-y-8">
                <div className="flex gap-5 items-center bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-3xl border border-emerald-100">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-teal-600 text-white text-4xl font-black flex items-center justify-center rounded-2xl shadow-inner">
                    {isSelfDelivery 
                      ? farmer?.fullName?.charAt(0) 
                      : deliveryMan?.accountHolderName?.charAt(0) || "?"}
                  </div>
                  <div className="flex-1">
                    <p className="text-2xl font-black text-slate-900 leading-none">
                      {isSelfDelivery ? farmer?.fullName : deliveryMan?.accountHolderName}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-emerald-600 font-bold text-sm tracking-wider">
                        {isSelfDelivery ? "FARMER SELF DELIVERY" : "ON THE WAY"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-5 rounded-2xl">
                    <Phone className="text-emerald-600 mb-3" size={26} />
                    <p className="text-sm text-slate-500">Contact</p>
                    <p className="font-semibold text-xl text-slate-800 mt-1">
                      {isSelfDelivery ? farmer?.phone : deliveryMan?.phone}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-2xl">
                    <Package className="text-emerald-600 mb-3" size={26} />
                    <p className="text-sm text-slate-500">Service</p>
                    <p className="font-semibold text-xl text-slate-800 mt-1 uppercase">
                      {isSelfDelivery ? "DIRECT FROM FARMER" : (deliveryMan?.vehicleType || "PARTNER")}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[420px] flex flex-col items-center justify-center text-center px-8">
                <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center mb-8">
                  <Loader2 className="w-12 h-12 text-slate-300 animate-spin" />
                </div>
                <h4 className="font-bold text-xl text-slate-700">Assigning Partner</h4>
                <p className="text-slate-500 mt-3">Finding the nearest delivery partner...</p>
              </div>
            )}
          </DetailCard>
        </div>

        {/* ORDER ITEMS SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 bg-white rounded-3xl p-8 md:p-10 shadow-2xl shadow-slate-200/70 border border-slate-100"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-emerald-100 rounded-2xl flex items-center justify-center">
                <Package className="text-emerald-600" size={28} />
              </div>
              <div>
                <h3 className="text-3xl font-black tracking-tight text-slate-900">Order Items</h3>
                <p className="text-slate-500 text-sm mt-1">Fresh from farm to your doorstep</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Total Amount</p>
              <p className="text-4xl font-black text-slate-900">₹{order?.totalAmount}</p>
            </div>
          </div>

          <div className="space-y-4">
            {order?.products?.map((item, i) => (
              <div 
                key={i} 
                className="group flex items-center gap-6 p-6 bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 rounded-2xl transition-all duration-300"
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 bg-white flex-shrink-0 shadow-sm">
                  {item.productImage ? (
                    <img 
                      src={item.productImage} 
                      alt={item.productName} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50">
                      <Package className="text-slate-200" size={36} />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xl text-slate-900 truncate">{item.productName}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="px-4 py-1 bg-white text-xs font-bold rounded-xl text-slate-500 inline-flex items-center">
                      Qty: <span className="text-emerald-600 ml-1">{item.quantity}</span>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">₹{item.price} per unit</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-black text-3xl text-slate-900">₹{item.total}</p>
                  <p className="text-xs text-emerald-600 font-medium">Subtotal</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderDetail;