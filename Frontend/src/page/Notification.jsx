"use client";

import React, { useState, useEffect } from "react";
import { 
  Bell, 
  BellOff, 
  Circle, 
  Trash2, 
  CheckCheck,
  ArrowRight,
  Info,
  Tag,
  Truck
} from "lucide-react";
import { useTranslation } from "../context/LanguageContext";

// Dummy Notifications Data
const DUMMY_NOTIFICATIONS = [
  {
    id: 1,
    title: "Order Shipped!",
    message: "Your order #ORD-99281 has been picked up by our delivery partner.",
    time: "2 mins ago",
    type: "delivery", // delivery, promo, info
    isRead: false
  },
  {
    id: 2,
    title: "Flash Sale Alert ⚡",
    message: "Get 50% OFF on all organic leafy vegetables for the next 2 hours.",
    time: "1 hour ago",
    type: "promo",
    isRead: true
  }
];

const NotificationsPage = () => {
  const { translations: t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      setNotifications(DUMMY_NOTIFICATIONS);
    } else {
      setIsLoggedIn(false);
    }
    setLoading(false);
  }, []);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case "delivery": return <Truck className="text-blue-500" size={20} />;
      case "promo": return <Tag className="text-orange-500" size={20} />;
      default: return <Info className="text-emerald-500" size={20} />;
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
      {/* Header - Match with Cart/Orders */}
      <div className="bg-white border-b border-slate-100 pt-8 pb-6">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Bell className="text-emerald-600" size={32} />
              {t.notifications || "Notifications"}
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              {t.notifSubtitle || "Stay updated with your orders and offers"}
            </p>
          </div>
          {isLoggedIn && notifications.length > 0 && (
            <button 
              onClick={markAllRead}
              className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors bg-emerald-50 px-4 py-2 rounded-xl"
            >
              <CheckCheck size={14} /> {t.markAllRead || "Mark all as read"}
            </button>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8">
        {!isLoggedIn ? (
          /* NOT LOGGED IN STATE */
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-16 text-center shadow-sm">
            <div className="bg-emerald-50 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 text-emerald-600">
              <BellOff size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">
              {t.stayConnected || "Stay Connected"}
            </h2>
            <p className="text-slate-500 max-w-sm mx-auto mb-8 font-medium">
              {t.loginPromptNotif || "Login to receive real-time updates about your farm orders and exclusive discounts."}
            </p>
            <a href="/auth">
              <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center gap-3 mx-auto uppercase text-sm tracking-widest">
                {t.loginButtonNotif || "Login to View"} <ArrowRight size={18} />
              </button>
            </a>
          </div>
        ) : (
          /* LOGGED IN VIEW */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-3">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`relative bg-white border rounded-3xl p-5 flex gap-4 transition-all shadow-sm group ${
                      notif.isRead ? "border-slate-100 opacity-80" : "border-emerald-100 bg-emerald-50/10 shadow-emerald-50"
                    }`}
                  >
                    {!notif.isRead && (
                      <div className="absolute top-6 right-6">
                        <Circle size={8} className="fill-emerald-500 text-emerald-500" />
                      </div>
                    )}
                    
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                      {getIcon(notif.type)}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className={`font-black text-slate-900 leading-tight ${notif.isRead ? "text-lg" : "text-xl"}`}>
                          {notif.title}
                        </h3>
                        <button 
                          onClick={() => deleteNotification(notif.id)}
                          className="text-slate-300 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <p className="text-slate-600 font-medium text-sm leading-relaxed mb-2">
                        {notif.message}
                      </p>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                        {notif.time}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-16 text-center text-slate-400 font-bold">
                  <BellOff size={48} className="mx-auto mb-4 opacity-20" />
                  {t.noNotifYet || "No new notifications for you."}
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white border border-slate-100 rounded-[2rem] p-6 sticky top-24 shadow-sm">
                <h3 className="text-xl font-black text-slate-900 mb-4">{t.notifSettings || "Settings"}</h3>
                <p className="text-slate-500 text-sm font-medium mb-6">
                  {t.notifSettingsDesc || "Manage how you receive alerts and stay updated with our latest harvest."}
                </p>
                <div className="space-y-4">
                   <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-xs font-black text-slate-700 uppercase tracking-tighter">Email Alerts</span>
                      <div className="w-8 h-4 bg-emerald-500 rounded-full relative"><div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5"/></div>
                   </div>
                   <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-xs font-black text-slate-700 uppercase tracking-tighter">Push Notifications</span>
                      <div className="w-8 h-4 bg-emerald-500 rounded-full relative"><div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5"/></div>
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

export default NotificationsPage;