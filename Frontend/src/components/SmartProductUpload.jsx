import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Upload, Sparkles, CheckCircle, Trash2, Plus, GripVertical, Image as ImageIcon, Loader2, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';
import { cn } from '../utils'; // Ensure this utility exists or replace with standard template strings
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- Sub-component for Draggable Images ---
const SortableImage = ({ img, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: img.id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : 'auto' };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={cn(
        "relative aspect-square rounded-2xl overflow-hidden border-2 bg-white group shadow-sm transition-shadow",
        isDragging ? "shadow-2xl opacity-50 scale-105" : "border-gray-100 hover:border-primary/30"
      )}
    >
      <img src={img.url} className="w-full h-full object-cover" alt="Preview" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1.5 bg-white/20 rounded-lg backdrop-blur-sm text-white">
          <GripVertical size={14} />
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onRemove(img.id); }}
          className="p-1.5 bg-red-500 hover:bg-red-600 rounded-lg text-white transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

// --- Main Component ---
export const SmartProductUpload = ({ onClose, onSave }) => {
  // Form State
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('kg');
  const [stock, setStock] = useState('');
  
  // Gallery State
  const [suggestions, setSuggestions] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isAISearching, setIsAISearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);
  const scrollRef = useRef(null);
  const suggestionCache = useRef({});

  // Sensors for Drag and Drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
