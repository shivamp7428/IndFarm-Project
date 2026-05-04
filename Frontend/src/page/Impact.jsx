import React from 'react';
import { useNavigate } from 'react-router-dom'; // Navigation ke liye
import { 
  TrendingUp, Users, ShieldCheck, Zap, 
  ArrowUpRight, IndianRupee, PieChart, Globe, 
  ChevronRight, Wallet, Truck, BarChart3,
  Leaf, ShoppingCart
} from 'lucide-react';
import { useTranslation } from "../context/LanguageContext";

const Impact = () => {
  const { translations: t } = useTranslation();
  const navigate = useNavigate();

  // Yahan apna asli login check lagao (e.g., from Redux, Context, or LocalStorage)
  const isLoggedIn = localStorage.getItem("token") ? true : false; 

  const handleAuthNavigation = (path) => {
    if (!isLoggedIn) {
      navigate("/auth");
    } else {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-100 pb-20">
      
      {/* --- Section 1: Hero --- */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-50 via-transparent to-transparent -z-10" />
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
            <Globe size={14} /> {t.impactBadge}
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[1.1]">
            {t.impactTitle1} <br/> {t.impactTitle2} <span className="text-emerald-600">{t.impactTitle3}</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            {t.impactSubtitle}
          </p>
        </div>
      </section>

      {/* --- Section 2: Metrics --- */}
      <section className="max-w-6xl mx-auto px-4 mb-32">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: t.metricIncome, value: "+60%", icon: <TrendingUp /> },
            { label: t.metricMiddlemen, value: t.zeroValue, icon: <ShieldCheck /> },
            { label: t.metricJobs, value: "5,000+", icon: <Users /> },
            { label: t.metricWaste, value: "40%", icon: <Leaf /> },
          ].map((stat, i) => (
            <div key={i} className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/40 group hover:border-emerald-500 transition-all">
              <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center mb-6">
                {stat.icon}
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-slate-900">{stat.value}</h3>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- Section 3: Revenue Split --- */}
      <section className="max-w-6xl mx-auto px-4 py-24 border-y border-slate-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-black mb-6">{t.valueChainTitle1} <br/><span className="text-emerald-600">{t.valueChainTitle2}</span></h2>
            <p className="text-slate-500 font-medium mb-10 leading-relaxed">{t.valueChainDesc}</p>
            <div className="space-y-4 text-slate-700 font-black text-xs uppercase tracking-widest">
                <div className="flex items-center gap-3"><div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white"><ArrowUpRight size={14}/></div>{t.featPayments}</div>
                <div className="flex items-center gap-3"><div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white"><ArrowUpRight size={14}/></div>{t.featAI}</div>
                <div className="flex items-center gap-3"><div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white"><ArrowUpRight size={14}/></div>{t.featCommission}</div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 relative overflow-hidden text-white shadow-2xl">
            <div className="relative z-10 space-y-12">
               <div className="text-center">
                  <PieChart className="text-emerald-500 mx-auto mb-4" size={48} />
                  <h3 className="text-xl font-black uppercase tracking-widest">{t.revSplitTitle}</h3>
               </div>
               <div className="space-y-8">
                  <div className="space-y-2">
                    <div className="flex justify-between font-black text-xs uppercase"><span>{t.shareFarmer}</span><span>₹75</span></div>
                    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 w-[75%]" /></div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between font-black text-xs uppercase"><span>{t.shareDelivery}</span><span>₹15</span></div>
                    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[15%]" /></div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between font-black text-xs uppercase"><span>{t.sharePlatform}</span><span>₹10</span></div>
                    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-slate-500 w-[10%]" /></div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 4: Opportunities --- */}
      <section className="max-w-6xl mx-auto px-4 py-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black uppercase tracking-tighter">{t.earnTitle}</h2>
          <p className="text-slate-500 font-medium mt-2">{t.earnSubtitle}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Delivery Hero */}
          <div className="p-10 rounded-[3rem] bg-emerald-50 border border-emerald-100 shadow-sm hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-emerald-200 mx-auto md:mx-0"><Truck size={28} /></div>
            <h4 className="text-2xl font-black mb-2">{t.roleDelivery}</h4>
            <p className="text-slate-600 font-bold mb-6 italic text-sm">{t.payDelivery}</p>
            <ul className="space-y-3 text-slate-500 text-sm font-medium">
              <li className="font-bold text-slate-700 underline decoration-emerald-200 underline-offset-4">{t.pointD1}</li>
              <li>{t.pointD2}</li>
              <li>{t.pointD3}</li>
            </ul>
          </div>

          {/* Fleet Owner */}
          <div className="p-10 rounded-[3rem] bg-blue-50 border border-blue-100 shadow-sm hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-200 mx-auto md:mx-0"><BarChart3 size={28} /></div>
            <h4 className="text-2xl font-black mb-2">{t.roleFleet}</h4>
            <p className="text-slate-600 font-bold mb-6 italic text-sm">{t.payFleet}</p>
            <ul className="space-y-3 text-slate-500 text-sm font-medium">
              <li className="font-bold text-slate-700 underline decoration-blue-200 underline-offset-4">{t.pointF1}</li>
              <li>{t.pointF2}</li>
              <li>{t.pointF3}</li>
            </ul>
          </div>

          {/* Agent */}
          <div className="p-10 rounded-[3rem] bg-orange-50 border border-orange-100 shadow-sm hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-orange-500 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-orange-200 mx-auto md:mx-0"><Wallet size={28} /></div>
            <h4 className="text-2xl font-black mb-2">{t.roleAgent}</h4>
            <p className="text-slate-600 font-bold mb-6 italic text-sm">{t.payAgent}</p>
            <ul className="space-y-3 text-slate-500 text-sm font-medium">
              <li className="font-bold text-slate-700 underline decoration-orange-200 underline-offset-4">{t.pointA1}</li>
              <li>{t.pointA2}</li>
              <li>{t.pointA3}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* --- Section 5: Dynamic CTA Logic --- */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-emerald-600 rounded-[4rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 blur-[100px] -ml-20 -mt-20 rounded-full" />
          <h2 className="text-4xl md:text-6xl font-black mb-10 relative z-10 leading-tight">
            {t.impactCTATitle}
          </h2>
          
          <div className="flex flex-wrap justify-center gap-6 relative z-10">
            {/* AGAR LOGGED IN NAHI HAI TABHI DIKHAO */}
            {!isLoggedIn && (
              <button 
                onClick={() => navigate("/auth")}
                className="px-10 py-5 bg-white text-emerald-600 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2 shadow-xl"
              >
                {t.ctaFarmerImpact} <ChevronRight size={18} />
              </button>
            )}

            {/* SHOP NOW / SHOPPING BUTTON (DYNAMIK NAVIGATION) */}
            <button 
              onClick={() => handleAuthNavigation("/shop")}
              className="px-10 py-5 bg-emerald-800 text-white border border-emerald-500 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-emerald-900 transition-all flex items-center gap-2"
            >
              <ShoppingCart size={18} /> {t.shopNowLabel || "Shop Now"}
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Impact;