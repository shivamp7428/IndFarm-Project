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
            
            {!isLogin && (
              <div className="grid grid-cols-2 gap-3 p-1 bg-gray-100 rounded-xl mb-4">
                <button type="button" onClick={() => setRole('farmer')} className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${role === 'farmer' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'}`}><Tractor size={16}/>{t.farmer}</button>
                <button type="button" onClick={() => setRole('customer')} className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${role === 'customer' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'}`}><ShoppingCart size={16}/>{t.customer}</button>
              </div>
            )}

            <div className="space-y-3">
              {!isLogin && (
                <div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/><input type="text" placeholder={t.fullName} className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-green-500 outline-none text-sm transition-all"/></div>
              )}
              
              <div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/><input type="text" placeholder={t.emailPhone} className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-green-500 outline-none text-sm transition-all"/></div>

              {!isLogin && role === 'farmer' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  <div className="relative"><Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/><input type="text" placeholder={t.farmName} className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-green-500 outline-none text-sm"/></div>
                  
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

          {/* ADDED: Google Login Section */}
          <div className="mt-6">
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <span className="relative px-4 bg-white text-[10px] uppercase tracking-widest font-bold text-slate-300">Or continue with</span>
            </div>

            <button 
              type="button" 
              className="w-full py-3 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-slate-600 font-bold rounded-xl transition-all flex justify-center items-center gap-3 text-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.14-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>
          </div>

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