import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Calendar, Clock, ArrowRight, 
  Tag, User, Filter 
} from 'lucide-react';
import { useTranslation } from "../context/LanguageContext";

const BlogPage = () => {
  const { translations: t } = useTranslation();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");

  // Category labels from translation
  const categories = ["All", "Farming", "Logistics", "Sustainability", "Community"];

const blogs = [
    {
      id: 1,
      title: "How Digital Marketplaces are Doubling Farmer Income",
      excerpt: "The shift from traditional mandis to digital platforms is not just about convenience—it's about survival and growth.",
      author: "Arjun Sharma",
      date: "May 10, 2026",
      readTime: "5 min",
      category: "Farming",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
      featured: true
    },
    {
      id: 2,
      title: "Zero Waste Logistics: The Future of Agri-Supply",
      excerpt: "Reducing post-harvest loss through AI-driven route optimization and smart storage solutions.",
      author: "Priya Das",
      date: "May 08, 2026",
      readTime: "4 min",
      category: "Logistics",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
      featured: false
    },
    {
      id: 3,
      title: "Organic vs Natural Farming: What You Need to Know",
      excerpt: "Understanding the subtle differences that impact soil health and consumer nutrition.",
      author: "Dr. K. Verma",
      date: "May 05, 2026",
      readTime: "7 min",
      category: "Sustainability",
      image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800",
      featured: false
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-20">
      
      {/* --- Header Section --- */}
      <section className="pt-32 pb-16 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4 leading-none">
                {t.blogHeroTitle1 || "The Agri"} <span className="text-emerald-600">{t.blogHeroTitle2 || "Journal."}</span>
              </h1>
              <p className="text-slate-500 text-lg font-medium max-w-xl">
                {t.blogHeroSub}
              </p>
            </div>
            
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder={t.searchPlaceholder} 
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- Filter Tabs --- */}
      <section className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4 overflow-x-auto no-scrollbar">
          <Filter size={18} className="text-slate-400 hidden md:block" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeCategory === cat 
                ? "bg-slate-900 text-white" 
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-16">
        {/* --- Featured Article --- */}
        {blogs.filter(b => b.featured).map(blog => (
          <div key={blog.id} className="group grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24 items-center cursor-pointer" onClick={() => navigate(`/blog/${blog.id}`)}>
            <div className="relative overflow-hidden rounded-[3rem] aspect-[4/3] shadow-2xl">
              <img src={blog.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="blog" />
              <div className="absolute top-6 left-6 bg-emerald-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                {t.featuredLabel}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-4 text-slate-400 text-xs font-bold mb-6">
                <span className="bg-slate-100 px-3 py-1 rounded-lg text-slate-900">{blog.category}</span>
                <span className="flex items-center gap-1"><Calendar size={14}/> {blog.date}</span>
                <span className="flex items-center gap-1"><Clock size={14}/> {blog.readTime}</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight group-hover:text-emerald-600 transition-colors">
                {blog.title}
              </h2>
              <p className="text-slate-500 text-lg mb-8 leading-relaxed font-medium">
                {blog.excerpt}
              </p>
              <button className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-slate-900 group-hover:gap-4 transition-all">
                {t.readFull} <ArrowRight size={18} className="text-emerald-600" />
              </button>
            </div>
          </div>
        ))}

        {/* --- Blog Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
          {blogs.filter(b => !b.featured).map(blog => (
            <div key={blog.id} className="group cursor-pointer" onClick={() => navigate(`/blog/${blog.id}`)}>
              <div className="relative overflow-hidden rounded-[2.5rem] aspect-video mb-8 shadow-lg">
                <img src={blog.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="blog" />
              </div>
              <div className="flex items-center gap-4 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">
                <span className="text-emerald-600">{blog.category}</span>
                <span>•</span>
                <span>{blog.date}</span>
              </div>
              <h3 className="text-2xl font-black mb-4 group-hover:text-emerald-600 transition-colors">
                {blog.title}
              </h3>
              <p className="text-slate-500 font-medium line-clamp-2 mb-6">
                {blog.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center"><User size={14} /></div>
                  <span className="text-xs font-black text-slate-700">{blog.author}</span>
                </div>
                <div className="text-slate-400 text-xs font-bold">{blog.readTime}</div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* --- Newsletter --- */}
      <section className="max-w-6xl mx-auto px-4 mt-20">
        <div className="bg-slate-900 rounded-[3rem] p-10 md:p-20 text-center text-white relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <Tag className="mx-auto mb-6 text-emerald-500" size={32} />
            <h2 className="text-3xl md:text-4xl font-black mb-6">{t.subscribeTitle}</h2>
            <p className="text-slate-400 font-medium mb-10">{t.subscribeSub}</p>
            <form className="flex flex-col md:flex-row gap-4 p-2 bg-white/5 rounded-3xl border border-white/10" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Email" className="flex-1 bg-transparent px-6 py-4 outline-none" />
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest">
                {t.subscribeBtn}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;