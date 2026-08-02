import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, Minus, RefreshCw, Maximize2, Search, TrendingUp, MapPin, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { motion, AnimatePresence, useDragControls } from 'motion/react';
import { cn } from '../utils';

const QUICK_ACTIONS = [
  { label: 'Search tomatoes', icon: <Search size={14} /> },
  { label: "Today's prices", icon: <TrendingUp size={14} /> },
  { label: 'Find nearby farmers', icon: <MapPin size={14} /> },
];

export const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { id: '1', role: 'model', text: 'Namaste! I am your KisanMitra AI assistant. How can I help you with your farming or shopping today? 🌿' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [size, setSize] = useState({ width: 400, height: 550 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [btnPosition, setBtnPosition] = useState({ x: 0, y: 0 });
  const [isListening, setIsListening] = useState(false);
  const [speakingId, setSpeakingId] = useState(null);

  const scrollRef = useRef(null);
  const dragControls = useDragControls();
  const recognitionRef = useRef(null);

  // Load saved state
  useEffect(() => {
    const savedPos = localStorage.getItem('chatbot-pos');
    const savedBtnPos = localStorage.getItem('chatbot-btn-pos');
    const savedSize = localStorage.getItem('chatbot-size');
    if (savedPos) setPosition(JSON.parse(savedPos));
    if (savedBtnPos) setBtnPosition(JSON.parse(savedBtnPos));
    if (savedSize) setSize(JSON.parse(savedSize));
  }, []);

  useEffect(() => {
    if (isOpen) {
      localStorage.setItem('chatbot-size', JSON.stringify(size));
    }
  }, [size, isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isMinimized]);

  // ==================== VOICE INPUT (Only Fill Input - No Auto Send) ====================
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionAPI();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'hi-IN';        // Good for Hinglish

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);           // Only put in input box
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  // ==================== TEXT TO SPEECH (Unchanged) ====================
  const speakMessage = (text, id) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1;

    utterance.onend = () => setSpeakingId(null);

    window.speechSynthesis.speak(utterance);
    setSpeakingId(id);
  };

  // ==================== HANDLE SEND (Original Logic) ====================
  const handleSend = async (text = input) => {
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage = { id: Date.now().toString(), role: 'user', text: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const key = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!key || key === 'undefined') {
        setIsLoading(false);
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          role: 'model', 
          text: "API Key is missing in your local environment. Please create a .env file in your VS Code project and add GEMINI_API_KEY=your_key_here! 🌿" 
        }]);
        return;
      }

      const ai = new GoogleGenAI({ apiKey: key });
      
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `You are KisanMitra (Farmer's Friend), a premium AI assistant for an Indian agricultural marketplace.
          - Tone: Professional, agricultural, modern startup vibe.
          - Features: Help with crop diseases, shopping for fresh produce, and local farm connections.
          - Context: You are in a high-end Farmer-to-Consumer marketplace.
          - Keep responses helpful but concise. Use emojis like 🚜, 🌽, 🍎 occasionally.`,
        }
      });

      const response = await chat.sendMessage({
        message: messageText,
      });

      const botMessage = { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: response.text || "I'm sorry, I couldn't process that request." 
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.warn('Chat AI unavailable:', error);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'model', 
        text: "I'm having a little trouble connecting right now. Please try again in a moment! 🌿" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([{ id: '1', role: 'model', text: 'Chat reset. How can I help you fresh? 🌿' }]);
    setSpeakingId(null);
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported in your browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInput(''); // Clear previous input
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            drag
            dragMomentum={false}
            onDragEnd={(_, info) => {
              const newPos = { x: btnPosition.x + info.offset.x, y: btnPosition.y + info.offset.y };
              setBtnPosition(newPos);
              localStorage.setItem('chatbot-btn-pos', JSON.stringify(newPos));
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              x: btnPosition.x,
              y: btnPosition.y
            }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-20 right-6 md:bottom-8 md:right-8 z-50 p-4 bg-emerald-600 text-white rounded-full shadow-[0_10px_40px_rgba(5,150,105,0.3)] border-2 border-white transition-shadow overflow-hidden group cursor-grab active:cursor-grabbing"
          >
            <div className="relative z-10 pointer-events-none">
              <MessageCircle size={28} className="group-hover:rotate-12 transition-transform" />
              <div className="absolute -top-1 -right-1 bg-yellow-400 w-3 h-3 rounded-full border-2 border-emerald-600 animate-pulse"></div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            drag
            dragControls={dragControls}
            dragMomentum={false}
            dragElastic={0}
            onDragEnd={(_, info) => {
              const newPos = { x: position.x + info.offset.x, y: position.y + info.offset.y };
              setPosition(newPos);
              localStorage.setItem('chatbot-pos', JSON.stringify(newPos));
            }}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              height: isMinimized ? 80 : size.height,
              width: window.innerWidth < 768 ? 'calc(100vw - 32px)' : size.width
            }}
            style={{ 
              x: position.x,
              y: position.y
            }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className={cn(
              "fixed z-50 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden border border-emerald-100",
              isMinimized ? "rounded-2xl" : "rounded-[2.5rem]",
              "bottom-20 right-4 md:bottom-8 md:right-8"
            )}
          >
            {/* Header - Unchanged */}
            <div 
              onPointerDown={(e) => dragControls.start(e)}
              className="bg-gradient-to-r from-emerald-700 to-emerald-600 p-5 text-white flex items-center justify-between cursor-grab active:cursor-grabbing shrink-0 relative"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                  <Bot size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base leading-none tracking-tight">KisanMitra AI</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_8px_#FACC15]" />
                    <span className="text-[9px] uppercase tracking-widest font-bold text-emerald-100">Live Assistant</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1" onPointerDown={e => e.stopPropagation()}>
                <button onClick={resetChat} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors" title="Reset">
                  <RefreshCw size={16} />
                </button>
                <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors" title="Minimize">
                  <Minus size={16} />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-red-500/80 rounded-lg transition-colors" title="Close">
                  <X size={16} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages Area */}
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-6 space-y-5 bg-gradient-to-b from-emerald-50/50 to-white"
                >
                  {messages.map((msg) => (
                    <div 
                      key={msg.id}
                      className={cn(
                        "flex flex-col gap-1.5 max-w-[85%]",
                        msg.role === 'user' ? "ml-auto items-end" : "items-start"
                      )}
                    >
                      <div className={cn(
                        "flex items-center gap-2 mb-0.5",
                        msg.role === 'user' ? "flex-row-reverse" : ""
                      )}>
                        <div className={cn(
                          "p-1 rounded-md",
                          msg.role === 'user' ? "bg-emerald-100 text-emerald-700" : "bg-emerald-700 text-white"
                        )}>
                          {msg.role === 'user' ? <User size={10} /> : <Bot size={10} />}
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-800/40">
                          {msg.role === 'user' ? 'You' : 'KisanMitra'}
                        </span>
                      </div>

                      <div className="flex items-start gap-3 w-full">
                        <div className={cn(
                          "px-4 py-3 rounded-2xl text-[13px] leading-relaxed shadow-sm flex-1",
                          msg.role === 'user' 
                            ? "bg-emerald-600 text-white rounded-tr-none font-medium" 
                            : "bg-white text-slate-700 border border-emerald-100 rounded-tl-none font-medium"
                        )}>
                          {msg.text}
                        </div>

                        {msg.role === 'model' && (
                          <button
                            onClick={() => speakMessage(msg.text, msg.id)}
                            className="mt-1.5 p-2 rounded-xl hover:bg-emerald-100 text-emerald-600 hover:text-emerald-700 transition-all"
                            title="Listen"
                          >
                            {speakingId === msg.id ? (
                              <VolumeX size={18} className="animate-pulse" />
                            ) : (
                              <Volume2 size={18} />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex items-center gap-2 text-emerald-600">
                      <Sparkles size={14} className="animate-spin" />
                      <span className="text-[10px] font-bold uppercase tracking-widest animate-pulse">Consulting the fields...</span>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="px-6 pb-2 mt-auto flex gap-2 overflow-x-auto no-scrollbar whitespace-nowrap">
                  {QUICK_ACTIONS.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(action.label)}
                      className="bg-white border border-emerald-200 px-3 py-1.5 rounded-full text-[10px] font-bold text-emerald-700 flex items-center gap-1.5 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm"
                    >
                      {action.icon} {action.label}
                    </button>
                  ))}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-emerald-50">
                  <div className="bg-emerald-50/50 rounded-2xl p-1.5 flex items-center gap-2 border border-emerald-100 focus-within:border-emerald-300 focus-within:bg-white transition-all">
                    <button
                      onClick={toggleVoiceInput}
                      className={cn(
                        "p-3 rounded-xl transition-all",
                        isListening ? "bg-red-100 text-red-600 animate-pulse" : "hover:bg-emerald-100 text-emerald-600"
                      )}
                      title={isListening ? "Listening..." : "Voice Input"}
                    >
                      {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                    </button>

                    <input 
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Ask about crops or prices... (Tap mic to speak)"
                      className="flex-1 bg-transparent border-none outline-none px-4 py-2.5 text-sm font-medium text-emerald-900 placeholder:text-emerald-300"
                    />

                    <button 
                      onClick={() => handleSend()}
                      disabled={!input.trim() || isLoading}
                      className={cn(
                        "p-3 rounded-xl transition-all shadow-md active:scale-95",
                        !input.trim() || isLoading 
                          ? "bg-emerald-200 text-emerald-400 cursor-not-allowed" 
                          : "bg-emerald-600 text-white hover:bg-emerald-700"
                      )}
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>

                {/* Resize Handle */}
                <div 
                  className="absolute bottom-1 right-1 w-4 h-4 cursor-nwse-resize flex items-center justify-center opacity-20 hover:opacity-100 transition-opacity"
                  onMouseDown={(e) => {
                    const startX = e.clientX;
                    const startY = e.clientY;
                    const startW = size.width;
                    const startH = size.height;

                    const onMouseMove = (moveE) => {
                      const newW = Math.max(320, Math.min(800, startW + (moveE.clientX - startX)));
                      const newH = Math.max(400, Math.min(800, startH + (moveE.clientY - startY)));
                      setSize({ width: newW, height: newH });
                    };

                    const onMouseUp = () => {
                      document.removeEventListener('mousemove', onMouseMove);
                      document.removeEventListener('mouseup', onMouseUp);
                    };

                    document.addEventListener('mousemove', onMouseMove);
                    document.addEventListener('mouseup', onMouseUp);
                  }}
                >
                  <Maximize2 size={12} className="rotate-90 text-emerald-400" />
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};