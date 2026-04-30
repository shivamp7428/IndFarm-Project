import React from 'react';
import { CATEGORIES } from '../../data';
import { motion } from 'motion/react';

export const Categories = () => {
  return (
    <section className="px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
      <div className="flex items-center gap-6 overflow-x-auto pb-4 hide-scrollbar">
        {CATEGORIES.map((cat, idx) => (
          <motion.button
            key={cat.name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex flex-col items-center gap-3 min-w-[100px] group"
          >
            <div className="cat-circle group-hover:border-primary transition-all">
              {cat.icon}
            </div>
            <span className="font-bold text-xs uppercase tracking-widest text-primary/60 group-hover:text-primary transition-colors">
              {cat.name}
            </span>
          </motion.button>
        ))}
      </div>
    </section>
  );
};
