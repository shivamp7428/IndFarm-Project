import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Zap, Star, ShieldCheck, Truck, ChevronRight, ChevronLeft, ShoppingCart, Clock, ArrowRight, Heart, Store, PhoneCall, CheckCircle2, Award, Leaf, Sprout, ShoppingBag, Eye } from 'lucide-react';
import { useTranslation } from "../context/LanguageContext";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
    const { translations: t } = useTranslation();
    const navigate = useNavigate();

    const [realProducts, setRealProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    
    const [farmers, setFarmers] = useState([]);
    const [loadingFarmers, setLoadingFarmers] = useState(true);

    const loggedInUser = JSON.parse(localStorage.getItem("user")) || null;

    useEffect(() => {
        const fetchHomeProducts = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
                const data = res.data.data || [];
                setRealProducts(data.slice(0, 15));
            } catch (error) {
                console.error("Error fetching home products:", error);
            } finally {
                setLoadingProducts(false);
            }
        };

        const fetchFarmers = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/farmers`);
                if (res.data.success) {
                    setFarmers(res.data.farmers.slice(0, 10));
                }
            } catch (error) {
                console.error("Error fetching farmers:", error);
            } finally {
                setLoadingFarmers(false);
            }
        };

        fetchHomeProducts();
        fetchFarmers();
    }, []);

    // Navigation Logic
    const handleFarmerClick = (farmer) => {
        if (loggedInUser && loggedInUser.id === farmer._id) {
            navigate(`/farmer-dashboard/${farmer._id}`);
        } else {
            navigate(`/farmerProfile/${farmer._id}`, { state: { farmer } });
        }
    };

    const carouselSlides = [
        {
            bg: "from-emerald-800 to-teal-700",
            title: t?.organicSelection || "100% Organic Essentials",
            sub: t?.pesticideFree || "Chemical-free, nutrient-rich produce",
            tag: t?.certified || "Certified",
            img: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200",
        },
        {
            bg: "from-orange-700 to-red-600",
            title: t?.seasonSpecial,
            sub: t?.saveMore,
            tag: t?.flashSale,
            img: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=1200",
        },
        {
            bg: "from-green-900 to-green-600",
            title: t?.harvestFresh,
            sub: t?.directFromFarm,
            tag: t?.newArrival,
            img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200",
        },
        {
            bg: "from-blue-900 to-indigo-800",
            title: t?.bulkOrders || "Wholesale & Bulk Supply",
            sub: t?.hotelRetail || "Best rates for Hotels, Cafes & Retailers",
            tag: t?.b2b || "B2B Deals",
            img: "https://plus.unsplash.com/premium_photo-1682092796955-536268eebc4c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
            bg: "from-yellow-700 to-amber-900",
            title: t?.smartFarming || "Smart Farming Tools",
            sub: t?.modernAgri || "Seeds, Fertilizers & Irrigation Tech",
            tag: t?.bestPrice || "Best Price",
            img: "https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=1200",
        }
    ];

    const [currentSlide, setCurrentSlide] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [carouselSlides.length]);

    if (!t) return <div className="h-screen flex items-center justify-center font-black text-green-600 animate-pulse uppercase tracking-widest">Loading KisanMitra...</div>;

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Carousel Section */}
            <section className="relative h-[300px] md:h-[350px] overflow-hidden group">
                {carouselSlides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-all duration-1000 bg-gradient-to-br ${slide.bg} flex items-center 
                        ${index === currentSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'}`}
                    >
                        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-8">
                            <div className={`text-white z-10 space-y-4 ${index === currentSlide ? 'animate-in fade-in slide-in-from-left duration-1000' : ''}`}>
                                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
                                    <Zap size={14} className="text-yellow-400" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{slide.tag}</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black leading-tight drop-shadow-xl">{slide.title}</h1>
                                <p className="text-lg opacity-80 font-medium italic border-l-4 border-white/40 pl-4 line-clamp-1">{slide.sub}</p>
                                <div className="flex gap-4 pt-2">
                                    <a href="/marketplace" className="bg-white text-green-900 px-8 py-3 rounded-full font-black hover:shadow-xl transition-all flex items-center gap-2 text-sm hover:-translate-y-0.5">
                                        {t.buyNow} <ArrowRight size={18} />
                                    </a>
                                </div>
                            </div>
                            <div className="hidden lg:block relative">
                                <div className="absolute -inset-4 border-2 border-white/10 rounded-[2.5rem] animate-pulse"></div>
                                <img src={slide.img} className="w-full h-[250px] object-cover rounded-[2rem] shadow-[-10px_10px_30px_rgba(0,0,0,0.3)] border-4 border-white/10" alt="Farm Visual" />
                            </div>
                        </div>
                    </div>
                ))}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-3 z-30">
                    {carouselSlides.map((_, i) => (
                        <button key={i} onClick={() => setCurrentSlide(i)} className={`h-2 rounded-full transition-all duration-500 ${currentSlide === i ? 'w-10 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'}`} />
                    ))}
                </div>
            </section>

            {/* Products Section (Untouched UI) */}
            <section className="max-w-[1500px] mx-auto px-4 py-8 bg-gray-100">
                <div className="flex justify-between items-baseline mb-6 px-1">
                    <h2 className="text-xl font-bold tracking-tight text-gray-900">{t.all} {t.products}</h2>
                    <a href="/marketplace" className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline">{t.ViewAll}</a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                    {loadingProducts ? (
                        <div className="col-span-full py-10 text-center text-green-600 font-bold">Loading Products...</div>
                    ) : realProducts.length > 0 ? (
                        realProducts.map((product) => (
                            <Link key={product._id || product.id} to={`/detail/${product._id || product.id}`} state={{ product }} className="bg-white flex flex-col h-[320px] p-4 shadow-none hover:shadow-md transition-shadow duration-200">
                                <div className="h-[40px] mb-3 overflow-hidden">
                                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight">{product.name}</h3>
                                </div>
                                <div className="relative w-full h-[250px] bg-white flex items-center justify-center overflow-hidden">
                                    <img src={product.productImageUrl} alt={product.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = "https://media.istockphoto.com/id/2211020890/photo/businesswoman-doing-digital-marketing-and-online-advertising-to-target-customers-online-sales.webp?a=1&b=1&s=612x612&w=0&k=20&c=Z9a0Pl7tBfI4JebhhMptU43bpfmQQAt9eV_xtVctI2U="; }} />
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-10">No Products Available</div>
                    )}
                </div>
            </section>

           {/* Farmers Section (UI Maintained, Data from API) */}
