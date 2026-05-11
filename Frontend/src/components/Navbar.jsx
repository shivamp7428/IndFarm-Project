"use client";
import React, { useState, useRef, useEffect } from "react";
import { Leaf, ShoppingCart, Package, Search, MapPin, Menu, X, User, ChevronRight, ChevronDown, Home, ShoppingBag, Settings, LogOut, Info, LayoutDashboard, Globe, Bell, Truck, User2 } from "lucide-react";
import { useTranslation } from "../context/LanguageContext";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("JWT Decode Error:", e);
    return null;
  }
}


function CustomSelect() {
  const { translations: t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(t.all || "All");
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const options = [t.all, t.vegetables, t.fruits, t.grains, t.dairy];

  return (
    <div className="relative" ref={selectRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-slate-700 hover:text-emerald-600 transition-colors outline-none"
      >
        {selected}
        <ChevronDown size={12} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-emerald-100 rounded-xl shadow-xl z-[120] overflow-hidden py-1">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { setSelected(opt); setIsOpen(false); }}
              className="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SearchBar() {
  const { translations: t } = useTranslation();
  const [isNearMe, setIsNearMe] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex-1 max-w-3xl hidden md:flex items-center bg-slate-50 border border-emerald-100 rounded-2xl p-1 focus-within:ring-4 ring-emerald-500/10 focus-within:border-emerald-500 transition-all duration-300 mx-6">
      <CustomSelect />
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
      <button className="bg-slate-900 p-2.5 rounded-xl text-white ml-1 hover:bg-black/80 transition-all">
        <Search size={18} strokeWidth={2.5} />
      </button>
    </div>
  );
}

function AccountDropdown() {
   const { translations: t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const { lang, toggleLanguage} = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const userId = user?._id || user?.id;
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //Profile Image
  const [profileImage, setProfileImage] = useState("");
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) return;
        const decoded = jwtDecode(token);
        const id = decoded.id || decoded._id;
        const farmerUrl = `http://localhost:5000/api/auth/${id}`;

        const res = await axios.get(farmerUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfileImage(
          res.data?.img ||
          res.data?.profileImage ||
          res.data?.profileImageUrl ||
          res.data?.farmer?.img ||
          res.data?.farmer?.profileImage ||
          res.data?.farmer?.profileImageUrl ||
          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
        );

      } catch (error) {
        console.log("Profile fetch error:", error);
      }
    };

    fetchUser();

  }, []);

