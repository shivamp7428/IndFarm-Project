"use client";

import React, { useState, useRef, useEffect } from "react";
import {Leaf,ShoppingCart,Package,Search,MapPin,Menu,X,User,ChevronRight,ChevronDown,Home,ShoppingBag,Settings,LogOut,Info,LayoutDashboard,} from "lucide-react";
import { useTranslation } from "../context/LanguageContext";

const categories = ["Vegetables","Fruits","Grains","Dairy","Organic","Offers","Farmer Stories",];

function LanguageSelector() {
  const { lang, toggleLanguage } = useTranslation();
  
  return (
    <button
      className="hidden md:flex items-center gap-1 cursor-pointer hover:bg-[#1F2937] px-2 py-1 rounded font-bold text-sm transition-colors"
      onClick={toggleLanguage}
      aria-label="Toggle language"
    >
      <span className={lang === "en" ? "text-[#FFFFFF]" : "text-[#9CA3AF]"}>EN</span>
      <span className="text-[#4B5563] text-xs">|</span>
      <span className={lang === "hi" ? "text-[#FFFFFF]" : "text-[#9CA3AF]"}>हिंदी</span>
    </button>
  );
}

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
        <option>{t.navbar.all}</option>
        <option>Vegetables</option>
        <option>Fruits</option>
        <option>Grains</option>
        <option>Dairy</option>
      </select>

      <div className="h-6 w-px bg-[#BBF7D0] mx-1" aria-hidden="true" />

      <input
        type="text"
        placeholder={t.navbar.search}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1 bg-transparent px-3 py-1.5 outline-none text-sm text-[#1F2937]"
        aria-label="Search products"
      />

      <button
        onClick={() => setIsNearMe(!isNearMe)}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl transition-colors ${
          isNearMe
            ? "bg-[#16A34A] text-[#FFFFFF]"
            : "hover:bg-[#F0FDF4] text-[#15803D]"
        }`}
        aria-pressed={isNearMe}
      >
        <MapPin size={16} />
        <span className="text-xs font-bold whitespace-nowrap">{t.navbar.nearMe}</span>
      </button>

      <button
        className="bg-[#16A34A] p-2 rounded-xl text-[#FFFFFF] ml-1 hover:bg-[#15803D] transition-colors"
        aria-label="Search"
      >
        <Search size={18} />
      </button>
    </div>
  );
}

function MobileSearchBar() {
  const { translations: t } = useTranslation();
  return (
    <div className="md:hidden px-4 py-2 bg-[#FFFFFF] border-b border-[#F0FDF4]">
      <div className="flex items-center bg-[#F9FAFB] border border-[#BBF7D0] rounded-xl p-1">
        <input
          type="text"
          placeholder={t.navbar.search}
          className="flex-1 bg-transparent px-3 py-2 outline-none text-sm text-[#1F2937]"
        />
        <button className="bg-[#16A34A] p-2 rounded-xl text-[#FFFFFF]">
          <Search size={18} />
        </button>
      </div>
    </div>
  );
}

function AccountDropdown({ isLoggedIn, userName }) {
  const { translations: t } = useTranslation();
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
        className="flex items-center gap-2 p-2 hover:bg-[#F0FDF4] rounded-xl transition-colors"
      >
        <div className="bg-[#DCFCE7] p-2 rounded-full text-[#15803D]">
          <User size={20} />
        </div>
        <div className="hidden lg:block text-left">
          <p className="text-[10px] text-[#4B5563] uppercase font-bold leading-none">
            {t.navbar.account}
          </p>
          <p className="text-sm font-bold text-[#1F2937]">
            {isLoggedIn ? userName : "Login"}
          </p>
        </div>
        <ChevronDown
          size={14}
          className={`hidden lg:block transition-transform text-[#4B5563] ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-[#FFFFFF] border border-[#F0FDF4] rounded-2xl shadow-xl p-2 z-50">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#F0FDF4] rounded-xl text-sm font-medium transition-colors text-[#1F2937]">
            <LayoutDashboard size={18} /> {t.navbar.dashboard}
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-600 rounded-xl text-sm font-medium mt-1 transition-colors">
            <LogOut size={18} /> {t.navbar.logout}
          </button>
        </div>
      )}
    </div>
  );
}

