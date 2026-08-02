import React, { useState ,useEffect} from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {Bike, CreditCard, IdCard, Smartphone, Upload, User, ChevronLeft, AlertCircle, ChevronDown,} from "lucide-react";
import { useNavigate } from "react-router-dom";


const CustomInput = ({
  label,
  icon: Icon,
  error,
  value,
  onChange,
  placeholder,
  type = "text",
  maxLength,
}) => {
  return (
    <div className="space-y-1.5 w-full">
      <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
        <Icon
          size={16}
          className={error ? "text-red-500" : "text-emerald-500"}
        />
        {label}
      </label>

      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`w-full bg-slate-50 border rounded-xl px-4 py-3 focus:ring-4 transition-all outline-none font-medium ${
            error
              ? "border-red-500 focus:ring-red-50 focus:border-red-500"
              : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-50"
          }`}
        />

        {error && (
          <AlertCircle
            className="absolute right-3 top-3.5 text-red-500"
            size={18}
          />
        )}
      </div>

      {error && (
        <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">
          {error}
        </p>
      )}
    </div>
  );
};

const DeliveryForm = () => {
  const navigate = useNavigate();
const [loading, setLoading] = useState(false);
const [errors, setErrors] = useState({});
const [isOpen, setIsOpen] = useState(false);

const [phone, setPhone] = useState("");
const [aadhaarNumber, setAadhaarNumber] = useState("");
const [aadhaarImage, setAadhaarImage] = useState(null);
const [vehicleType, setVehicleType] = useState("");
const [vehicleNumber, setVehicleNumber] = useState("");
const [accountHolderName, setAccountHolderName] = useState("");
const [accountNumber, setAccountNumber] = useState("");
const [ifscCode, setIfscCode] = useState("");
const [bankImage, setBankImage] = useState(null);


const detectLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return reject();
    }

    const toastId = toast.loading("Detecting location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        toast.success("Location detected", { id: toastId });

        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        toast.error("Location access denied", { id: toastId });
        reject(error);
      }
    );
  });
};
useEffect(() => {
  detectLocation();
}, []);

const handlePhone = (e) => {
  const value = e.target.value.replace(/[^0-9]/g, "");
  if (value.length <= 10) setPhone(value);
};

const handleAadhaar = (e) => {
  const value = e.target.value.replace(/[^0-9]/g, "");
  if (value.length <= 12) setAadhaarNumber(value);
};

const handleVehicleNumber = (e) => {
  const value = e.target.value.toUpperCase().replace(/[^A-Z0-9\s]/g, "");
  if (value.length <= 15) setVehicleNumber(value);
};

const handleAccountNumber = (e) => {
  const value = e.target.value.replace(/[^0-9]/g, "");
  if (value.length <= 18) setAccountNumber(value);
};

const handleIFSC = (e) => {
  const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (value.length <= 11) setIfscCode(value);
};

const handleName = (e) => {
  const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
  if (value.length <= 50) setAccountHolderName(value);
};

