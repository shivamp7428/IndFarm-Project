"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, Sprout, Heart, ShieldCheck, TrendingUp, Globe, 
  CheckCircle2, Leaf, ChevronRight, Target, ShoppingBag,
  Zap, Recycle, Award, ArrowUpRight
} from "lucide-react";
import { useNavigate } from "react-router-dom"; 
import { useTranslation } from "../context/LanguageContext";

const AboutPage = () => {
  const { translations: t } = useTranslation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const stats = [
    { label: t.activeFarmers || "Active Farmers", value: "5,000+", icon: <Sprout className="text-emerald-500" /> },
    { label: t.deliveredOrders || "Orders Delivered", value: "150k+", icon: <ShoppingBag className="text-blue-500" /> },
    { label: t.citiesCovered || "Cities Covered", value: "24+", icon: <Globe className="text-orange-500" /> },
    { label: t.customerRating || "Happy Customers", value: "4.9/5", icon: <Heart className="text-pink-500" /> },
  ];

  const values = [
    {
      title: t.valueQuality || "Freshness First",
      desc: t.valueQualityDesc || "We ensure produce reaches your kitchen within 24 hours of harvest.",
      icon: <Leaf size={32} className="text-emerald-600" />
    },
    {
      title: t.valuePrice || "Fair Pricing",
      desc: t.valuePriceDesc || "Cutting out middlemen to ensure farmers get more and you pay less.",
      icon: <TrendingUp size={32} className="text-blue-600" />
    },
    {
      title: t.valueImpact || "Social Impact",
      desc: t.valueImpactDesc || "Every purchase supports a farming family's education and healthcare.",
      icon: <Heart size={32} className="text-red-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-white pb-20 font-sans">
      {/* Hero Section */}
      <div className="relative bg-slate-900 py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1600" className="w-full h-full object-cover" alt="Farm" />
        </div>
        <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
          <span className="bg-emerald-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 inline-block">
            {t.sinceYear || "Founded in 2026"}
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            {t.heroMainTitle || "Connecting Farmers Directly to Your Home."}
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto font-medium leading-relaxed">
            {t.aboutHeroDesc || "KisanMitra is more than a platform. It's a movement to digitize the Indian agricultural supply chain."}
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-4 -mt-12 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 text-center">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">{stat.icon}</div>
              <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why KisanMitra */}
      <div className="max-w-6xl mx-auto px-4 mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4 flex items-center gap-3">
                <Target className="text-emerald-600" size={32} />
                {t.whyKisanMitra || "Why KisanMitra?"}
              </h2>
              <p className="text-slate-600 font-medium text-lg leading-relaxed">
                {t.missionText || "Traditional supply chains involve middlemen..."}
              </p>
            </div>
            <div className="space-y-4">
              {[t.bullet1, t.bullet2, t.bullet3, t.bullet4].map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                  <span className="text-slate-700 font-bold text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
              <img src="https://plus.unsplash.com/premium_photo-1682092792260-1b7cd1674a74?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGluZGlhbiUyMGZhcm1lciUyMG5ld3xlbnwwfHwwfHx8MA%3D%3D" className="w-full h-full object-cover" alt="Farmer" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 max-w-[200px]">
              <p className="text-[10px] font-black text-emerald-600 uppercase mb-1 italic">{t.testimonyLabel || "Farmer Testimony"}</p>
              <p className="text-slate-800 font-bold text-xs italic">{t.testimonyText || "Doubled my income..."}</p>
              <p className="text-slate-400 text-[10px] mt-2 font-black">{t.farmerName || "— Ramesh Kumar, Farmer"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Section */}
      <div className="max-w-6xl mx-auto px-4 mt-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t.techTitle || "Smart Farming Technology"}</h2>
          <p className="text-slate-500 font-medium mt-2">{t.techSubtitle || "Beyond delivery..."}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: <Zap />, title: t.demandPrediction, desc: t.demandDesc, color: "emerald" },
            { icon: <Recycle />, title: t.ecoPackaging, desc: t.ecoDesc, color: "blue" },
            { icon: <Award />, title: t.traceability, desc: t.traceDesc, color: "orange" }
          ].map((item, i) => (
            <div key={i} className={`p-8 bg-${item.color}-50 rounded-[2.5rem] border border-${item.color}-100`}>
              <div className={`text-${item.color}-600 mb-4`}>{item.icon}</div>
              <h4 className="font-black text-slate-900 text-lg mb-2">{item.title}</h4>
              <p className="text-slate-600 text-sm font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-slate-50 mt-24 py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t.ourValues || "Our Core Values"}</h2>
            <p className="text-slate-500 font-medium mt-2">{t.valueSubtitle || "The pillars of our mission"}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-6">{v.icon}</div>
                <h3 className="text-xl font-black text-slate-900 mb-3">{v.title}</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Journey Section */}
      <div className="max-w-6xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t.journeyTitle || "The Farm-to-Fork Journey"}</h2>
          <div className="h-1.5 w-20 bg-emerald-500 mx-auto mt-4 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {[
            { step: "01", title: t.harvestTitle, desc: t.harvestDesc },
            { step: "02", title: t.qualityTitle, desc: t.qualityDesc },
            { step: "03", title: t.deliveryTitle, desc: t.deliveryDesc }
          ].map((item, i) => (
            <div key={i} className="text-center group">
              <div className="w-16 h-16 bg-white border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-500 transition-colors">
                <span className="text-xl font-black text-emerald-600 group-hover:text-white">{item.step}</span>
              </div>
              <h4 className="text-lg font-black text-slate-900 mb-2">{item.title}</h4>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Community Section */}
      <div className="max-w-6xl mx-auto px-4 mb-24">
        <div className="bg-emerald-50 rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center gap-12 border border-emerald-100">
           <div className="md:w-1/2">
              <h2 className="text-3xl font-black text-slate-900 mb-4">{t.communityTitle || "Empowering Rural Households"}</h2>
              <p className="text-slate-600 font-medium mb-6">{t.communityDesc || "Life beyond logistics..."}</p>
              <div className="flex gap-4">
                 <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100 text-center">
                    <p className="text-2xl font-black text-emerald-600">30%</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{t.incomeIncrease || "Income Increase"}</p>
                 </div>
                 <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100 text-center">
                    <p className="text-2xl font-black text-emerald-600">12k+</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{t.trainingHours || "Training Hours"}</p>
                 </div>
              </div>
           </div>
           <div className="md:w-1/2">
              <img src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800" className="rounded-3xl shadow-lg" alt="Community" />
           </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-emerald-600 rounded-[3rem] p-12 text-center text-white relative overflow-hidden">
          <h2 className="text-3xl md:text-4xl font-black mb-8 relative z-10">
            {isLoggedIn ? t.readyToExplore || "Ready to explore?" : t.readyToTaste || "Ready to taste the difference?"}
          </h2>
          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            {isLoggedIn ? (
              <>
                <button onClick={() => navigate("/marketplace")} className="bg-white text-emerald-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100">{t.visitMarketplace || "Marketplace"}</button>
                <button onClick={() => navigate("/farmerdashboard")} className="bg-emerald-700 text-white border border-emerald-500 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-800">{t.sellProducts || "Sell Products"}</button>
              </>
            ) : (
              <>
                <button onClick={() => navigate("/auth")} className="bg-white text-emerald-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100">{t.startShopping || "Start Shopping"}</button>
                <button onClick={() => navigate("/auth")} className="bg-emerald-700 text-white border border-emerald-500 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-800">{t.joinAsFarmer || "Join as a Farmer"}</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;