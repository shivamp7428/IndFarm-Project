import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  ChevronRight,
  Search,
  MousePointerClick
} from 'lucide-react';

const KisanMitraAssignDelivery = ({
  isOpen,
  onClose,
  orderId
}) => {

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [view, setView] = useState('partners');
  const [searchQuery, setSearchQuery] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');

  const [selectedPartner, setSelectedPartner] = useState(null);
  const [isSelfSelected, setIsSelfSelected] = useState(false);

  const [loading, setLoading] = useState(false);

  // API DATA
  const [partners, setPartners] = useState([]);
  const [fetchingPartners, setFetchingPartners] = useState(false);

 useEffect(() => {

  if (!isOpen) return;

  const fetchPartners = async () => {

    try {

      setFetchingPartners(true);

      const res = await axios.get(
        "http://localhost:5000/api/delivery/all",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.data.success) {

        setPartners(res.data.partners || []);

      }

    } catch (error) {

      console.log("FETCH PARTNERS ERROR:", error);

    } finally {

      setFetchingPartners(false);

    }

  };

  fetchPartners();

}, [isOpen]);

  // FILTER PARTNERS
  const filteredPartners = useMemo(() => {

    return partners.filter((p) =>
      p?.userId?.fullName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

  }, [partners, searchQuery]);

  // SELECT PARTNER
  const handlePartnerSelect = (partner) => {

    setSelectedPartner(partner);
    setIsSelfSelected(false);

  };

  // SELF DELIVERY
  const handleSelfSelect = () => {

    setIsSelfSelected(true);
    setSelectedPartner(null);

  };

  // SEND REQUEST
  const handleFinalSubmit = async () => {

    try {

      setLoading(true);

      // VALIDATION
      if (!deliveryDate || !deliveryTime) {
        return alert("Select delivery date and time");
      }

      // SELF DELIVERY
      if (isSelfSelected) {

        if (!user?.phone) {
          return alert("Please add phone number in profile first");
        }

        await axios.put(
          `http://localhost:5000/api/orders/assign-delivery/${orderId}`,
          {
            selfDelivery: true,
            deliveryDate,
            deliveryTime,
            phone: user.phone
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        alert("Self delivery assigned successfully");

      }

      else {

        if (!selectedPartner) {
          return alert("Select delivery partner");
        }

        await axios.post(
          "http://localhost:5000/api/delivery-request/create",
          {
            orderId,
            farmerId: user?._id || user?.id,
            deliveryPartnerId: selectedPartner._id,
            deliveryDate,
            deliveryTime
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        alert("Delivery request sent successfully");

      }

      onClose();

    } catch (error) {

      console.log(error);

      alert(
        error?.response?.data?.message ||
        "Something went wrong"
      );

    } finally {

      setLoading(false);

    }

  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4">

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-lg h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
      >

        {/* HEADER */}
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">

          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Assign Delivery
            </h2>

            <p className="text-xs text-gray-400 font-medium">
              ORDER ID: #{orderId}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-all"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>

        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* DATE TIME */}
          <div className="grid grid-cols-2 gap-3">

            <div className="space-y-1.5">

              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
                Delivery Date
              </label>

              <div className="relative">

                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />

                <input
                  type="date"
                  className="w-full pl-9 pr-3 py-3 bg-gray-50 rounded-xl border-none text-sm font-semibold outline-none focus:ring-2 focus:ring-green-500/20"
                  onChange={(e) => setDeliveryDate(e.target.value)}
                />

              </div>

            </div>

            <div className="space-y-1.5">

              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
                Delivery Time
              </label>

              <div className="relative">

                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />

                <input
                  type="time"
                  className="w-full pl-9 pr-3 py-3 bg-gray-50 rounded-xl border-none text-sm font-semibold outline-none focus:ring-2 focus:ring-green-500/20"
                  onChange={(e) => setDeliveryTime(e.target.value)}
                />

              </div>

            </div>

          </div>

          {/* TABS */}
          <div className="flex bg-gray-100 p-1 rounded-2xl">

            <button
              onClick={() => setView('partners')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                view === 'partners'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              Partners
            </button>

            <button
              onClick={() => setView('self')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                view === 'self'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              Self Delivery
            </button>

          </div>

          <AnimatePresence mode="wait">

            {/* PARTNERS */}
            {view === 'partners' ? (

              <motion.div
                key="p"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >

                {/* SEARCH */}
                <div className="relative">

                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                  <input
                    placeholder="Search nearby partners..."
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-sm outline-none focus:border-green-500"
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />

                </div>

                {/* PARTNER LIST */}
                <div className="space-y-3">

                 {fetchingPartners ? (

  <div className="flex items-center justify-center py-10">
    <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
  </div>

) : filteredPartners.length === 0 ? (

  <div className="bg-gray-50 rounded-2xl p-8 text-center">
    <p className="text-sm font-bold text-gray-400">
      No Delivery Partner Found
    </p>
  </div>

) : (

  filteredPartners.map((p) => (

    <div
      key={p._id}
      onClick={() => handlePartnerSelect(p)}
      className={`p-4 rounded-2xl border-2 flex items-center gap-4 transition-all cursor-pointer ${
        selectedPartner?._id === p._id
          ? 'border-green-500 bg-green-50/30'
          : 'border-gray-50 bg-white hover:border-gray-100'
      }`}
    >

      <img
        src={
          p?.userId?.img ||
          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
        }
        className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover"
        alt=""
      />

      <div className="flex-1">

        <h4 className="text-sm font-bold text-gray-800">
          {p?.userId?.fullName || "Unknown"}
        </h4>

        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
          {p?.vehicleType} • {p?.phone}
        </p>

        <p className="text-[10px] text-green-600 font-bold mt-1">
          {p?.isAvailable ? "Available" : "Currently Busy"}
        </p>

      </div>

      {selectedPartner?._id === p._id && (
        <CheckCircle2 className="w-5 h-5 text-green-600" />
      )}

    </div>

  ))

)}

                </div>

              </motion.div>

            ) : (

              // SELF DELIVERY
              <motion.div
                key="s"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >

                <div
                  className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center text-center ${
                    isSelfSelected
                      ? 'border-green-500 bg-green-50/50 shadow-inner'
                      : 'border-gray-100 bg-gray-50/50'
                  }`}
                >

                  <div
                    className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-4 transition-all ${
                      isSelfSelected
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-300 shadow-sm'
                    }`}
                  >

                    <User className="w-8 h-8" />

                  </div>

                  <h4 className="text-lg font-bold text-gray-800 tracking-tight">
                    {user?.fullName}
                  </h4>

                  <p className="text-xs text-gray-500 mb-6">
                    {user?.phone || "Phone Number Not Added"}
                  </p>

                  <button
                    onClick={handleSelfSelect}
                    className={`px-8 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
                      isSelfSelected
                        ? 'bg-green-600 text-white shadow-lg shadow-green-200'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-green-500 hover:text-green-600'
                    }`}
                  >

                    {isSelfSelected ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Selected
                      </>
                    ) : (
                      <>
                        <MousePointerClick className="w-4 h-4" />
                        Select This Mode
                      </>
                    )}

                  </button>

                </div>

              </motion.div>

            )}

          </AnimatePresence>

        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-gray-50">

          <button
            disabled={
              !deliveryDate ||
              !deliveryTime ||
              (!selectedPartner && !isSelfSelected) ||
              loading
            }
            onClick={handleFinalSubmit}
            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
              (!deliveryDate ||
                !deliveryTime ||
                (!selectedPartner && !isSelfSelected))
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700 shadow-xl shadow-green-100'
            }`}
          >

            {loading ? (

              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />

            ) : (

              <>
                Confirm Assignment
                <ChevronRight className="w-4 h-4" />
              </>

            )}

          </button>

        </div>

      </motion.div>

    </div>
  );
};

export default KisanMitraAssignDelivery;