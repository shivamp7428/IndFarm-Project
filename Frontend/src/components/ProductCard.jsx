import React from 'react';
import { Star, Plus } from 'lucide-react';
import { motion } from 'motion/react';

export const ProductCard = ({ product, onClick, onAddToCart }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-card shadow-agri group cursor-pointer overflow-hidden border border-primary/5"
      onClick={onClick}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.organic && (
          <div className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            Organic
          </div>
        )}
      </div>

      <div className="p-4 space-y-2 relative">
        <div className="flex flex-col">
          <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest leading-none mb-1">
            {product.farmer} • {product.location}
          </span>
          <h3 className="font-heading text-lg font-semibold text-text-dark leading-tight line-clamp-1">
            {product.name}
          </h3>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col">
            <span className="text-primary font-bold text-xl">
              ${product.price.toFixed(2)}
              <span className="text-xs text-gray-400 font-normal"> / {product.unit}</span>
            </span>
            <div className="flex items-center gap-1">
              <Star size={12} className="fill-accent text-accent" />
              <span className="text-xs font-semibold text-text-dark">{product.rating}</span>
            </div>
          </div>

          <button 
            onClick={onAddToCart}
            className="bg-accent h-10 w-10 rounded-full flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-md"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
