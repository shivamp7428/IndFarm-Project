import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast'; // Import Toast
import {
  X, Calendar, Clock, User, CheckCircle2,
  Search, MousePointerClick, Truck, 
  Loader2, Phone, AlertCircle
} from 'lucide-react';

const KisanMitraAssignDelivery = ({ isOpen, onClose, orderId }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const token = localStorage.getItem("token");

  const [view, setView] = useState('partners');
  const [searchQuery, setSearchQuery] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const [selectedPartner, setSelectedPartner] = useState(null);
  const [isSelfSelected, setIsSelfSelected] = useState(false);

  const [loading, setLoading] = useState(false);
  const [partners, setPartners] = useState([]);
  const [fetchingPartners, setFetchingPartners] = useState(false);
  const [updatingPhone, setUpdatingPhone] = useState(false);


  const fetchPartners = async (lat, lng) => {
    try {
      setFetchingPartners(true);
      const res = await axios.get("http://localhost:5000/api/delivery/all", {
        params: { latitude: lat, longitude: lng }, 
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setPartners(res.data.partners || []);
      }
    } catch (error) {
      toast.error("Failed to fetch nearby partners");
    } finally {
      setTimeout(() => setFetchingPartners(false), 800);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchPartners(pos.coords.latitude, pos.coords.longitude),
        () => fetchPartners(null, null) 
      );
    } else {
      fetchPartners(null, null);
    }
  }, [isOpen]);

  const handleUpdatePhone = async () => {
    if (!newPhone || newPhone.length < 10) return toast.error("Enter a valid 10-digit number");
    
    try {
      setUpdatingPhone(true);
      const config = { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } };
      const formData = new FormData();
      formData.append("phone", newPhone);

      const res = await axios.put("http://localhost:5000/api/auth/update", formData, config);
      
      if (res.data) {
        const updatedUser = { ...user, phone: newPhone };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsSelfSelected(true);
        toast.success("Phone number updated! ✅");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      setUpdatingPhone(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!deliveryDate || !deliveryTime) return toast.error("Please select date and time");
    
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };
       if (isSelfSelected) {await axios.put(  `http://localhost:5000/api/orders/assign-delivery/${orderId}`,
         {
           deliveryPartnerId: "SELF"
          },
           config
        );
        toast.success("Self delivery assigned successfully!");
         onClose();
       }else {
        if (!selectedPartner) return toast.error("Select a partner first");
        
        await axios.post("http://localhost:5000/api/delivery-request/create", {
          orderId,
          farmerId: user?._id || user?.id,
          deliveryPartnerId: selectedPartner._id,
          deliveryDate,
          deliveryTime
        }, config);
        toast.success("Delivery request sent to partner! 🚀");
      }
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Assignment failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4 font-sans">
      <Toaster position="top-center" reverseOrder={false} />

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="bg-white w-full max-w-lg h-[85vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
      >
        
        {/* HEADER */}
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-gray-800">Assign Delivery</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/50">
          
          {/* DATE & TIME */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Delivery Date</label>
              <input type="date" className="w-full p-3.5 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-green-500/20 text-sm font-bold" onChange={(e) => setDeliveryDate(e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Delivery Time</label>
              <input type="time" className="w-full p-3.5 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-green-500/20 text-sm font-bold" onChange={(e) => setDeliveryTime(e.target.value)} />
            </div>
          </div>

          {/* TABS */}
          <div className="flex bg-gray-200/50 p-1.5 rounded-2xl">
            <button onClick={() => setView('partners')} className={`flex-1 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${view === 'partners' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'}`}>
              <Truck className="w-4 h-4" /> Partners
            </button>
            <button onClick={() => setView('self')} className={`flex-1 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${view === 'self' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'}`}>
              <User className="w-4 h-4" /> Self
            </button>
          </div>

          <div className="min-h-[280px]">
            <AnimatePresence mode="wait">
              {view === 'partners' ? (
                <motion.div key="p" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      placeholder="Search partner..." 
                      className="w-full pl-11 pr-4 py-4 bg-white border border-gray-100 shadow-sm rounded-2xl outline-none text-sm font-bold"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  {fetchingPartners ? (
                    <div className="text-center py-10"><Loader2 className="w-8 h-8 animate-spin mx-auto text-green-500" /></div>
                  ) : (
                    <div className="space-y-3">
                      {partners
                        .filter(p => p?.userId?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map(p => (
                          <div 
                            key={p._id} 
                            onClick={() => {setSelectedPartner(p); setIsSelfSelected(false)}} 
                            className={`p-4 border-2 rounded-2xl flex items-center gap-4 cursor-pointer transition-all ${selectedPartner?._id === p._id ? 'border-green-500 bg-green-50' : 'border-white bg-white shadow-sm hover:border-green-200'}`}
                          >
                            <img src={p?.userId?.img || `https://ui-avatars.com/api/?name=${p?.userId?.fullName}&background=random&color=fff`} className="w-12 h-12 rounded-full object-cover" />
                            <div className="flex-1">
                              <p className="font-bold text-gray-800 text-sm">{p?.userId?.fullName}</p>
                              <p className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 border border-green-200">
                                  {p.distance} KM • {p.vehicleType}
                             </p>
                            </div>
                            {selectedPartner?._id === p._id && <CheckCircle2 className="text-green-600 w-6 h-6" />}
                          </div>
                        ))
                      }
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-4">
                  <div className={`p-8 rounded-[2.5rem] border-2 ${isSelfSelected ? 'border-green-500 bg-green-50' : 'border-dashed border-gray-200 bg-white'}`}>
                    <img src={user?.img || `https://ui-avatars.com/api/?name=${user?.fullName}&background=10b981&color=fff`} className="w-20 h-20 mx-auto rounded-full mb-4 shadow-lg" />
                    <h4 className="text-lg font-black text-gray-800">{user?.fullName}</h4>
                    
                    {user?.phone ? (
                      <div className="mt-4 space-y-4">
                        <p className="text-xs font-bold text-green-600 bg-green-100 py-1.5 px-4 rounded-full inline-block">📞 {user.phone}</p>
                        <button onClick={() => {setIsSelfSelected(true); setSelectedPartner(null)}} className={`w-full py-4 rounded-2xl font-black text-sm transition-all ${isSelfSelected ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600'}`}>
                          {isSelfSelected ? "Selected" : "Deliver Myself"}
                        </button>
                      </div>
                    ) : (
                      <div className="mt-6 space-y-3 bg-orange-50 p-6 rounded-[2rem]">
                        <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Update Phone Number</p>
                        <input 
                          type="text" 
                          placeholder="10-digit Phone" 
                          className="w-full p-4 rounded-2xl border-2 border-orange-200 outline-none text-center font-bold text-sm"
                          value={newPhone}
                          onChange={(e) => setNewPhone(e.target.value.replace(/\D/g, ''))}
                        />
                        <button onClick={handleUpdatePhone} disabled={updatingPhone} className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black text-xs shadow-lg active:scale-95 disabled:opacity-50">
                          {updatingPhone ? <Loader2 className="w-4 h-4 animate-spin mx-auto"/> : "SAVE & CONTINUE"}
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t bg-white">
          <button 
            disabled={loading || (!isSelfSelected && !selectedPartner)} 
            onClick={handleFinalSubmit} 
            className={`w-full py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 disabled:bg-gray-100 disabled:text-gray-300 ${loading ? 'bg-gray-200' : 'bg-green-600 text-white hover:bg-green-700 active:scale-95'}`}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm Assignment"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default KisanMitraAssignDelivery;