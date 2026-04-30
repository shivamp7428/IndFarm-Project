import React, { useState } from 'react';
import { Star, Truck, CheckCircle2, ChevronLeft, Minus, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../utils';

export const ProductDetail = ({ product, onAddToCart, setView }) => {
  const [qty, setQty] = useState(1);
  const gallery = product.images && product.images.length > 0 ? product.images : [product.image];
  const [selectedImage, setSelectedImage] = useState(gallery[0]);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
      <button 
        onClick={() => setView('marketplace')}
        className="flex items-center gap-2 text-gray-500 font-bold hover:text-primary mb-8"
      >
        <ChevronLeft size={20} /> Back to Marketplace
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left: Gallery */}
        <div className="space-y-6">
          <motion.div 
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative aspect-square rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white"
          >
            <img src={selectedImage} alt={product.name} className="w-full h-full object-cover" />
            <div className="absolute top-6 left-6 bg-accent text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg">
              <CheckCircle2 size={16} /> Verified Fresh
            </div>
          </motion.div>
          {gallery.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
              {gallery.map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedImage(img)}
                  className={cn(
                    "aspect-square rounded-2xl overflow-hidden border-4 transition-all cursor-pointer shadow-sm",
                    selectedImage === img ? "border-primary" : "border-transparent hover:border-primary/30"
                  )}
                >
                  <img src={img} alt="thumbnail" className={cn(
                    "w-full h-full object-cover transition-opacity",
                    selectedImage === img ? "opacity-100" : "opacity-60 hover:opacity-100"
                  )} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="space-y-8 py-6">
          <div className="space-y-4">
            <button 
              onClick={() => setView('farmer-profile')}
              className="text-primary font-bold text-sm tracking-widest uppercase hover:underline"
            >
              {product.farmer}
            </button>
            <h1 className="font-heading text-5xl font-bold text-text-dark">{product.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 bg-accent/10 px-3 py-1 rounded-full">
                <Star size={16} className="fill-accent text-accent" />
                <span className="font-bold text-accent">{product.rating}</span>
                <span className="text-accent/60 text-sm">({product.reviews} reviews)</span>
              </div>
              <span className="text-gray-400 font-bold text-sm">• {product.location}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-5xl font-bold text-primary">
              ₹{product.price.toFixed(2)} 
              <span className="text-xl text-primary/60 font-normal ml-2">/ {product.unit}</span>
            </div>
            <p className="text-gray-500 font-medium">Inclusive of local farm taxes</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center bg-white border-2 border-primary/10 rounded-pill p-1 shadow-sm">
              <button 
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Minus size={20} />
              </button>
              <span className="w-12 text-center font-bold text-xl font-outfit">{qty}</span>
              <button 
                onClick={() => setQty(qty + 1)}
                className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="flex-1">
              <button 
                onClick={() => onAddToCart(product.id)}
                className="w-full bg-primary text-white h-14 rounded-pill font-bold shadow-lg hover:bg-primary-light active:scale-95 transition-all"
              >
                Add to Cart
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-primary/5 flex items-center gap-6 shadow-sm">
            <img src={product.farmerImage} className="w-16 h-16 rounded-full border-2 border-primary/20" alt="Farmer" />
            <div className="flex-1">
              <p className="font-medium text-gray-700"> Harvested by <span className="font-bold text-primary">{product.farmer}</span> in Nashika.</p>
              <div className="flex items-center gap-2 text-xs font-bold text-accent mt-1">
                <Truck size={14} /> Estimated delivery: Tomorrow morning
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6">
            <h3 className="font-heading text-2xl font-bold">About the Soil</h3>
            <p className="text-gray-600 leading-relaxed italic">
              "Grown in mineral-rich black volcanic soil, these tomatoes benefit from the natural drainage of our hillside plots. We use only sea-kelp mulch and volcanic ash to mineralise the earth."
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm font-bold uppercase tracking-widest text-primary/60">
              <div className="flex items-center gap-2">🌿 No Synthetic Pesticides</div>
              <div className="flex items-center gap-2">💧 Rain-water Irrigated</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