// CHECK DELIVERY PARTNER
const [deliveryPartner,setDeliveryPartner] =
useState(null);
useEffect(()=>{
   const checkDeliveryPartner = async()=>{
      try{
         if(!isAuthenticated ||user?.role === "farmer") return;
         const { data } = await axios.get(
            `http://localhost:5000/api/delivery/status/${userId}`,
            {
               withCredentials:true
            }
         );

         if(data.success){
            setDeliveryPartner(
               data.deliveryPartner
            );
         }
      }catch(error){
         console.log(error);
      }
   }
   checkDeliveryPartner();
},[isAuthenticated,userId,user]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded-2xl transition-all"
      >
      <div className="lg:hidden h-12 w-12 rounded-full overflow-hidden  border border-black  flex items-center justify-center">
  
     {profileImage ? (
       <img src={profileImage} alt="Profile" className="w-full h-full object-cover" onError={(e) => {   e.target.style.display = "https://media.istockphoto.com/id/512830984/photo/icon-man-on-a-white-background-3d-render.webp?a=1&b=1&s=612x612&w=0&k=20&c=r6Sx3TDUH8ERT43UvzRwFgo_VyD4WWjxNGrHCSos_68="; }}/>
     ) : (
       <User2 size={24} className="text-black" />
      )}

       </div>

        {/* DESKTOP */}
        <div className="hidden lg:block text-left">
          <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">
            {isAuthenticated
              ? `Hello, ${user?.fullName?.split(" ")[0] || "User"}`
              : `Hello,${t.signin}`}
          </p>

          <p className="text-sm font-black text-slate-800 flex items-center gap-1">
            {t.account}
            <ChevronDown
              size={14}
              className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </p>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] right-0 w-64 bg-white border border-slate-100 rounded-3xl shadow-2xl p-4 z-[110]">
          
          {!isAuthenticated ? (
            <div className="text-center border-b border-slate-50 pb-4 mb-4">
              <a href="/auth" className="block w-full">
                <button className="w-full bg-emerald-600 text-white py-2.5 rounded-xl font-bold text-sm">
                  {t.signin}
                </button>
              </a>
            </div>
          ) : (
            <div className="px-3 pb-2 mb-2 border-b border-slate-50">
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                Active Session
              </p>
            </div>
          )}

          {/* OPTIONS */}
          <div className="space-y-1">

           <button
            onClick={toggleLanguage}
            className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-600"
          >
            <div className="flex items-center gap-3">
              <Globe size={16} />
              <span>{t.language}</span>
            </div>

            <span className="text-[10px] font-black text-emerald-600">
              {lang === "en" ? "HI" : "EN"}
            </span>
          </button>
    {isAuthenticated && userId && (

<>
   {/* FARMER DASHBOARD */}

   {
      user?.role === "farmer" && (

      <a
         href={`/farmer-dashboard/${userId}`}
         className="block"
      >

         <button className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-600">

            <LayoutDashboard size={16} />

            Dashboard

         </button>

      </a>
   )}


   {
      user?.role !== "farmer" && (

      deliveryPartner ? (

         <a
            href={`/user-delivery-dashboard/${userId}/${deliveryPartner._id}`}
            className="block"
         >

            <button className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-600">

               <LayoutDashboard size={16} />

               Dashboard

            </button>

         </a>

      ) : (

         <a
            href={`/become-delivery-man/${userId}`}
            className="block"
         >

            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-sm font-bold transition-all text-slate-600">

               <Truck size={16} />

               Become Delivery Partner

            </button>

         </a>

      )
   )}

</>
)}
{isAuthenticated && (
  <a href={user?.role === "farmer" ? "/farmer/orders" : "/orders"} className="block lg:hidden">
    <button className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-600">
      <Package size={16} />
      {user?.role === "farmer" ? "Sales & Orders" : "My Orders"}
    </button>
  </a>
)}
            {/* LOGOUT */}
            {isAuthenticated && (
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 rounded-xl text-sm font-bold text-red-600"
              >
                <LogOut size={16} />
                {t.logout}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


function MobileMenu({ isOpen, setIsOpen }) {
  
  const { user, isAuthenticated, logout } = useAuth();   // Backend se user fetch
  
  const { lang, toggleLanguage, translations: t } = useTranslation();
  
  const userId = user?._id || user?.id;

  const navItems = [
    { name: t.home, icon: Home, link: "/" },
    { name: t.shopcategories, icon: ShoppingBag, link: "/categories" },
    ...(isAuthenticated && userId ? [
  {
    name: user?.role === "farmer" ? "Sales Orders" : t.myorders,
    icon: Package,
    link: user?.role === "farmer" 
      ? "/farmer/orders" 
      : "/orders",
  },
] : []),
    ...(isAuthenticated && userId ? [{
        name: t.dashboard,
        icon: LayoutDashboard,
        link: user?.role === "farmer" ? `/farmer-dashboard/${userId}` : `/user-dashboard/${userId}`,},
      ...(user?.role !== "farmer" ? [{
              name: "Become Delivery Man",
              icon: Truck,
              link: "/become-delivery-man",
            },
          ]
        : []),
    ]
  : []),
    
    { name: t.settings, icon: Settings, link: "/settings" },
    { name: t.aboutkisanmitra, icon: Info, link: "/about" },
  ];

  //profile Image


  const [profileImage, setProfileImage] = useState("");
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) return;
        const decoded = jwtDecode(token);
        const id = decoded.id || decoded._id;
        const farmerUrl = `http://localhost:5000/api/auth/${id}`;

        const res = await axios.get(farmerUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfileImage(
          res.data?.img ||
          res.data?.profileImage ||
          res.data?.profileImageUrl ||
          res.data?.farmer?.img ||
          res.data?.farmer?.profileImage ||
          res.data?.farmer?.profileImageUrl ||
          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
        );

      } catch (error) {
        console.log("Profile fetch error:", error);
      }
    };

    fetchUser();

  }, []);
  return (
    <>
      <div 
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[150] transition-opacity ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} 
        onClick={() => setIsOpen(false)} 
      />
      
      <div className={`fixed top-0 left-0 h-full w-[300px] bg-white z-[160] shadow-2xl transform transition-transform duration-500 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        <div className="bg-slate-900 text-white p-6 rounded-br-[2.5rem]">
          <div className="flex justify-between items-center mb-6">
            <div className=" h-12 w-12 rounded-full overflow-hidden shadow-lg border border-white  flex items-center justify-center">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" onError={(e) => {   e.target.style.display = "https://media.istockphoto.com/id/512830984/photo/icon-man-on-a-white-background-3d-render.webp?a=1&b=1&s=612x612&w=0&k=20&c=r6Sx3TDUH8ERT43UvzRwFgo_VyD4WWjxNGrHCSos_68="; }}/>
            ) : (
              <User2 size={24} className="text-white " />
              )}
            </div>
            <button onClick={() => setIsOpen(false)} className="h-10 w-10 flex items-center justify-center bg-white/10 rounded-xl">
              <X size={24} />
            </button>
          </div>
          
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">
            {isAuthenticated ? t.hello : t.welcome}
          </p>
          
          <a 
            href={isAuthenticated ? "/profile" : "/auth"} 
            onClick={() => setIsOpen(false)}
          >
            <p className="text-xl font-black">
              {isAuthenticated ? (user?.fullName || "User") : t.signin}
            </p>
          </a>
        </div>

        <nav className="py-6">
          {/* Language Toggle */}
          <button 
            onClick={toggleLanguage} 
            className="w-full flex items-center justify-between px-8 py-4 hover:bg-slate-50 border-b border-slate-50"
          >
            <div className="flex items-center gap-4">
              <Globe size={20} className="text-emerald-600" /> 
              <span className="font-bold text-slate-700 text-sm">{t.language}</span>
            </div>
            <span className="text-xs font-black text-emerald-600">
              {lang === "en" ? "हिन्दी" : "English"}
            </span>
          </button>

          {/* Navigation Items */}
          {navItems.map((item) => (
            <a href={item.link} key={item.name} onClick={() => setIsOpen(false)} className="block">
              <button className="w-full flex items-center justify-between px-8 py-4 hover:bg-slate-50 text-slate-700">
                <div className="flex items-center gap-4">
                  <item.icon size={20} className="text-slate-400" /> 
                  <span className="font-bold text-sm">{item.name}</span>
                </div>
                <ChevronRight size={16} className="text-slate-300" />
              </button>
            </a>
          ))}

          {/* Logout */}
          {isAuthenticated && (
            <button 
              onClick={logout} 
              className="w-full flex items-center gap-4 px-8 py-4 hover:bg-red-50 text-red-600 mt-2"
            >
              <LogOut size={20} /> 
              <span className="font-bold text-sm">{t.logout}</span>
            </button>
          )}
        </nav>
      </div>
    </>
  );
}


// MAIN NAVBAR 

export function Navbar({ cartCount = 0 }) {
  const { translations: t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [user, setUser] = useState(null);
  const { lang, toggleLanguage} = useTranslation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    let currentUser = null;

    if (userStr) {
      try {
        currentUser = JSON.parse(userStr);
      } catch (e) {
        console.error("User parse error");
      }
    }

    if (!currentUser && token) {
      const decoded = decodeJWT(token);
      if (decoded?.id) {
        currentUser = {
          id: decoded.id,
          role: decoded.role,
          fullName: "User"
        };
      }
    }

    if (currentUser && token) {
      setUser(currentUser);
      setIsLoggedIn(true);
      setUserName(currentUser.fullName || currentUser.name || "User");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setUserName("");
    window.location.href = "/";
  };

  return (
    <>
      <nav className="sticky top-0 z-[50] w-full bg-white/90 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-full mx-auto px-2 py-3 flex items-center justify-between">
          
          <button className="md:hidden p-2.5 bg-slate-100 rounded-xl text-slate-600" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={20} strokeWidth={2.5} />
          </button>

          <div className="flex items-center gap-2 shrink-0 cursor-pointer ml-2">
            <div className="bg-slate-900 p-2 rounded-2xl text-white shadow-xl shadow-slate-200">
              <Leaf size={20} fill="currentColor" />
            </div>
            <a href="/">
              <span className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter">
                {t.kisan}<span className="text-emerald-600">{t.mitra}</span>
              </span>
            </a>
          </div>

          <SearchBar />

          <div className="flex items-center gap-1 sm:gap-4 mr-2">
            <a href="/notification">
              <button className="relative p-2 text-slate-400 hover:text-black/90 hover:bg-emerald-50 rounded-xl transition-all">
                <Bell size={20} />
                <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              </button>
            </a>

            {/* Language Toggle*/}
            <button 
              onClick={toggleLanguage} 
              className="hidden md:flex items-center gap-2 px-2 py-1.5 border border-slate-100 rounded-xl text-[10px] font-black text-slate-600 hover:bg-emerald-50 transition-all uppercase tracking-widest"
            >
              <Globe size={14} strokeWidth={2.5} />
              {lang === "en" ? "हिन्दी" : "ENG"}
            </button>

            {user?.role === "farmer" ? (
  <a href="/farmer/orders" className="hidden lg:block">
    <button className="flex flex-col items-start px-2 py-1 hover:bg-slate-50 rounded-xl transition-all text-left">
      <span className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">
        Sales
      </span>
      <span className="text-sm font-black text-slate-800 tracking-tight">
        & Orders
      </span>
    </button>
  </a>
) : (
  <a href="/orders" className="hidden lg:block">
    <button className="flex flex-col items-start px-2 py-1 hover:bg-slate-50 rounded-xl transition-all text-left">
      <span className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">
        {t.return}
      </span>
      <span className="text-sm font-black text-slate-800 tracking-tight">
        & {t.order}
      </span>
    </button>
  </a>
)}

            <AccountDropdown/>

            <a href="/cart" className="block ml-1">
              <button className="relative p-3 bg-slate-900 text-white hover:bg-black/80 rounded-2xl transition-all shadow-lg shadow-slate-200">
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
        user={user}
        onLogout={handleLogout}
      />
    </>
  );
}