"use client";

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ShoppingCart, Heart, Minus, Plus, ChevronLeft } from "lucide-react";
import { useTranslation } from "../context/LanguageContext";

const ALL_PRODUCTS = (t) => [
  { 
    id: 1, 
    name: "Organic Spinach", 
    price: "30", 
    farmName: "Bhopal Bio-Farm", 
    farmerName: "Ram Singh",
    farmerImg: "https://images.unsplash.com/photo-1595033531232-3919939d7ff8?q=80&w=200",
    img: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=400", 
    rating: 3.8,
    quantity:1
  },
  { 
    id: 2, 
    name: "Red Onions", 
    price: "45", 
    farmName: "Patel Mandi", 
    farmerName: "Arjun Patel",
    farmerImg: "https://images.unsplash.com/photo-1541577141970-eebc83ebe30e?q=80&w=200",
    img: "https://images.unsplash.com/photo-1508747703725-719777637510?q=80&w=400", 
    rating: 2.5,
    quantity:7

  },
  { 
    id: 3, 
    name: "Fresh Garlic", 
    price: "180", 
    farmName: "Indore Roots", 
    farmerName: "Sanjay Mishra",
    farmerImg: "https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=200",
    img: "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?q=80&w=400", 
    rating: 4.9,
    quantity:3

  },
  { 
    id: 4, 
    name: "Arhar Dal", 
    price: "140", 
    farmName: "Vidisha Grains", 
    farmerName: "Lakshmi Bai",
    farmerImg: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=200",
    img: "https://images.unsplash.com/photo-1612869538502-b5baa439abd7?w=600&auto=format&fit=crop&q=60", 
    rating: 2.7,
    quantity:2

  },
  { 
    id: 5, 
    name: "Cow Ghee", 
    price: "650", 
    farmName: "Sanchi Dairy", 
    farmerName: "Vikram Yadav",
    farmerImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
    img: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?q=80&w=400", 
    rating: 5.0,
    quantity:7

  },
  { 
    id: 6, 
    name: "Local Tomatoes", 
    price: "25", 
    farmName: "Raisen Greens", 
    farmerName: "Deepak Kushwaha",
    farmerImg: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
    img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=400", 
    rating: 4.2,
    quantity:9

  },
  { 
    id: 7, 
    name: "Green Chillies", 
    price: "60", 
    farmName: "Kisan Colony", 
    farmerName: "Om Prakash",
    farmerImg: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200",
    img: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?q=80&w=400", 
    rating: 4.4,
    quantity:2

  },
  { 
    id: 8, 
    name: "Cauliflower", 
    price: "40", 
    farmName: "Sehore Valley", 
    farmerName: "Sunita Verma",
    farmerImg: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200",
    img: "https://images.unsplash.com/photo-1566842600175-97dca489844f?q=80&w=400", 
    rating: 4.6,
    quantity:5

  },
  { 
    id: 9, 
    name: "Ginger", 
    price: "120", 
    farmName: "Valley Roots", 
    farmerName: "Rahul Sharma",
    farmerImg: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200",
    img: "https://images.unsplash.com/photo-1599940859674-a7fef05b94ae?q=80&w=400", 
    rating: 4.7,
    quantity:4

  },
  { 
    id: 10, 
    name: "Mustard Oil", 
    price: "190", 
    farmName: "Pure Press", 
    farmerName: "Harpreet Singh",
    farmerImg: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200",
    img: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=400", 
    rating: 4.8,
    quantity:8

  },
  { 
    id: 11, 
    name: "Basmati Rice", 
    price: "90", 
    farmName: "Punjab Gold", 
    farmerName: "Gurnam Singh",
    farmerImg: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=200",
    img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=400", 
    rating: 4.9,
    quantity:10

  },
  { 
    id: 12, 
    name: "Watermelon", 
    price: "350", 
    farmName: "Wild Nectar", 
    farmerName: "Anita Deshmukh",
    farmerImg: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
    img: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=400", 
    rating: 4.3,
    quantity:2

  },
  { 
    id: 13, 
    name: "Potatoes", 
    price: "20", 
    farmName: "Malwa Farms", 
    farmerName: "Kailash Chand",
    farmerImg: "https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=200",
    img: "https://images.unsplash.com/photo-1635774855536-9728f2610245?q=80&w=400", 
    rating: 4.1,
    quantity:9

  },
  { 
    id: 14, 
    name: "Turmeric", 
    price: "240", 
    farmName: "Spice Route", 
    farmerName: "Rajeshwari Devi",
    farmerImg: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?q=80&w=200",
    img: "https://images.unsplash.com/photo-1606951444141-e5533feb55be?w=600&auto=format&fit=crop&q=60", 
    rating: 4.9,
    quantity:8

  },
  { 
    id: 15, 
    name: "Pomegranate", 
    price: "160", 
    farmName: "Nashik Orchards", 
    farmerName: "Vijay Kulkarni",
    farmerImg: "https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=200",
    img: "https://images.unsplash.com/photo-1601767770428-265b2c67780c?w=600&auto=format&fit=crop&q=60", 
    rating: 3.7,
    quantity:5

  },
];

