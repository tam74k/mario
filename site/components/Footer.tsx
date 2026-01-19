
import React from 'react';
import { SALON_NAME, LOCATION, OPENING_HOURS, MAP_LINK, FACEBOOK_LINK } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-right">
          <div>
            <h3 className="text-2xl font-playfair font-bold mb-6 text-rose-500">{SALON_NAME.split('(')[0]}</h3>
            <p className="text-stone-400 leading-relaxed">
              وجهتكِ الأولى للجمال والأناقة في بنها. نقدم كل ما تحتاجه المرأة العصرية من عناية ودلال.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-6">معلومات التواصل</h4>
            <ul className="space-y-4 text-stone-400">
              <li className="flex flex-row-reverse items-center gap-3 justify-center md:justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {LOCATION}
              </li>
              <li className="flex flex-row-reverse items-center gap-3 justify-center md:justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {OPENING_HOURS}
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">روابط سريعة</h4>
            <div className="flex gap-4 justify-center md:justify-start">
              <a 
                href={FACEBOOK_LINK} 
                target="_blank" 
                rel="noreferrer"
                className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-rose-500 transition-colors"
              >
                <span className="font-bold">fb</span>
              </a>
              <a 
                href={MAP_LINK} 
                target="_blank" 
                rel="noreferrer"
                className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-rose-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-16 pt-8 text-center text-stone-500 text-sm">
          <p>© {new Date().getFullYear()} ماريو بيوتي صالون بنها. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
