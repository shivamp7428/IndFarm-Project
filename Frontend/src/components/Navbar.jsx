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
    <div className="flex-1 max-w-2xl hidden md:flex items-center bg-[#F9FAFB] border border-[#BBF7D0] rounded-2xl p-1 focus-within:ring-2 ring-[#16A34A] ring-offset-1 transition-all">
      <select
        className="bg-transparent text-sm font-medium px-3 outline-none text-[#166534] cursor-pointer"
        aria-label="Category filter"
      >
        <option>{t.all}</option>
        <option>{t.vegetables}</option>
        <option>{t.fruits}</option>
        <option>{t.grains}</option>
        <option>{t.dairy}</option>
      </select>

      <div className="h-6 w-px bg-[#BBF7D0] mx-1" aria-hidden="true" />

      <input
        type="text"
        placeholder={t.search}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1 bg-transparent px-3 py-1.5 outline-none text-sm text-[#1F2937]"
      />

      <button
        onClick={() => setIsNearMe(!isNearMe)}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl transition-colors ${
          isNearMe
            ? "bg-[#16A34A] text-white"
            : "hover:bg-[#F0FDF4] text-[#15803D]"
        }`}
      >
        <MapPin size={16} />
        <span className="text-xs font-bold whitespace-nowrap">{t.nearMe}</span>
      </button>

      <button className="bg-[#16A34A] p-2 rounded-xl text-white ml-1 hover:bg-[#15803D] transition-colors">
        <Search size={18} />
      </button>
    </div>
  );
}

// --- Sub-Component: Account Dropdown (Desktop) ---
function AccountDropdown({ isLoggedIn, userName }) {
  const { lang, toggleLanguage, translations: t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 p-2 hover:bg-[#F0FDF4] rounded-lg border border-transparent hover:border-[#BBF7D0] transition-all"
      >
        <div className="hidden lg:block text-left">
          <p className="text-[11px] text-[#4B5563] leading-none">
            {isLoggedIn ? `${t.hello}, ${userName}` : "Hello, Sign in"}
          </p>
          <p className="text-sm font-bold text-[#1F2937] flex items-center gap-1">
            {t.account} & Lists
            <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </p>
        </div>
        <div className="lg:hidden bg-[#DCFCE7] p-2 rounded-full text-[#15803D]">
          <User size={20} />
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-64 bg-white border border-[#F0FDF4] rounded-xl shadow-2xl p-4 z-50">
          {!isLoggedIn ? (
            <div className="text-center border-b border-[#F3F4F6] pb-4 mb-4">
             <a href="/auth">
               <button className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white py-2 rounded-lg font-bold text-sm shadow-md transition-all">
                Sign in
              </button>
             </a>
              <a href="/auth">
                <p className="text-[11px] mt-2 text-[#4B5563]">
                New customer? <span className="text-[#16A34A] font-bold cursor-pointer hover:underline">Start here.</span>
              </p>
              </a>
            </div>
          ) : (
            <div className="border-b border-[#F3F4F6] pb-2 mb-2 text-left">
              <p className="text-xs font-bold text-[#16A34A] px-2 mb-1">Your Account</p>
              <p className="text-sm font-medium text-[#1F2937] px-2 mb-2">{userName}</p>
            </div>
          )}

          <div className="space-y-1">
            <button 
              onClick={toggleLanguage}
              className="w-full flex items-center justify-between px-2 py-2 hover:bg-[#F0FDF4] rounded-lg text-sm text-[#1F2937] transition-colors"
            >
              <div className="flex items-center gap-3">
                <Globe size={16} className="text-[#9CA3AF]" />
                <span>Language</span>
              </div>
              <span className="text-[10px] font-bold text-[#15803D]">{lang === "en" ? "English" : "हिंदी"}</span>
            </button>
            
            <button className="w-full flex items-center gap-3 px-2 py-2 hover:bg-[#F0FDF4] rounded-lg text-sm text-[#1F2937]">
              <LayoutDashboard size={16} className="text-[#9CA3AF]" /> {t.dashboard}
            </button>
            <button className="w-full flex items-center gap-3 px-2 py-2 hover:bg-[#F0FDF4] rounded-lg text-sm text-[#1F2937]">
              <Package size={16} className="text-[#9CA3AF]" /> {t.orders}
            </button>

            {isLoggedIn && (
              <button className="w-full flex items-center gap-3 px-2 py-2 hover:bg-red-50 text-red-600 rounded-lg text-sm font-medium mt-2 border-t border-[#F3F4F6] pt-3 transition-colors">
                <LogOut size={16} /> {t.logout}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// --- Sub-Component: Side Menu (Mobile/Tablet) ---
function MobileMenu({ isOpen, setIsOpen, userName, isLoggedIn }) {
  const { lang, toggleLanguage, translations: t } = useTranslation();
  const navItems = [
    { name: "Home", icon: Home },
    { name: "Shop Categories", icon: ShoppingBag },
    { name: "My Orders", icon: Package },
    { name: "Settings", icon: Settings },
    { name: "About KisanMitra", icon: Info },
  ];

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-[#1F2937]/80 z-[60] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsOpen(false)}
      />

      <div className={`fixed top-0 left-0 h-full w-[280px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="bg-[#16A34A] text-white p-6 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="bg-[#4B5563] p-2 rounded-full"><User size={24} /></div>
            <button onClick={() => setIsOpen(false)} className="text-white/80"><X size={24} /></button>
          </div>
          <div>
            {isLoggedIn ? (
              <>
                <p className="text-lg font-bold">{t.hello}, {userName}</p>
                <p className="text-xs text-gray-400">{t.yourAccount}</p>
              </>
            ) : (
              <div className="flex items-center gap-2 text-lg font-bold">
               <a href="/auth"><button className="hover:text-[#BBF7D0]">Sign in</button></a>
                <span className="text-gray-500">•</span>
                <a href="/auth"><button className="hover:text-[#BBF7D0]">Sign up</button></a>
              </div>
            )}
          </div>
        </div>

        <nav className="py-4 overflow-y-auto h-[calc(100%-160px)]">
          <button onClick={toggleLanguage} className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#F9FAFB] border-b border-[#F3F4F6]">
            <div className="flex items-center gap-4">
              <Globe size={20} className="text-[#16A34A]" />
              <span className="font-medium">Language</span>
            </div>
            <span className="text-xs font-bold text-[#16A34A]">{lang === "en" ? "हिन्दी" : "English"}</span>
          </button>

          <div className="px-6 py-4 text-xs font-bold text-[#4B5563] uppercase tracking-wider">{t.mainMenu}</div>
          {navItems.map((item) => (
            <button key={item.name} className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#F9FAFB] text-[#1F2937]" onClick={() => setIsOpen(false)}>
              <div className="flex items-center gap-4">
                <item.icon size={20} className="text-[#9CA3AF]" />
                <span className="font-medium">{item.name}</span>
              </div>
              <ChevronRight size={16} className="text-[#9CA3AF]" />
            </button>
          ))}
          {isLoggedIn && (
            <>
              <hr className="my-2 border-[#F3F4F6]" />
              <button className="w-full flex items-center gap-4 px-6 py-4 text-red-600 hover:bg-red-50 font-medium">
                <LogOut size={20} /> {t.signOut}
              </button>
            </>
          )}
        </nav>
      </div>
    </>
  );
}

// --- Main Component: Navbar ---
export function Navbar({ cartCount = 0, isLoggedIn = false, userName = "Rajesh" }) {
  const { lang, toggleLanguage, translations: t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full shadow-sm">
        {/* Top Header */}
       <div className="bg-white px-4 md:px-8 py-3 flex items-center justify-between gap-4 border-b border-[#F0FDF4]">
  
  <button className="md:hidden p-2 hover:bg-[#F0FDF4] rounded-xl transition-colors" onClick={() => setMobileMenuOpen(true)}>
    <Menu size={24} className="text-[#166534]" />
  </button>

  {/* Logo */}
  <div className="flex items-center gap-2 shrink-0 cursor-pointer">
    <div className="bg-[#16A34A] p-2 rounded-2xl text-white shadow-lg hidden sm:block shadow-[#BBF7D0]">
      <Leaf size={24} />
    </div>
    <a href="/">
      <span className="text-2xl font-black text-[#166534] tracking-tight">
        {t.KisanMitra}
      </span>
    </a>
  </div>

  {/* ✅ ADD THIS LINE */}
  <SearchBar />

  {/* Right Side */}
  <div className="flex items-center gap-2 sm:gap-4">

       <button
        onClick={toggleLanguage}
        className="hidden md:flex items-center gap-1 px-2 py-1 border border-[#BBF7D0] rounded-lg text-xs font-bold text-[#15803D] hover:bg-[#F0FDF4] transition-all"
        >
       <Globe size={16} />
       {lang === "en" ? "हिन्दी" : "ENG"}
</button>

            <AccountDropdown isLoggedIn={isLoggedIn} userName={userName} />

            <button className="relative p-2 hover:bg-[#F0FDF4] rounded-xl transition-colors">
              <ShoppingCart size={24} className="text-[#166534]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#16A34A] text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Only */}
        <div className="md:hidden px-4 py-2 bg-white border-b border-[#F0FDF4]">
          <div className="flex items-center bg-[#F9FAFB] border border-[#BBF7D0] rounded-xl p-1">
            <input type="text" placeholder={t.search} className="flex-1 bg-transparent px-3 py-2 outline-none text-sm text-[#1F2937]" />
            <button className="bg-[#16A34A] p-2 rounded-xl text-white"><Search size={18} /></button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="bg-[#1F2937] text-white px-4 md:px-6 py-1.5 flex items-center gap-4 overflow-x-auto no-scrollbar whitespace-nowrap text-sm">
          <button className="flex items-center gap-1 font-bold hover:bg-[#4B5563] p-1 px-2 rounded transition-colors">
            <Menu size={18} /> {t.all}
          </button>
          {categories.map((cat) => (
            <a key={cat} href="#" className="hover:bg-[#4B5563] p-1 px-2 rounded transition-colors">{cat}</a>
          ))}
          <div className="flex-1" />
          <button className="bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg transition-all active:scale-95">
            {t.sell}
          </button>
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