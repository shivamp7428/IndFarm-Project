"use client";

import React, { useState } from "react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare, 
  User, 
  CheckCircle2, 
  ChevronDown
} from "lucide-react";
import { useTranslation } from "../context/LanguageContext";

const ContactPage = () => {
  const { translations: t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
const [dropdownOpen, setDropdownOpen] = useState(false);
const [selectedSubject, setSelectedSubject] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const contactMethods = [
    {
      icon: <Phone className="text-emerald-500" size={24} />,
      title: t.callUs || "Call Us",
      detail: "+91 xxxxxxxxxx",
      sub: t.callSub || "Mon-Sat, 9am - 7pm"
    },
    {
      icon: <Mail className="text-blue-500" size={24} />,
      title: t.emailUs || "Email Us",
      detail: "support@kisanmitra.in",
      sub: t.emailSub || "24/7 Online Support"
    },
    {
      icon: <MapPin className="text-red-500" size={24} />,
      title: t.visitUs || "Visit Us",
      detail: "Bhopal, Madhya Pradesh",
      sub: "Indrapuri, 462022"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header Section */}
      <div className="bg-slate-900 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            {t.contactTitle || "Get in Touch"}
          </h1>
          <p className="text-slate-400 text-lg font-medium">
            {t.contactSubtitle || "Have questions? We're here to help you grow and thrive."}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1 space-y-6">
            {contactMethods.map((method, idx) => (
              <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex items-start gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl">
                  {method.icon}
                </div>
                <div>
                  <h3 className="font-black text-slate-900">{method.title}</h3>
                  <p className="text-slate-700 font-bold text-sm mt-1">{method.detail}</p>
                  <p className="text-slate-400 text-xs font-medium mt-1">{method.sub}</p>
                </div>
              </div>
            ))}

            {/* Social Connection */}
            <div className="bg-emerald-600 p-8 rounded-[2rem] text-white">
              <MessageSquare size={32} className="mb-4 opacity-50" />
              <h3 className="text-xl font-black mb-2">{t.chatWithUs || "Live Chat"}</h3>
              <p className="text-emerald-100 text-sm font-medium mb-6">
                {t.chatDesc || "Chat with our support team for instant help."}
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-xl shadow-slate-200/50">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="text-emerald-600" size={40} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 mb-2">{t.thankYou || "Message Sent!"}</h2>
                  <p className="text-slate-500 font-medium">{t.successDesc || "We'll get back to you within 24 hours."}</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-8 text-emerald-600 font-black text-sm uppercase tracking-widest underline"
                  >
                    {t.sendAnother || "Send another message"}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t.fullName || "Full Name"}</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          required
                          type="text" 
                          placeholder="Enter Your Name"
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t.emailAddress || "Email Address"}</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          required
                          type="email" 
                          placeholder="Enter Your Email"
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>

<div className="space-y-2 relative">
  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
    {t.subject || "Subject"}
  </label>
  
  <div 
    onClick={() => setDropdownOpen(!dropdownOpen)}
    className={`w-full bg-slate-50 border ${dropdownOpen ? 'border-emerald-500 ring-2 ring-emerald-500/10' : 'border-slate-100'} rounded-2xl py-4 px-4 flex items-center justify-between cursor-pointer transition-all duration-300 group`}
  >
    <span className={`font-medium ${selectedSubject ? 'text-slate-900' : 'text-slate-400'}`}>
      {selectedSubject || (t.selectSubject || "Select a Topic")}
    </span>
    <ChevronDown 
      size={18} 
      className={`text-slate-400 transition-transform duration-300 ${dropdownOpen ? 'rotate-180 text-emerald-500' : ''}`} 
    />
  </div>

  {dropdownOpen && (
    <>
      <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)}></div>
      
      <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-100 rounded-[1.5rem] shadow-2xl shadow-slate-200/50 z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
        {[
          { id: 'general', label: t.generalInquiry || "General Inquiry" },
          { id: 'farmer', label: t.farmerSupport || "Farmer Support" },
          { id: 'order', label: t.orderIssue || "Order/Delivery Issue" },
          { id: 'business', label: t.partnership || "Business Partnership" }
        ].map((item) => (
          <div 
            key={item.id}
            onClick={() => {
              setSelectedSubject(item.label);
              setDropdownOpen(false);
            }}
            className="px-5 py-4 hover:bg-emerald-50 text-slate-700 font-medium cursor-pointer transition-colors flex items-center justify-between group"
          >
            {item.label}
            {selectedSubject === item.label && <CheckCircle2 size={16} className="text-emerald-500" />}
          </div>
        ))}
      </div>
    </>
  )}
</div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t.message || "Message"}</label>
                    <textarea 
                      required
                      rows="5"
                      placeholder={t.msgPlaceholder || "How can we help you?"}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium resize-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 group"
                  >
                    {t.sendMessage || "Send Message"}
                    <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;