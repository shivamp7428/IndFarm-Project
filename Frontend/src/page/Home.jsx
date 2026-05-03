import React, { useState, useEffect } from 'react';
import { Search, MapPin, Zap, Star, ShieldCheck, Truck, ChevronRight, ChevronLeft, ShoppingCart, Clock, ArrowRight, Heart, Store, PhoneCall,CheckCircle2, Award, Leaf, Sprout, ShoppingBag, Eye} from 'lucide-react';
import { useTranslation } from "../context/LanguageContext";
import { Link } from "react-router-dom";

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
 const TOP_FARMERS = (t) => [
  {
    id: 1,
    name: "Rajesh Kumar",
    farmName: "Green Valley Organics",
    location: "Nashik, Maharashtra",
    type: "Organic Vegetables",
    rank: "Expert",
    stars: 4.9,
    img: "https://plus.unsplash.com/premium_photo-1682092016074-b136e1acb26e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmFybWVyJTIwaW5kaWF8ZW58MHx8MHx8fDA%3D",
    farmImage:""
  },
  {
    id: 2,
    name: "Savitri Devi",
    farmName: "Shakti Mahila Farms",
    location: "Karnal, Haryana",
    type: "Premium Grains",
    rank: "Verified",
    stars: 4.8,
    img: "https://plus.unsplash.com/premium_photo-1682092047778-a5ebda1804e8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZmFybWVyJTIwaW5kaWF8ZW58MHx8MHx8fDA%3D",
    farmImage:""
  },
  {
    id: 3,
    name: "Anand Patel",
    farmName: "Patel Fruit Orchards",
    location: "Junagadh, Gujarat",
    type: "Export Mangoes",
    rank: "Gold",
    stars: 5.0,
    img: "https://plus.unsplash.com/premium_photo-1682092610151-f91e1afa5f60?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGZhcm1lciUyMGluZGlhfGVufDB8fDB8fHww",
    farmImage:""
  },
  {
    id: 4,
    name: "Harpreet Singh",
    farmName: "Golden Harvest",
    location: "Ludhiana, Punjab",
    type: "Wheat & Mustard",
    rank: "Expert",
    stars: 4.7,
    img: "https://media.istockphoto.com/id/2216111434/photo/farmers-discussing-while-harvesting-in-organic-farm.webp?a=1&b=1&s=612x612&w=0&k=20&c=C8ZsVlKiIGdVJ7UaZyU9ksMJh4G62N8tc72zASMG06E=",
    farmImage:""
  },
  {
    id: 5,
    name: "Manoj Tiwari",
    farmName: "Kisan Kranti Farms",
    location: "Bhopal, MP",
    type: "Pulses & Legumes",
    rank: "Gold",
    stars: 4.9,
    img: "https://plus.unsplash.com/premium_photo-1682092093534-c16eb3ea13c8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fGZhcm1lciUyMGluZGlhfGVufDB8fDB8fHww",
    farmImage:""
  },
  {
    id: 6,
    name: "Lakshmi Narayanan",
    farmName: "Cauvery Delta Agri",
    location: "Thanjavur, Tamil Nadu",
    type: "Premium Ponni Rice",
    rank: "Verified",
    stars: 4.8,
    img: "https://images.unsplash.com/photo-1570966087241-20278ac27b2c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDZ8fGZhcm1lciUyMGluZGlhfGVufDB8fDB8fHww",
    farmImage:""
  },
  {
    id: 7,
    name: "Vikram Rathore",
    farmName: "Desert Bloom",
    location: "Jodhpur, Rajasthan",
    type: "Spices & Dry Fruits",
    rank: "Expert",
    stars: 4.6,
    img: "https://plus.unsplash.com/premium_photo-1678344150632-c653afccd6aa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTV8fGZhcm1lciUyMGluZGlhfGVufDB8fDB8fHww",
    farmImage:""
  },
  {
    id: 8,
    name: "Siddharth Das",
    farmName: "Assam Tea Estates",
    location: "Silchar, Assam",
    type: "Organic Tea Leaves",
    rank: "Gold",
    stars: 4.9,
    img: "https://plus.unsplash.com/premium_photo-1722682238873-648b1264ca06?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzl8fGZhcm1lciUyMGluZGlhfGVufDB8fDB8fHww",
    farmImage:""
  },
  {
    id: 9,
    name: "Prakash Hegde",
    farmName: "Western Ghats Nut Farm",
    location: "Sirsi, Karnataka",
    type: "Areca Nut & Pepper",
    rank: "Verified",
    stars: 4.7,
    img: "https://plus.unsplash.com/premium_photo-1769868326927-7bfa3d77610e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTE5fHxmYXJtZXIlMjBpbmRpYXxlbnwwfHwwfHx8MA%3D%3D",
    farmImage:""
  },
  {
    id: 10,
    name: "Arjun Reddy",
    farmName: "Reddy Hydroponics",
    location: "Hyderabad, Telangana",
    type: "Modern Leafy Greens",
    rank: "Expert",
    stars: 5.0,
    img: "https://images.unsplash.com/photo-1606203452426-f5af98e6f96e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTE0fHxmYXJtZXIlMjBpbmRpYXxlbnwwfHwwfHx8MA%3D%3D",
    farmImage:""
  }
];


