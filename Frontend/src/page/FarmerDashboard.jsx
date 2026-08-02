"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  MapPin, Star, Users, Package, 
  BookOpen, ShoppingBasket, 
  Edit3, Plus, Save, Trash2, Camera, Loader2,
  X
} from "lucide-react";
import { useTranslation } from "../context/LanguageContext";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import FarmerReviewSection from "./Comment";

export default function FarmerDashboard() {
  const { translations: t } = useTranslation();
  const [activeTab, setActiveTab] = useState("products");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [farmer, setFarmer] = useState(null);
  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);
 const [selectedBlog, setSelectedBlog] = useState(null);
 const [selectedProduct, setSelectedProduct] = useState(null);
 const [isEditingProduct, setIsEditingProduct] = useState(false);
const [editingProduct, setEditingProduct] = useState(null);
const [editProductForm, setEditProductForm] = useState({});
const [previewEditImage, setPreviewEditImage] = useState(null);
const [quantity, setQuantity] = useState(1);

const user = JSON.parse(localStorage.getItem("user") || "{}");
const userRole = user.role;

  // Edit Profile Form
  const [editForm, setEditForm] = useState({
    fullName: "",
    farmName: "",
    farmLocation: "",
    farmImage: null,     
    profileImage: null,  
  });
  const [previewFarmImage, setPreviewFarmImage] = useState(null);
  const [previewProfileImage, setPreviewProfileImage] = useState(null);

  // Add Product Form
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [productForm, setProductForm] = useState({
    name: "", price: "", unit: "kg", category: "", description: "", stock: "", isAvailable: true, productImage: null
  });
  const [previewProductImage, setPreviewProductImage] = useState(null);

  // Add Blog Form
  const [showAddBlog, setShowAddBlog] = useState(false);
  const [blogForm, setBlogForm] = useState({
    title: "", content: "", blogImage: null
  });
  const [previewBlogImage, setPreviewBlogImage] = useState(null);

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
  axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, getAuthHeader()),
  axios.get(`${import.meta.env.VITE_API_URL}/products/my-products/${userId}`, getAuthHeader()),
  axios.get(`${import.meta.env.VITE_API_URL}/blogs/farmer/${userId}`, getAuthHeader())
]);

      const backendUser = profileRes.data?.user || profileRes.data?.data || profileRes.data || {};

      const mergedFarmer = {
        ...localUser,
        ...backendUser,
        fullName: backendUser.fullName || localUser.fullName,
        farmName: backendUser.farmName,
        farmLocation: backendUser.farmLocation,
        farmImageUrl: backendUser.farmImageUrl,
        img: backendUser.img,
        stars: backendUser.stars || 4.5,
      };

      setFarmer(mergedFarmer);
      setProducts(Array.isArray(productsRes.data?.data || productsRes.data) ? (productsRes.data?.data || productsRes.data) : []);
      setBlogs(Array.isArray(blogsRes.data?.data || blogsRes.data) ? (blogsRes.data?.data || blogsRes.data) : []);

      setEditForm({
        fullName: mergedFarmer.fullName || "",
        farmName: mergedFarmer.farmName || "",
        farmLocation: mergedFarmer.farmLocation || "",
        farmImage: null,
        profileImage: null,
      });

      setPreviewFarmImage(mergedFarmer.farmImageUrl);
      setPreviewProfileImage(mergedFarmer.img);

    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // PROFILE IMAGE HANDLERS =
  const handleFarmImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditForm(prev => ({ ...prev, farmImage: file }));
      setPreviewFarmImage(URL.createObjectURL(file));
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditForm(prev => ({ ...prev, profileImage: file }));
      setPreviewProfileImage(URL.createObjectURL(file));
    }
  };

  // UPDATE PROFILE 
  const handleUpdateProfile = async () => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("fullName", editForm.fullName);
      formData.append("farmName", editForm.farmName);
      formData.append("farmLocation", editForm.farmLocation);

      if (editForm.farmImage) formData.append("farmImage", editForm.farmImage);
      if (editForm.profileImage) formData.append("profileImage", editForm.profileImage);  // Important: using "img"

      await axios.put(
  `${import.meta.env.VITE_API_URL}/auth/update`,
  formData,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }
);
     // Update localStorage name
       const user = JSON.parse(localStorage.getItem("user"));
       user.fullName = editForm.fullName;
      localStorage.setItem("user", JSON.stringify(user));
      
      toast.success("Profile Updated Successfully!");
      setIsEditingProfile(false);
      fetchFarmerData();        
    } catch (err) {
      console.error(err.response?.data);
      toast.error(err.response?.data?.message || "Update Failed");
    } finally {
      setSubmitting(false);
    }
  };

  // ADD PRODUCT
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) return alert("Name and Price are required");

    setSubmitting(true);
    try {
      const userStr = localStorage.getItem("user");
      const user = JSON.parse(userStr);
      const farmerId = user.id || user._id;

      const formData = new FormData();
      formData.append("name", productForm.name);
      formData.append("price", productForm.price);
      formData.append("unit", productForm.unit);
      formData.append("category", productForm.category);
      formData.append("description", productForm.description);
      formData.append("stock", productForm.stock || 1);
      formData.append("isAvailable", productForm.isAvailable);

      if (productForm.productImage) {
        formData.append("productImage", productForm.productImage);
      }

      await axios.post(`${import.meta.env.VITE_API_URL}/products/add`, formData, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
});

      toast.success("Product Added Successfully!");
      setShowAddProduct(false);
      resetProductForm();
      fetchFarmerData();
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error(err.response?.data?.message || "Failed to add product");
    } finally {
      setSubmitting(false);
    }
  };

  //  ADD BLOG 
  const handleAddBlog = async (e) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.content) return alert("Title and Content are required");

    setSubmitting(true);
    try {
      const userStr = localStorage.getItem("user");
      const user = JSON.parse(userStr);
      const farmerId = user.id || user._id;

      const formData = new FormData();
      formData.append("title", blogForm.title);
      formData.append("content", blogForm.content);

      if (blogForm.blogImage) {
         formData.append("blogImage", blogForm.blogImage);
      }

      await axios.post(`${import.meta.env.VITE_API_URL}/blogs/add`, formData, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
});

      toast.success("Blog Posted Successfully!");
      setShowAddBlog(false);
      resetBlogForm();
      fetchFarmerData();
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error(err.response?.data?.message || "Failed to add blog");
    } finally {
      setSubmitting(false);
    }
  };

  const resetProductForm = () => {
    setProductForm({ name: "", price: "", unit: "kg", category: "", description: "", stock: "", isAvailable: true, productImage: null });
    setPreviewProductImage(null);
  };

  const resetBlogForm = () => {
    setBlogForm({ title: "", content: "", blogImage: null });
    setPreviewBlogImage(null);
  };

  //product
 const openProductDetail = (product) => {
  setSelectedProduct(product);
  setQuantity(1);
};

