import React from 'react';
import { 
  RefreshCcw, ShieldCheck, Clock, 
  AlertCircle, ChevronRight, HelpCircle 
} from 'lucide-react';
import { useTranslation } from "../context/LanguageContext";

const RefundPage = () => {
  const { translations: t } = useTranslation();

  const refundSteps = [
    {
      id: "01",
      title: t.refundStep1Title || "Request Initiation",
      desc: t.refundStep1Desc || "Raise a request via the app within 24 hours of delivery."
    },
    {
      id: "02",
      title: t.refundStep2Title || "Quality Audit",
      desc: t.refundStep2Desc || "Our experts verify the produce quality or damage report."
    },
    {
      id: "03",
      title: t.refundStep3Title || "Instant Payout",
      desc: t.refundStep3Desc || "Amount is credited back to your original payment method."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      
      {/* --- Hero Section --- */}
      <section className="pt-32 pb-20 px-6 bg-slate-50 border-b border-slate-100">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200 text-emerald-600 text-xs font-black uppercase tracking-widest mb-8">
            <RefreshCcw size={14} className="animate-spin-slow" /> {t.refundBadge || "Hassle-Free Returns"}
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight mb-6">
            {t.refundHeroTitle} <span className="text-emerald-600">{t.refundHeroSpan}</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            {t.refundHeroSub}
          </p>
        </div>
      </section>

      {/* --- Refund Process Steps --- */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {refundSteps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="text-8xl font-black text-slate-100 absolute -top-10 -left-4 group-hover:text-emerald-50 transition-colors z-0">
                {step.id}
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
                  {step.title} <ChevronRight className="text-emerald-500" size={20} />
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Policy Grid --- */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Eligibility Box */}
          <div className="bg-slate-900 rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ShieldCheck size={120} />
            </div>
            <h2 className="text-3xl font-black mb-8">{t.refundEligTitle}</h2>
            <ul className="space-y-6">
              {[t.elig1, t.elig2, t.elig3].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <span className="text-slate-300 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Timeline Box */}
          <div className="bg-emerald-50 rounded-[3rem] p-10 md:p-14 border border-emerald-100">
            <h2 className="text-3xl font-black mb-8 text-emerald-900">{t.timelineTitle}</h2>
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-emerald-600">
                  <Clock size={32} />
                </div>
                <div>
                  <h4 className="font-black text-emerald-900">{t.timeLabel1}</h4>
                  <p className="text-emerald-700/70 font-medium">{t.timeValue1}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-emerald-600">
                  <RefreshCcw size={32} />
                </div>
                <div>
                  <h4 className="font-black text-emerald-900">{t.timeLabel2}</h4>
                  <p className="text-emerald-700/70 font-medium">{t.timeValue2}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- Footer Help --- */}
      <section className="max-w-4xl mx-auto px-6 pb-32 text-center">
        <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-200 inline-block w-full">
          <HelpCircle className="mx-auto mb-4 text-slate-400" size={40} />
          <h3 className="text-2xl font-black mb-2">{t.refundHelpTitle}</h3>
          <p className="text-slate-500 font-medium mb-8">{t.refundHelpSub}</p>
          <a href="/contact">
             <button className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">
            {t.contactSupport}
          </button>
          </a>
        </div>
      </section>

    </div>
  );
};

export default RefundPage;