export default function Home() {
  const { translations: t } = useTranslation();


  if (!t) return <div className="h-screen flex items-center justify-center font-black text-green-600 animate-pulse uppercase tracking-widest">{t?.loading || "Loading KisanMitra..."}</div>;

  const carouselSlides = [
    {
      bg: "from-emerald-800 to-teal-700",
      title: t.organicSelection || "100% Organic Essentials",
      sub: t.pesticideFree || "Chemical-free, nutrient-rich produce",
      tag: t.certified || "Certified",
      img: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200",
    },
    {
      bg: "from-orange-700 to-red-600",
      title: t.seasonSpecial,
      sub: t.saveMore,
      tag: t.flashSale,
      img: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=1200",
    },
   {
      bg: "from-green-900 to-green-600",
      title: t.harvestFresh,
      sub: t.directFromFarm,
      tag: t.newArrival,
      img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200",
    },
    {
      bg: "from-blue-900 to-indigo-800",
      title: t.bulkOrders || "Wholesale & Bulk Supply",
      sub: t.hotelRetail || "Best rates for Hotels, Cafes & Retailers",
      tag: t.b2b || "B2B Deals",
      img: "https://plus.unsplash.com/premium_photo-1682092796955-536268eebc4c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      bg: "from-yellow-700 to-amber-900",
      title: t.smartFarming || "Smart Farming Tools",
      sub: t.modernAgri || "Seeds, Fertilizers & Irrigation Tech",
      tag: t.bestPrice || "Best Price",
      img: "https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=1200",
    }
  ];

  // Carousel loop
const [currentSlide, setCurrentSlide] = useState(0);
useEffect(() => {
  const timer = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  }, 4000); 
  return () => clearInterval(timer);
}, [carouselSlides.length]);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
<section className="relative h-[300px] md:h-[350px] overflow-hidden group">
  {carouselSlides.map((slide, index) => (
    <div 
      key={index}
      className={`absolute inset-0 transition-all duration-1000 bg-gradient-to-br ${slide.bg} flex items-center 
        ${index === currentSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'}`}
    >
      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-8">
        
        {/* Left Content - Scaled down for smaller height */}
        <div className={`text-white z-10 space-y-4 ${index === currentSlide ? 'animate-in fade-in slide-in-from-left duration-1000' : ''}`}>
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
            <Zap size={14} className="text-yellow-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">{slide.tag}</span>
          </div>
          
          {/* Reduced text size from 8xl to 5xl */}
          <h1 className="text-4xl md:text-5xl font-black leading-tight drop-shadow-xl">
            {slide.title}
          </h1>
          
          {/* Reduced paragraph size */}
          <p className="text-lg opacity-80 font-medium italic border-l-4 border-white/40 pl-4 line-clamp-1">
            {slide.sub}
          </p>
          
          <div className="flex gap-4 pt-2">
            <a href="/marketplace" className="bg-white text-green-900 px-8 py-3 rounded-full font-black hover:shadow-xl transition-all flex items-center gap-2 text-sm hover:-translate-y-0.5">
              {t.buyNow} <ArrowRight size={18} />
            </a>
          </div>
        </div>

        {/* Right Visual - Scaled down height */}
        <div className="hidden lg:block relative">
          <div className="absolute -inset-4 border-2 border-white/10 rounded-[2.5rem] animate-pulse"></div>
          <img 
            src={slide.img} 
            className="w-full h-[250px] object-cover rounded-[2rem] shadow-[-10px_10px_30px_rgba(0,0,0,0.3)] border-4 border-white/10" 
            alt="Farm Visual" 
          />
        </div>
      </div>
    </div>
  ))}

  {/* Navigation Dots - Moved closer to bottom */}
  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-3 z-30">
    {carouselSlides.map((_, i) => (
      <button 
        key={i} 
        onClick={() => setCurrentSlide(i)} 
        className={`h-2 rounded-full transition-all duration-500 
          ${currentSlide === i ? 'w-10 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'}`} 
      />
    ))}
  </div>
