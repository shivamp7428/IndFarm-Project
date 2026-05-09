import React, { useState } from 'react';
import { 
  Mail, Lock, User, MapPin, 
  Building, Tractor, ShoppingCart, 
  Eye, EyeOff, ArrowRight,
  Upload, Hash, Navigation
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "../context/LanguageContext";
import { ChevronDown, Leaf, History } from 'lucide-react'; 
import { AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const AuthPage = () => {
  const { translations: t } = useTranslation();
  const navigate = useNavigate();
  
  const API_BASE_URL = "http://localhost:5000/api/auth";

  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('farmer'); 
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // New states for OTP flow
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [tempIdentifier, setTempIdentifier] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    identifier: '', 
    password: '',
    farmName: '',
    pincode: '',
    farmingType: '',
    showFarmingDropdown: false,
  });

  const [locationValue, setLocationValue] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [imageFile, setImageFile] = useState(null);

  const productList = [
    { id: 'vegetables', label: t.vegetables },
    { id: 'fruits', label: t.fruits },
    { id: 'grains', label: t.grains },
    { id: 'dairy', label: t.dairy },
    { id: 'spices', label: t.spices },
    { id: 'pulses', label: t.pulses },
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleProductToggle = (id) => {
    setSelectedProducts(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      const toastId = toast.loading("Detecting your location...");
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
            const data = await res.json();
            const address = data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            setLocationValue(address);
            toast.update(toastId, { render: "Location detected!", type: "success", isLoading: false, autoClose: 3000 });
          } catch (err) {
            setLocationValue(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            toast.update(toastId, { render: "Coordinates fetched!", type: "info", isLoading: false, autoClose: 3000 });
          }
        },
        () => {
          toast.update(toastId, { render: "Location access denied.", type: "error", isLoading: false, autoClose: 3000 });
        }
      );
    }
  };

  const resetOtpFlow = () => {
    setShowOtp(false);
    setOtp('');
    setTempIdentifier('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin && showOtp) {
        // Verify OTP
        const response = await fetch(`${API_BASE_URL}/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identifier: tempIdentifier,
            otp: otp
          }),
        });

        const result = await response.json();

        if (response.ok) {
          toast.success("Login Successful!");
          localStorage.setItem('token', result.token);
          localStorage.setItem('user', JSON.stringify(result.user));
          setTimeout(() => {
            navigate("/"); 
            window.location.reload();
          }, 1500);
        } else {
          toast.error(result?.message || "OTP verification failed.");
        }
      } 
      else if (isLogin) {
        // Login attempt
        const response = await fetch(`${API_BASE_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identifier: formData.identifier,
            password: formData.password
          }),
        });

        const result = await response.json();

        if (response.ok) {
          if (result.otpRequired) {
            setTempIdentifier(formData.identifier);
            setShowOtp(true);
            toast.info("OTP sent to your registered contact");
          } else {
            toast.success("Login Successful!");
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
            setTimeout(() => {
              navigate("/"); 
              window.location.reload();
            }, 1500);
          }
        } else {
          toast.error(result?.message || "Login failed.");
        }
      } 
      else {
        // Signup (unchanged)
        const data = new FormData();
        data.append('fullName', formData.fullName);
        data.append('identifier', formData.identifier);
        data.append('password', formData.password);
        data.append('role', role);

        if (role === 'farmer') {
          data.append('farmName', formData.farmName);
          data.append('farmLocation', locationValue);
          data.append('farmingType', formData.farmingType);
          selectedProducts.forEach(p => {data.append("products[]", p);});
          if (imageFile) data.append('farmImage', imageFile);
        } else {
          data.append('deliveryAddress', locationValue);
          data.append('pincode', formData.pincode);
        }

        const response = await fetch(`${API_BASE_URL}/signup`, { 
          method: 'POST', 
          body: data 
        });

        const result = await response.json();
        
        if (response.ok) {
          toast.success("Account Created Successfully!, Please Verify You Email");
          setIsLogin(true);
          resetOtpFlow();
        } else {
          toast.error(result?.message || "Signup failed.");
        }
      }
    } catch (error) {
      toast.error("Server connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    resetOtpFlow();
    setFormData({
      fullName: '',
      identifier: '', 
      password: '',
      farmName: '',
      pincode: '',
      farmingType: '',
      showFarmingDropdown: false,
    });
    setLocationValue('');
    setSelectedProducts([]);
    setImageFile(null);
  };

  const handleGoogleLogin = () => {
  
    window.location.href =`${API_BASE_URL}/google`;
};  
  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-gray-50/50 px-4 py-8">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="light" />

      <motion.div layout className="w-full max-w-lg bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
        
        <div className="flex p-1.5 bg-gray-50 border-b">
          <button onClick={() => { setIsLogin(true); resetOtpFlow(); }} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${isLogin && !showOtp ? 'bg-white text-green-600 shadow-sm' : 'text-gray-400'}`}>{t.login}</button>
          <button onClick={() => { setIsLogin(false); resetOtpFlow(); }} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${!isLogin ? 'bg-white text-green-600 shadow-sm' : 'text-gray-400'}`}>{t.signup}</button>
        </div>

        <div className="p-6 md:p-8">
          <form className="space-y-4" onSubmit={handleSubmit}>
            
            {!isLogin && (
              <div className="grid grid-cols-2 gap-3 p-1 bg-gray-100 rounded-xl mb-4">
                <button type="button" onClick={() => setRole('farmer')} className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${role === 'farmer' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'}`}><Tractor size={16}/>{t.farmer}</button>
                <button type="button" onClick={() => setRole('customer')} className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${role === 'customer' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'}`}><ShoppingCart size={16}/>{t.customer}</button>
              </div>
            )}

            {/* Main Form Fields - Hidden during OTP */}
            {!showOtp && (
              <div className="space-y-3">
                {!isLogin && (
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
                    <input name="fullName" value={formData.fullName} onChange={handleInputChange} type="text" placeholder={t.fullName} className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm focus:border-green-500 transition-all" required/>
                  </div>
                )}
                
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
                  <input 
                    name="identifier" 
                    value={formData.identifier} 
                    onChange={handleInputChange} 
                    type="text" 
                    placeholder={t.emailPhone} 
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm focus:border-green-500 transition-all" 
                    required 
                  />
                </div>

                {!isLogin && (
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      value={locationValue} 
                      onChange={(e) => setLocationValue(e.target.value)} 
                      placeholder="Your Location" 
                      className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm focus:border-green-500 transition-all" 
                      required
                    />
                    <button 
                      type="button" 
                      onClick={handleDetectLocation}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-all active:scale-90 border border-white"
                    >
                      <Navigation size={18} fill="currentColor" className="opacity-80" />
                    </button>
                  </div>
                )}

                {!isLogin && role === 'farmer' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
                      <input name="farmName" value={formData.farmName} onChange={handleInputChange} type="text" placeholder={t.farmName} className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm focus:border-green-500 transition-all"/>
                    </div>
                    
                    <div className="relative">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1 block">
                        Farming Strategy
                      </label>
                      
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, showFarmingDropdown: !formData.showFarmingDropdown })}
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm transition-all focus:border-green-500 hover:bg-white"
                      >
                        <div className="flex items-center gap-3">
                          {formData.farmingType === 'organic' ? (
                            <Leaf size={18} className="text-green-500" />
                          ) : formData.farmingType === 'traditional' ? (
                            <History size={18} className="text-amber-600" />
                          ) : (
                            <Tractor size={18} className="text-gray-400" />
                          )}
                          <span className={formData.farmingType ? "text-gray-700 font-medium" : "text-gray-400"}>
                            {formData.farmingType ? (formData.farmingType.charAt(0).toUpperCase() + formData.farmingType.slice(1)) : "Select Farming Type"}
                          </span>
                        </div>
                        <ChevronDown 
                          size={18} 
                          className={`text-gray-400 transition-transform duration-300 ${formData.showFarmingDropdown ? 'rotate-180' : ''}`} 
                        />
                      </button>

                      <AnimatePresence>
                        {formData.showFarmingDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 5 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden p-1.5"
                          >
                            <div 
                              onClick={() => {
                                setFormData({ ...formData, farmingType: 'organic', showFarmingDropdown: false });
                              }}
                              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50 cursor-pointer transition-colors group"
                            >
                              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                                <Leaf size={16} className="text-green-600" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-gray-700">Organic</p>
                                <p className="text-[10px] text-gray-400">Chemical-free & Natural</p>
                              </div>
                            </div>

                            <div 
                              onClick={() => {
                                setFormData({ ...formData, farmingType: 'traditional', showFarmingDropdown: false });
                              }}
                              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-amber-50 cursor-pointer transition-colors group"
                            >
                              <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
                                <History size={16} className="text-amber-600" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-gray-700">Traditional</p>
                                <p className="text-[10px] text-gray-400">Conventional methods</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {productList.map(item => (
                        <button key={item.id} type="button" onClick={() => handleProductToggle(item.id)} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition-all ${selectedProducts.includes(item.id) ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-gray-100 text-gray-400'}`}>
                          {item.label}
                        </button>
                      ))}
                    </div>

                    <label className="flex items-center justify-center w-full py-4 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-green-50 transition-all">
                      <div className="text-center">
                        <Upload className="w-5 h-5 text-green-500 mx-auto" />
                        <p className="text-[10px] text-gray-400">{imageFile ? imageFile.name : "Upload farm image"}</p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
                    </label>
                  </motion.div>
                )}

                {!isLogin && role === 'customer' && (
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
                    <input name="pincode" value={formData.pincode} onChange={handleInputChange} type="text" placeholder={t.pincode} className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm focus:border-green-500 transition-all" required/>
                  </div>
                )}

                {/* Password field - only for login or signup */}
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    name="password" 
                    value={formData.password} 
                    onChange={handleInputChange} 
                    type={showPassword ? "text" : "password"} 
                    placeholder={t.password} 
                    className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm focus:border-green-500 transition-all" 
                    required 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            {/* OTP Section */}
            {showOtp && (
              <div className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
                  <input 
                    type="text" 
                    value={tempIdentifier} 
                    disabled
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm focus:border-green-500 transition-all opacity-75" 
                  />
                </div>

                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    value={otp} 
                    onChange={handleOtpChange}
                    placeholder="Enter OTP" 
                    maxLength={6}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm focus:border-green-500 transition-all text-center tracking-widest text-lg" 
                    required 
                  />
                </div>

                <p className="text-xs text-center text-gray-500">Enter the 6-digit code sent to your registered email/phone</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full py-3.5 bg-green-600 text-white font-bold rounded-xl flex justify-center items-center gap-2 transition-all hover:bg-green-700 active:scale-95 disabled:opacity-70"
            >
              {loading 
                ? (showOtp ? "Verifying OTP..." : "Connecting...") 
                : (showOtp ? "Verify OTP" : (isLogin ? t.login : t.submit))
              }
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Google Button - Hide during OTP */}
          {!showOtp && (
            <div className="mt-6">
              <div className="relative flex items-center justify-center mb-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                <span className="relative px-4 bg-white text-[10px] uppercase tracking-widest font-bold text-slate-300">Or continue with</span>
              </div>
              <button onClick={handleGoogleLogin} type="button" className="w-full py-3 bg-white border border-gray-200 hover:border-gray-300 rounded-xl flex justify-center items-center gap-3 text-sm text-slate-600 font-bold transition-all">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.14-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>
            </div>
          )}

          <footer className="mt-6 text-center">
            <button 
              onClick={handleToggleMode} 
              className="text-xs text-slate-400 hover:text-green-600 font-medium transition-colors"
            >
              {isLogin && !showOtp ? t.toggleSignup : (!showOtp ? t.toggleLogin : "Back to Login")}
            </button>
            
            {showOtp && (
              <button 
                onClick={resetOtpFlow} 
                className="block mx-auto mt-3 text-xs text-slate-400 hover:text-green-600 font-medium transition-colors"
              >
                ← Try different password
              </button>
            )}
          </footer>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;