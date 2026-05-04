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
    name: "Lakshmi Narayanan",
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
    name: "Savitri Devi",
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

{/* Product Card*/}
<section className="max-w-[1500px] mx-auto px-4 py-8 bg-gray-100">
  <div className="flex justify-between items-baseline mb-6 px-1">
    <h2 className="text-xl font-bold tracking-tight text-gray-900">
      {t.all} {t.products}
    </h2>
    <a href="/marketplace" className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline">
      {t.ViewAll}
    </a>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
    {ALL_PRODUCTS(t).map((product) => (
      <Link
        key={product.id}
        to={`/detail/${product.id}`}
        state={{ product: product }}
        className="bg-white flex flex-col h-[320px] p-4 shadow-none hover:shadow-md transition-shadow duration-200"
      >
        <div className="h-[40px] mb-3 overflow-hidden">
          <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight">
            {product.name}
          </h3>
        </div>

        <div className="relative w-full h-[250px] bg-white flex items-center justify-center overflow-hidden">
          <img
            src={product.img}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://media.istockphoto.com/id/2182219687/photo/online-advertising-concepts-to-target-customers-influencer-marketing-social-media.webp?a=1&b=1&s=612x612&w=0&k=20&c=DwRxJVvzERqtg5oDpv_1v7zjNolIdcjcbA7pjNSlkhk=";
            }}
          />
        </div>
      </Link>
    ))}
  </div>
</section>

{/*FARMERS Card */}
<section className="max-w-[1500px] mx-auto px-4 py-8 bg-gray-100">
  <div className="flex justify-between items-baseline mb-6 px-1">
    <h2 className="text-xl font-bold tracking-tight text-gray-900">
      {t.topFarmers}
    </h2>
    <a href="/farmers" className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline">
      {t.MeetAllFarmers}
    </a>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
    {TOP_FARMERS(t).map((farmer) => (
      <Link
        key={farmer.id}
        to={`/farmer-profile/${farmer.id}`}
        state={{ farmer }}
        className="bg-white flex flex-col h-[320px] p-4 shadow-none hover:shadow-md transition-shadow duration-200"
      >
        <div className="h-[45px] mb-3 overflow-hidden">
          <h3 className="text-sm font-bold text-gray-900 line-clamp-1 leading-tight">
            {farmer.name}
          </h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
            {farmer.farmName}
          </p>
        </div>

        <div className="relative w-full h-[200px] bg-white flex items-center justify-center overflow-hidden">
          <img
            src={farmer.img}
            alt={farmer.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://media.istockphoto.com/id/512830984/photo/icon-man-on-a-white-background-3d-render.webp?a=1&b=1&s=612x612&w=0&k=20&c=r6Sx3TDUH8ERT43UvzRwFgo_VyD4WWjxNGrHCSos_68=";
            }}
          />
        </div>
      </Link>
    ))}
  </div>
</section>
{/* AMAZON STYLE FARMER STORIES SECTION */}
<section className="bg-gray-100 py-10">
  <div className="max-w-[1500px] mx-auto px-4">
    {/* Clean, Sharp White Card Container */}
    <div className="bg-white p-8 md:p-12 flex flex-col lg:flex-row items-center gap-12">
      
      {/* Left Content: Clean & Bold */}
      <div className="flex-1 space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
          {t.farmerStories} — <span className="text-[#c45500]">{t.verifiedFarmer}</span>
        </h2>
        
        <p className="text-lg text-gray-700 leading-snug max-w-xl">
          Every purchase helps a local farmer from Bhopal grow their business. 100% of the price goes directly to them.
        </p>

        <div className="pt-4">
          <a 
            href="/farmerplace" 
            className="inline-block bg-black border border-[#FCD200] text-white px-8 py-2.5 text-sm font-medium hover:bg-black/85 shadow-sm transition-all"
          >
            {t.viewAll} {t.farmer}
          </a>
          <p className="text-xs text-gray-500 mt-2 italic">*Supporting local agriculture since 2026</p>
        </div>
      </div>

      {/* Right Content: Clean Image Grid (No Offset, No Rounding) */}
      <div className="flex-1 grid grid-cols-2 gap-6 w-full items-center">
        <div className="h-72 overflow-hidden">
          <img 
            src="https://plus.unsplash.com/premium_photo-1682092792260-1b7cd1674a74?q=80&w=687&auto=format&fit=crop" 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" 
            alt="Farmer" 
          />
        </div>
        <div className="h-72 overflow-hidden mt-20">
          <img 
            src="https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=400" 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" 
            alt="Farmer" 
          />
        </div>
      </div>
    </div>
  </div>
</section>
    </div>
  );
}