const fetchAISuggestions = useCallback(async (name) => {
  const query = name.trim();
  if (query.length < 3) return;

  // 1. Get keys and CLEAN them of any invisible characters/quotes/semicolons
  const rawKey = import.meta.env.VITE_GEMINI_API_KEY || "";
  const GEMINI_KEY = rawKey.replace(/[";]/g, "").trim(); 
  
  const rawUnsplash = import.meta.env.VITE_UNSPLASH_ACCESS_KEY || "";
  const UNSPLASH_KEY = rawUnsplash.replace(/[";]/g, "").trim();

  if (!GEMINI_KEY) {
    setError("Gemini Key is missing or invalid");
    return;
  }

  setIsAISearching(true);
  setError(null);

  try {
    // 2. Initialize with the CLEANED key
    const genAI = new GoogleGenAI(GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Give me a 1-word English noun for a photo of: ${query}. No quotes.`;
    const aiResult = await model.generateContent(prompt);
    const keyword = aiResult.response.text().trim();

    // 3. Fetch from Unsplash
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(keyword)}&per_page=12`,
      { 
        headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } 
      }
    );

    const data = await response.json();

    if (data.results) {
      setSuggestions(data.results.map(img => ({
        id: `ai-${img.id}`,
        url: img.urls.regular,
        thumb: img.urls.small,
        source: 'ai'
      })));
    }
  } catch (err) {
    console.error("SDK Error:", err);
    setError(err.message); 
  } finally {
    setIsAISearching(false);
  }
}, []);

  // Debounce Name Input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (productName) fetchAISuggestions(productName);
    }, 1000);
    return () => clearTimeout(timer);
  }, [productName, fetchAISuggestions]);

  // --- Handlers ---
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSelectedImages((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const toggleSelection = (img) => {
    setSelectedImages(prev => 
      prev.find(item => item.url === img.url) 
        ? prev.filter(item => item.url !== img.url) 
        : [...prev, img]
    );
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImgs = files.map(file => ({
      id: `up-${Math.random()}`,
      url: URL.createObjectURL(file),
      source: 'upload'
    }));
    setSelectedImages(prev => [...prev, ...newImgs]);
  };

  const onFinalSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onSave({ 
        name: productName, 
        price, 
        unit, 
        stock, 
        images: selectedImages,
        createdAt: new Date().toISOString() 
      });
      setIsSaving(false);
      setIsSuccess(true);
      setTimeout(onClose, 2000);
    }, 1500);
  };

  // --- UI Layout ---
  if (isSuccess) return <SuccessOverlay />;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        className="relative bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl">
              <Sparkles className={isAISearching ? "animate-spin" : ""} />
            </div>
            <div>
              <h2 className="text-xl font-bold uppercase tracking-tight">KisanMitra AI Upload</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Smart Marketplace Intelligence</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10">
          {/* Section 1: Info */}
          <section className="space-y-4">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Step 1: Harvest Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-4 relative">
                <input 
                  className="w-full p-5 bg-gray-50 rounded-2xl border-4 border-transparent focus:border-primary focus:bg-white outline-none text-xl font-bold transition-all"
                  placeholder="Product Name (e.g. Saffron Mangoes)"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
                {isAISearching && <Loader2 className="absolute right-5 top-5 animate-spin text-primary" />}
              </div>
              <input type="number" placeholder="Price (₹)" className="p-4 bg-gray-50 rounded-xl outline-none font-bold focus:ring-2 ring-primary/20" value={price} onChange={e => setPrice(e.target.value)} />
              <select className="p-4 bg-gray-50 rounded-xl outline-none font-bold" value={unit} onChange={e => setUnit(e.target.value)}>
                <option value="kg">Per kg</option>
                <option value="quintal">Per Quintal</option>
                <option value="piece">Per Piece</option>
              </select>
              <input type="number" placeholder="Stock" className="md:col-span-2 p-4 bg-gray-50 rounded-xl outline-none font-bold" value={stock} onChange={e => setStock(e.target.value)} />
            </div>
          </section>

          {/* Section 2: AI Suggestions */}
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Step 2: AI Suggested Images</h3>
              {error && <span className="text-[10px] text-red-500 font-bold uppercase">{error}</span>}
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar min-h-[160px]">
              {suggestions.map((img) => (
                <div 
                  key={img.id}
                  onClick={() => toggleSelection(img)}
                  className={cn(
                    "relative min-w-[160px] aspect-square rounded-2xl overflow-hidden cursor-pointer border-4 transition-all hover:scale-105",
                    selectedImages.find(s => s.url === img.url) ? "border-primary shadow-lg scale-95" : "border-transparent"
                  )}
                >
                  <img src={img.thumb} className="w-full h-full object-cover" alt="AI Suggestion" />
                  {selectedImages.find(s => s.url === img.url) && (
                    <div className="absolute inset-0 bg-primary/30 backdrop-blur-[1px] flex items-center justify-center">
                      <CheckCircle className="text-white" size={32} />
                    </div>
                  )}
                </div>
              ))}
              {!productName && (
                <div className="w-full flex items-center justify-center border-2 border-dashed rounded-3xl text-gray-300 py-10">
                  Enter product name to generate images
                </div>
              )}
            </div>
          </section>

          {/* Section 3: Reorder Preview */}
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Step 3: Preview (Drag to Reorder)</h3>
              <button onClick={() => fileInputRef.current.click()} className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1 hover:underline">
                <Upload size={14}/> Upload Own
              </button>
              <input type="file" hidden ref={fileInputRef} multiple onChange={handleFileUpload} />
            </div>
            
            <div className={cn(
              "p-6 rounded-[2.5rem] min-h-[180px] transition-colors",
              selectedImages.length > 0 ? "bg-gray-50" : "bg-gray-50/50 border-2 border-dashed border-gray-200"
            )}>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={selectedImages.map(i => i.id)} strategy={rectSortingStrategy}>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {selectedImages.map((img) => (
                      <SortableImage 
                        key={img.id} 
                        img={img} 
                        onRemove={(id) => setSelectedImages(prev => prev.filter(i => i.id !== id))} 
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
              {selectedImages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-gray-300">
                  <ImageIcon size={40} className="mb-2 opacity-20" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">No images selected</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-8 border-t flex justify-between items-center bg-gray-50/50">
          <div className="hidden md:block">
            <p className="text-[10px] font-black text-gray-400 uppercase">Selected Assets</p>
            <p className="text-xl font-black">{selectedImages.length}</p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <button onClick={onClose} className="flex-1 md:flex-none px-8 py-4 font-bold text-gray-500 hover:text-black transition-colors">Cancel</button>
            <button 
              disabled={!productName || selectedImages.length === 0 || isSaving}
              onClick={onFinalSave}
              className={cn(
                "flex-1 md:flex-none px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl",
                (!productName || selectedImages.length === 0) 
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none" 
                  : "bg-primary text-white hover:bg-primary-light active:scale-95"
              )}
            >
              {isSaving ? <Loader2 className="animate-spin" size={18}/> : <CheckCircle size={18}/>}
              {isSaving ? 'Processing...' : 'Save Harvest'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const SuccessOverlay = () => (
  <div className="fixed inset-0 z-[120] bg-primary flex flex-col items-center justify-center text-white">
    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-white text-primary p-8 rounded-full mb-8 shadow-2xl">
      <CheckCircle size={80} strokeWidth={3} />
    </motion.div>
    <h2 className="text-5xl font-black uppercase tracking-tighter">Listed Successfully</h2>
    <p className="mt-4 font-bold opacity-80 uppercase tracking-widest text-xs">Redirecting to your dashboard...</p>
  </div>
);