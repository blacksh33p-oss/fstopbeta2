
import React, { useState, useEffect } from 'react';
import { HardwareState, Preset, GeneratedPrompts } from './types';
import { PRESETS } from './constants';
import HardwarePanel from './components/HardwarePanel';
import VisualPresetBrowser from './components/VisualPresetBrowser';
import { Copy, RefreshCw, Aperture, History, Search, Dice5, Coffee, Crown } from 'lucide-react';

const App: React.FC = () => {
  // --- STATE ---
  const [state, setState] = useState<HardwareState>({
    scene: '',
    location: '',
    datetime: '',
    genre: 'portrait',
    camera: 'None',
    lens: '50mm prime',
    focal: '50',
    aperture: 'f/2.8',
    shutter: '1/125s',
    iso: '100',
    film: 'None',
    wb: 'None',
    grain: 'None',
    lensChar: 'None',
    lighting: 'None',
    activeLightingSetups: new Set(),
    composition: 'Rule of Thirds',
    productSubgenre: 'None',
    ar: '16:9',
    model: 'midjourney',
    presetId: 'none',
    photographerStyle: 'None',
    presetDescription: '',
    vibe: ''
  });

  const [prompts, setPrompts] = useState<GeneratedPrompts>({ main: '', cine: '', grit: '', prod: '' });
  const [showBrowser, setShowBrowser] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // --- ACTIONS ---
  const update = (key: keyof HardwareState, value: any) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const toggleLighting = (phrase: string) => {
    setState(prev => {
      const newSet = new Set(prev.activeLightingSetups);
      if (newSet.has(phrase)) newSet.delete(phrase);
      else newSet.add(phrase);
      return { ...prev, activeLightingSetups: newSet };
    });
  };

  const applyPreset = (preset: Preset) => {
    setState(prev => ({
      ...prev,
      presetId: preset.id,
      vibe: preset.data.vibe || '',
      presetDescription: preset.desc,
      genre: preset.data.genre || prev.genre,
      camera: preset.data.camera || prev.camera,
      lens: preset.data.lens || prev.lens,
      focal: preset.data.focal?.toString() || prev.focal,
      aperture: preset.data.aperture || prev.aperture,
      shutter: preset.data.shutter || prev.shutter,
      iso: preset.data.iso || prev.iso,
      lighting: preset.data.lighting || prev.lighting,
      film: preset.data.film || prev.film,
      wb: preset.data.wb || prev.wb,
      grain: preset.data.grain || prev.grain,
      lensChar: preset.data.lensChar || prev.lensChar,
      composition: preset.data.composition || prev.composition,
      productSubgenre: preset.data.productSubgenre || prev.productSubgenre,
      activeLightingSetups: new Set(preset.data.lightingSetups || []),
      photographerStyle: preset.title
    }));
    setShowBrowser(false);
  };

  const handleRandomize = () => {
    const randomPreset = PRESETS[Math.floor(Math.random() * PRESETS.length)];
    applyPreset(randomPreset);
  };

  // --- PROMPT GENERATION LOGIC ---
  useEffect(() => {
    const scenePart = state.scene.trim() || "A cinematic scene";
    const locPart = state.location ? ` at ${state.location}` : "";
    const techParts = [state.aperture, state.shutter, state.iso !== 'None' ? `ISO ${state.iso}` : ''].filter(x => x && x !== 'None').join(", ");
    const lightingExtras = Array.from(state.activeLightingSetups).join(", ");
    const lensCharPart = state.lensChar !== 'None' ? state.lensChar : '';
    
    // Construct Main Prompt Block
    let blocks = [];
    blocks.push(`${scenePart}${locPart}, ${state.genre} photography`);
    blocks.push(`Shot on ${state.camera}, ${state.lens} ${state.focal}mm${techParts ? `, ${techParts}` : ""}`);
    
    let styleBlock = [];
    if(state.lighting !== 'None') styleBlock.push(state.lighting);
    if(lightingExtras) styleBlock.push(lightingExtras);
    if(state.composition !== 'None') styleBlock.push(state.composition);
    if(state.film !== 'None') styleBlock.push(state.film);
    if(state.wb !== 'None') styleBlock.push(state.wb);
    if(state.grain !== 'None') styleBlock.push(state.grain);
    if(lensCharPart) styleBlock.push(lensCharPart);
    if(state.vibe) styleBlock.push(state.vibe);
    
    if(styleBlock.length > 0) blocks.push(styleBlock.join(", "));

    const core = blocks.join(".\n\n");
    const arSuffix = ` --ar ${state.ar}`;

    setPrompts({
      main: `${core}\n\n--style raw --s 250${arSuffix}`,
      cine: `${core}, cinematic lighting, dramatic atmosphere\n\n--style raw${arSuffix}`,
      grit: `${core}, high contrast, grainy, raw street photography\n\n--style raw${arSuffix}`,
      prod: `${core}, commercial lighting, hyper-detailed, 8k\n\n${arSuffix}`
    });

  }, [state]);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate "Processing" visual feedback
    setTimeout(() => setIsGenerating(false), 800);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Gradient Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 sticky top-0 z-40 opacity-70"></div>
      
      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full p-4 md:p-8 flex-grow grid lg:grid-cols-12 gap-8 relative z-10">
        
        {/* LEFT COLUMN: Controls */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Header */}
          <div className="flex justify-between items-end border-b border-zinc-800 pb-6">
             <div>
               <div className="flex items-center gap-2 mb-2">
                 <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse"></div>
                 <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">System Online</span>
               </div>
               <h1 className="text-4xl font-bold tracking-tighter text-white flex items-center gap-3">
                 <Aperture className="w-8 h-8 text-indigo-500" />
                 <span className="font-mono">f-stop<span className="text-indigo-500">.ai</span></span>
               </h1>
             </div>
             
             {/* LCD Display */}
             <div className="hidden md:flex font-lcd bg-[#9ea792] text-zinc-900 border-2 border-zinc-700 rounded-sm px-4 py-2 gap-6 shadow-inner items-center opacity-90">
                <div className="text-center">
                  <div className="text-[8px] font-bold opacity-60">SHUTTER</div>
                  <div className="text-xl font-bold leading-none">{state.shutter === 'None' ? '--' : state.shutter}</div>
                </div>
                <div className="w-px h-6 bg-black/20"></div>
                <div className="text-center">
                  <div className="text-[8px] font-bold opacity-60">APERTURE</div>
                  <div className="text-xl font-bold leading-none">{state.aperture === 'None' ? '--' : state.aperture}</div>
                </div>
                <div className="w-px h-6 bg-black/20"></div>
                <div className="text-center">
                  <div className="text-[8px] font-bold opacity-60">ISO</div>
                  <div className="text-xl font-bold leading-none">{state.iso === 'None' ? '--' : state.iso}</div>
                </div>
                <div className="w-px h-6 bg-black/20"></div>
                <div className="text-center">
                  <div className="text-[8px] font-bold opacity-60">FOCAL</div>
                  <div className="text-xl font-bold leading-none">{state.focal ? state.focal : '--'}</div>
                </div>
             </div>
          </div>

          {/* Scene Input */}
          <div className="relative group">
            <textarea
              value={state.scene}
              onChange={(e) => update('scene', e.target.value)}
              placeholder="INPUT SCENE DATA (e.g., A futuristic samurai in a neon rainstorm)..."
              className="w-full bg-[#09090b] border border-zinc-800 rounded-sm text-sm text-white p-4 h-24 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-none font-mono placeholder-zinc-700 transition-colors"
            />
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-focus-within:opacity-100 transition-opacity rounded-l-sm"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <input type="text" placeholder="Location (e.g. Tokyo)" value={state.location} onChange={(e) => update('location', e.target.value)} className="bg-[#09090b] border border-zinc-800 p-2 text-xs text-white rounded-sm focus:border-indigo-500 outline-none" />
             <input type="datetime-local" value={state.datetime} onChange={(e) => update('datetime', e.target.value)} className="bg-[#09090b] border border-zinc-800 p-2 text-xs text-white rounded-sm focus:border-indigo-500 outline-none" />
          </div>

          {/* Preset Selector Button */}
          <div className="bg-[#09090b] border border-zinc-800 rounded-md p-4 flex items-center justify-between relative overflow-hidden">
             <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none"></div>
             <div>
                <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">Active Preset</label>
                <div className="text-lg font-bold text-white">{state.photographerStyle !== 'None' ? state.photographerStyle : 'Manual Mode'}</div>
                {state.presetDescription && (
                  <div className="text-xs text-zinc-400 mt-1 max-w-md truncate">{state.presetDescription}</div>
                )}
             </div>
             <div className="flex gap-2 relative z-10">
               <button 
                  onClick={handleRandomize}
                  className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-indigo-400 hover:text-indigo-300 px-3 py-2 rounded-sm text-xs font-bold uppercase tracking-wide transition border border-zinc-700 hover:border-zinc-500"
                  title="Random Preset"
               >
                  <Dice5 className="w-3 h-3" /> Random
               </button>
               <button 
                  onClick={() => setShowBrowser(true)}
                  className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wide transition border border-zinc-700 hover:border-zinc-500"
               >
                  <Search className="w-3 h-3" /> Browse Presets
               </button>
             </div>
          </div>

          {/* Hardware Controls */}
          <HardwarePanel state={state} update={update} toggleLighting={toggleLighting} />

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-white text-black font-black text-xs uppercase tracking-[0.2em] py-4 rounded-sm hover:bg-zinc-200 transition shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2"
          >
            {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Generate Prompt"}
          </button>

          {/* Social / Support Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <a href="https://buymeacoffee.com/fdashstop" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-3 border border-zinc-800 bg-zinc-900/50 rounded-sm text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-yellow-500 hover:border-yellow-500/50 transition-colors group">
              <Coffee className="w-3 h-3 group-hover:scale-110 transition-transform" />
              Buy Coffee
            </a>
            <a href="https://buymeacoffee.com/fdashstop/membership" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-3 border border-zinc-800 bg-zinc-900/50 rounded-sm text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-indigo-500 hover:border-indigo-500/50 transition-colors group">
              <Crown className="w-3 h-3 group-hover:scale-110 transition-transform" />
              Become Member
            </a>
          </div>

        </div>

        {/* RIGHT COLUMN: Output */}
        <div className="lg:col-span-5 space-y-6">
           
           {/* Model Tabs */}
           <div className="flex justify-center bg-zinc-900 border border-zinc-800 rounded-sm p-1 gap-1 sticky top-6 z-20">
              {['midjourney', 'flux', 'dalle'].map(m => (
                 <button
                    key={m}
                    onClick={() => update('model', m)}
                    className={`flex-1 px-3 py-1 text-[9px] font-bold uppercase rounded-sm transition ${state.model === m ? 'bg-indigo-600 text-white' : 'text-zinc-500 hover:text-white'}`}
                 >
                    {m}
                 </button>
              ))}
           </div>

           {/* Aspect Ratio */}
           <div className="flex gap-2 justify-center">
              {['1:1', '16:9', '9:16', '21:9'].map(ratio => (
                 <button
                   key={ratio}
                   onClick={() => update('ar', ratio)}
                   className={`px-3 py-2 border rounded-sm text-[10px] font-bold ${state.ar === ratio ? 'border-indigo-500 bg-indigo-500/10 text-white' : 'border-zinc-800 bg-zinc-900 text-zinc-500'}`}
                 >
                   {ratio}
                 </button>
              ))}
           </div>

           {/* Outputs */}
           <div className="space-y-4">
              <OutputCard title="Master Prompt" content={prompts.main} onCopy={() => copyToClipboard(prompts.main)} highlight />
              <div className="grid grid-rows-3 gap-4 opacity-80">
                 <OutputCard title="Cinematic Variant" content={prompts.cine} onCopy={() => copyToClipboard(prompts.cine)} />
                 <OutputCard title="Gritty / Raw Variant" content={prompts.grit} onCopy={() => copyToClipboard(prompts.grit)} />
                 <OutputCard title="Commercial Variant" content={prompts.prod} onCopy={() => copyToClipboard(prompts.prod)} />
              </div>
           </div>

        </div>
      </main>

      {/* Visual Browser Modal */}
      {showBrowser && (
        <VisualPresetBrowser 
          onSelect={applyPreset} 
          onClose={() => setShowBrowser(false)} 
          currentGenre={state.genre}
        />
      )}
    </div>
  );
};

const OutputCard: React.FC<{ title: string, content: string, onCopy: () => void, highlight?: boolean }> = ({ title, content, onCopy, highlight }) => (
  <div className={`relative rounded-md overflow-hidden border transition-all duration-300 ${highlight ? 'bg-black/40 border-indigo-500/50 shadow-[0_0_30px_-10px_rgba(79,70,229,0.2)]' : 'bg-black/20 border-zinc-800'}`}>
     <div className="flex justify-between items-center px-4 py-2 border-b border-white/5 bg-white/5">
        <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">{title}</span>
        <button onClick={onCopy} className="text-zinc-500 hover:text-white transition"><Copy className="w-3 h-3" /></button>
     </div>
     <textarea 
        readOnly 
        value={content} 
        className="w-full bg-transparent border-none text-xs text-zinc-300 p-4 font-mono focus:ring-0 resize-none h-32 leading-relaxed"
     />
  </div>
);

export default App;
