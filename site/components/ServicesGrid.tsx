
import React, { useState } from 'react';
import { SERVICES } from '../constants';

const ServicesGrid: React.FC = () => {
  const categories = Array.from(new Set(SERVICES.map(s => s.category)));
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredServices = selectedCategory 
    ? SERVICES.filter(s => s.category === selectedCategory)
    : SERVICES;

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-playfair font-bold text-stone-800 mb-4">خدماتنا وأسعارنا</h2>
          <div className="w-24 h-1 bg-rose-500 mx-auto rounded-full mb-8"></div>
          
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${!selectedCategory ? 'bg-rose-500 text-white' : 'bg-stone-100 text-stone-600 hover:bg-rose-50'}`}
            >
              الكل
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat ? 'bg-rose-500 text-white' : 'bg-stone-100 text-stone-600 hover:bg-rose-50'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredServices.map((service, index) => (
            <div 
              key={index}
              className="bg-stone-50 border border-stone-100 p-6 rounded-2xl hover:shadow-lg hover:border-rose-100 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded uppercase tracking-wider">
                  {service.category}
                </span>
                <span className="text-xl font-bold text-stone-800 font-playfair">
                  {service.price} <span className="text-sm font-sans font-normal text-stone-500">ج.م</span>
                </span>
              </div>
              <h3 className="text-lg font-bold text-stone-700 group-hover:text-rose-600 transition-colors">
                {service.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
