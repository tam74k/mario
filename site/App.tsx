
import React, { useState } from 'react';
import { AppView } from './types';
import Header from './components/Header';
import Hero from './components/Hero';
import ServicesGrid from './components/ServicesGrid';
import ChatInterface from './components/ChatInterface';
import VoiceInterface from './components/VoiceInterface';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.LANDING);

  const renderContent = () => {
    switch (view) {
      case AppView.LANDING:
        return (
          <>
            <Hero onAction={() => setView(AppView.CHAT)} />
            <ServicesGrid />
          </>
        );
      case AppView.SERVICES:
        return <ServicesGrid />;
      case AppView.CHAT:
        return <ChatInterface />;
      case AppView.VOICE:
        return <VoiceInterface onClose={() => setView(AppView.LANDING)} />;
      default:
        return <Hero onAction={() => setView(AppView.CHAT)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500">
      <Header currentView={view} setView={setView} />
      
      <main className="flex-grow">
        {renderContent()}
      </main>

      {view !== AppView.VOICE && view !== AppView.CHAT && (
        <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
          <button
            onClick={() => setView(AppView.VOICE)}
            className="bg-rose-500 hover:bg-rose-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center"
            title="تحدث مع الذكاء الاصطناعي"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
          <button
            onClick={() => setView(AppView.CHAT)}
            className="bg-stone-800 hover:bg-stone-900 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center"
            title="دردشة كتابية"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default App;
