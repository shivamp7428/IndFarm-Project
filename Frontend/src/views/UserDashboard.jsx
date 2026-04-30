import React from 'react';
import { ShoppingBag, Heart, Wallet, Settings, Package, MapPin, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const UserDashboard = ({ setView }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 flex flex-col md:flex-row gap-12">
      {/* Sidebar Nav */}
      <aside className="w-full md:w-64 space-y-2 shrink-0">
        {[
          { icon: <ShoppingBag size={20} />, label: 'Orders', active: true },
          { icon: <Heart size={20} />, label: 'Favorites', active: false },
          { icon: <Wallet size={20} />, label: 'Wallet', active: false },
          { icon: <Settings size={20} />, label: 'Settings', active: false }
        ].map(item => (
          <button 
            key={item.label}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${
              item.active ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-white hover:text-primary'
            }`}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 space-y-10">
        {/* Live Tracking */}
        <div className="bg-white p-8 rounded-[2rem] shadow-agri border border-primary/5 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-xl font-bold flex items-center gap-2">
              <Package size={22} className="text-primary" /> Live Tracking
            </h3>
            <span className="text-xs font-bold text-primary bg-primary/5 px-3 py-1 rounded-full uppercase tracking-widest">Order #AG-9284</span>
          </div>

          <div className="flex items-center justify-between relative px-4">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
            <div className="absolute top-1/2 left-0 w-1/2 h-1 bg-primary -translate-y-1/2 z-0"></div>
            
            {[
              { label: 'Placed', active: true },
              { label: 'Harvesting', active: true },
              { label: 'In Transit', active: true },
              { label: 'Delivered', active: false }
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-md transition-colors ${step.active ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}>
                  {step.active ? <CheckCircle size={18} /> : <div className="w-2 h-2 bg-current rounded-full" />}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${step.active ? 'text-primary' : 'text-gray-400'}`}>{step.label}</span>
              </div>
            ))}
          </div>

          <div className="bg-bg-warm p-4 rounded-2xl flex items-center gap-4">
            <div className="bg-white p-2 rounded-xl">
              <MapPin size={24} className="text-primary" />
            </div>
            <div>
              <p className="font-bold text-sm">Delivery to: Office (Downtown)</p>
              <p className="text-xs text-gray-500">Estimating delivery by 10:30 AM today</p>
            </div>
          </div>
        </div>

        {/* History */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-2xl font-bold">Order History</h3>
            <button className="text-sm font-bold text-gray-400 hover:text-primary">View Full History</button>
          </div>
          
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-primary/5 flex items-center gap-6 group hover:border-primary/20 transition-all">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-bg-warm">
                  <img src="https://images.unsplash.com/photo-1592924357228-91a4daaef392?auto=format&fit=crop&q=80&w=200" alt="prod" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-lg truncate">Seasonal Veggie Box (Premium)</h4>
                  <p className="text-xs text-gray-500 font-medium">April 24, 2026 • $45.00</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-1 rounded uppercase tracking-wider">Completed</span>
                  <button className="bg-primary text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-primary-light transition-all whitespace-nowrap">Reorder</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
