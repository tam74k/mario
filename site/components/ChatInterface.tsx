
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { ChatMessage, MessageRole } from '../types';
import { SYSTEM_PROMPT } from '../constants';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'أهلاً بكِ في ماريو بيوتي صالون بنها! أنا مساعدكِ الذكي، كيف يمكنني مساعدتكِ اليوم؟', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const model = 'gemini-3-flash-preview';
      
      const response = await ai.models.generateContent({
        model,
        contents: [
            ...messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
            { role: 'user', parts: [{ text: input }] }
        ],
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.7,
        },
      });

      const aiText = response.text || "عذراً، حدث خطأ ما. يرجى المحاولة مرة أخرى.";
      setMessages(prev => [...prev, { role: 'model', text: aiText, timestamp: new Date() }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "حدث خطأ في الاتصال بالذكاء الاصطناعي. تأكدي من الاتصال بالإنترنت.", timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-10 bg-white shadow-2xl rounded-3xl overflow-hidden border border-rose-100 flex flex-col h-[70vh]">
      <div className="bg-rose-600 p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
             </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg">المساعد الذكي لماريو بيوتي</h3>
            <p className="text-xs text-rose-100">نشط الآن للمساعدة في الحجز والأسعار</p>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-stone-50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
              msg.role === 'user' 
                ? 'bg-white text-stone-800 rounded-tr-none' 
                : 'bg-rose-500 text-white rounded-tl-none'
            }`}>
              <p className="text-sm md:text-base leading-relaxed">{msg.text}</p>
              <p className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-stone-400' : 'text-rose-100'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-end">
            <div className="bg-rose-200 p-3 rounded-2xl rounded-tl-none animate-pulse">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-stone-100 bg-white">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتبي سؤالك هنا (مثلاً: سعر الحمام المغربي كام؟)"
            className="flex-grow bg-stone-100 border-none rounded-xl px-6 py-3 text-stone-800 focus:ring-2 focus:ring-rose-500 outline-none transition-all"
          />
          <button 
            type="submit"
            disabled={loading}
            className="bg-rose-600 text-white p-3 rounded-xl hover:bg-rose-700 disabled:opacity-50 transition-colors shadow-lg shadow-rose-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
