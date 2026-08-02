import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Search, ArrowRight, Loader2, BookOpen, RefreshCcw 
} from 'lucide-react';

const BlogPage = () => {
  const navigate = useNavigate();
  
  // State Initialization
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Farming", "Logistics", "Sustainability", "Community"];

  // Get Current Logged-in User ID
  const getCurrentUserId = () => {
    try {
      const user = localStorage.getItem('user');
      if (!user) return null;
      const parsedUser = JSON.parse(user);
      return parsedUser?._id || parsedUser?.id || null;
    } catch (e) {
      return null;
    }
  };

  const currentUserId = getCurrentUserId();

  // Smart Navigation Function
  const handleFarmerProfileClick = (farmerId) => {
    if (!farmerId) return;

    const isOwnProfile = currentUserId && currentUserId === farmerId;

    if (isOwnProfile) {
      navigate(`/farmer-dashboard/${farmerId}`);
    } else {
      navigate(`/farmerProfile/${farmerId}`);
    }
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
  `${import.meta.env.VITE_API_URL}/api/blogs`
);
        
        if (res.data.success && Array.isArray(res.data.data)) {
          setBlogs(res.data.data);
        } else {
          setBlogs([]);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Filtering Logic
  const filteredBlogs = blogs?.filter(blog => {
    const matchesCategory = activeCategory === "All" || (blog.category || "Farming") === activeCategory;
    const matchesSearch = blog.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }) || [];

  const resetFilters = () => {
    setSearchQuery("");
    setActiveCategory("All");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-20">
      
      {/* Search Header */}
      <section className="pt-24 pb-12 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-5xl font-black tracking-tighter text-slate-900 flex items-center gap-2">
              The Agri <span className="text-emerald-600">Journal<span className="text-slate-400">.</span></span>
            </h1>
            <div className="h-1.5 w-20 bg-emerald-500 rounded-full"></div>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search stories..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>
        </div>
      </section>

      {/* Categories Sticky Bar */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b py-4">
        <div className="max-w-6xl mx-auto flex gap-3 px-4 overflow-x-auto no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                activeCategory === cat ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {filteredBlogs.map((blog) => (
              <div key={blog._id} className="group relative">
                
                {/* Blog Image & Farmer Profile Overlay */}
                <div className="relative overflow-hidden rounded-[2.5rem] aspect-video mb-6 shadow-lg">
                  <img 
                    src={blog.blogImageUrl || "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=1000"} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    alt={blog.title} 
                  />
                  
                  {/* Farmer Profile Overlay - Smart Navigation */}
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFarmerProfileClick(blog.farmerId?._id);
                    }}
                    className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-1.5 pr-4 rounded-2xl flex items-center gap-3 shadow-xl cursor-pointer hover:bg-white transition-all border border-white/20"
                  >
                    <img 
                      src={blog.farmerId?.img || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                      className="w-10 h-10 rounded-xl object-cover" 
                      alt="farmer" 
                    />
                    <div>
                      <p className="text-[10px] font-black text-slate-900 leading-none">
                        {blog.farmerId?.fullName || "Verified Farmer"}
                      </p>
                      <p className="text-[9px] font-bold text-emerald-600 uppercase mt-1 tracking-tighter">
                        {blog.farmerId?.farmName || "Green Earth Farm"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Blog Text Content */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-slate-400 text-[10px] font-black uppercase">
                    <span className="text-emerald-600">{blog.category || "Farming"}</span>
                    <span>•</span>
                    <span>{new Date(blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                  </div>
                  
                  {/* Title Click - Smart Navigation */}
                  <h2 
                    onClick={() => handleFarmerProfileClick(blog.farmerId?._id)}
                    className="text-2xl font-black transition-colors cursor-pointer leading-tight hover:text-emerald-700"
                  >
                    {blog.title}
                  </h2>
                  
                  <p className="text-slate-500 font-medium line-clamp-3">
                    {blog.content}
                  </p>

                  {/* Read Story Button - Smart Navigation */}
                  <button 
                    onClick={() => handleFarmerProfileClick(blog.farmerId?._id)}
                    className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-slate-900 group-hover:gap-4 transition-all"
                  >
                    Read Story <ArrowRight size={16} className="text-emerald-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in zoom-in duration-300">
            <div className="bg-slate-50 p-8 rounded-full mb-6 border border-slate-100">
              <BookOpen size={48} className="text-slate-300" />
            </div>
            <h3 className="text-3xl font-black text-slate-900">No Stories Found</h3>
            <p className="text-slate-500 mt-3 max-w-md mx-auto leading-relaxed">
              We couldn't find any blogs matching <strong>"{searchQuery || activeCategory}"</strong>. 
              Try using different keywords or explore another category.
            </p>
            <button 
              onClick={resetFilters}
              className="mt-8 flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold text-sm hover:bg-emerald-600 transition-all shadow-lg"
            >
              <RefreshCcw size={16} /> Reset All Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default BlogPage;