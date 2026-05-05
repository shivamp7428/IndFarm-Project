"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  MapPin, Star, Users, Package, 
  BookOpen, ShoppingBasket, 
  Edit3, Plus, Save, Trash2, Camera, Loader2
} from "lucide-react";
import { useTranslation } from "../context/LanguageContext";

export default function FarmerDashboard() {
  const { translations: t } = useTranslation();
  const [activeTab, setActiveTab] = useState("products");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  const [farmer, setFarmer] = useState(null);
  const [products, setProducts] = useState([]);   // Always array
  const [blogs, setBlogs] = useState([]);

  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });

  useEffect(() => {
    fetchFarmerData();
  }, []);

  const fetchFarmerData = async () => {
    try {
      setLoading(true);

      const userStr = localStorage.getItem("user");
      if (!userStr) return;

      const localUser = JSON.parse(userStr);
      const userId = localUser.id || localUser._id;

      const [profileRes, productsRes, blogsRes] = await Promise.all([
        axios.get("/api/auth/me", getAuthHeader()),
        axios.get("/api/products/my-products", getAuthHeader()),
        axios.get(`/api/blogs/farmer/${userId}`, getAuthHeader())
      ]);

      const backendUser = profileRes.data?.user || profileRes.data?.data || {};

      const mergedFarmer = {
        ...localUser,
        ...backendUser,
        fullName: backendUser.fullName || localUser.fullName,
        farmName: backendUser.farmName,
        farmLocation: backendUser.farmLocation,
        farmImageUrl: backendUser.farmImageUrl,
        stars: backendUser.stars || 4.5,
      };

      setFarmer(mergedFarmer);
      
      // ✅ Safe products handling
      const fetchedProducts = productsRes.data?.data || productsRes.data || [];
      setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : []);

      // ✅ Safe blogs handling
      const fetchedBlogs = blogsRes.data?.data || blogsRes.data || [];
      setBlogs(Array.isArray(fetchedBlogs) ? fetchedBlogs : []);

    } catch (err) {
      console.error("Dashboard Fetch Error:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`/api/products/${id}`, getAuthHeader());
      fetchFarmerData(); // Refresh
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  if (loading || !farmer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-600" size={50} />
      </div>
    );
  }

  const DEFAULT_FARM_IMAGE = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600";

  return (
    <section className="bg-white min-h-screen pb-20">
      {/* Cover Image */}
      <div className="relative h-[280px] md:h-[360px] w-full overflow-hidden group">
        <img 
          src={farmer.farmImageUrl || DEFAULT_FARM_IMAGE} 
          alt="Farm Cover" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/50" />
        <button className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg flex items-center gap-2 font-bold text-sm hover:bg-white transition-all">
          <Camera size={18} /> Change Cover
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 relative">
        <div className="-mt-16 md:-mt-20 flex items-end justify-between md:justify-start gap-6">
          <div className="relative group">
            <img 
              src={farmer.farmerImage || farmer.img || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
              alt={farmer.fullName} 
              className="w-32 h-32 md:w-40 md:h-40 rounded-3xl border-4 border-white shadow-2xl object-cover bg-white" 
            />
          </div>

          <button 
            onClick={() => setIsEditingProfile(!isEditingProfile)} 
            className="mb-2 bg-white border border-gray-200 text-gray-800 p-3 rounded-2xl shadow-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-all"
          >
            {isEditingProfile ? <Save size={20} className="text-emerald-600" /> : <Edit3 size={20} />}
            <span className="hidden md:inline">{isEditingProfile ? "Save Changes" : "Edit Profile"}</span>
          </button>
        </div>

        <div className="mt-6 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-7">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{farmer.fullName}</h1>
            <p className="text-emerald-600 font-semibold text-xl mt-1">{farmer.farmName || "Farm Name"}</p>
            <div className="flex items-center gap-2 mt-4 text-gray-600">
              <MapPin size={20} className="text-emerald-600" />
              <span className="font-medium">{farmer.farmLocation}</span>
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-2xl font-bold text-lg shadow-lg flex items-center gap-2 transition-all active:scale-95">
                <Plus size={22} /> Add Product
              </button>
              <button className="bg-black hover:bg-gray-900 text-white px-8 py-3.5 rounded-2xl font-bold text-lg shadow-lg flex items-center gap-2 transition-all active:scale-95">
                Add Blog Post
              </button>
            </div>
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
                    <p className="text-gray-400 text-xs mt-1">Products</p>
                  </div>
                </div>
                <div className="h-10 w-[1px] bg-gray-200" />
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                    <Users size={22} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900 leading-none">5K+</p>
                    <p className="text-gray-400 text-xs mt-1">Customers</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="uppercase text-[10px] tracking-widest font-bold text-gray-400 mb-1">Trust Rating</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-gray-900">{farmer.stars || "4.5"}</span>
                      <span className="text-gray-400 font-bold">/ 5</span>
                    </div>
                  </div>
                  <div className="flex text-amber-400 mb-1"><Star size={20} fill="currentColor" /></div>
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
            { id: "products", label: t.myInventory || "My Inventory", icon: Package },
            { id: "blog", label: t.farmBlog || "Farm Blog", icon: BookOpen },
            { id: "reviews", label: "Reviews", icon: Star }
          ].map((tab) => (
            <button
              key={tab.id}   // ← Fixed Key Warning
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 md:flex-none justify-center items-center gap-2 pb-4 text-sm md:text-lg font-bold transition-all border-b-4 ${
                activeTab === tab.id ? "border-emerald-600 text-emerald-600" : "border-transparent text-gray-400"
              }`}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 mt-12">
        {activeTab === "products" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400 border-2 border-dashed border-gray-100 rounded-[3rem]">
                <ShoppingBasket size={64} strokeWidth={1.5} className="mb-4 opacity-50 text-emerald-600" />
                <h3 className="text-xl font-bold text-gray-900">No Products Yet</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((item) => (
                  <div key={item._id || item.id} className="group bg-white rounded-3xl overflow-hidden border hover:shadow-xl transition-all relative">
                    <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleDeleteProduct(item._id)} 
                        className="bg-white/90 p-2 rounded-xl text-red-600 shadow-md"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="aspect-square overflow-hidden">
                      <img src={item.productImageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition" />
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

        {activeTab === "blog" && <div className="py-20 text-center">No Blog Yet</div>}
        
        {activeTab === "reviews" && (
          <div className="py-20 text-center text-gray-400">
            <Star size={64} className="mx-auto mb-4 opacity-20" />
            <h3>No Reviews Yet</h3>
          </div>
        )}
      </div>
    </section>
  );
}