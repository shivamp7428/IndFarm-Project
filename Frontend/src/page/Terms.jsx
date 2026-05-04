import React, { useState } from 'react';
import { 
  ShieldCheck, Gavel, Lock, Info, 
  ChevronRight, ArrowRight, Printer 
} from 'lucide-react';
import { useTranslation } from "../context/LanguageContext";

const PremiumTerms = () => {
  const { translations: t } = useTranslation();
  const [activeTab, setActiveTab] = useState('usage');

  const menuItems = [
    { id: 'usage', label: t.termsTab1, icon: <Gavel size={18} /> },
    { id: 'privacy', label: t.termsTab2, icon: <Lock size={18} /> },
    { id: 'payment', label: t.termsTab3, icon: <ShieldCheck size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans">
      
      {/* --- Header --- */}
      <header className="pt-32 pb-20 px-6 bg-white border-b border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-500/5 blur-[120px] rounded-full -translate-y-1/2" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
            <Info size={14} /> {t.legalNotice}
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6">
            {t.termsHeroTitle} <span className="text-emerald-600">{t.termsHeroTitleSpan}</span>
          </h1>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <p className="text-slate-500 text-lg max-w-2xl font-medium">
              {t.termsHeroSub}
            </p>
            <button onClick={() => window.print()} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-colors">
              <Printer size={16} /> {t.printVersion}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* --- Sticky Sidebar --- */}
          <aside className="lg:w-1/4">
            <div className="sticky top-28 space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl text-sm font-black transition-all ${
                    activeTab === item.id 
                    ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20" 
                    : "bg-transparent text-slate-400 hover:bg-white hover:text-slate-600"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    {item.label}
                  </div>
                  {activeTab === item.id && <ChevronRight size={16} />}
                </button>
              ))}
            </div>
          </aside>

          {/* --- Content Area --- */}
          <section className="lg:w-3/4">
            <div className="bg-white rounded-[2.5rem] p-10 md:p-16 border border-slate-200 shadow-sm">
              
              <div className="prose prose-slate max-w-none">
                <h2 className="text-3xl font-black mb-8 border-b border-slate-100 pb-6 text-slate-900">
                  {activeTab === 'usage' && t.termsTab1}
                  {activeTab === 'privacy' && t.termsTab2}
                  {activeTab === 'payment' && t.termsTab3}
                </h2>

                <div className="space-y-10 text-slate-600 font-medium leading-relaxed">
                  <article>
                    <h3 className="text-xl font-black text-slate-900 mb-4">{t.introTitle}</h3>
                    <p>{t.introContent}</p>
                  </article>

                  <article className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <h3 className="text-xl font-black text-slate-900 mb-4">{t.responsibilityTitle}</h3>
                    <ul className="space-y-4">
                      <li className="flex gap-3">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        {t.resPoint1}
                      </li>
                      <li className="flex gap-3">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        {t.resPoint2}
                      </li>
                    </ul>
                  </article>
                </div>

                <div className="mt-16 flex items-center justify-between p-8 bg-emerald-900 rounded-[2rem] text-white">
                  <div>
                    <p className="text-emerald-300 text-xs font-black uppercase tracking-widest mb-1">{t.doubtTitle}</p>
                    <h4 className="text-lg font-bold">{t.talkLegal}</h4>
                  </div>
                  <button className="bg-white text-slate-900 p-4 rounded-full hover:bg-emerald-400 transition-colors">
                    <ArrowRight size={24} />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PremiumTerms;