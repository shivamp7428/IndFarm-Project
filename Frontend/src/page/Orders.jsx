"use client";

import React, { useState, useEffect } from "react";
import { 
  Package, 
  ChevronRight, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Truck,
  ArrowRight,
  History
} from "lucide-react";
import { useTranslation } from "../context/LanguageContext";

const DUMMY_ORDERS = [
  {
    id: "ORD-99281",
    date: "24 Oct, 2023",
    status: "Delivered",
    total: "₹1,250",
    items: ["Organic Tomatoes", "Fresh Spinach"],
    image: "https://images.unsplash.com/photo-1597362868123-a5563b014a04?auto=format&fit=crop&q=80&w=200",
  }
];

const OrdersPage = () => {
  const { translations: t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      setOrders(DUMMY_ORDERS);
    } else {
      setIsLoggedIn(false);
    }
    setLoading(false);
  }, []);

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "delivered": return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "on the way": return "bg-blue-50 text-blue-700 border-blue-100";
      default: return "bg-slate-50 text-slate-700 border-slate-100";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-black text-slate-400 uppercase tracking-widest">
        {t.loading || "Loading..."}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Page Header - Same Height as Cart */}
      <div className="bg-white border-b border-slate-100 pt-8 pb-6">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Package className="text-emerald-600" size={32} />
            {t.myOrders || "Your Orders"}
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            {t.ordersSubtitle || "Track and manage your farm-fresh purchases"}
          </p>
        </div>
      </div>

      {/* Main Content Container - Max Width Match with Cart */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        {!isLoggedIn ? (
          /* NOT LOGGED IN - Matching Cart's Hero Style */
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-16 text-center shadow-sm">
            <div className="bg-emerald-50 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 text-emerald-600">
              <History size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">
              {t.noDataAvailable || "No data available"}
            </h2>
            <p className="text-slate-500 max-w-sm mx-auto mb-8 font-medium">
              {t.loginPromptOrders || "Please sign in to view your order history and track your current deliveries."}
            </p>
            <a href="/auth">
              <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center gap-3 mx-auto uppercase text-sm tracking-widest">
                {t.loginButtonOrders || "Sign In / Sign Up"} <ArrowRight size={18} />
              </button>
            </a>
          </div>
        ) : (
          /* LOGGED IN VIEW */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Orders List - Takes 2/3 width like Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div 
                    key={order.id} 
                    className="bg-white border border-slate-100 rounded-3xl p-5 flex gap-5 items-center shadow-sm hover:shadow-md transition-shadow group"
                  >
                    {/* Item Image - Fixed size to match Cart */}
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 shrink-0">
                      <img 
                        src={order.image} 
                        alt="order" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                    </div>

                    <div className="flex-1 flex flex-col md:flex-row justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            {t.orderId || "Order ID"}
                          </span>
                          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                            {order.id}
                          </span>
                        </div>
                        <h3 className="font-black text-slate-900 text-lg leading-tight">
                          {order.items.join(", ")}
                        </h3>
                        <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                          <Clock size={12} className="text-emerald-500" /> 
                          {t.orderedOn || "Ordered on"} {order.date}
                        </p>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0">
                        <div className="md:text-right">
                          <p className="text-[10px] font-black uppercase text-slate-400 leading-none mb-1">
                            {t.totalAmount || "Total Amount"}
                          </p>
                          <p className="text-xl font-black text-emerald-600">{order.total}</p>
                        </div>
                        <div className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-wider flex items-center gap-2 ${getStatusStyle(order.status)}`}>
                          {order.status === "Delivered" ? <CheckCircle2 size={14} /> : <Truck size={14} />}
                          {order.status}
                        </div>
                        <ChevronRight className="text-slate-300 hidden md:block" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                /* EMPTY STATE - Matching Cart Item Area */
                <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400 font-bold">
                  <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
                  {t.noOrdersYet || "You haven't placed any orders yet."}
                </div>
              )}
            </div>

            {/* Side Information Card - Matching Summary Card Position */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-slate-100 rounded-[2rem] p-6 sticky top-24 shadow-sm">
                <h3 className="text-xl font-black text-slate-900 mb-4">{t.supportHeader || "Need Help?"}</h3>
                <p className="text-slate-500 text-sm font-medium mb-6">
                  {t.supportText || "If you have any issues with your orders, our support team is available 24/7."}
                </p>
                <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-200 mb-4">
                  {t.contactSupport || "Contact Support"}
                </button>
                <div className="space-y-3 opacity-60">
                   <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                    <CheckCircle2 size={16} className="text-emerald-500" /> 100% Quality Assurance
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                    <Truck size={16} className="text-emerald-500" /> Fast Delivery Tracking
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;