function MobileMenu({ isOpen, setIsOpen, userName }) {
  const { translations: t } = useTranslation();
  const navItems = [
    { name: "Home", icon: Home },
    { name: "Shop Categories", icon: ShoppingBag },
    { name: "My Orders", icon: ShoppingBag },
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
        className={`fixed inset-0 bg-[#1F2937]/80 z-[60] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={`fixed top-0 left-0 h-full w-[280px] bg-[#FFFFFF] z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="bg-[#16A34A] text-[#FFFFFF] p-6 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="bg-[#F3F4F6] p-2 rounded-full text-[#1F2937]">
              <User size={24} />
            </div>
            <button onClick={() => setIsOpen(false)} className="text-[#FFFFFF]/80">
              <X size={24} />
            </button>
          </div>
          <div>
            <p className="text-lg font-bold">{t.navbar.hello}, {userName}</p>
            <p className="text-xs text-gray-300">{t.navbar.yourAccount}</p>
          </div>
        </div>

        <nav className="py-4 overflow-y-auto h-[calc(100%-160px)]">
          <div className="px-6 py-2 text-xs font-bold text-[#4B5563] uppercase tracking-wider">
            {t.navbar.mainMenu}
          </div>
          {navItems.map((item) => (
            <button
              key={item.name}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#F9FAFB] text-[#1F2937]"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-4">
                <item.icon size={20} className="text-[#9CA3AF]" />
                <span className="font-medium">{item.name}</span>
              </div>
              <ChevronRight size={16} className="text-[#9CA3AF]" />
            </button>
          ))}
          <hr className="my-2 border-[#F3F4F6]" />
          <button className="w-full flex items-center gap-4 px-6 py-4 text-red-600 hover:bg-red-50 font-medium">
            <LogOut size={20} /> {t.navbar.signOut}
          </button>
        </nav>
      </div>
    </>
  );
}

export function Navbar({ cartCount = 3, isLoggedIn = true, userName = "Rajesh", setView }) {
  const { lang, toggleLanguage, translations: t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full shadow-sm">
        <div className="bg-[#FFFFFF] px-4 md:px-8 py-3 flex items-center justify-between gap-4 border-b border-[#F0FDF4]">
          <button className="md:hidden p-2 hover:bg-[#F0FDF4] rounded-xl transition-colors" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={24} className="text-[#166534]" />
          </button>

        <div 
         className="flex items-center gap-2 shrink-0 cursor-pointer"
         onClick={() => setView('home')} 
         >
         <div className="bg-[#16A34A] p-2 rounded-2xl text-[#FFFFFF] shadow-lg shadow-[#BBF7D0]">
           <Leaf size={24} />
         </div>
         <span className="text-2xl font-black text-[#166534] tracking-tight hidden sm:block">
           KisanMitra
         </span>
         </div>

          <SearchBar />

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={toggleLanguage}
              className="md:hidden px-2 py-1 border border-[#BBF7D0] rounded-lg text-xs font-bold text-[#15803D] hover:bg-[#F0FDF4]"
            >
              {lang === "en" ? "हिंदी" : "EN"}
            </button>

            <button className="hidden xl:flex flex-col items-center p-2 hover:bg-[#F0FDF4] rounded-xl transition-colors">
              <span className="text-[10px] text-[#4B5563] font-bold uppercase">{t.navbar.orders}</span>
              <Package size={22} className="text-[#15803D]" />
            </button>

            <button className="relative p-2 hover:bg-[#F0FDF4] rounded-xl transition-colors">
              <ShoppingCart size={24} className="text-[#166534]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#16A34A] text-[#FFFFFF] text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center ring-2 ring-[#FFFFFF]">
                  {cartCount}
                </span>
              )}
            </button>

            <AccountDropdown isLoggedIn={isLoggedIn} userName={userName} />
          </div>
        </div>

        <MobileSearchBar />

        <div className="bg-[#1F2937] text-[#FFFFFF] px-4 md:px-6 py-1.5 flex items-center gap-4 overflow-x-auto no-scrollbar whitespace-nowrap text-sm">
          <button className="flex items-center gap-1 font-bold hover:bg-[#4B5563] p-1 px-2 rounded transition-colors">
            <Menu size={18} /> {t.navbar.all}
          </button>

          {categories.map((cat) => (
            <a key={cat} href="#" className="hover:bg-[#4B5563] p-1 px-2 rounded transition-colors">
              {cat}
            </a>
          ))}

          <div className="flex-1" />
          <LanguageSelector />
          <button className="bg-[#16A34A] hover:bg-[#15803D] text-[#FFFFFF] text-xs font-bold px-4 py-1.5 rounded-full shadow-lg transition-all active:scale-95">
            {t.navbar.sell}
          </button>
        </div>
      </nav>

      <MobileMenu isOpen={mobileMenuOpen} setIsOpen={setMobileMenuOpen} userName={userName} />
    </>
  );
}