import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

import {ChevronRight, ChevronLeft, MapPin, Navigation, CreditCard, Loader2, CheckCircle2,} from "lucide-react";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { product, quantity, farmer } = location.state || {};

  useEffect(() => {
    if (!product || !farmer || !quantity) {
      toast.error("No product selected");
      navigate("/");
    }
  }, [product, farmer, quantity, navigate]);

  const [step, setStep] = useState(1);

  const [loading, setLoading] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("cod");

 const [shippingAddress, setShippingAddress] = useState({
  fullName: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  latitude: null,
  longitude: null,
});


  const subtotal = product?.price * quantity;

  const deliveryCharge =
    subtotal < 100 ? 30 : subtotal < 300 ? 15 : 0;

  const grandTotal = subtotal + deliveryCharge;

  const remainingForFree =
    subtotal < 300 ? 300 - subtotal : 0;


  const handleChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };


  const useCurrentLocation = () => {

  if (!navigator.geolocation) {
    return toast.error("Geolocation not supported");
  }

  const toastId = toast.loading("Detecting location...");

  navigator.geolocation.getCurrentPosition(

    async (position) => {

      try {

        const { latitude, longitude } = position.coords;

        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );

        const data = response.data;

        const fullAddress = data.display_name || "";

        toast.success("Location detected", {
          id: toastId,
        });

        setShippingAddress((prev) => ({
          ...prev,
          address: fullAddress,
          latitude,  
          longitude,
        }));

      } catch (error) {

        toast.error("Failed to fetch address", {
          id: toastId,
        });

      }

    },

    () => {

      toast.error("Failed to fetch location", {
        id: toastId,
      });

    }

  );
};

 const handlePlaceOrder = async () => {

  const token = localStorage.getItem("token");

  if (!token) {
    return toast.error("Please login first");
  }

  setLoading(true);

  try {

    const payload = {
      farmer: farmer._id,

      products: [
        {
          product: product._id,
          quantity,
        },
      ],

      shippingAddress,

      paymentMethod,
    };

    // CASH ON DELIVERY

    if (paymentMethod === "cod") {

      await axios.post(
        "http://localhost:5000/api/orders/create",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Order placed successfully");

      setTimeout(() => {
        navigate(`/detail/${product._id}`);
      }, 1500);

      return;
    }

    // ONLINE PAYMENT

    const { data } = await axios.post(
      "http://localhost:5000/api/payment/order",
      {
        amount: grandTotal,
      }
    );

    const options = {

      key: import.meta.env.VITE_RAZORPAY_KEY_ID,

      amount: data.order.amount,

      currency: data.order.currency,

      name: "Kisan Mitra",

      description: "Fresh Farm Product Order",

      order_id: data.order.id,

      handler: async function (response) {

        try {

          // VERIFY PAYMENT

          const verifyRes = await axios.post(
            "http://localhost:5000/api/payment/verify",
            response
          );

          if (verifyRes.data.success) {

            // CREATE FINAL ORDER

            await axios.post(
              "http://localhost:5000/api/orders/create",
              payload,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            toast.success("Payment successful");

            setTimeout(() => {
              navigate(`/detail/${product._id}`);
            }, 1500);

          } else {

            toast.error("Payment verification failed");

          }

        } catch (error) {

          toast.error("Payment failed");

        }
      },

      prefill: {
        name: shippingAddress.fullName,
        contact: shippingAddress.phone,
      },

      theme: {
        color: "#10b981",
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.open();

  } catch (error) {

    console.log(error);

    toast.error(
      error.response?.data?.message ||
      "Something went wrong"
    );

  } finally {

    setLoading(false);

  }
};

  if (!product) return null;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Toaster position="top-center" />
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center gap-2 ${
                step >= 1
                  ? "text-emerald-600"
                  : "text-slate-400"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold ${
                  step >= 1
                    ? "bg-emerald-100"
                    : "bg-slate-100"
                }`}
              >
                1
              </div>
              <span className="font-bold hidden sm:block">
                Shipping
              </span>
            </div>
            <div className="w-16 h-[2px] bg-slate-200 relative overflow-hidden rounded-full">
              <motion.div
                animate={{
                  width: step === 2 ? "100%" : "0%",
                }}
                className="absolute inset-0 bg-emerald-500"
              />
            </div>
            <div
              className={`flex items-center gap-2 ${
                step >= 2
                  ? "text-emerald-600"
                  : "text-slate-400"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold ${
                  step >= 2
                    ? "bg-emerald-100"
                    : "bg-slate-100"
                }`}
              >
                2
              </div>
              <span className="font-bold hidden sm:block">
                Payment
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="text-sm font-bold text-slate-500 hover:text-black"
          >
            Cancel
          </button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="shipping"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                className="bg-white rounded-[32px] p-8 shadow-xl border border-slate-100"
              >
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                    <MapPin className="text-emerald-500" />
                    Shipping Details
                  </h2>
                  
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={shippingAddress.fullName}
                    onChange={handleChange}
                    className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={shippingAddress.phone}
                    onChange={handleChange}
                    className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <div className="md:col-span-2 relative">

                <textarea
                 rows="4"
                 name="address"
                 placeholder="Full Address"
                 value={shippingAddress.address}
                 onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 pr-36 outline-none resize-none focus:ring-2 focus:ring-emerald-500"
                />

             <button
               type="button"
               onClick={useCurrentLocation}
               className="absolute top-4 right-4 flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-100 transition-all"
              >
              <Navigation size={14} />
               Current
             </button>

            </div>
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={shippingAddress.city}
                    onChange={handleChange}
                    className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={shippingAddress.state}
                      onChange={handleChange}
                      className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                      type="text"
                      name="pincode"
                      placeholder="Pincode"
                      value={shippingAddress.pincode}
                      onChange={handleChange}
                      className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <div className="mt-10 flex justify-end">

                  <button
                    onClick={() => setStep(2)}
                    className="group flex items-center gap-2 bg-black text-white px-8 py-4 rounded-2xl font-black transition-all"
                  >
                    Continue
                    <ChevronRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </div>
              </motion.div>

            ) : (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="bg-white rounded-[32px] p-8 shadow-xl border border-slate-100"
              >
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 text-slate-500 hover:text-black mb-8 font-bold"
                >
                  <ChevronLeft size={18} />
                  Back
                </button>
                <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 mb-10">
                  <CreditCard className="text-emerald-500" />
                  Payment Method
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div
                    onClick={() =>
                      setPaymentMethod("cod")
                    }
                    className={`cursor-pointer rounded-3xl p-6 border-2 transition-all ${
                      paymentMethod === "cod"
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-100"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-black text-lg">
                          Cash on Delivery
                        </h3>
                        <p className="text-slate-500 text-sm mt-1">
                          Pay after delivery
                        </p>
                      </div>
                      {paymentMethod === "cod" && (
                        <CheckCircle2 className="text-emerald-500" />
                      )}
                    </div>
                  </div>
                  <div
                    onClick={() =>
                      setPaymentMethod("online")
                    }
                    className={`cursor-pointer rounded-3xl p-6 border-2 transition-all ${
                      paymentMethod === "online"
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-100"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-black text-lg">
                          Online Payment
                        </h3>
                        <p className="text-slate-500 text-sm mt-1">
                          UPI / Card / NetBanking
                        </p>
                      </div>
                      {paymentMethod === "online" && (
                        <CheckCircle2 className="text-emerald-500" />
                      )}
                    </div>
                  </div>
                </div>
                <button
                  disabled={loading}
                  onClick={handlePlaceOrder}
                  className="w-full mt-10 bg-emerald-500 hover:bg-emerald-600 text-white py-5 rounded-3xl font-black text-lg transition-all flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : paymentMethod === "cod" ? (
                    "PLACE ORDER"
                  ) : (
                    "PAY & ORDER"
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="relative">
          <div className="sticky top-28 space-y-6">
            <div className="bg-white rounded-[32px] p-5 shadow-xl border border-slate-100">
              <img
                src={product.productImageUrl}
                alt={product.name}
                className="w-full h-64 object-cover rounded-3xl"
              />
              <div className="mt-5">
                <h2 className="text-2xl font-black text-slate-900">
                  {product.name}
                </h2>
                <p className="text-slate-500 mt-1">
                  ₹{product.price} / {product.unit}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">
                    Quantity
                  </span>
                  <span className="text-xl font-black">
                    {quantity}
                  </span>
                </div>
                <div className="mt-6 flex items-center gap-3 bg-slate-50 p-3 rounded-2xl">
                  <img
                    src={farmer.img}
                    alt=""
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold text-slate-900">
                      {farmer.fullName}
                    </p>
                    <p className="text-xs uppercase font-black text-emerald-600">
                      {farmer.farmName}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-[32px] p-8 shadow-xl border border-slate-100">
              <h3 className="text-2xl font-black mb-8">
                Order Summary
              </h3>
              <div className="space-y-5">
                <div className="flex justify-between text-slate-500">
                  <span>
                    ₹{product.price} × {quantity}
                  </span>
                  <span className="font-bold text-slate-900">
                    ₹{subtotal}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Delivery Charge</span>
                  <span
                    className={`font-bold ${
                      deliveryCharge === 0
                        ? "text-emerald-500"
                        : "text-slate-900"
                    }`}
                  >
                    {deliveryCharge === 0
                      ? "FREE"
                      : `₹${deliveryCharge}`}
                  </span>
                </div>
                {remainingForFree > 0 && (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                    <p className="text-sm font-bold text-emerald-700">
                      Add ₹{remainingForFree} more for FREE delivery
                    </p>
                  </div>
                )}
                <div className="border-t border-dashed pt-5 flex justify-between items-end">
                  <div>
                    <p className="text-xs font-black uppercase text-slate-400">
                      Grand Total
                    </p>
                    <h2 className="text-4xl font-black text-slate-900">
                      ₹{grandTotal}
                    </h2>
                  </div>
                  <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-black uppercase">
                    Secure
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;