</section>


{/* PREMIUM PRODUCT CARD */}
<section className="max-w-7xl mx-auto px-4 md:px-6 py-16 bg-white">
  <div className="flex justify-between items-end mb-12">
    <h2 className="md:text-4xl text-2xl font-semibold tracking-tighter text-gray-900">
      {t.all} {t.products}
    </h2>
    <a href="/marketplace" className="text-sm font-medium flex items-center gap-2 hover:gap-3 transition-all group">
      {t.ViewAll}
      <span className="text-xl group-hover:translate-x-1 transition">→</span>
    </a>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 lg:gap-8">
    {ALL_PRODUCTS(t).map((product) => {
      const rating = product.rating || 4.5;
      const fullStars = Math.floor(rating);
      const decimal = rating % 1;

      // Farmer Image with Fallback
      const farmerImage = product.farmerImg && product.farmerImg.trim() !== "" 
        ? product.farmerImg 
        : "https://media.istockphoto.com/id/512830984/photo/icon-man-on-a-white-background-3d-render.webp?a=1&b=1&s=612x612&w=0&k=20&c=r6Sx3TDUH8ERT43UvzRwFgo_VyD4WWjxNGrHCSos_68=";

      return (
        <div 
          key={product.id} 
          className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-emerald-200 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full hover:-translate-y-3"
        >
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-gray-50">
            <img 
              src={product.img} 
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" 
              alt={product.name} 
            />
            {/* Wishlist */}
            <button className="absolute top-2 right-2 p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-md hover:bg-white hover:scale-110 active:scale-95 transition-all">
              <Heart 
                size={20} 
                className={`transition-all ${product.id % 3 === 0 ? "fill-red-500 text-red-500" : "text-gray-400 group-hover:text-gray-600"}`} 
              />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 flex-1 flex flex-col">
            {/* Farm & Farmer */}
            <div className="flex items-center gap-2 mb-3">
              <img 
                src={farmerImage}
                alt={product.farmerName || "Farmer"}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-white shadow"
                onError={(e) => {
                  e.target.src = "https://media.istockphoto.com/id/512830984/photo/icon-man-on-a-white-background-3d-render.webp?a=1&b=1&s=612x612&w=0&k=20&c=r6Sx3TDUH8ERT43UvzRwFgo_VyD4WWjxNGrHCSos_68=";
                }}
              />
              <div className="text-xs">
                <p className="font-medium text-gray-700 truncate">{product.farmerName}</p>
                <p className="text-gray-400 text-[10px]">{product.farmName}</p>
              </div>
            </div>

            {/* Product Name */}
            <h3 className="font-semibold text-lg leading-tight text-gray-900 line-clamp-2 mb-4 group-hover:text-emerald-700 transition-colors">
              {product.name}
            </h3>

            {/* Star Rating */}
            <div className="flex items-center gap-1.5 mb-5">
              <div className="flex text-2xl text-amber-400">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="relative">
                    <span className="text-gray-200">★</span>
                    <span 
                      className="absolute top-0 left-0 overflow-hidden text-amber-400"
                      style={{ 
                        width: index < fullStars 
                          ? '100%' 
                          : index === fullStars 
                            ? `${decimal * 100}%` 
                            : '0%' 
                      }}
                    >
                      ★
                    </span>
                  </div>
                ))}
              </div>
              <span className="text-sm font-medium text-gray-600 ml-2">{rating}/5.0 {t.rating || "Rating"}</span>
            </div>

            {/* Price */}
            <div className="mt-auto">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tighter text-gray-900">
                  ₹{product.price}
                </span>
                <span className="text-sm text-gray-400">/{t.kg || "kg"}</span>
                <span className="text-gray-400 line-through text-sm ml-auto">
                  ₹{Math.round(product.price * 1.25)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button 
                className="flex-1 bg-black hover:bg-black/80 text-white py-3.5 rounded-2xl text-sm font-semibold tracking-wider transition-all active:scale-[0.97] shadow-md"
              >
                 {t.addToCart || "Add to Cart"}
              </button>

              <Link 
                to={`/detail/${product.id}`}
                state={{ product: product }}
                className="w-12 h-12 flex items-center justify-center border border-gray-200 rounded-2xl hover:border-emerald-600 hover:bg-emerald-50 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Bottom Accent Line */}
          <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-400 w-0 group-hover:w-full transition-all duration-700" />
        </div>
      );
    })}
  </div>
