"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Leaf,
  ShoppingCart,
  Package,
  Search,
  MapPin,
  Menu,
  X,
  User,
  ChevronRight,
  ChevronDown,
  Home,
  ShoppingBag,
  Settings,
  LogOut,
  Info,
  LayoutDashboard,
  Globe,
  Bell,
} from "lucide-react";
import { useTranslation } from "../context/LanguageContext";

const categories = [
  "Vegetables",
  "Fruits",
  "Grains",
  "Dairy",
  "Organic",
  "Offers",
  "Farmer Stories",
];

function SearchBar() {
  const { translations: t } = useTranslation();
  const [isNearMe, setIsNearMe] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex-1 max-w-2xl hidden md:flex items-center bg-slate-50 border border-emerald-100 rounded-2xl p-1 focus-within:ring-4 ring-emerald-500/10 focus-within:border-emerald-500 transition-all duration-300">
      <select className="bg-transparent text-xs font-bold px-4 outline-none text-emerald-800 cursor-pointer appearance-none uppercase tracking-wider">
        <option>{t.all}</option>
        <option>{t.vegetables}</option>
        <option>{t.fruits}</option>
        <option>{t.grains}</option>
        <option>{t.dairy}</option>
      </select>

      <div className="h-5 w-px bg-emerald-100 mx-1" aria-hidden="true" />

      <input
        type="text"
        placeholder={t.search}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1 bg-transparent px-4 py-2 outline-none text-sm text-slate-700 font-medium"
      />

      <button
        onClick={() => setIsNearMe(!isNearMe)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all ${
          isNearMe ? "bg-emerald-600 text-white shadow-lg" : "hover:bg-emerald-50 text-emerald-700"
        }`}
      >
        <MapPin size={14} strokeWidth={2.5} />
        <span className="text-[11px] font-black uppercase tracking-tighter whitespace-nowrap">{t.nearMe}</span>
      </button>

      <button className="bg-slate-900 p-2.5 rounded-xl text-white ml-1 hover:bg-emerald-600 transition-all">
        <Search size={18} strokeWidth={2.5} />
      </button>
    </div>
  );
}

function AccountDropdown({ isLoggedIn, userName }) {
  const { lang, toggleLanguage, translations: t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-3 p-1.5 pr-3 hover:bg-slate-50 rounded-2xl transition-all">
        <div className="lg:hidden h-10 w-10 bg-emerald-100 flex items-center justify-center rounded-xl text-emerald-700">
          <User size={20} />
        </div>
        <div className="hidden lg:block text-left">
          <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">
            {isLoggedIn ? `${t.hello}, ${userName}` : "Hello, Sign in"}
          </p>
          <p className="text-sm font-black text-slate-800 flex items-center gap-1">
            {t.account} & Lists <ChevronDown size={14} className={isOpen ? "rotate-180" : ""} />
          </p>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] right-0 w-64 bg-white border border-slate-100 rounded-3xl shadow-2xl p-4 z-[110]">
          {!isLoggedIn && (
             <div className="text-center border-b border-slate-50 pb-4 mb-4">
               <a href="/auth" className="block w-full">
                 <button className="w-full bg-emerald-600 text-white py-2.5 rounded-xl font-bold text-sm">{t.signin}</button>
               </a>
             </div>
          )}
          <div className="space-y-1">
            <button onClick={toggleLanguage} className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-600">
              <div className="flex items-center gap-3"><Globe size={16} /> <span>{t.language}</span></div>
              <span className="text-[10px] font-black text-emerald-600">{lang === "en" ? "EN" : "HI"}</span>
            </button>
            <a href="/dashboard" className="block">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-600"><LayoutDashboard size={16}/> {t.dashboard}</button>
            </a>
            <a href="/orders" className="block">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-600"><Package size={16}/> {t.orders}</button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function MobileMenu({ isOpen, setIsOpen, userName, isLoggedIn }) {
  const { lang, toggleLanguage, translations: t } = useTranslation();
  const navItems = [
    { name: `${t.home}`, icon: Home, link: "/" },
    { name: `${t.shopcategories}`, icon: ShoppingBag, link: "/categories" },
    { name: `${t.myorders}`, icon: Package, link: "/orders" },
    { name: `${t.settings}`, icon: Settings, link: "/settings" },
    { name: `${t.aboutkisanmitra}`, icon: Info, link: "/about" },
  ];

  return (
    <>
      <div className={`fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[150] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={() => setIsOpen(false)} />
      <div className={`fixed top-0 left-0 h-full w-[300px] bg-white z-[160] shadow-2xl transform transition-transform duration-500 ease-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="bg-slate-900 text-white p-6 rounded-br-[2.5rem]">
          <div className="flex justify-between items-center mb-6">
            <div className="h-12 w-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg"><User size={24} /></div>
            <button onClick={() => setIsOpen(false)} className="h-10 w-10 flex items-center justify-center bg-white/10 rounded-xl"><X size={24} /></button>
          </div>
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">{isLoggedIn ? t.hello : t.welcome}</p>
          <a href={isLoggedIn ? "/profile" : "/auth"} onClick={() => setIsOpen(false)}>
            <p className="text-xl font-black">{isLoggedIn ? userName : t.signin}</p>
          </a>
        </div>
        <nav className="py-6">
          <button onClick={toggleLanguage} className="w-full flex items-center justify-between px-8 py-4 hover:bg-slate-50 border-b border-slate-50">
            <div className="flex items-center gap-4"><Globe size={20} className="text-emerald-600" /> <span className="font-bold text-slate-700 text-sm">{t.language}</span></div>
            <span className="text-xs font-black text-emerald-600">{lang === "en" ? "हिन्दी" : "English"}</span>
          </button>
          {navItems.map((item) => (
            <a href={item.link} key={item.name} onClick={() => setIsOpen(false)} className="block">
              <button className="w-full flex items-center justify-between px-8 py-4 hover:bg-slate-50 text-slate-700">
                <div className="flex items-center gap-4"><item.icon size={20} className="text-slate-400" /> <span className="font-bold text-sm">{item.name}</span></div>
                <ChevronRight size={16} className="text-slate-300" />
              </button>
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}

export function Navbar({ cartCount = 0, isLoggedIn = false, userName = "Patel" }) {
  const { lang, toggleLanguage, translations: t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-[100] w-full bg-white/90 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-4">
          
          <button className="md:hidden p-2.5 bg-slate-100 rounded-xl text-slate-600" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={20} strokeWidth={2.5} />
          </button>

          <div className="flex items-center gap-3 shrink-0 cursor-pointer">
            <div className="bg-slate-900 p-2.5 rounded-2xl text-white shadow-xl shadow-slate-200">
              <Leaf size={22} fill="currentColor" />
            </div>
            <a href="/"><span className="text-2xl font-black text-slate-900 tracking-tighter">{t.kisan}<span className="text-emerald-600">{t.mitra}</span></span></a>
          </div>

          <SearchBar />

          <div className="flex items-center gap-2 sm:gap-4">
            <button className="relative p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
              <Bell size={22} />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>

            <button
              onClick={toggleLanguage}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 border border-slate-100 rounded-xl text-[10px] font-black text-slate-600 hover:bg-emerald-50 transition-all uppercase tracking-widest"
            >
              <Globe size={14} strokeWidth={2.5} />
              {lang === "en" ? "हिन्दी" : "ENG"}
            </button>

            <AccountDropdown isLoggedIn={isLoggedIn} userName={userName} />

            <a href="/cart" className="block">
              <button className="relative p-3 bg-slate-900 text-white hover:bg-emerald-600 rounded-2xl transition-all shadow-lg shadow-slate-200">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center ring-4 ring-white shadow-lg">
                    {cartCount}
                  </span>
                )}
              </button>
            </a>
          </div>
        </div>

        <div className="md:hidden px-4 pb-4 bg-white">
          <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl p-1">
            <input type="text" placeholder={t.search} className="flex-1 bg-transparent px-4 py-2 outline-none text-sm font-medium" />
            <button className="bg-emerald-600 p-2 rounded-xl text-white"><Search size={18} /></button>
          </div>
        </div>
      </nav>

      <MobileMenu 
        isOpen={mobileMenuOpen} 
        setIsOpen={setMobileMenuOpen} 
        userName={userName} 
        isLoggedIn={isLoggedIn} 
      />
    </>
  );
}