export default function Detail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { translations: t } = useTranslation();
  
  const product = state?.product;

  const [qty, setQty] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
    setQty(1); 
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-10 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{t.productNotFound || "Product Not Found"}</h1>
        <button 
          onClick={() => navigate("/marketplace")}
          className="bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-emerald-700 transition"
        >
          {t.backToMarketplace || "Back to Marketplace"}
        </button>
      </div>
    );
  }

  const sellingPrice = Number(product.price);
  const originalPrice = Math.round(sellingPrice * 1.25);
  const rating = product.rating || 4.5;
  const fullStars = Math.floor(rating);
  const decimal = rating % 1;

  const farmerImage = product.farmerImg && product.farmerImg.trim() !== ""
    ? product.farmerImg
    : "https://media.istockphoto.com/id/512830984/photo/icon-man-on-a-white-background-3d-render.webp?a=1&b=1&s=612x612&w=0&k=20&c=r6Sx3TDUH8ERT43UvzRwFgo_VyD4WWjxNGrHCSos_68=";

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
      
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 mb-8 transition-colors group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition" />
        <span className="font-medium">{t.backToProducts || "Back to products"}</span>
      </button>

      <div className="grid lg:grid-cols-2 gap-12 items-start mb-24">
        {/* Product Image */}
        <div className="group relative rounded-[2rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
          <img src={product.img} alt={product.name} className="w-full aspect-square object-cover" />
          <button className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-md">
            <Heart className="text-gray-400 hover:text-red-500 transition-colors" size={24} />
          </button>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-6 p-2 pr-6 w-fit rounded-full bg-gray-50 border border-gray-100">
            <img 
              src={farmerImage}
              alt={product.farmerName || "Farmer"}
              className="w-7 h-7 rounded-full object-cover ring-2 ring-white shadow"
              onError={(e) => {
                 e.target.src = "https://media.istockphoto.com/id/512830984/photo/icon-man-on-a-white-background-3d-render.webp?a=1&b=1&s=612x612&w=0&k=20&c=r6Sx3TDUH8ERT43UvzRwFgo_VyD4WWjxNGrHCSos_68=";
                }} 
            />
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase">{t.sourcedFrom || "Sourced From"}</p>
              <p className="font-bold text-gray-800 leading-none">{product.farmerName || t.localFarmer || "Local Farmer"}</p>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex text-2xl text-amber-400">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="relative">
                  <span className="text-gray-200">★</span>
                  <span className="absolute top-0 left-0 overflow-hidden text-amber-400" style={{ width: index < fullStars ? "100%" : index === fullStars ? `${decimal * 100}%` : "0%" }}>★</span>
                </div>
              ))}
            </div>
            <span className="text-sm text-gray-600 font-bold">{rating} / 5.0 {t.rating || "Rating"}</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4 mb-8">
            <span className="text-5xl font-black text-emerald-600">₹{product.price}<span className="text-lg text-gray-400 font-medium ml-1">/{t.kg || "kg"}</span></span>
            <div className="flex flex-col">
              <span className="line-through text-gray-400 text-xl">₹{originalPrice}</span>
              <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-xs font-bold w-fit">
                {t.save}!
              </span>
            </div>
          </div>

          {/* Quantity Selector with Logic */}
          <div className="flex flex-col gap-3 mb-8">
            <div className="flex justify-between items-center max-w-[200px]">
               <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">{t.selectQuantity || "Select Quantity"}</label>
               <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${product.quantity > 3 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                 {product.quantity} {t.available || "Available"}
               </span>
            </div>
            
            <div className="flex items-center gap-6 bg-gray-50 w-fit p-2 rounded-2xl border border-gray-100">
              <button 
                onClick={() => setQty(qty > 1 ? qty - 1 : 1)} 
                className="w-12 h-12 flex items-center justify-center bg-white border rounded-xl hover:bg-gray-100 transition shadow-sm active:scale-90"
              >
                <Minus size={18} />
              </button>
              
              <span className="text-2xl font-bold w-8 text-center">{qty}</span>
              
              <button 
                onClick={() => { if (qty < product.quantity) setQty(qty + 1); }} 
                disabled={qty >= product.quantity}
                className={`w-12 h-12 flex items-center justify-center border rounded-xl transition shadow-sm active:scale-90 
                  ${qty >= product.quantity ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-100"}`}
              >
                <Plus size={18} />
              </button>
            </div>
            {qty >= product.quantity && (
              <p className="text-red-500 text-xs font-medium animate-pulse">{t.maxLimitReached || "Max stock limit reached"}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex-[2] bg-black text-white py-5 rounded-2xl font-bold text-lg hover:bg-gray-900 transition-all shadow-xl uppercase tracking-wider active:scale-95">
              {t.buyNow || "Buy Now"}
            </button>
            <button className="flex-1 border-2 border-gray-900 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all active:scale-95">
              <ShoppingCart size={20} /> {t.addToCart || "Cart"}
            </button>
          </div>
        </div>
      </div>

      {/* Recommended Section */}
      <div className="border-t border-gray-100 pt-16">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl font-semibold tracking-tighter text-gray-900">
            {t.recommendedForYou || "Recommended"} <span className="text-emerald-600">{t.forYou || "For You"}</span>
          </h2>
          <Link to="/marketplace" className="text-sm font-medium flex items-center gap-2 hover:gap-3 transition-all group">
            {t.viewAll || "View All"}
            <span className="text-xl group-hover:translate-x-1 transition">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8">
          {ALL_PRODUCTS(t)
            .filter((p) => p.id !== product.id)
            .slice(0, 5)
            .map((item) => {
              const relRating = item.rating || 4.5;
              const relFullStars = Math.floor(relRating);
              const relDecimal = relRating % 1;

              return (
                <div key={item.id} className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-emerald-200 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full hover:-translate-y-3">
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <img src={item.img} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" alt={item.name} />
                    <button className="absolute top-2 right-2 p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-md hover:scale-110 transition-all">
                      <Heart size={20} className={item.id % 3 === 0 ? "fill-red-500 text-red-500" : "text-gray-400"} />
                    </button>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <img src={item.farmerImg || farmerImage} 
                        className="w-7 h-7 rounded-full object-cover" 
                        alt={item.farmerName}
                        onError={(e) => {
                        e.target.src = "https://media.istockphoto.com/id/512830984/photo/icon-man-on-a-white-background-3d-render.webp?a=1&b=1&s=612x612&w=0&k=20&c=r6Sx3TDUH8ERT43UvzRwFgo_VyD4WWjxNGrHCSos_68=";
                       }} 
                       />
                      <div className="text-xs">
                        <p className="font-medium text-gray-700 truncate">{item.farmerName}</p>
                        <p className="text-gray-400 text-[10px]">{item.farmName}</p>
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg leading-tight text-gray-900 line-clamp-2 mb-4 group-hover:text-emerald-700 transition-colors">{item.name}</h3>
                    
                    <div className="flex items-center gap-1.5 mb-5 text-amber-400">
                      <div className="flex text-lg">
                        {[...Array(5)].map((_, idx) => (
                          <div key={idx} className="relative">
                            <span className="text-gray-200">★</span>
                            <span className="absolute top-0 left-0 overflow-hidden text-amber-400" style={{ width: idx < relFullStars ? '100%' : idx === relFullStars ? `${relDecimal * 100}%` : '0%' }}>★</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-auto">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold tracking-tighter text-gray-900">₹{item.price}</span>
                        <span className="text-sm text-gray-400">/{t.kg || "kg"}</span>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button className="flex-1 bg-black hover:bg-black/90 text-white py-3 rounded-2xl text-xs font-semibold transition-all shadow-md">
                        {t.addToCart || "Add to Cart"}
                      </button>
                      <Link 
                        to={`/detail/${item.id}`} 
                        state={{ product: item }}
                        className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-xl hover:border-emerald-600 hover:bg-emerald-50 transition-all"
                      >
                        <ChevronLeft size={16} className="rotate-180" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}