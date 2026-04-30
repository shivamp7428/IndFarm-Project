import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';

export const Hero = ({ setView }) => {
  return (
    <section className="relative h-[600px] w-full overflow-hidden">
      {/* Background Image / Pattern */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=2000" 
          alt="Agriculture" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-warm via-bg-warm/80 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 h-full flex flex-col justify-center gap-8 py-20">
        <motion.div
           initial={{ opacity: 0, x: -30 }}
           animate={{ opacity: 1, x: 0 }}
           className="inline-flex items-center gap-2 bg-accent/20 border border-accent/20 px-4 py-1 rounded-pill text-accent font-bold text-xs uppercase tracking-widest backdrop-blur-sm w-fit"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          Direct Farmer-to-Consumer
        </motion.div>

        <div className="space-y-4 max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-heading text-6xl md:text-8xl font-bold leading-[0.95] text-text-dark"
          >
            Direct from the <span className="text-primary italic">soil</span> to your table.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-700 font-medium leading-relaxed"
          >
            Skip the middlemen. Support local farmers and get the freshest organic produce delivered within 24 hours.
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <button 
            onClick={() => setView('marketplace')}
            className="w-full sm:w-auto px-10 py-5 bg-primary text-white rounded-pill font-bold shadow-2xl hover:bg-primary-light hover:scale-105 active:scale-95 transition-all text-lg flex items-center justify-center gap-3"
          >
            Shop Now <ChevronRight size={20} />
          </button>
          <button 
            onClick={() => setView('farmer-profile')}
            className="w-full sm:w-auto btn-pill btn-secondary text-lg backdrop-blur-md"
          >
            Meet Our Farmers
          </button>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: 'spring' }}
        className="absolute bottom-10 right-10 hidden xl:block w-72 bg-white/90 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl border border-primary/5 space-y-6"
      >
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Limited Offer</span>
          <h4 className="font-heading text-2xl font-bold leading-tight">Harvest Season Sale!</h4>
        </div>
        <p className="text-sm text-gray-500 font-medium">Get up to 40% off on all seasonal berries and leafy greens today.</p>
        <button 
          onClick={() => setView('marketplace')}
          className="w-full py-3 bg-accent text-white rounded-xl font-bold text-sm shadow-lg hover:bg-accent/90 transition-all active:scale-95"
        >
          Claim Discount
        </button>
      </motion.div>
    </section>
  );
};
