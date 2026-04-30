import React, { useState } from 'react';
import { TrendingUp, Package, Star, Edit2, Trash2, Plus, LayoutDashboard, Inbox, User, BarChart3, X, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SmartProductUpload } from '../components/SmartProductUpload';
import { motion, AnimatePresence } from 'motion/react';

const data = [
  { name: 'Mon', sales: 400 },
  { name: 'Tue', sales: 300 },
  { name: 'Wed', sales: 600 },
  { name: 'Thu', sales: 800 },
  { name: 'Fri', sales: 500 },
  { name: 'Sat', sales: 900 },
  { name: 'Sun', sales: 1100 },
];

export const FarmerDashboard = ({ setView, onAddProduct }) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 flex flex-col lg:flex-row gap-12 relative">
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[110] bg-text-dark text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10"
          >
            <div className="bg-primary p-2 rounded-xl">
              <CheckCircle size={20} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-sm">Product uploaded successfully!</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Live on marketplace</p>
            </div>
            <button 
              onClick={() => setShowSuccessToast(false)}
              className="ml-4 p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showUploadModal && (
          <SmartProductUpload 
            onClose={() => setShowUploadModal(false)}
            onSave={(data) => {
              const imageArray = data.images.map((img) => img.url);
              onAddProduct({
                id: Date.now().toString(),
                name: data.name,
                price: parseFloat(data.price) || 0,
                unit: data.unit || 'kg',
                farmer: 'Farmer David',
                location: 'Punjab (Local)',
                rating: 5.0,
                reviews: 1,
                image: imageArray[0] || 'https://images.unsplash.com/photo-1592924357228-91a4daaef392?auto=format&fit=crop&q=80&w=800',
                images: imageArray,
                category: data.category || 'Veggies',
                farmerImage: 'https://i.pravatar.cc/150?u=david',
                organic: true,
                pesticideFree: true
              });
              setShowUploadModal(false);
              setShowSuccessToast(true);
              setTimeout(() => setShowSuccessToast(false), 5000);
            }}
          />
        )}
      </AnimatePresence>
      {/* Sidebar */}
      <aside className="w-full lg:w-64 space-y-2 shrink-0">
        {[
          { icon: <LayoutDashboard size={20} />, label: 'Overview', active: true },
          { icon: <Inbox size={20} />, label: 'Orders', active: false },
          { icon: <Package size={20} />, label: 'Products', active: false },
          { icon: <BarChart3 size={20} />, label: 'Analytics', active: false },
          { icon: <User size={20} />, label: 'Profile', active: false }
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-agri space-y-4 border border-primary/5">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest leading-none">Total Revenue</span>
              <TrendingUp size={16} className="text-primary" />
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold">$4,250</h2>
              <span className="text-xs font-bold text-primary">+12%</span>
            </div>
            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[70%]" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-agri space-y-4 border border-primary/5">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest leading-none">Pending Orders</span>
              <Package size={16} className="text-primary" />
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold">14</h2>
              <span className="text-xs font-bold text-accent">Active</span>
            </div>
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <img key={i} src={`https://i.pravatar.cc/150?u=${i}`} className="w-8 h-8 rounded-full border-2 border-white" alt="user" />
              ))}
              <div className="w-8 h-8 rounded-full bg-bg-warm border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-500">+11</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-agri space-y-4 border border-primary/5">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest leading-none">Top Product</span>
              <Star size={16} className="text-accent fill-accent" />
            </div>
            <h2 className="text-xl font-bold truncate">Organic Spinach</h2>
            <p className="text-xs font-medium text-gray-500">Sold 125kg this week</p>
          </div>
        </div>

        {/* Inventory */}
        <div className="bg-white rounded-3xl shadow-agri border border-primary/5 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-heading text-2xl font-bold">Inventory Management</h3>
            <button className="text-primary font-bold text-sm hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-bg-warm/50 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  <th className="px-8 py-4">Product Name</th>
                  <th className="px-8 py-4">Stock (kg)</th>
                  <th className="px-8 py-4">Price</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  { name: 'Heritage Tomatoes', stock: '450', price: '$6.50' },
                  { name: 'Baby Spinach', stock: '120', price: '$2.50' },
                  { name: 'Red Onions', stock: '850', price: '$1.80' }
                ].map((item, idx) => (
                  <tr key={idx} className="hover:bg-bg-warm/30 transition-colors group">
                    <td className="px-8 py-6 font-bold">{item.name}</td>
                    <td className="px-8 py-6">
                      <span className="bg-primary/5 text-primary px-3 py-1 rounded-full font-bold text-xs">{item.stock}kg</span>
                    </td>
                    <td className="px-8 py-6 font-medium text-gray-500">{item.price}</td>
                    <td className="px-8 py-6 text-right space-x-2">
                       <button className="p-2 hover:bg-primary/5 rounded-lg text-primary transition-colors"><Edit2 size={16} /></button>
                       <button className="p-2 hover:bg-red-50 rounded-lg text-red-400 transition-colors"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sales Analytics */}
        <div className="bg-white p-8 rounded-3xl shadow-agri border border-primary/5 space-y-8">
           <h3 className="font-heading text-2xl font-bold">Sales Overview (7 Days)</h3>
           <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontWeight: 600, fill: '#9ca3af' }}
                  dy={10}
                />
                <YAxis 
                  hide
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                  labelStyle={{ fontWeight: 800, color: '#1B211E' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#2E7D32" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: '#2E7D32', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 8, fill: '#66BB6A' }}
                />
              </LineChart>
            </ResponsiveContainer>
           </div>
        </div>
      </main>

      {/* FAB */}
      <button 
        onClick={() => setShowUploadModal(true)}
        className="fixed bottom-10 right-10 w-16 h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-20"
      >
        <Plus size={32} />
      </button>
    </div>
  );
};
