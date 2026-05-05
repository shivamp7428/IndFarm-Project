"use client";

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapPin, Star, Users, Package, ArrowLeft, BookOpen, ShoppingBasket } from "lucide-react";
import { useTranslation } from "../context/LanguageContext";

export default function FarmerProfile() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { translations: t } = useTranslation();
  
  const farmer = state?.farmer;
  const [activeTab, setActiveTab] = useState("products");

  const DEFAULT_FARM_IMAGE = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600";
  const farmCover = farmer?.farmImage && farmer.farmImage.trim() !== "" ? farmer.farmImage : DEFAULT_FARM_IMAGE;

  const [reviews, setReviews] = useState([
    { id: 1, name: "Rahul Sharma", rating: 5, comment: "Very fresh vegetables.", date: "2 days ago" },
    { id: 2, name: "Priya Patel", rating: 4, comment: "Good quality products.", date: "1 week ago" }
  ]);

  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!farmer) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-10 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{t.farmerNotFound || "Farmer Not Found"}</h1>
        <p className="text-gray-500 mb-6">{t.pleaseSelectFarmer || "Please go back and select a farmer."}</p>
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-emerald-700 transition-colors">
          <ArrowLeft size={20} /> {t.back || "Back"}
        </button>
      </div>
    );
  }

  const handleSubmitReview = () => {
    if (newReview.comment.trim() === "") return;
    const review = { 
        id: Date.now(), 
        name: t.you || "You", 
        rating: newReview.rating, 
        comment: newReview.comment, 
        date: t.justNow || "Just now" 
    };
    setReviews([review, ...reviews]);
    setNewReview({ rating: 5, comment: "" });
  };

  return (
    <section className="bg-white min-h-screen pb-20">
      <div className="relative h-[280px] md:h-[360px] w-full overflow-hidden">
        <img src={farmCover} alt="Farm Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/50" />
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 relative">
        <div className="-mt-16 md:-mt-20 flex items-end justify-between md:justify-start gap-6">
          <div className="relative">
            <button 
              onClick={() => navigate(-1)}
              className="absolute -left-4 top-1/2 -translate-x-full -translate-y-1/2 bg-white p-3 rounded-full shadow-xl border border-gray-100 text-gray-700 hover:text-emerald-600 hover:scale-110 transition-all hidden md:flex"
              title={t.back || "Back"}
            >
              <ArrowLeft size={24} />
            </button>
            <img src={farmer.img} alt={farmer.name} className="w-32 h-32 md:w-40 md:h-40 rounded-3xl border-4 border-white shadow-2xl object-cover bg-white" />
          </div>
          <button onClick={() => navigate(-1)} className="md:hidden bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-gray-100 text-gray-800 mb-2">
            <ArrowLeft size={20} />
          </button>
        </div>

        <div className="mt-6 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-7">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{farmer.name}</h1>
            <p className="text-emerald-600 font-semibold text-xl mt-1">{farmer.farmName}</p>
            <div className="flex items-center gap-2 mt-4 text-gray-600">
              <MapPin size={20} className="text-emerald-600" />
              <span className="font-medium">{farmer.location}</span>
            </div>
            <button className="mt-8 bg-black hover:bg-gray-900 text-white px-8 py-3.5 rounded-2xl font-semibold text-lg shadow-md w-full md:w-auto transition-all active:scale-95">
              {t.contactFarmer || "Contact Farmer"}
            </button>
          </div>

          <div className="md:col-span-5 bg-gray-50 border border-gray-100 p-8 rounded-[2.5rem] shadow-sm">
            <div className="space-y-8">
              <div className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600"><Package size={22} /></div>
                  <div>
                    <p className="text-xl font-bold text-gray-900 leading-none">{farmer.products?.length || 0}</p>
                    <p className="text-gray-400 text-xs mt-1">{t.products || "Products"}</p>
                  </div>
                </div>
                <div className="h-10 w-[1px] bg-gray-200" />
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600"><Users size={22} /></div>
                  <div>
                    <p className="text-xl font-bold text-gray-900 leading-none">5K+</p>
                    <p className="text-gray-400 text-xs mt-1">{t.customer || "Customers"}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="uppercase text-[10px] tracking-widest font-bold text-gray-400 mb-1">{t.trustScore || "Trust Rating"}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-gray-900">{farmer.stars || "4.8"}</span>
                      <span className="text-gray-400 font-bold">/ 5</span>
                    </div>
                  </div>
                  <div className="flex text-amber-400 mb-1"><Star size={20} fill="currentColor" /></div>
                </div>
                <div className="relative h-4 flex items-center">
                  <div className="absolute w-full h-2 bg-gray-200 rounded-full" />
                  <div className="absolute h-2 bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full z-10" style={{ width: `${((farmer.stars || 4.8) / 5) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 mt-12 border-b border-gray-100">
        <div className="flex justify-between items-center w-full">
          {[ 
            { id: "products", label: t.products || "Products", icon: Package },
            { id: "story", label: t.story || "Story", icon: BookOpen },
            { id: "reviews", label: t.reviews || "Reviews", icon: Star }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 md:flex-none justify-center items-center gap-2 pb-4 text-sm md:text-lg font-bold transition-all border-b-4 ${
                activeTab === tab.id ? "border-emerald-600 text-emerald-600" : "border-transparent text-gray-400"
              }`}
            >
              <tab.icon size={18} />
              <span className="truncate">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 mt-12">
        {activeTab === "products" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {(!farmer.products || farmer.products.length === 0) ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <ShoppingBasket size={80} strokeWidth={1} className="mb-4 opacity-20" />
                <h3 className="text-2xl font-semibold">{t.noProductsText || "No Products Available"}</h3>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {farmer.products.map((item, i) => (
                  <div key={i} className="group bg-white rounded-3xl overflow-hidden border hover:shadow-xl transition-all">
                    <div className="aspect-square overflow-hidden">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition" />
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-emerald-600 font-bold text-xl mt-1">₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "story" && (
          <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-bold mb-6">{t.aboutFarmer || "About Farmer"}</h2>
            <p className="text-gray-700 leading-relaxed text-xl">
              {farmer.about || t.defaultFarmerBio || "Passionate farmer delivering fresh organic produce."}
            </p>
            <div className="mt-8 p-8 bg-emerald-50 rounded-[2rem] border border-emerald-100 italic text-emerald-800 text-lg">
              "{t.farmQuote || "Growing with love, serving with honesty. Our farm is committed to bringing the purest nature to your dining table."}"
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gray-50 border border-gray-100 rounded-[2.5rem] p-6 md:p-10 mb-12 shadow-sm">
              <h3 className="font-bold text-xl mb-6 text-gray-900">{t.rateExperience || "Rate Your Experience"}</h3>
              <div className="max-w-md mb-10">
                <p className="text-sm font-bold text-emerald-600 mb-1">{t.yourRating || "Your Rating"}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-gray-900">{newReview.rating}</span>
                  <span className="text-gray-400 font-bold">/ 5</span>
                </div>
                <input
                  type="range" min="0" max="5" step="0.5" value={newReview.rating}
                  onChange={(e) => setNewReview(prev => ({...prev, rating: parseFloat(e.target.value)}))}
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-emerald-600 mt-4"
                />
              </div>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({...prev, comment: e.target.value}))}
                placeholder={t.writeYourReview || "Tell others about the quality..."}
                className="w-full h-32 p-5 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all mb-6"
              />
              <button onClick={handleSubmitReview} className="bg-black text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-all">
                {t.submitReview || "Post Review"}
              </button>
            </div>

            <div className="space-y-8">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-8">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{review.name === "You" ? (t.you || "You") : review.name}</div>
                    <div className="text-sm text-gray-500">{review.date === "Just now" ? (t.justNow || "Just now") : review.date}</div>
                  </div>
                  <div className="flex text-amber-400 mt-1">
                    {[...Array(5)].map((_, i) => <span key={i}>{i < review.rating ? "★" : "☆"}</span>)}
                  </div>
                  <p className="mt-3 text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}