
import React from 'react';

interface HeroProps {
  onAction: () => void;
}

const Hero: React.FC<HeroProps> = ({ onAction }) => {
  return (
    <section className="relative h-[600px] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/seed/salon/1600/900" 
          alt="Beauty Salon" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-rose-50/80 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 text-right">
        <div className="max-w-2xl ml-auto">
          <span className="inline-block px-4 py-1 bg-rose-100 text-rose-600 rounded-full text-sm font-bold mb-6 tracking-wider">
            مرحباً بكِ في عالم الجمال
          </span>
          <h2 className="text-5xl md:text-7xl font-playfair font-black text-stone-900 mb-6 leading-tight">
            ماريو بيوتي صالون <br/>
            <span className="text-rose-500">بنها</span>
          </h2>
          <p className="text-xl text-stone-600 mb-10 leading-relaxed max-w-lg ml-auto">
            نقدم لكِ أفضل خدمات العناية بالشعر، البشرة، والجسم بأحدث التقنيات وأفضل الأسعار في قلب بنها.
          </p>
          <div className="flex flex-row-reverse gap-4">
            <button 
              onClick={onAction}
              className="bg-rose-600 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-xl shadow-rose-200 hover:bg-rose-700 transition-all transform hover:-translate-y-1"
            >
              احجزي مع المساعد الذكي
            </button>
            <a 
              href="#services"
              className="bg-white text-rose-600 border border-rose-200 px-8 py-4 rounded-xl text-lg font-bold hover:bg-rose-50 transition-all"
            >
              استعرضي الخدمات
            </a>
          </div>
        </div>
      </div>
      
      <div className="hidden lg:block absolute left-10 bottom-0 top-0 w-1/3 p-12">
        <div className="relative h-full w-full rounded-3xl overflow-hidden shadow-2xl rotate-3">
             <img src="https://picsum.photos/seed/face/600/800" className="w-full h-full object-cover" alt="Model" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
