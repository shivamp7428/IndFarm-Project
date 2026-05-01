import React, { useState } from 'react';
import { 
  Mail, Lock, User, MapPin, 
  Building, Tractor, ShoppingCart, 
  Eye, EyeOff, ArrowRight, Navigation,
  Upload, CheckCircle2, Sprout, Hash
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from "../context/LanguageContext";

const AuthPage = () => {
  const { translations: t } = useTranslation();
  
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('farmer'); 
  const [showPassword, setShowPassword] = useState(false);
  const [locationValue, setLocationValue] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);

  const productList = [
    { id: 'vegetables', label: t.vegetables },
    { id: 'fruits', label: t.fruits },
    { id: 'grains', label: t.grains },
    { id: 'dairy', label: t.dairy },
    { id: 'spices', label: t.spices },
    { id: 'pulses', label: t.pulses },
  ];

  const handleProductToggle = (id) => {
    setSelectedProducts(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleDetectLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          const address = data.address;
          const cityStr = `${address.city || address.town || address.village}, ${address.state}`;
          setLocationValue(cityStr);
        } catch (error) {
          setLocationValue(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
        }
      });
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-gray-50/50 font-sans text-slate-900 px-4 py-8">
      
      {/* Container width constrained to max-w-lg for a cleaner, premium look */}
      <motion.div 
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white rounded-[2rem] shadow-xl shadow-green-900/5 border border-gray-100 overflow-hidden"
      >
        {/* Toggle Tabs */}
        <div className="flex p-1.5 bg-gray-50 border-b border-gray-100">
          <button onClick={() => setIsLogin(true)} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${isLogin ? 'bg-white text-green-600 shadow-sm' : 'text-gray-400'}`}>{t.login}</button>
          <button onClick={() => setIsLogin(false)} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${!isLogin ? 'bg-white text-green-600 shadow-sm' : 'text-gray-400'}`}>{t.signup}</button>
        </div>

        <div className="p-6 md:p-8">
          <header className="mb-6 text-center">
            <h1 className="text-2xl font-black text-slate-800">{isLogin ? t.welcomeBack : t.createAccount}</h1>
            <p className="text-sm text-slate-400 mt-1">{isLogin ? t.loginSubtitle : t.signupSubtitle}</p>
          </header>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            
            {/* Role Selection */}
            {!isLogin && (
              <div className="grid grid-cols-2 gap-3 p-1 bg-gray-100 rounded-xl mb-4">
                <button type="button" onClick={() => setRole('farmer')} className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${role === 'farmer' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'}`}><Tractor size={16}/>{t.farmer}</button>
                <button type="button" onClick={() => setRole('customer')} className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${role === 'customer' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'}`}><ShoppingCart size={16}/>{t.customer}</button>
              </div>
            )}

            <div className="space-y-3">
              {/* Full Name - Signup Only */}
              {!isLogin && (
                <div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/><input type="text" placeholder={t.fullName} className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-green-500 outline-none text-sm transition-all"/></div>
              )}
              
              <div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/><input type="text" placeholder={t.emailPhone} className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-green-500 outline-none text-sm transition-all"/></div>

              {/* Farmer Specific */}
              {!isLogin && role === 'farmer' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  <div className="relative"><Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/><input type="text" placeholder={t.farmName} className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-green-500 outline-none text-sm"/></div>
                  
                  {/* Location with Auto-detect */}
                  <div className="relative flex items-center">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" value={locationValue} onChange={(e) => setLocationValue(e.target.value)} placeholder={t.location} className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-green-500 outline-none text-sm" />
                    <button type="button" onClick={handleDetectLocation} className="absolute right-2 p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all"><Navigation size={14} /></button>
                  </div>

                  <div className="relative">
                    <Sprout className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <select className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-green-500 outline-none appearance-none text-sm">
                      <option value="" disabled selected>{t.farmingType}</option>
                      <option value="organic">Organic</option>
                      <option value="traditional">Traditional</option>
                      <option value="mixed">Mixed</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 ml-1">Products</p>
                    <div className="grid grid-cols-2 gap-2">
                      {productList.map(item => (
                        <button key={item.id} type="button" onClick={() => handleProductToggle(item.id)} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition-all ${selectedProducts.includes(item.id) ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-gray-100 text-gray-400'}`}>
                          {selectedProducts.includes(item.id) ? <CheckCircle2 size={14}/> : <div className="w-3 h-3 rounded-full border border-gray-200"/>}
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 ml-1">Farm Image</p>
                    <label className="flex items-center justify-center w-full py-6 border-2 border-dashed border-gray-100 rounded-xl cursor-pointer hover:bg-green-50 hover:border-green-300 transition-all">
                      <div className="text-center">
                        <Upload className="w-5 h-5 text-green-500 mx-auto mb-1" />
                        <p className="text-[10px] text-gray-400">Click to upload</p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" />
                    </label>
                  </div>
                </motion.div>
              )}

              {/* Customer Specific - Now includes Location */}
              {!isLogin && role === 'customer' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  <div className="relative flex items-center">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      value={locationValue} 
                      onChange={(e) => setLocationValue(e.target.value)} 
                      placeholder={t.address} 
                      className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-green-500 outline-none text-sm" 
                    />
                    <button type="button" onClick={handleDetectLocation} className="absolute right-2 p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all"><Navigation size={14} /></button>
                  </div>
                  <div className="relative"><Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/><input type="text" placeholder={t.pincode} className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-green-500 outline-none text-sm"/></div>
                </motion.div>
              )}

              {/* Password */}
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                <input type={showPassword ? "text" : "password"} placeholder={t.password} className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-green-500 outline-none text-sm transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              </div>

              {isLogin && (
                <div className="flex justify-between items-center text-[11px] px-1">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-400">
                    <input type="checkbox" className="w-3 h-3 rounded border-gray-300 text-green-600 focus:ring-0" />
                    {t.remember}
                  </label>
                  <a href="#" className="text-green-600 font-bold hover:underline">{t.forgotPass}</a>
                </div>
              )}
            </div>

            <button type="submit" className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-100 transition-all flex justify-center items-center gap-2 group mt-4 text-sm">
              {isLogin ? t.login : t.submit}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <footer className="mt-6 text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-xs text-slate-400 hover:text-green-600 font-medium transition-colors">
              {isLogin ? t.toggleSignup : t.toggleLogin}
            </button>
          </footer>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;