<section className="max-w-[1500px] mx-auto px-4 py-8 bg-gray-100">
    <div className="flex justify-between items-baseline mb-6 px-1">
        <h2 className="text-xl font-bold tracking-tight text-gray-900">{t.topFarmers}</h2>
        <a href="/farmershub" className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline">
            {t.MeetAllFarmers}
        </a>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
        {loadingFarmers ? (
            <div className="col-span-full py-10 text-center text-green-600 font-bold">
                Loading Farmers...
            </div>
        ) : farmers.length > 0 ? (
            farmers.map((farmer) => (
                <div
                    key={farmer._id}
                    onClick={() => handleFarmerClick(farmer)}
                    className="bg-white flex flex-col h-[355px] p-4 shadow-none hover:shadow-md transition-shadow duration-200 cursor-pointer"
                >
                    {/* Name & Farm Name */}
                    <div className="h-[45px] mb-3 overflow-hidden">
                        <h3 className="text-sm font-bold text-gray-900 line-clamp-1 leading-tight">
                            {farmer.fullName}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                            {farmer.farmName}
                        </p>
                    </div>

                    {/* Increased Image Height - Same as FarmerHub */}
                    <div className="relative w-full h-[260px] bg-white flex items-center justify-center overflow-hidden">
                        <img
                            src={farmer.img}
                            alt={farmer.fullName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = "https://media.istockphoto.com/id/512830984/photo/icon-man-on-a-white-background-3d-render.webp?a=1&b=1&s=612x612&w=0&k=20&c=r6Sx3TDUH8ERT43UvzRwFgo_VyD4WWjxNGrHCSos_68=";
                            }}
                        />
                    </div>
                </div>
            ))
        ) : (
            <div className="col-span-full text-center py-10">No Farmers Found</div>
        )}
    </div>
</section>

            {/* Farmer Stories Section */}
            <section className="bg-gray-100 py-10">
                <div className="max-w-[1500px] mx-auto px-4">
                    <div className="bg-white p-8 md:p-12 flex flex-col lg:flex-row items-center gap-12">
                        <div className="flex-1 space-y-6">
                            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                                {t.farmerStories} — <span className="text-[#c45500]">{t.verifiedFarmer}</span>
                            </h2>
                            <p className="text-lg text-gray-700 leading-snug max-w-xl">
                                Every purchase helps a local farmer from Bhopal grow their business. 100% of the price goes directly to them.
                            </p>
                            <div className="pt-4">
                                <a href="/blog" className="inline-block bg-black border border-[#FCD200] text-white px-8 py-2.5 text-sm font-medium hover:bg-black/85 shadow-sm transition-all">
                                    {t.viewAll} {t.farmer}
                                </a>
                                <p className="text-xs text-gray-500 mt-2 italic">*Supporting local agriculture since 2026</p>
                            </div>
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-6 w-full items-center">
                            <div className="h-72 overflow-hidden">
                                <img src="https://plus.unsplash.com/premium_photo-1682092792260-1b7cd1674a74?q=80&w=687&auto=format&fit=crop" className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" alt="Farmer" />
                            </div>
                            <div className="h-72 overflow-hidden mt-20">
                                <img src="https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=400" className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" alt="Farmer" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}