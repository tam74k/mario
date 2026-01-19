
import React, { useEffect, useState, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { SYSTEM_PROMPT } from '../constants';

// Helper functions for audio encoding/decoding as per requirements
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

interface VoiceInterfaceProps {
  onClose: () => void;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [transcription, setTranscription] = useState<string>('');
  const [status, setStatus] = useState<string>('جاري الاتصال...');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);

  useEffect(() => {
    startSession();
    return () => {
      stopSession();
    };
  }, []);

  const startSession = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setStatus('متصل - تفضلي بالتحدث');
            setIsActive(true);
            
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
               setTranscription(prev => prev + ' ' + message.serverContent?.outputTranscription?.text);
            }

            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              const outputCtx = audioContextRef.current!;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              
              const audioBuffer = await decodeAudioData(
                decode(base64Audio),
                outputCtx,
                24000,
                1
              );
              
              const source = outputCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputCtx.destination);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
              });
              
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              for (const source of sourcesRef.current.values()) {
                source.stop();
              }
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Gemini error:', e);
            setStatus('حدث خطأ في الاتصال');
          },
          onclose: () => {
            setIsActive(false);
            setStatus('تم قطع الاتصال');
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: SYSTEM_PROMPT + "\nاجعلي ردودك قصيرة جداً ومناسبة للمحادثة الصوتية السريعة.",
        },
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error('Error starting session:', err);
      setStatus('خطأ في الوصول للميكروفون');
    }
  };

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
    }
    for (const source of sourcesRef.current.values()) {
      source.stop();
    }
    sourcesRef.current.clear();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-white text-center">
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-stone-400 hover:text-white transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="mb-12">
        <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center mb-6 transition-all duration-700 ${isActive ? 'border-rose-500 shadow-[0_0_50px_rgba(244,63,94,0.4)] scale-110' : 'border-stone-700'}`}>
          <div className={`w-24 h-24 rounded-full bg-rose-500 flex items-center justify-center ${isActive ? 'animate-pulse' : ''}`}>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
             </svg>
          </div>
        </div>
        <h2 className="text-3xl font-playfair font-bold mb-2">{status}</h2>
        <p className="text-stone-400 text-sm">مساعدكِ الصوتي جاهز لمساعدتكِ الآن</p>
      </div>

      <div className="max-w-lg w-full bg-white/5 p-6 rounded-3xl border border-white/10 min-h-[100px] flex items-center justify-center">
        <p className="text-stone-300 italic">
          {transcription || "تحدثي بخصوص الأسعار أو مواعيد الحجز في بنها..."}
        </p>
      </div>

      <div className="mt-12 flex gap-4">
         <div className={`w-2 h-2 rounded-full bg-rose-500 animate-bounce`}></div>
         <div className={`w-2 h-2 rounded-full bg-rose-500 animate-bounce [animation-delay:-0.15s]`}></div>
         <div className={`w-2 h-2 rounded-full bg-rose-500 animate-bounce [animation-delay:-0.3s]`}></div>
      </div>
    </div>
  );
};

export default VoiceInterface;
