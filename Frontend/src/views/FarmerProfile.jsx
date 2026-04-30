import React from 'react';
import { Star, ShieldCheck, Mail, MapPin, Calendar, ExternalLink } from 'lucide-react';
import { PRODUCTS } from '../data';
import { ProductCard } from '../components/ProductCard';

export const FarmerProfile = ({ farmer, onProductClick }) => {
  return (
    <div className="pb-20">
      {/* Banner Header */}
      <div className="relative h-80 w-full">
        <img src={farmer.banner} className="w-full h-full object-cover" alt="Farm" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative h-full">
          <div className="absolute -bottom-16 left-12 flex flex-col md:flex-row items-end gap-6">
            <div className="relative">
              <img src={farmer.image} className="w-40 h-40 rounded-full border-4 border-white shadow-xl" alt={farmer.name} />
              <div className="absolute bottom-2 right-2 bg-primary text-white p-2 rounded-full border-2 border-white">
                <ShieldCheck size={20} />
              </div>
            </div>
            <div className="pb-4 space-y-1">
              <h1 className="font-heading text-4xl font-bold text-white drop-shadow-md">{farmer.name}</h1>
              <div className="flex items-center gap-3 text-white/90 font-medium">
                <div className="flex items-center gap-1"><Star size={16} className="fill-accent text-accent" /> {farmer.rating}</div>
                <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                <div>{farmer.reviews} reviews</div>
                <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                <div>Verified since {farmer.verifiedSince}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-24 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Sidebar Bio */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-agri space-y-6">
            <h3 className="font-heading text-2xl font-bold">Biography</h3>
            <p className="text-gray-600 leading-relaxed">{farmer.bio}</p>
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3 text-gray-500 font-medium">
                <Calendar size={18} className="text-primary" />
                <span>{farmer.experience} expertise</span>
              </div>
              <div className="flex items-center gap-3 text-gray-500 font-medium">
                <MapPin size={18} className="text-primary" />
                <span>Punjab, India</span>
              </div>
              <div className="flex items-center gap-3 text-gray-500 font-medium whitespace-nowrap">
                <ShieldCheck size={18} className="text-primary" />
                <span>Organic Certified Farm</span>
              </div>
            </div>
            <button className="w-full bg-primary/5 text-primary py-4 rounded-pill font-bold flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all">
              <Mail size={18} /> Message Farmer
            </button>
          </div>

          <div className="bg-primary p-8 rounded-3xl text-white space-y-4">
            <h4 className="font-bold flex items-center gap-2"><ExternalLink size={18} /> Our Mission</h4>
            <p className="text-sm opacity-80 italic">"I believe everyone deserves to know exactly where their food comes from. Farming is a sacred trust between man and soil."</p>
          </div>
        </div>

        {/* Main Products */}
        <div className="lg:col-span-2 space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-3xl font-bold">Currently Harvesting</h2>
            <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase bg-primary/5 px-4 py-2 rounded-full tracking-widest">
              Live from the farm
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {PRODUCTS.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onClick={() => onProductClick(product)} 
                onAddToCart={() => {}} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
