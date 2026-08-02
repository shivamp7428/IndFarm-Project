"use client";

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {MapPin, Star, Users, Package, ArrowLeft,BookOpen, ShoppingBasket, Loader2, X, StarHalf, Trash2} from "lucide-react";
import { useTranslation } from "../context/LanguageContext";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function FarmerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { translations: t } = useTranslation();

  const [farmer, setFarmer] = useState(null);
  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [reviews, setReviews] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("products");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  const DEFAULT_FARM_IMAGE = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600";
  const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  useEffect(() => {
    window.scrollTo(0, 0);

const fetchAllData = async () => {
  setLoading(true);

  try {

    const token = localStorage.getItem("token");

    const config = token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : {};

    const farmerUrl = `http://localhost:5000/api/auth/${id}`;
    const productUrl = `http://localhost:5000/api/products/farmer/${id}`;
    const blogUrl = `http://localhost:5000/api/blogs/farmer/${id}`;
    const commentUrl = `http://localhost:5000/api/comment/farmer/${id}`;

    const [
      farmerRes,
      productsRes,
      blogsRes,
      commentsRes,
    ] = await Promise.all([
      axios.get(farmerUrl, config),
      axios.get(productUrl, config),
      axios.get(blogUrl, config),
      axios.get(commentUrl, config),
    ]);

    setFarmer(
      farmerRes.data.farmer ||
      farmerRes.data.data ||
      farmerRes.data
    );

    setProducts(
      productsRes.data.products ||
      productsRes.data.data ||
      []
    );

    setBlogs(
      blogsRes.data.blogs ||
      blogsRes.data.data ||
      []
    );

    // COMMENTS
    setReviews(
      commentsRes.data.comments || []
    );

    console.log("COMMENTS:", commentsRes.data.comments);

  } catch (err) {

    console.log(err);

    setError("Failed to load profile");

  } finally {

    setLoading(false);

  }
};

    if (id) fetchAllData();
  }, [id]);

  
const fetchAllData = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem("token");
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

    const farmerUrl = `http://localhost:5000/api/auth/${id}`;
    const productUrl = `http://localhost:5000/api/products/farmer/${id}`;
    const blogUrl = `http://localhost:5000/api/blogs/farmer/${id}`;
    
    const commentUrl = `http://localhost:5000/api/comment/farmer/${id}`; 

    const [farmerRes, productsRes, blogsRes, commentsRes] = await Promise.allSettled([
      axios.get(farmerUrl, config),
      axios.get(productUrl, config),
      axios.get(blogUrl, config),
      axios.get(commentUrl, config), 
    ]);

    if (farmerRes.status === "fulfilled") {
      setFarmer(farmerRes.value.data.farmer || farmerRes.value.data);
    }

    if (productsRes.status === "fulfilled") {
      setProducts(productsRes.value.data.products || productsRes.value.data);
    }

    if (blogsRes.status === "fulfilled") {
      setBlogs(blogsRes.value.data.blogs || blogsRes.value.data);
    }

    if (commentsRes.status === "fulfilled") {
      const commentData = commentsRes.value.data.comments || [];
      setReviews(commentData); 
    }

  } catch (err) {
    console.error("Data fetch error:", err);
    setError("Profile load karne mein dikkat aa rahi hai");
  } finally {
    setLoading(false);
  }
};

const token = localStorage.getItem("token");
  let loggedInUserId = null;
  
  if (token) {
    try {
      const decoded = jwtDecode(token);
      loggedInUserId = decoded.id || decoded._id || decoded.userId;
    } catch (error) {
      console.error("Invalid token");
    }
  }
