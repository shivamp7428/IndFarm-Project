"use client";

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapPin, Star, Users, Package, ArrowLeft } from "lucide-react";
import { useTranslation } from "../context/LanguageContext";

export default function FarmerProfile() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { translations: t } = useTranslation();
  
  const farmer = state?.farmer;

  const DEFAULT_FARM_IMAGE = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600";

  const farmCover = farmer?.farmImage && farmer.farmImage.trim() !== ""
    ? farmer.farmImage
    : DEFAULT_FARM_IMAGE;

  // Reviews State
  const [reviews, setReviews] = useState([
    { id: 1, name: "Rahul Sharma", rating: 5, comment: "Very fresh vegetables. Delivery was on time.", date: "2 days ago" },
    { id: 2, name: "Priya Patel", rating: 4, comment: "Good quality products. Farmer is very responsive.", date: "1 week ago" }
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
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-emerald-700 transition-colors"
        >
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
      {/* Cover Image */}
      <div className="relative h-[280px] md:h-[360px] w-full overflow-hidden">
        <img src={farmCover} alt="Farm Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/50" />
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 relative">
        {/* Profile Picture & Back Button Area */}
        <div className="-mt-16 md:-mt-20 flex items-end justify-between md:justify-start gap-6">
          <div className="relative">
            {/* Desktop Back Button (Left of Image) */}
            <button 
              onClick={() => navigate(-1)}
              className="absolute -left-4 top-1/2 -translate-x-full -translate-y-1/2 bg-white p-3 rounded-full shadow-xl border border-gray-100 text-gray-700 hover:text-emerald-600 hover:scale-110 transition-all active:scale-90 hidden md:flex items-center justify-center"
              title={t.back || "Back"}
            >
              <ArrowLeft size={24} />
            </button>

            <img
              src={farmer.img}
              alt={farmer.name}
              className="w-32 h-32 md:w-40 md:h-40 rounded-3xl border-4 border-white shadow-2xl object-cover bg-white"
            />
          </div>

          {/* Mobile Back Button */}
          <button 
            onClick={() => navigate(-1)}
            className="md:hidden bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-gray-100 text-gray-800 mb-2 active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>
        </div>

        <div className="mt-6 grid md:grid-cols-12 gap-10">
          {/* LEFT SIDE - NAME & BIO */}
          <div className="md:col-span-7">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{farmer.name}</h1>
            <p className="text-emerald-600 font-semibold text-xl mt-1">{farmer.farmName}</p>

            <div className="flex items-center gap-2 mt-4 text-gray-600">
              <MapPin size={20} className="text-emerald-600" />
              <span className="font-medium">{farmer.location}</span>
            </div>

            <div className="mt-8">
              <h3 className="uppercase text-xs tracking-widest font-semibold text-gray-400 mb-3">
                {t.aboutFarmer || "About Farmer"}
              </h3>
              <p className="text-gray-700 leading-relaxed text-[17px]">
                {farmer.about || t.defaultFarmerBio || "Passionate farmer delivering fresh organic produce directly to customers."}
              </p>
            </div>

            <button className="mt-8 bg-black hover:bg-gray-900 text-white px-8 py-3.5 rounded-2xl font-semibold text-lg shadow-md w-full md:w-auto transition-all active:scale-95">
              {t.contactFarmer || "Contact Farmer"}
            </button>
          </div>

          {/* RIGHT SIDE - STATS & RATING SLIDER */}
          <div className="md:col-span-5 bg-gray-50 border border-gray-100 p-8 rounded-[2.5rem] shadow-sm">
            <div className="space-y-8">
              
              {/* Horizontal Stats Row */}
              <div className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                    <Package size={22} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900 leading-none">{farmer.products?.length || 0}</p>
                    <p className="text-gray-400 text-xs mt-1">{t.products || "Products"}</p>
                  </div>
                </div>

                <div className="h-10 w-[1px] bg-gray-200" />

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                    <Users size={22} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900 leading-none">5K+</p>
                    <p className="text-gray-400 text-xs mt-1">{t.customer || "Customers"}</p>
                  </div>
                </div>
              </div>

              {/* RATING SLIDER UI */}
              <div className="pt-4">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="uppercase text-[10px] tracking-widest font-bold text-gray-400 mb-1">
                      {t.trustScore || "Trust Rating"}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-gray-900">{farmer.stars || "4.8"}</span>
                      <span className="text-gray-400 font-bold">/ 5</span>
                    </div>
                  </div>
                  <div className="flex text-amber-400 mb-1">
                    <Star size={20} fill="currentColor" />
                  </div>
                </div>

                {/* The Slider Track */}
                <div className="relative h-4 flex items-center">
                  <div className="absolute w-full h-2 bg-gray-200 rounded-full" />
                  <div 
                    className="absolute h-2 bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full z-10"
                    style={{ width: `${((farmer.stars || 4.8) / 5) * 100}%` }}
                  />
                  <div 
                    className="absolute w-5 h-5 bg-white border-2 border-emerald-600 rounded-full shadow-lg z-20"
                    style={{ left: `calc(${((farmer.stars || 4.8) / 5) * 100}% - 10px)` }}
                  />

                  <div className="absolute w-full flex justify-between px-1 top-6">
                    {[0, 1, 2, 3, 4, 5].map((tick) => (
                      <div key={tick} className="flex flex-col items-center">
                        <div className="h-1.5 w-[1px] bg-gray-300" />
                        <span className="text-[10px] font-bold text-gray-400 mt-1">{tick}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-12 bg-white/50 border border-white p-4 rounded-2xl">
                  <p className="text-xs text-gray-500 text-center italic">
                    {t.ratingStatsText?.replace("{rating}", farmer.stars || "4.8") || `This farmer has maintained a ${farmer.stars || "4.8"} star rating.`}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 mt-20">
        <h2 className="text-3xl font-bold mb-8">{t.products || "Products"}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {(farmer.products || []).map((item, i) => (
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
      </div>

      {/* Reviews Section */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 mt-24">
        <h2 className="text-3xl font-bold mb-8">{t.reviews || "Reviews"}</h2>

        {/* Add Review Form */}
        <div className="bg-gray-50 border border-gray-100 rounded-[2.5rem] p-6 md:p-10 mb-12 shadow-sm">
          <h3 className="font-bold text-xl mb-6 text-gray-900">{t.rateExperience || "Rate Your Experience"}</h3>
          
          <div className="max-w-md mb-10">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-sm font-bold text-emerald-600 mb-1">{t.yourRating || "Your Rating"}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-gray-900">{newReview.rating}</span>
                  <span className="text-gray-400 font-bold">/ 5</span>
                </div>
              </div>
              <Star size={24} className={newReview.rating >= 4 ? "text-amber-400 fill-amber-400" : "text-gray-300"} />
            </div>

            <div className="relative h-6 flex items-center group">
              <div className="absolute w-full h-2 bg-gray-200 rounded-full" />
              <div 
                className="absolute h-2 bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full z-10 pointer-events-none"
                style={{ width: `${(newReview.rating / 5) * 100}%` }}
              />
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={newReview.rating}
                onChange={(e) => setNewReview(prev => ({...prev, rating: parseFloat(e.target.value)}))}
                className="absolute w-full h-6 opacity-0 cursor-pointer z-30"
              />
              <div 
                className="absolute w-6 h-6 bg-white border-2 border-emerald-600 rounded-full shadow-md z-20 pointer-events-none group-active:scale-125 transition-transform"
                style={{ left: `calc(${(newReview.rating / 5) * 100}% - 12px)` }}
              />
              <div className="absolute w-full flex justify-between px-1 top-8">
                {[0, 1, 2, 3, 4, 5].map((num) => (
                  <span key={num} className="text-[11px] font-black text-gray-400">{num}</span>
                ))}
              </div>
            </div>
          </div>

          <textarea
            value={newReview.comment}
            onChange={(e) => setNewReview(prev => ({...prev, comment: e.target.value}))}
            placeholder={t.writeYourReview || "Tell others about the quality..."}
            className="w-full h-32 p-5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-gray-700 mb-6 bg-white"
          />

          <button
            onClick={handleSubmitReview}
            className="bg-black hover:bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 shadow-lg flex items-center gap-2"
          >
            {t.submitReview || "Post Review"}
          </button>
        </div>

        {/* Reviews List */}
        <div className="space-y-8">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-8">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{review.name}</div>
                <div className="text-sm text-gray-500">{review.date}</div>
              </div>
              <div className="flex text-amber-400 mt-1">
                {[...Array(5)].map((_, i) => <span key={i}>{i < review.rating ? "★" : "☆"}</span>)}
              </div>
              <p className="mt-3 text-gray-700 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}