</section>


{/* PREMIUM TOP FARMERS SECTION */}
<section className="max-w-7xl mx-auto px-4 md:px-6 py-16 bg-white">
  <div>
    <div className='flex justify-between items-end mb-12'>
      <h2 className="md:text-4xl text-2xl font-semibold tracking-tighter text-gray-900">
       {t.topFarmers}
    </h2>
    <a href="/farmers" className="text-sm font-medium flex items-center gap-2 hover:gap-3 transition-all group">
      {t.MeetAllFarmers}
      <span className="text-xl group-hover:translate-x-1 transition">→</span>
    </a>
    </div>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 lg:gap-8">
    {TOP_FARMERS(t).map((farmer) => (
      <div 
        key={farmer.id} 
        className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-emerald-200 hover:shadow-2xl transition-all duration-500 flex flex-col h-full hover:-translate-y-2"
      >
        {/* Image Section */}
        <div className="relative h-64 overflow-hidden">
          <img 
            src={farmer.img} 
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" 
            alt={farmer.name} 
          />
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-[17px] font-semibold text-gray-900 group-hover:text-emerald-800 transition-colors leading-tight">
            {farmer.name}
          </h3>
          
          <p className="text-gray-500  font-medium mt-1 mb-4">{farmer.farmName}</p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-5">
            <div className="flex text-amber-500 text-2xl leading-none">
              ★★★★☆
            </div>
            <span className="font-semibold text-gray-700">{farmer.stars}</span>
          </div>

          {/* Details */}
          <div className="space-y-3 mb-6 text-sm">
            <div className="flex items-center gap-3 text-gray-600">
              <MapPin size={18} className="text-gray-400" />
              <span>{farmer.location}</span>
            </div>
            
            <div className="flex items-center gap-3 text-gray-600">
              <span className="text-emerald-600 font-semibold">🌱</span>
              <span>{farmer.type}</span>
            </div>
          </div>

         <Link
          to={`/farmer-profile/${farmer.id}`}
          state={{ farmer }}
          >
          <button className="mt-auto w-full bg-black hover:bg-black/80 text-white py-4 rounded-2xl font-semibold text-sm tracking-wider transition-all">
          {t.viewfarmprofile}
        </button>
        </Link>
        </div>

        {/* Premium Hover Accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600 scale-x-0 group-hover:scale-x-100 transition-all duration-700" />
      </div>
    ))}
  </div>
</section>

      {/* 3. FARMER STORIES / STORIES SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white rounded-[4rem] p-12 md:p-20 shadow-xl shadow-slate-200/50 border border-gray-50 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <h2 className="text-5xl font-black text-gray-900 leading-tight">
              {t.farmerStories} <br/> <span className="text-green-600 underline decoration-wavy decoration-green-200">{t.verifiedFarmer}</span>
            </h2>
            <p className="text-xl text-gray-500 font-medium leading-relaxed">
              Every purchase helps a local farmer from Bhopal grow their business. 100% of the price goes directly to them.
            </p>
            <a href="/farmers" className="inline-flex items-center gap-3 bg-gray-900 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-black/80 transition-all group">
              {t.viewAll} {t.farmer} <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </a>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-6 w-full">
            <img src="https://plus.unsplash.com/premium_photo-1682092792260-1b7cd1674a74?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="w-full h-64 object-cover rounded-[2.5rem] shadow-lg" alt="Farmer" />
            <img src="https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=400" className="w-full h-64 object-cover rounded-[2.5rem] shadow-lg mt-12" alt="Farmer" />
          </div>
        </div>
      </section>

    </div>
  );
}