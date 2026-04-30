import React, { useState } from 'react';
import { Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { PRODUCTS } from '../data';
import { ProductCard } from '../components/ProductCard';

export const Marketplace = ({ products, onProductClick, onAddToCart }) => {
  const [distance, setDistance] = useState(25);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 flex flex-col md:flex-row gap-12">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 space-y-10 shrink-0">
        <div>
          <h3 className="font-outfit font-bold text-lg mb-6 flex items-center gap-2">
            <Filter size={20} className="text-primary" /> Filters
          </h3>
          
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Distance: {distance}km</label>
              <input 
                type="range" 
                min="1" 
                max="50" 
                value={distance}
                onChange={(e) => setDistance(parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase">
                <span>1km</span>
                <span>50km</span>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Categories</label>
              <div className="space-y-3">
                {['Fruits', 'Veggies', 'Grains', 'Spices'].map(cat => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded-lg border-primary text-primary focus:ring-primary cursor-pointer" />
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Badges</label>
              <div className="space-y-3">
                {['Organic Certified', 'Pesticide Free', 'Same Day Delivery'].map(badge => (
                  <label key={badge} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded-lg border-primary text-primary focus:ring-primary cursor-pointer" />
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">{badge}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-gray-500 font-medium font-outfit">Showing {products.length} results</p>
          <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-full shadow-sm border border-primary/5 cursor-pointer hover:border-primary transition-all">
            <SlidersHorizontal size={16} className="text-primary" />
            <span className="text-sm font-bold text-text-dark">Sort by: Distance (Nearest First)</span>
            <ChevronDown size={16} className="text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onClick={() => onProductClick(product)}
              onAddToCart={(e) => {
                e.stopPropagation();
                onAddToCart(product.id);
              }}
            />
          ))}
        </div>
      </main>
    </div>
  );
};
