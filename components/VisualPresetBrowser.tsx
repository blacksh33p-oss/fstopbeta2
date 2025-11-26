import React, { useState } from 'react';
import { PRESETS } from '../constants';
import { Preset } from '../types';
import { generateSampleImage } from '../services/geminiService';
import { Image as ImageIcon, Loader2, Sparkles, X, Search } from 'lucide-react';

interface VisualPresetBrowserProps {
  onSelect: (preset: Preset) => void;
  onClose: () => void;
  currentGenre: string;
}

const VisualPresetBrowser: React.FC<VisualPresetBrowserProps> = ({ onSelect, onClose, currentGenre }) => {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  // Local state to store generated preview images for this session
  const [previewImages, setPreviewImages] = useState<Record<string, string>>({});
  const [loadingPreview, setLoadingPreview] = useState<string | null>(null);

  const categories = ['All', ...Array.from(new Set(PRESETS.map(p => p.category)))];
  
  const filteredPresets = PRESETS.filter(p => {
    const matchesCategory = filter === 'All' || p.category === filter;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleGeneratePreview = async (e: React.MouseEvent, preset: Preset) => {
    e.stopPropagation();
    if (loadingPreview) return;

    setLoadingPreview(preset.id);
    try {
      // Construct a simple prompt for the preview
      const prompt = `Artistic photography sample: ${preset.desc}. ${preset.data.vibe}. High quality, photorealistic.`;
      const imageUrl = await generateSampleImage(prompt);
      setPreviewImages(prev => ({ ...prev, [preset.id]: imageUrl }));
    } catch (err) {
      console.error("Failed to generate preview", err);
      // Fallback or error toast could go here
    } finally {
      setLoadingPreview(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-5xl h-[80vh] bg-[#09090b] border border-zinc-800 rounded-lg flex flex-col shadow-2xl relative overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-[#09090b] z-10 gap-4">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              Visual Preset Browser
            </h2>
            <p className="text-xs text-zinc-500 font-mono mt-1 hidden sm:block">
              Select a style. Click the eye icon to generate a Gemini AI preview.
            </p>
          </div>

          <div className="flex items-center gap-4">
             {/* Search Input */}
             <div className="relative group">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search styles..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-zinc-900 border border-zinc-700 text-xs text-white pl-9 pr-4 py-2.5 rounded-sm focus:border-indigo-500 outline-none w-32 sm:w-64 transition-all focus:w-48 sm:focus:w-72"
                />
             </div>

             <button onClick={onClose} className="text-zinc-500 hover:text-white transition">
                <X className="w-6 h-6" />
             </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 p-4 overflow-x-auto border-b border-zinc-800 bg-zinc-900/50">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded-sm transition whitespace-nowrap ${
                filter === cat 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
          {filteredPresets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPresets.map(preset => (
                <div 
                  key={preset.id}
                  onClick={() => onSelect(preset)}
                  className="group relative bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden cursor-pointer hover:border-indigo-500 transition-all hover:shadow-[0_0_20px_rgba(79,70,229,0.2)] flex flex-col"
                >
                  {/* Image Area */}
                  <div className="aspect-square w-full bg-zinc-950 relative overflow-hidden">
                    {previewImages[preset.id] ? (
                      <img 
                        src={previewImages[preset.id]} 
                        alt={preset.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700 bg-zinc-950/50">
                        <ImageIcon className="w-12 h-12 mb-2 opacity-20" />
                        <span className="text-[10px] font-mono uppercase opacity-40">No Preview</span>
                      </div>
                    )}

                    {/* Generate Button Overlay */}
                    <div className="absolute top-2 right-2 z-10">
                      <button
                          onClick={(e) => handleGeneratePreview(e, preset)}
                          disabled={loadingPreview === preset.id}
                          className="bg-black/60 hover:bg-indigo-600 backdrop-blur-sm p-2 rounded-full text-white transition border border-white/10"
                          title="Generate Sample with Gemini"
                      >
                          {loadingPreview === preset.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Sparkles className="w-4 h-4" />
                          )}
                      </button>
                    </div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[9px] font-bold text-zinc-300 border border-white/10 uppercase tracking-wider z-10">
                      {preset.category}
                    </div>
                  </div>

                  {/* Info Area */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-sm font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">{preset.title}</h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{preset.desc}</p>
                    
                    <div className="mt-4 pt-3 border-t border-zinc-800 flex gap-2 text-[10px] text-zinc-500 font-mono">
                      <span>{preset.data.camera || "Generic Camera"}</span>
                      <span>•</span>
                      <span>{preset.data.film || "Digital"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500">
               <Search className="w-12 h-12 mb-4 opacity-20" />
               <p className="text-sm font-mono">No presets found matching "{searchQuery}"</p>
               <button 
                  onClick={() => setSearchQuery('')}
                  className="mt-4 px-4 py-2 bg-zinc-800 rounded-sm text-xs text-white hover:bg-zinc-700 transition"
               >
                 Clear Search
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisualPresetBrowser;