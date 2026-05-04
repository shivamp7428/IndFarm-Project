import React, { useState } from 'react';
import { 
  Plus, Minus, Search, HelpCircle, 
  MessageSquare, Mail, Phone, ChevronRight 
} from 'lucide-react';
import { useTranslation } from "../context/LanguageContext";

const FAQPage = () => {
  const { translations: t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      question: t.faqQ1,
      answer: t.faqA1,
      category: "General"
    },
    {
      question: t.faqQ2,
      answer: t.faqA2,
      category: "Payments"
    },
    {
      question: t.faqQ3,
      answer: t.faqA3,
      category: "Delivery"
    },
    {
      question: t.faqQ4,
      answer: t.faqA4,
      category: "General"
    }
  ];

  const filteredFaqs = faqData.filter(faq => 
    faq.question?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-20">
      
      {/* --- Header Section --- */}
      <section className="pt-32 pb-16 px-4 bg-emerald-50/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <HelpCircle size={14} /> {t.faqBadge}
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            {t.faqHeroTitle} <span className="text-emerald-600">{t.faqHeroTitleSpan}</span>
          </h1>
          
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder={t.faqSearchPlaceholder}
              className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-[2rem] shadow-xl shadow-emerald-900/5 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-lg"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* --- FAQ List --- */}
      <section className="max-w-3xl mx-auto px-4 py-20">
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <div 
                key={index} 
                className={`border rounded-[2rem] transition-all duration-300 ${
                  openIndex === index ? "border-emerald-500 bg-emerald-50/30" : "border-slate-100 bg-white hover:border-slate-300"
                }`}
              >
                <button 
                  className="w-full px-8 py-7 flex items-center justify-between text-left"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <span className="text-lg font-black pr-8">{faq.question}</span>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    openIndex === index ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500"
                  }`}>
                    {openIndex === index ? <Minus size={18} /> : <Plus size={18} />}
                  </div>
                </button>
                
                {openIndex === index && (
                  <div className="px-8 pb-8 text-slate-500 font-medium leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest">
              {t.noFaqFound} "{searchTerm}"
            </div>
          )}
        </div>
      </section>

      {/* --- Contact Grid --- */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <MessageSquare />, title: t.liveChat, detail: t.liveChatTime, color: "bg-blue-500" },
            { icon: <Mail />, title: t.emailSupport, detail: "support@kisanmitra.in", color: "bg-emerald-500" },
            { icon: <Phone />, title: t.callCenter, detail: "+91 xxxxxxxxxx", color: "bg-orange-500" },
          ].map((item, i) => (
            <div key={i} className="p-8 rounded-[2.5rem] border border-slate-100 text-center hover:shadow-xl transition-all group">
              <div className={`w-12 h-12 ${item.color} text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                {item.icon}
              </div>
              <h3 className="text-lg font-black mb-2">{item.title}</h3>
              <p className="text-slate-500 font-medium mb-4">{item.detail}</p>
              <div className="flex justify-center text-emerald-600 font-black text-xs uppercase tracking-widest group-hover:gap-2 transition-all cursor-pointer">
                {t.contactLabel} <ChevronRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default FAQPage;