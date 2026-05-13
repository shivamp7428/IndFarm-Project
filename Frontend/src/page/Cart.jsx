"use client";

import React, { useState, useEffect } from "react";
import { 
  ShoppingCart, Trash2, Plus, Minus, ArrowRight, 
  ShoppingBag, ShieldCheck, Truck 
} from "lucide-react";
import { useTranslation } from "../context/LanguageContext";
import { useNavigate } from 'react-router-dom';


const CartPage = () => {
  const { translations: t } = useTranslation();
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Auth state
  const [loading, setLoading] = useState(true);
const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (token) {
      setIsLoggedIn(true);
      
      const savedCart = localStorage.getItem("cart");
      
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      } else {
        setCartItems([]);
      }
    } else {
      setIsLoggedIn(false);
    }
    
    setLoading(false);
  }, []);

 const updateQuantity = (id, delta) => {
    const updatedCart = cartItems.map(item => 
      item._id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // LocalStorage update
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // LocalStorage update
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 500 || subtotal === 0 ? 0 : 40;
  const total = subtotal + deliveryFee;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400 uppercase tracking-widest">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="bg-white border-b border-slate-100 pt-8 pb-6">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <ShoppingCart className="text-emerald-600" size={32} />
            {t.myCart || "Shopping Cart"}
          </h1>
          <p className="text-slate-500 font-medium mt-1">{t.cartSubtitle || "Review your items and proceed to checkout"}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8">
        {!isLoggedIn ? (
          /* NO LOGGED IN VIEW */
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-16 text-center shadow-sm">
            <div className="bg-emerald-50 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 text-emerald-600">
               <ShoppingBag size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">{t.emptyCartTitle || "Your cart is empty"}</h2>
            <p className="text-slate-500 max-w-sm mx-auto mb-8 font-medium">
              {t.loginPrompt || "Looks like you haven't signed in yet. Log in to see your saved items."}
            </p>
            <a href="/auth">
              <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center gap-3 mx-auto uppercase text-sm tracking-widest">
                {t.loginButton || "Login to Continue"} <ArrowRight size={18} />
              </button>
            </a>
          </div>
        ) : (
          /* LOGGED IN VIEW */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div key={item._id || item.id} className="bg-white border border-slate-100 rounded-3xl p-4 flex gap-4 items-center shadow-sm hover:shadow-md transition-shadow">
                    <img src={item.image} alt={item.name} className="w-24 h-24 rounded-2xl object-cover bg-slate-50 shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-black text-slate-800 text-lg leading-tight">{item.name}</h3>
                      <p className="text-emerald-600 font-bold">₹{item.price} / {item.unit}</p>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center bg-slate-100 rounded-xl p-1">
                          <button onClick={() => updateQuantity(item._id, -1)} className="p-1.5 hover:bg-white rounded-lg transition-all text-slate-500"><Minus size={14} /></button>
                          <span className="px-4 font-black text-slate-800 text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item._id, 1)} className="p-1.5 hover:bg-white rounded-lg transition-all text-slate-500"><Plus size={14} /></button>
                        </div>
                        <button onClick={() => removeItem(item._id)} className="text-red-400 hover:text-red-600 p-2 transition-colors"><Trash2 size={20} /></button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400 font-bold">
                  {t.noItemsInCart || "Your cart is empty. Add fresh produce!"}
                </div>
              )}
            </div>

            {/* SUMMARY CARD */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-slate-100 rounded-[2rem] p-6 sticky top-24 shadow-sm">
                <h3 className="text-xl font-black text-slate-900 mb-6">{t.orderSummary || "Order Summary"}</h3>
                <div className="space-y-4 mb-6 text-sm font-bold">
                  <div className="flex justify-between text-slate-500">
                    <span>{t.subtotal || "Subtotal"}</span> <span className="text-slate-800">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>{t.deliveryFee || "Delivery Fee"}</span>
                    <span className={deliveryFee === 0 ? "text-emerald-600" : "text-slate-800"}>
                      {deliveryFee === 0 ? t.free || "FREE" : `₹${deliveryFee}`}
                    </span>
                  </div>
                  <div className="h-px bg-slate-100 w-full" />
                  <div className="flex justify-between text-xl font-black text-slate-900">
                    <span>{t.total || "Total"}</span> <span>₹{total}</span>
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/marketplace')} // Yeh line add karein
                  disabled={cartItems.length === 0} 
                 className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 disabled:bg-slate-200 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-100 mb-4"
                >
               {t.checkout || "Proceed to Checkout"}
              </button>

                <div className="space-y-3 opacity-60">
                   <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                    <ShieldCheck size={16} className="text-emerald-500" /> Secure Payment
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                    <Truck size={16} className="text-emerald-500" /> Free delivery above ₹500
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;