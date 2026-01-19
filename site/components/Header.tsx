
import React from 'react';
import { AppView } from '../types';
import { SALON_NAME } from '../constants';

interface HeaderProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-rose-100">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div 
          className="cursor-pointer flex items-center gap-3"
          onClick={() => setView(AppView.LANDING)}
        >
          <div className="w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center text-white font-playfair text-xl shadow-md">
            M
          </div>
          <h1 className="text-xl md:text-2xl font-playfair font-bold text-stone-800 hidden sm:block">
            {SALON_NAME.split('(')[0]}
          </h1>
        </div>

        <nav className="flex items-center gap-2 md:gap-6">
          <button
            onClick={() => setView(AppView.LANDING)}
            className={`px-3 py-2 text-sm md:text-base transition-colors ${currentView === AppView.LANDING ? 'text-rose-600 font-bold border-b-2 border-rose-600' : 'text-stone-600 hover:text-rose-500'}`}
          >
            الرئيسية
          </button>
          <button
            onClick={() => setView(AppView.SERVICES)}
            className={`px-3 py-2 text-sm md:text-base transition-colors ${currentView === AppView.SERVICES ? 'text-rose-600 font-bold border-b-2 border-rose-600' : 'text-stone-600 hover:text-rose-500'}`}
          >
            الخدمات
          </button>
          <button
            onClick={() => setView(AppView.CHAT)}
            className="bg-rose-50 text-rose-600 px-4 py-2 rounded-full text-sm md:text-base font-medium hover:bg-rose-100 transition-colors border border-rose-200"
          >
            احجزي الآن
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
