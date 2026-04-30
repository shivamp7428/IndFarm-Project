import React from 'react';

export const Stats = () => {
  return (
    <section className="w-full bg-primary py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-wrap justify-between gap-8 text-white">
        {[
          { label: '12k+ Farmers', val: 'Direct support' },
          { label: '50k+ Orders', val: 'Freshly delivered' },
          { label: '120+ Cities', val: 'Wide coverage' },
          { label: '4.9/5 Rating', val: 'Customer trust' }
        ].map((stat, idx) => (
          <div key={idx} className="flex-1 min-w-[200px] text-center md:text-left">
            <h3 className="font-heading text-3xl font-bold mb-1">
              {stat.label.split(' ')[0]} 
              <span className="text-xl font-normal opacity-80"> {stat.label.split(' ')[1]}</span>
            </h3>
            <p className="text-sm uppercase tracking-widest font-bold opacity-60">{stat.val}</p>
          </div>
        ))}
      </div>
    </section>
  );
};