const validate = () => {
  let newErrors = {};

  if (phone.length !== 10) newErrors.phone = "Phone number must be 10 digits";
  if (aadhaarNumber.length !== 12) newErrors.aadhaar = "Aadhaar must be 12 digits";
  if (!vehicleType) newErrors.vehicleType = "Select vehicle type";
  if (vehicleNumber.length < 5) newErrors.vehicleNumber = "Invalid vehicle number";
  if (accountHolderName.trim().length < 3) newErrors.name = "Name must be at least 3 characters";
  if (accountNumber.length < 9 || accountNumber.length > 18) newErrors.acc = "Account number must be 9-18 digits";
  if (ifscCode.length !== 11) newErrors.ifsc = "IFSC must be 11 characters";
  if (!aadhaarImage) newErrors.img1 = "Aadhaar image required";
  if (!bankImage) newErrors.img2 = "Bank image required";

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validate()) {
    toast.error("Please fill all fields correctly");
    return;
  }

  try {
    setLoading(true);

    const token = localStorage.getItem("token");
    let location = { lat: null, lng: null };

    try {
      location = await detectLocation();
    } catch (err) {
      toast.error("Location required for delivery");
      setLoading(false);
      return;
    }

    const formData = new FormData();

    formData.append("phone", phone);
    formData.append("aadhaarNumber", aadhaarNumber);
    formData.append("aadhaarImage", aadhaarImage);
    formData.append("vehicleType", vehicleType);
    formData.append("vehicleNumber", vehicleNumber);
    formData.append("accountHolderName", accountHolderName);
    formData.append("accountNumber", accountNumber);
    formData.append("ifscCode", ifscCode);
    formData.append("bankImage", bankImage);

    formData.append("latitude", location.lat);
    formData.append("longitude", location.lng);

   const { data } = await axios.post(
  `${import.meta.env.VITE_API_URL}/delivery/register`,
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  }
);

    if (data.success) {
      toast.success("Registration Successful 🎉");
      navigate("/");
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* LEFT SIDE */}
          <div className="lg:col-span-4 bg-slate-900 p-10 text-white flex flex-col justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-all"
            >
              <ChevronLeft size={20} /> Back
            </button>
            <div>
              <h1 className="text-4xl font-black leading-tight">
                Become <br />
                <span className="text-emerald-500">Delivery Partner</span>
              </h1>
              <p className="mt-4 text-slate-400 text-sm">
                Deliver products from farmers to customers and earn money.
              </p>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">SECURE DELIVERY SYSTEM</p>
          </div>

          {/* RIGHT SIDE (FORM) */}
          <div className="lg:col-span-8 p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CustomInput
                  label="Phone Number"
                  icon={Smartphone}
                  value={phone}
                  onChange={handlePhone}
                  placeholder="Enter Phone Number"
                  error={errors.phone}
                  maxLength={10}
                />

                <CustomInput
                  label="Aadhaar Number"
                  icon={IdCard}
                  value={aadhaarNumber}
                  onChange={handleAadhaar}
                  placeholder="Enter Aadhaar Number"
                  error={errors.aadhaar}
                  maxLength={12}
                />

                {/* CUSTOM VEHICLE TYPE SELECTOR */}
                <div className="space-y-1.5 relative">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Bike size={16} className="text-emerald-500" />
                    Vehicle Type
                  </label>
                  <div
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full bg-slate-50 border rounded-xl px-4 py-3 flex justify-between items-center cursor-pointer transition-all ${
                      errors.vehicleType ? "border-red-500" : "border-slate-200"
                    }`}
                  >
                    <span className={`font-medium ${!vehicleType ? "text-slate-400" : "text-slate-900"}`}>
                      {vehicleType ? vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1) : "Select Vehicle"}
                    </span>
                    <ChevronDown size={18} className={`transition-transform text-slate-400 ${isOpen ? "rotate-180" : ""}`} />
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-50 w-full mt-2 bg-white border border-slate-100 shadow-xl rounded-xl overflow-hidden"
                      >
                        {["bike", "car"].map((type) => (
                          <div
                            key={type}
                            onClick={() => {
                              setVehicleType(type);
                              setIsOpen(false);
                            }}
                            className="px-4 py-3 hover:bg-emerald-50 hover:text-emerald-600 cursor-pointer font-medium text-slate-700 transition-colors"
                          >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {errors.vehicleType && (
                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{errors.vehicleType}</p>
                  )}
                </div>

                <CustomInput
                  label="Vehicle Number"
                  icon={Bike}
                  value={vehicleNumber}
                  onChange={handleVehicleNumber}
                  placeholder="Ex: UP32AB1234"
                  error={errors.vehicleNumber}
                  maxLength={15}
                />

                <div className="md:col-span-2">
                  <CustomInput
                    label="Account Holder Name"
                    icon={User}
                    value={accountHolderName}
                    onChange={handleName}
                    placeholder="Enter Full Name"
                    error={errors.name}
                    maxLength={50}
                  />
                </div>

                <CustomInput
                  label="Account Number"
                  icon={CreditCard}
                  value={accountNumber}
                  onChange={handleAccountNumber}
                  placeholder="Enter Account Number"
                  error={errors.acc}
                  maxLength={18}
                />

                <CustomInput
                  label="IFSC Code"
                  icon={CreditCard}
                  value={ifscCode}
                  onChange={handleIFSC}
                  placeholder="Enter IFSC Code"
                  error={errors.ifsc}
                  maxLength={11}
                />
              </div>

              {/* FILE UPLOADS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-6 border-2 border-dashed rounded-2xl relative transition-all cursor-pointer ${errors.img1 ? "border-red-300 bg-red-50" : "border-slate-200 hover:border-emerald-500"}`}>
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setAadhaarImage(e.target.files[0])} />
                  <Upload className="mx-auto text-slate-400 mb-2" size={28} />
                  <p className="text-center font-semibold text-sm">Aadhaar Card Image</p>
                  <p className="text-[10px] text-center text-slate-500 mt-1">{aadhaarImage ? aadhaarImage.name : "Upload Image"}</p>
                </div>

                <div className={`p-6 border-2 border-dashed rounded-2xl relative transition-all cursor-pointer ${errors.img2 ? "border-red-300 bg-red-50" : "border-slate-200 hover:border-emerald-500"}`}>
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setBankImage(e.target.files[0])} />
                  <Upload className="mx-auto text-slate-400 mb-2" size={28} />
                  <p className="text-center font-semibold text-sm">Passbook / Cheque</p>
                  <p className="text-[10px] text-center text-slate-500 mt-1">{bankImage ? bankImage.name : "Upload Image"}</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-4 rounded-2xl font-black tracking-widest text-lg transition-all shadow-xl shadow-emerald-100"
              >
                {loading ? "Registering..." : "Register Now"}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DeliveryForm;