const handleDeleteComment = async (commentId) => {
  const token = localStorage.getItem("token");
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#10b981", 
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  });

  if (result.isConfirmed) {
    try {
      await axios.delete(`http://localhost:5000/api/comment/delete/${commentId}`, config);
      
      toast.success("Review deleted!");
      
      if (typeof fetchAllData === 'function') {
        fetchAllData(); 
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete review");
    }
  }
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


  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return interval + " year" + (interval > 1 ? "s" : "") + " ago";
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval + " month" + (interval > 1 ? "s" : "") + " ago";
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + " day" + (interval > 1 ? "s" : "") + " ago";
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + " hr" + (interval > 1 ? "s" : "") + " ago";
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval + " min" + (interval > 1 ? "s" : "") + " ago";
    return "just now";
  };
  
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

           <a href="/contact">
             <button className="mt-8 bg-black hover:bg-gray-900 text-white px-8 py-3.5 rounded-2xl font-semibold text-lg shadow-md w-full md:w-auto transition-all active:scale-95">
              {t.contactFarmer || "Contact Farmer"}
            </button>
           </a>
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

      {activeTab === "reviews" && (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="space-y-6 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
      {reviews && reviews.length > 0 ? (
        reviews.map((comment) => (
          <div key={comment._id} className="bg-white border border-gray-200 p-5 md:p-6 hover:shadow-md transition-all group">
            
            <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <img 
                  src={comment.userId?.img || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                  className="w-12 h-12 rounded-full object-cover ring-4 ring-emerald-50" 
                  alt="user" 
                />
                <div className="flex flex-col">
                  <h4 className="font-black text-gray-900 text-sm md:text-base leading-tight">
                    {comment.userId?.fullName || "Kharidne Wala"}
                  </h4>
                  <span className="text-[10px] font-bold text-gray-400 tracking-widest">
                    {formatTimeAgo(comment.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                {comment.productId && (
                  <div 
                    onClick={() => navigate(`/detail/${comment.productId._id}`)}
                    className="flex items-center gap-3 cursor-pointer group/prod text-right"
                  >
                    <div className="flex flex-col items-end">
                      <h4 className="font-black text-black text-sm md:text-base leading-tight group-hover/prod:underline">
                        {comment.productId.name}
                      </h4>
                      <div className="flex gap-0.5 mt-1">
                        {[...Array(5)].map((_, i) => {
                          const starVal = i + 1;
                          const rating = comment.rating || 5;
                          return (
                            <Star 
                              key={i} 
                              size={12} 
                              fill={rating >= starVal ? "#fbbf24" : "none"} 
                              color={rating >= starVal ? "#fbbf24" : "#e5e7eb"} 
                            />
                          );
                        })}
                      </div>
                    </div>
                    <img 
                      src={comment.productId.productImageUrl || "https://via.placeholder.com/150"} 
                      className="w-12 h-12 rounded-xl object-cover ring-4 ring-gray-50 shadow-sm border border-gray-100" 
                      alt="product" 
                    />
                  </div>
                )}

                {loggedInUserId && String(loggedInUserId) === String(comment.userId?._id || comment.userId) && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      onClick={() => handleDeleteComment(comment._id)} 
                      className="flex items-center gap-1 text-red-500 hover:text-red-700 transition-all p-2 cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="relative">
              <div className="bg-slate-50 p-3 border border-slate-100 relative">
                <p className="text-gray-700 leading-relaxed font-medium text-sm md:text-base">
                  {comment.comment}
                </p>
                <div className="absolute -top-2 left-6 w-4 h-4 bg-slate-50 rotate-45 border-l border-t border-slate-100"></div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200 text-gray-400 font-bold italic">
          No reviews yet. Be the first!
        </div>
      )}
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
      
      {/* FIXED CLOSE BUTTON - Always on top */}
      <button 
        onClick={() => setSelectedBlog(null)}
        className="absolute top-5 right-5 z-[130] bg-white/90 hover:bg-white p-3 rounded-full text-gray-900 shadow-xl border border-gray-100 transition-all hover:rotate-90 active:scale-90"
        title="Close"
      >
        <X size={24} strokeWidth={2.5} />
      </button>

      <div className="overflow-y-auto custom-scrollbar flex-1 flex flex-col">
       {selectedBlog.blogImageUrl && (
         <div className="relative w-full bg-black flex items-center justify-center flex-shrink-0">
           <img src={selectedBlog.blogImageUrl} alt={selectedBlog.title} className="w-full max-h-[500px] object-contain"/>
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

          <div className="h-6" />
        </div>
      </div>
    </div>
  </div>
)}
    </section>
  );
}