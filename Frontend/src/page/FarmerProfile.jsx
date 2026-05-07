"use client";

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin, Star, Users, Package, ArrowLeft,
  BookOpen, ShoppingBasket, Loader2, X
} from "lucide-react";
import { useTranslation } from "../context/LanguageContext";
import axios from "axios";

export default function FarmerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { translations: t } = useTranslation();

  const [farmer, setFarmer] = useState(null);
  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("products");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const [reviews, setReviews] = useState([
    { id: 1, name: "Rahul Sharma", rating: 5, comment: "Amazing fresh vegetables!", date: "2 days ago" },
    { id: 2, name: "Anita Desai", rating: 4, comment: "The honey is pure and delicious.", date: "1 week ago" }
  ]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  const DEFAULT_FARM_IMAGE = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600";
  const DEFAULT_AVATAR = "https://www.w3schools.com/howto/img_avatar.png";

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchAllData = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

        const farmerUrl = `http://localhost:5000/api/auth/${id}`;
        const productUrl = `http://localhost:5000/api/products/farmer/${id}`;
        const blogUrl = `http://localhost:5000/api/blogs/farmer/${id}`;

        const [farmerRes, productsRes, blogsRes] = await Promise.allSettled([
          axios.get(farmerUrl, config),
          axios.get(productUrl, config),
          axios.get(blogUrl, config),
        ]);

        // === Robust Data Extraction ===
        let farmerData = null;
        if (farmerRes.status === "fulfilled") {
          const resData = farmerRes.value.data;
          farmerData = resData?.farmer || resData?.data || resData;
        }

        let productData = [];
        if (productsRes.status === "fulfilled") {
          const resData = productsRes.value.data;
          productData = resData?.products || resData?.data || resData || [];
        }

        let blogData = [];
        if (blogsRes.status === "fulfilled") {
          const resData = blogsRes.value.data;
          blogData = resData?.blogs || resData?.data || resData || [];
        }

        if (!farmerData) {
          throw new Error("Farmer data not found");
        }

        setFarmer(farmerData);
        setProducts(Array.isArray(productData) ? productData : []);
        setBlogs(Array.isArray(blogData) ? blogData : []);
      } catch (err) {
        console.error("API ERROR:", err);
        if (err?.response?.status === 401) {
          setError("Unauthorized access. Please login again.");
          localStorage.removeItem("token");
        } else {
          setError(err.message || "Failed to load farmer profile");
        }
        setFarmer(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAllData();
  }, [id]);

  const handleSubmitReview = () => {
    if (!newReview.comment.trim()) return alert("Please write a comment");

    const reviewToAdd = {
      id: Date.now(),
      name: "You",
      rating: newReview.rating,
      comment: newReview.comment,
      date: "Just now"
    };

    setReviews([reviewToAdd, ...reviews]);
    setNewReview({ rating: 5, comment: "" });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    );
  }

  if (error || !farmer) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold">Farmer Not Found</h1>
        <p className="text-gray-500 mt-2">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 flex items-center gap-2 bg-emerald-600 text-white px-5 py-2 rounded-xl"
        >
          <ArrowLeft size={18} /> Back
        </button>
      </div>
    );
  }

  const farmCover = farmer?.farmImageUrl?.trim() || DEFAULT_FARM_IMAGE;
  const profileImg = farmer?.img || farmer?.profileImage || DEFAULT_AVATAR;

  return (
    <section className="bg-slate-50 min-h-screen pb-20">
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
            >
              <ArrowLeft size={24} />
            </button>
            <img 
              src={profileImg} 
              alt={farmer.fullName} 
              className="w-32 h-32 md:w-40 md:h-40 rounded-3xl border-4 border-white shadow-2xl object-cover bg-white" 
            />
          </div>
          <button onClick={() => navigate(-1)} className="md:hidden bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-gray-100 text-gray-800 mb-2">
            <ArrowLeft size={20} />
          </button>
        </div>

        <div className="mt-6 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-7">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{farmer.fullName}</h1>
            <p className="text-emerald-600 font-semibold text-xl mt-1">{farmer.farmName}</p>
            <div className="flex items-center gap-2 mt-4 text-gray-600">
              <MapPin size={20} className="text-emerald-600" />
              <span className="font-medium">{farmer.farmLocation}</span>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">{t.aboutFarmer || "About Farmer"}</h3>
              <p className="text-gray-600 leading-relaxed">
                {farmer.about || "Passionate farmer delivering fresh organic produce."}
              </p>
            </div>

            <button className="mt-8 bg-black hover:bg-gray-900 text-white px-8 py-3.5 rounded-2xl font-semibold text-lg shadow-md w-full md:w-auto transition-all active:scale-95">
              {t.contactFarmer || "Contact Farmer"}
            </button>
          </div>

          <div className="md:col-span-5 bg-gray-50 border border-gray-100 p-8 rounded-[2.5rem] shadow-sm">
            <div className="space-y-8">
              <div className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                    <Package size={22} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900 leading-none">{products.length}</p>
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
                <div className="relative h-4 flex items-center">
                  <div className="absolute w-full h-2 bg-gray-200 rounded-full" />
                  <div 
                    className="absolute h-2 bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full z-10" 
                    style={{ width: `${((farmer.stars || 4.8) / 5) * 100}%` }} 
                  />
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
            { id: "blog", label: t.blog || "Blog", icon: BookOpen },
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
        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <ShoppingBasket size={80} strokeWidth={1} className="mb-4 opacity-20" />
                <h3 className="text-2xl font-semibold">{t.noProductsText || "No Products Yet"}</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
                {products.map((product) => (
                  <div 
                    key={product._id} 
                    onClick={() => setSelectedProduct(product)}
                    className="bg-white flex flex-col h-[320px] p-4 shadow-none hover:shadow-sm transition-shadow duration-200 cursor-pointer relative group"
                  >

                    <div className="h-[40px] mb-3 overflow-hidden">
                     <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight">
                     {product.name}
                    </h3>
                   </div>
                    <div className="relative w-full h-[250px] bg-white flex items-center justify-center overflow-hidden">
                      <img 
                        src={product.productImageUrl || "https://placehold.co/400x400?text=Product"} 
                        alt={product.name} 
                        className="w-full h-full object-cover  duration-500"
                         onError={(e) => {
                         e.target.src = "https://media.istockphoto.com/id/2182219687/photo/online-advertising-concepts-to-target-customers-influencer-marketing-social-media.webp?a=1&b=1&s=612x612&w=0&k=20&c=DwRxJVvzERqtg5oDpv_1v7zjNolIdcjcbA7pjNSlkhk=";
                         }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Blog Tab */}
        {activeTab === "blog" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {blogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <BookOpen size={80} strokeWidth={1} className="mb-4 opacity-20" />
                <h3 className="text-2xl font-semibold">No Blogs Yet</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
                {blogs.map((blog) => (
                  <div 
                    key={blog._id} 
                    onClick={() => setSelectedBlog(blog)}
                    className="bg-white flex flex-col h-[340px] p-4 shadow-none hover:shadow-sm transition-shadow duration-200 cursor-pointer relative group overflow-hidden"
                  >
                    {/* Blog Title */}
                  <div className="h-[50px] mb-3 overflow-hidden">
                     <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight">
                     {blog.title}
                   </h3>
                  </div>
                    <div className="relative flex-1 w-full bg-white flex items-center justify-center overflow-hidden">
                      <img 
                        src={blog.blogImageUrl || "https://placehold.co/600x400?text=Blog"} 
                        alt={blog.title} 
                        className="w-full h-full object-cover  duration-300 "
                        onError={(e) => {
                           e.target.src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600";
                       }}
                      />
                    </div>
                    <div className="mt-auto pt-3">
                     <p className="text-gray-600 text-sm line-clamp-2 leading-tight">
                      {blog.content}
                    </p>
                  </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )} 

       {/* Reviews Tab */}
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

{selectedProduct && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto">
    
    <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[95vh] overflow-hidden flex flex-col shadow-2xl relative my-auto">
      
      <button 
        onClick={() => setSelectedProduct(null)}
        className="absolute top-4 right-4 z-[110] bg-white/90 hover:bg-white p-3 rounded-full text-gray-800 shadow-md transition-all hover:rotate-90 active:scale-90"
      >
        <X size={24} />
      </button>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        
        <div className="relative h-full w-full bg-gray-100">
          <img 
            src={selectedProduct.productImageUrl || "https://placehold.co/600x400?text=No+Image"} 
            alt={selectedProduct.name} 
            className="w-full h-full object-cover" 
          />
        </div>

        {/* Content Section */}
        <div className="p-8 space-y-6">
          
          {/* Title & Price */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{selectedProduct.name}</h2>
            <p className="text-emerald-600 text-3xl font-black mt-2">
              ₹{selectedProduct.price} 
              <span className="text-xl font-normal text-gray-500 ml-1">/{selectedProduct.unit}</span>
            </p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-6 text-sm border-y border-gray-100 py-6">
            <div>
              <p className="text-gray-400 uppercase tracking-wider font-bold text-[11px] mb-1">Category</p>
              <p className="font-semibold text-gray-800 text-base">{selectedProduct.category || "Not Specified"}</p>
            </div>
            <div>
              <p className="text-gray-400 uppercase tracking-wider font-bold text-[11px] mb-1">Stock Available</p>
              <p className="font-semibold text-gray-800 text-base">{selectedProduct.stock} {selectedProduct.unit}</p>
            </div>
            <div>
              <p className="text-gray-400 uppercase tracking-wider font-bold text-[11px] mb-1">Status</p>
              <p className={`font-bold text-base flex items-center gap-1.5 ${selectedProduct.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                <span className="text-xs">●</span> {selectedProduct.stock > 0 ? "Available" : "Out of Stock"}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-gray-400 uppercase tracking-wider font-bold text-[11px] mb-2">Description</p>
            <p className="text-gray-600 leading-relaxed text-[16px] whitespace-pre-line">
              {selectedProduct.description || "No description provided for this product."}
            </p>
          </div>

          <div className="h-4" />
        </div>
      </div>

      <div className="p-6 border-t bg-gray-50 rounded-b-3xl">
        <a href={`/detail/${selectedProduct._id}`}>
          <button 
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-emerald-100 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <ShoppingBasket size={22} />
          {t.getBuy || "Buy Now"}
        </button>
        </a>
      </div>
    </div>
  </div>
)}

{selectedBlog && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4 backdrop-blur-sm animate-in fade-in duration-300">
    <div className="bg-white rounded-[2.5rem] max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative">
      <button 
        onClick={() => setSelectedBlog(null)}
        className="absolute top-5 right-5 z-[110] bg-white/90 hover:bg-white p-3 rounded-full text-gray-900 shadow-xl border border-gray-100 transition-all hover:rotate-90 active:scale-90"
        title="Close"
      >
        <X size={24} strokeWidth={2.5} />
      </button>

      <div className="overflow-y-auto scrollbar-hide">
        {/* Image Section */}
        {selectedBlog.blogImageUrl && (
          <div className="relative h-64 md:h-80 w-full flex-shrink-0">
            <img 
              src={selectedBlog.blogImageUrl} 
              className="w-full h-full object-cover" 
              alt={selectedBlog.title} 
            />
            {/* Dark overlay to make top-right button pop even more if image is bright */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent" />
          </div>
        )}

        <div className="p-8 md:p-12">
          {/* Date Tag */}
          <div className="flex items-center gap-2 mb-5">
            <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
              {new Date(selectedBlog.createdAt).toLocaleDateString(undefined, { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-8 leading-tight">
            {selectedBlog.title}
          </h1>
          
          {/* Content */}
          <div className="text-gray-700 leading-relaxed text-[18px] whitespace-pre-line prose prose-emerald max-w-none">
            {selectedBlog.content}
          </div>
        </div>
      </div>
    </div>
  </div>
)}
    </section>
  );
}