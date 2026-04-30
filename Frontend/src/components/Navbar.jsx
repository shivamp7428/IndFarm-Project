import React from 'react';
import { Search, ShoppingCart, Leaf, Menu, ChevronDown } from 'lucide-react';
import { cn } from '../utils';

export const Navbar = ({ currentView, setView, cartCount }) => {
  return (
    <nav className="glass-nav h-20 px-6 md:px-12 flex items-center justify-between gap-8">
      {/* Logo Section */}
      <div 
        className="flex items-center gap-2 cursor-pointer group shrink-0"
        onClick={() => setView('home')}
      >
        <div className="bg-primary p-2 rounded-xl text-white group-hover:rotate-12 transition-transform shadow-lg">
          <Leaf size={24} />
        </div>
        <div className="flex flex-col -gap-1">
          <span className="font-heading text-2xl font-bold text-primary tracking-tighter leading-none">KisanMitra</span>
          <span className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] ml-0.5">Agriculture for All</span>
        </div>
      </div>

      {/* Amazon-style Centered Search Bar */}
      <div className="hidden md:flex flex-1 max-w-2xl items-center relative group">
        <div className="flex w-full items-center bg-white rounded-xl border-2 border-primary/10 group-focus-within:border-primary group-focus-within:shadow-lg transition-all overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-r border-gray-100 text-xs font-bold text-gray-500 hover:bg-gray-100 cursor-pointer flex items-center gap-1">
            All <ChevronDown size={14} />
          </div>
          <input 
            type="text" 
            placeholder="Search farm-fresh produce, seeds, or farmer stories..." 
            className="flex-1 px-4 py-3 bg-transparent border-none outline-none text-sm placeholder:text-gray-400"
          />
          <button className="bg-primary p-3 text-white hover:bg-primary-light transition-colors">
            <Search size={20} />
          </button>
        </div>
      </div>

      {/* User Actions Section */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="hidden lg:flex flex-col items-start leading-tight cursor-pointer hover:bg-black/5 px-3 py-1 rounded-lg transition-colors">
          <span className="text-[10px] text-gray-500 font-medium">Hello, Guest</span>
          <span className="text-sm font-bold text-text-dark flex items-center gap-1">Account & Lists <ChevronDown size={12} /></span>
        </div>

        <div 
          className="hidden lg:flex flex-col items-start leading-tight cursor-pointer hover:bg-black/5 px-3 py-1 rounded-lg transition-colors"
          onClick={() => setView('user-dashboard')}
        >
          <span className="text-[10px] text-gray-500 font-medium">Returns</span>
          <span className="text-sm font-bold text-text-dark">& Orders</span>
        </div>

        <button 
          className="relative p-2.5 hover:bg-primary/5 rounded-xl transition-colors group"
          onClick={() => setView('user-dashboard')}
        >
          <ShoppingCart size={24} className="text-text-dark group-hover:text-primary transition-colors" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              {cartCount}
            </span>
          )}
        </button>

        <button 
          onClick={() => setView('farmer-dashboard')}
          className="hidden xl:flex items-center gap-2 bg-text-dark text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary transition-all shadow-md active:scale-95"
        >
          Farmer Portal
        </button>
      </div>
    </nav>
  );
};