const closeProductDetail = () => {
  setSelectedProduct(null);
  setQuantity(1);
};

// Open Edit Mode
const handleEditProduct = (product) => {
  setSelectedProduct(null); 
  setEditingProduct(product);
  setEditProductForm({
    name: product.name || "",
    price: product.price || "",
    unit: product.unit || "kg",
    category: product.category || "",
    description: product.description || "",
    stock: product.stock || 1,
    isAvailable: product.isAvailable !== false,
  });
  setPreviewEditImage(product.productImageUrl);
  setIsEditingProduct(true);
};

// Handle Input Change
const handleEditProductChange = (e) => {
  const { name, value } = e.target;
  setEditProductForm(prev => ({ ...prev, [name]: value }));
};

// Handle Image Change
const handleEditProductImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setEditProductForm(prev => ({ ...prev, productImage: file }));
    setPreviewEditImage(URL.createObjectURL(file));
  }
};

// Update Product API Call
const handleUpdateProduct = async (e) => {
  e.preventDefault();
  if (!editingProduct) return;

  setSubmitting(true);
  try {
    const formData = new FormData();
    formData.append("name", editProductForm.name);
    formData.append("price", editProductForm.price);
    formData.append("unit", editProductForm.unit);
    formData.append("category", editProductForm.category);
    formData.append("description", editProductForm.description);
    formData.append("stock", editProductForm.stock);
    formData.append("isAvailable", editProductForm.isAvailable);

    if (editProductForm.productImage) {
      formData.append("productImage", editProductForm.productImage);
    }

    await axios.put(
  `${import.meta.env.VITE_API_URL}/products/${editingProduct._id}`,
  formData,
  {
    headers: {
      ...getAuthHeader().headers,
      "Content-Type": "multipart/form-data"
    }
  }
);

    toast.success("Product Updated Successfully!");
    setIsEditingProduct(false);
    setEditingProduct(null);
    fetchFarmerData(); // Refresh list
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Failed to update product");
  } finally {
    setSubmitting(false);
  }
};

 const handleDeleteProduct = async (id) => { 
   const result = await Swal.fire({  
     title: "Delete Product?",    
     text: "This product will be permanently deleted.",   
     icon: "warning",    showCancelButton: true, 
     confirmButtonColor: "#059669",    
     cancelButtonColor: "#d33",    
     confirmButtonText: "Yes, Delete",    
     cancelButtonText: "Cancel"  });  
     if (!result.isConfirmed) return;  
     try {    
      await axios.delete(`${import.meta.env.VITE_API_URL}/products/${id}`, getAuthHeader());
toast.success("Product Deleted Successfully!");
fetchFarmerData();
      } catch (err) {    
        console.error(err);   
       toast.error("Delete Failed");  
      }};


  //manage blog function
  const openBlogDetail = (blog) => {
  setSelectedBlog(blog);
};
const closeBlogDetail = () => {
  setSelectedBlog(null);
};
const handleDeleteBlog = async (id) => {
  const result = await Swal.fire({
    title: "Delete Blog?",
    text: "This blog will be permanently deleted.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#059669",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Delete",
    cancelButtonText: "Cancel"
  });
  if (!result.isConfirmed) return;

  try {
    await axios.delete(
  `${import.meta.env.VITE_API_URL}/blogs/${id}`,
  getAuthHeader()
);
    toast.success("Blog Deleted Successfully!");
    fetchFarmerData();
  } catch (err) {
    console.error(err);
    toast.error("Delete Failed");
  }
};


  const handleEditChange = (e) => {
    setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProductChange = (e) => {
    setProductForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBlogChange = (e) => {
    setBlogForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
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
    <section className="bg-slate-50 min-h-screen pb-20">
      {/* Cover Image */}
      <div className="relative h-[280px] md:h-[360px] w-full overflow-hidden group">
        <img 
          src={previewFarmImage || farmer.farmImageUrl || DEFAULT_FARM_IMAGE} 
          alt="Farm Cover" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/50" />

        {isEditingProfile && (
          <label className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg flex items-center gap-2 font-bold text-sm hover:bg-white cursor-pointer">
            <Camera size={18} /> Change Cover
            <input type="file" accept="image/*" onChange={handleFarmImageChange} className="hidden" />
          </label>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 relative">
        <div className="-mt-16 md:-mt-20 flex items-end justify-between md:justify-start gap-6">
          <div className="relative group">
            <img 
              src={previewProfileImage || farmer.img || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
              alt={farmer.fullName} 
              className="w-32 h-32 md:w-40 md:h-40 rounded-3xl border-4 border-white shadow-2xl object-cover bg-white" 
            />
            {isEditingProfile && (
              <label className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-2 rounded-full cursor-pointer shadow-lg">
                <Camera size={18} />
                <input type="file" accept="image/*" onChange={handleProfileImageChange} className="hidden" />
              </label>
            )}
          </div>

          <button 
            onClick={() => isEditingProfile ? handleUpdateProfile() : setIsEditingProfile(true)}
            disabled={submitting}
            className="mb-2 bg-white border border-gray-200 text-gray-800 p-3 rounded-2xl shadow-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-all"
          >
            {submitting ? <Loader2 className="animate-spin" size={20} /> : isEditingProfile ? <Save size={20} className="text-emerald-600" /> : <Edit3 size={20} />}
            <span className="hidden md:inline">{submitting ? "Saving..." : isEditingProfile ? "Save Changes" : "Edit Profile"}</span>
          </button>
        </div>

        {/* Rest of your UI remains same... */}
        <div className="mt-6 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-7">
            {isEditingProfile ? (
              <input type="text" name="fullName" value={editForm.fullName} onChange={handleEditChange}
                className="text-4xl md:text-5xl font-bold text-gray-900 bg-transparent border-b-2 border-emerald-300 focus:outline-none w-full" />
            ) : (
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{farmer.fullName}</h1>
            )}

            {isEditingProfile ? (
              <input type="text" name="farmName" value={editForm.farmName} onChange={handleEditChange}
                className="text-emerald-600 font-semibold text-xl mt-1 bg-transparent border-b border-emerald-300 focus:outline-none w-full" />
            ) : (
              <p className="text-emerald-600 font-semibold text-xl mt-1">{farmer.farmName || "Farm Name"}</p>
            )}

            <div className="flex items-center gap-2 mt-4 text-gray-600">
              <MapPin size={20} className="text-emerald-600" />
              {isEditingProfile ? (
                <input type="text" name="farmLocation" value={editForm.farmLocation} onChange={handleEditChange}
                  className="font-medium bg-transparent border-b border-gray-300 focus:outline-none flex-1" />
              ) : (
                <span className="font-medium">{farmer.farmLocation}</span>
              )}
            </div>

            <div className="flex  gap-4 mt-8">
              <button onClick={() => setShowAddProduct(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white md:px-5 md:py-1.5 px-3 py-2 rounded-2xl font-bold text-lg shadow-lg flex items-center gap-2 transition-all active:scale-95">
                <Plus size={22} /> Add Product
              </button>
              <button onClick={() => setShowAddBlog(true)} className="bg-black hover:bg-gray-900 text-white md:px-5 md:py-1.5 px-3 py-2 rounded-2xl font-bold text-lg shadow-lg flex items-center gap-2 transition-all active:scale-95">
                Add Blog Post
              </button>
            </div>
          </div>

          {/* Stats Card - Updated */}
          <div className="md:col-span-5 bg-gray-50 border border-gray-100 p-8 rounded-[2.5rem] shadow-sm">
           <div className="space-y-8">
    
    {/* First Row - Products & Customers */}
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

    {/* Second Row - Stars & Farming Type */}
    <div className="flex justify-between items-center gap-4 pt-6 border-t border-gray-200">
      
      {/* Stars Rating */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
          <Star size={22} />
        </div>
        <div>
          <p className="text-xl font-bold text-gray-900 leading-none flex items-center gap-1">
            {farmer?.stars || 4.5}
            <span className="text-amber-500 text-lg">★</span>
          </p>
          <p className="text-gray-400 text-xs mt-1">Rating</p>
        </div>
      </div>

      <div className="h-10 w-[1px] bg-gray-200" />

      {/* Farming Type */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
          <span className="text-xl">🌱</span>
        </div>
        <div>
          <p className="text-xl font-bold text-gray-900 leading-none capitalize">
            {farmer?.farmingType || "Organic"}
          </p>
          <p className="text-gray-400 text-xs mt-1">Farming Type</p>
        </div>
      </div>
    </div>

          </div>
          </div>
        </div>
      </div>

      {/* Tabs and Content - unchanged except blog display */}
      <div className="max-w-6xl mx-auto px-4 mt-12 border-b border-gray-100">
        <div className="flex justify-between items-center w-full">
          {[
            { id: "products", label: t.myInventory || "My Inventory", icon: Package },
            { id: "blog", label: t.farmBlog || "Farm Blog", icon: BookOpen },
            { id: "reviews", label: "Reviews", icon: Star }
          ].map((tab) => (
            <button
              key={tab.id}
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
  <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
    {products.length === 0 ? (
      <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400 border-2 border-dashed rounded-[3rem]">
        <ShoppingBasket size={64} strokeWidth={1.5} className="mb-4 opacity-50 text-emerald-600" />
        <h3>No Products Yet</h3>
      </div>
    ) : (
      products.map((item) => (
        <div
          key={item._id}
          className="bg-white flex flex-col h-[320px] p-4 shadow-none hover:shadow-md transition-shadow duration-200 cursor-pointer relative group"
          onClick={() => openProductDetail(item)}
        >
          {/* Delete Button */}
          <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteProduct(item._id);
              }}
              className="bg-white p-2 rounded-xl text-red-600 hover:bg-red-50 shadow-md"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {/* Product Name */}
          <div className="h-[40px] mb-3 overflow-hidden">
            <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight">
              {item.name}
            </h3>
          </div>

          {/* Product Image */}
          <div className="relative w-full h-[250px] bg-white flex items-center justify-center overflow-hidden">
            <img
              src={item.productImageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://media.istockphoto.com/id/2182219687/photo/online-advertising-concepts-to-target-customers-influencer-marketing-social-media.webp?a=1&b=1&s=612x612&w=0&k=20&c=DwRxJVvzERqtg5oDpv_1v7zjNolIdcjcbA7pjNSlkhk=";
              }}
            />
          </div>
        </div>
      ))
    )}
  </div>
)}

{/* Product Detail Modal  */}
{selectedProduct && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto backdrop-blur-sm">
    <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[95vh] overflow-hidden flex flex-col my-auto shadow-2xl relative">
      
      <button 
        onClick={() => setSelectedProduct(null)}
        className="absolute top-4 right-4 bg-white/90 hover:bg-white p-3 rounded-full text-gray-800 shadow-md transition-all hover:rotate-90 z-[60]"
      >
        <X size={24} />
      </button>

      <div className="flex-1 overflow-y-auto">
        
        <div className="relative h-full w-full bg-gray-100">
          <img 
            src={selectedProduct.productImageUrl || "https://via.placeholder.com/600x400?text=No+Image"} 
            alt={selectedProduct.name} 
            className="w-full h-full object-cover" 
          />
        </div>

        {/* Content Section */}
        <div className="p-8 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{selectedProduct.name}</h1>
            <p className="text-emerald-600 text-3xl font-bold mt-2">
              ₹{selectedProduct.price} 
              <span className="text-xl font-normal text-gray-500">/{selectedProduct.unit}</span>
            </p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-gray-500">Category</p>
              <p className="font-semibold text-gray-800">{selectedProduct.category || "Not Specified"}</p>
            </div>
            <div>
              <p className="text-gray-500">Stock Available</p>
              <p className="font-semibold text-gray-800">{selectedProduct.stock} {selectedProduct.unit}</p>
            </div>
            <div>
              <p className="text-gray-500">Status</p>
              <p className={`font-semibold ${selectedProduct.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                {selectedProduct.isAvailable ? "● Available" : "● Out of Stock"}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-gray-500 mb-2 font-medium">Description</p>
            <p className="text-gray-700 leading-relaxed text-[16.5px] whitespace-pre-line">
              {selectedProduct.description || "No description provided for this product."}
            </p>
          </div>
          
          <div className="h-4"></div>
        </div>
      </div>

      {/* FIXED BOTTOM ACTION BUTTONS */}
      <div className="p-6 border-t bg-gray-50 rounded-b-3xl">
        <div className="flex gap-4">
          <button 
            onClick={() => {
              closeProductDetail();
              handleEditProduct(selectedProduct);
            }}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-semibold text-lg transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Edit3 size={22} />
            Edit Product
          </button>

          <button 
            onClick={() => handleDeleteProduct(selectedProduct._id)}
            className="flex-1 border border-red-500 text-red-600 hover:bg-red-50 py-4 rounded-2xl font-semibold text-lg transition-all active:scale-95"
          >
            Delete Product
          </button>
        </div>
      </div>
    </div>
  </div>
)}
{/* Edit Product Modal */}
{isEditingProduct && editingProduct && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
    <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[95vh] overflow-auto">
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-8">Edit Product</h2>

        <form onSubmit={handleUpdateProduct} className="space-y-6">
          {/* Image Upload */}
          <div className="text-center">
            <label className="cursor-pointer block">
              <img
                src={previewEditImage || "https://via.placeholder.com/600x400?text=No+Image"}
                alt="Preview"
                className="w-full h-64 object-cover rounded-3xl mx-auto border"
              />
              <p className="text-emerald-600 mt-3 font-medium">Click to Change Image</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleEditProductImageChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Product Name</label>
              <input
                type="text"
                name="name"
                value={editProductForm.name}
                onChange={handleEditProductChange}
                className="w-full p-4 border rounded-2xl"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={editProductForm.price}
                onChange={handleEditProductChange}
                className="w-full p-4 border rounded-2xl"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Unit</label>
              <input
                type="text"
                name="unit"
                value={editProductForm.unit}
                onChange={handleEditProductChange}
                className="w-full p-4 border rounded-2xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <input
                type="text"
                name="category"
                value={editProductForm.category}
                onChange={handleEditProductChange}
                className="w-full p-4 border rounded-2xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Stock</label>
            <input
              type="number"
              name="stock"
              value={editProductForm.stock}
              onChange={handleEditProductChange}
              className="w-full p-4 border rounded-2xl"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={editProductForm.description}
              onChange={handleEditProductChange}
              rows={5}
              className="w-full p-4 border rounded-2xl"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isAvailable"
              checked={editProductForm.isAvailable}
              onChange={(e) => setEditProductForm(prev => ({ ...prev, isAvailable: e.target.checked }))}
            />
            <label htmlFor="isAvailable" className="font-medium">Product is Available</label>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => setIsEditingProduct(false)}
              className="flex-1 py-4 border border-gray-300 rounded-2xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-semibold disabled:opacity-70"
            >
              {submitting ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}

  {activeTab === "blog" && (
  <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
    {blogs.length === 0 ? (
      <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400 border-2 border-dashed rounded-[3rem]">
        <BookOpen size={64} strokeWidth={1.5} className="mb-4 opacity-50 text-emerald-600" />
        <h3>No Blogs Yet</h3>
      </div>
    ) : (
      blogs.map(blog => (
        <div 
          key={blog._id} 
          className="bg-white flex flex-col h-[340px] p-4 shadow-none  transition-shadow duration-200 cursor-pointer relative group overflow-hidden "
          onClick={() => openBlogDetail(blog)}
        >
          {/* Delete Button */}
          <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                handleDeleteBlog(blog._id); 
              }} 
              className="bg-white p-2 rounded-xl text-red-600 hover:bg-red-50 "
            >
              <Trash2 size={18} />
            </button>
          </div>

          {/* Blog Title */}
          <div className="h-[50px] mb-3 overflow-hidden">
            <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight">
              {blog.title}
            </h3>
          </div>

          {/* Blog Image */}
          <div className="relative flex-1 w-full bg-white flex items-center justify-center overflow-hidden ">
            {blog.blogImageUrl ? (
              <img 
                src={blog.blogImageUrl} 
                alt={blog.title} 
                className="w-full h-full object-cover  duration-300 "
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600";
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <BookOpen size={50} className="text-gray-300" />
              </div>
            )}
          </div>

          {/* Short Content Preview */}
          <div className="mt-auto pt-3">
            <p className="text-gray-600 text-sm line-clamp-2 leading-tight">
              {blog.content}
            </p>
          </div>
        </div>
      ))
    )}
  </div>
  )}
{selectedBlog && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-300">
    <div className="bg-white rounded-[2.5rem] max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative">
      
      <button 
        onClick={closeBlogDetail}
        className="absolute top-5 right-5 z-[60] bg-white/90 hover:bg-white p-3 rounded-full text-gray-900 shadow-xl border border-gray-100 transition-all hover:rotate-90 active:scale-90"
      >
        <X size={24} strokeWidth={2.5} />
      </button>

      <div className="overflow-y-auto">
        {selectedBlog.blogImageUrl && (
          <div className="relative h-64 md:h-80 w-full flex-shrink-0">
            <img 
              src={selectedBlog.blogImageUrl} 
              className="w-full h-full object-cover" 
              alt={selectedBlog.title} 
            />
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

          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-8 leading-tight pr-10">
            {selectedBlog.title}
          </h1>
          <div className="text-gray-700 leading-relaxed text-[18px] whitespace-pre-line prose prose-emerald max-w-none">
            {selectedBlog.content}
          </div>
        </div>
      </div>

      <div className="h-6 bg-white w-full flex-shrink-0" />
    </div>
  </div>
)}

        {activeTab === "reviews" && (
          <div>
            <FarmerReviewSection/>
          </div>
        )}
      </div>

  {/* Add Product Modal */}
{showAddProduct && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 md:p-6 overflow-y-auto backdrop-blur-sm">
    
    <div className="bg-white rounded-[2.5rem] max-w-lg w-full shadow-2xl relative flex flex-col my-auto max-h-[95vh]">
      
      {/* Fixed Header */}
      <div className="p-8 pb-4 flex justify-between items-center border-b border-gray-50">
        <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
        <button 
          onClick={() => {setShowAddProduct(false); resetProductForm();}}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={24} className="text-gray-500" />
        </button>
      </div>

      {/* Scrollable Form Body */}
      <div className="p-8 pt-6 overflow-y-auto custom-scrollbar">
        <form onSubmit={handleAddProduct} className="space-y-5">
          
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600 ml-1">Product Name</label>
            <input type="text" name="name" placeholder="Enter product name" value={productForm.name} onChange={handleProductChange} className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600 ml-1">Price (₹)</label>
              <input type="number" name="price" placeholder="0.00" value={productForm.price} onChange={handleProductChange} className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all" required />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600 ml-1">Unit (e.g. kg)</label>
              <input type="text" name="unit" placeholder="kg/pc" value={productForm.unit} onChange={handleProductChange} className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600 ml-1">Category</label>
              <input type="text" name="category" placeholder="Vegetables" value={productForm.category} onChange={handleProductChange} className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600 ml-1">Stock</label>
              <input type="number" name="stock" placeholder="100" value={productForm.stock} onChange={handleProductChange} className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600 ml-1">Description</label>
            <textarea name="description" placeholder="Tell us about your product..." value={productForm.description} onChange={handleProductChange} className="w-full p-4 border border-gray-200 rounded-2xl h-28 resize-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all" />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600 ml-1">Product Image</label>
            <label className="block border-2 border-dashed border-gray-200 hover:border-emerald-500 rounded-2xl p-6 text-center cursor-pointer bg-gray-50/50 hover:bg-emerald-50/30 transition-all">
              {previewProductImage ? (
                <div className="relative group">
                  <img src={previewProductImage} className="mx-auto max-h-48 rounded-xl shadow-md" alt="Preview" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-xl transition-all">
                    <p className="text-white text-sm font-medium">Change Photo</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                    <Package size={24} />
                  </div>
                  <p className="text-gray-500 font-medium">Click to upload image</p>
                  <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                </div>
              )}
              <input type="file" accept="image/*" onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setProductForm(p => ({...p, productImage: file}));
                  setPreviewProductImage(URL.createObjectURL(file));
                }
              }} className="hidden" />
            </label>
          </div>

          <div className="flex gap-4 pt-4 sticky bottom-0 bg-white pb-2">
            <button type="button" onClick={() => {setShowAddProduct(false); resetProductForm();}} className="flex-1 py-4 border border-gray-200 text-gray-600 rounded-2xl font-semibold hover:bg-gray-50 transition-all active:scale-[0.98]">Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-500 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-3 active:scale-[0.98]">
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                "Add Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}
      {/* Add Blog Modal - */}
{showAddBlog && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 md:p-6 overflow-y-auto backdrop-blur-sm">
    
    <div className="bg-white rounded-[2.5rem] max-w-lg w-full shadow-2xl relative flex flex-col my-auto max-h-[95vh]">
      
      {/* Fixed Header */}
      <div className="p-8 pb-4 flex justify-between items-center border-b border-gray-50">
        <h2 className="text-2xl font-bold text-gray-900">Create Blog Post</h2>
        <button 
          onClick={() => {setShowAddBlog(false); resetBlogForm();}}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={24} className="text-gray-500" />
        </button>
      </div>

      {/* Scrollable Form Body */}
      <div className="p-8 pt-6 overflow-y-auto custom-scrollbar">
        <form onSubmit={handleAddBlog} className="space-y-6">
          
          {/* Title Field */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600 ml-1">Blog Title</label>
            <input 
              type="text" 
              name="title" 
              placeholder="Give your blog a catchy title" 
              value={blogForm.title} 
              onChange={handleBlogChange} 
              className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-black/5 focus:border-black outline-none transition-all" 
              required 
            />
          </div>

          {/* Content Field */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600 ml-1">Content</label>
            <textarea 
              name="content" 
              placeholder="What's happening on your farm? Write here..." 
              value={blogForm.content} 
              onChange={handleBlogChange} 
              className="w-full p-4 border border-gray-200 rounded-2xl h-56 resize-none focus:ring-4 focus:ring-black/5 focus:border-black outline-none transition-all" 
              required 
            />
          </div>

          {/* Image Upload Field */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600 ml-1">Cover Image</label>
            <label className="block border-2 border-dashed border-gray-200 hover:border-black rounded-2xl p-6 text-center cursor-pointer bg-gray-50/50 hover:bg-gray-50 transition-all">
              {previewBlogImage ? (
                <div className="relative group">
                  <img src={previewBlogImage} className="mx-auto max-h-52 rounded-xl shadow-md" alt="Preview" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-xl transition-all">
                    <p className="text-white text-sm font-medium">Change Cover Photo</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                    <BookOpen size={24} />
                  </div>
                  <p className="text-gray-500 font-medium">Upload blog cover image</p>
                  <p className="text-xs text-gray-400">Recommended size: 1200x630 (PNG, JPG)</p>
                </div>
              )}
              <input type="file" accept="image/*" onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setBlogForm(b => ({...b, blogImage: file}));
                  setPreviewBlogImage(URL.createObjectURL(file));
                }
              }} className="hidden" />
            </label>
          </div>

          {/* Action Buttons - Sticky at bottom of card */}
          <div className="flex gap-4 pt-4 sticky bottom-0 bg-white pb-2">
            <button 
              type="button" 
              onClick={() => {setShowAddBlog(false); resetBlogForm();}} 
              className="flex-1 py-4 border border-gray-200 text-gray-600 rounded-2xl font-semibold hover:bg-gray-50 transition-all active:scale-[0.98]"
            >
              Discard
            </button>
            <button 
              type="submit" 
              disabled={submitting} 
              className="flex-1 py-4 bg-black text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-3 disabled:bg-gray-400 disabled:shadow-none active:scale-[0.98]"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Publishing...</span>
                </>
              ) : (
                "Publish Post"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </section>
  );
}