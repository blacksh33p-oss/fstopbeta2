import React from 'react';
import { HardwareState } from '../types';
import { CAMERAS, LENSES_BY_GENRE, APERTURES, SHUTTERS, ISOS, FILMS, LIGHTINGS, LIGHTING_SETUPS, GRAINS, LENS_CHARS, WBS, COMPOSITIONS } from '../constants';

interface HardwarePanelProps {
  state: HardwareState;
  update: (key: keyof HardwareState, value: any) => void;
  toggleLighting: (phrase: string) => void;
}

const HardwarePanel: React.FC<HardwarePanelProps> = ({ state, update, toggleLighting }) => {
  
  const Select = ({ label, id, options, value }: { label: string, id: keyof HardwareState, options: string[], value: string }) => (
    <div className="flex flex-col gap-1.5">
       {label && <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">{label}</label>}
       <div className="relative">
         <select 
            value={value}
            onChange={(e) => update(id, e.target.value)}
            className="w-full bg-[#050505] border border-zinc-800 rounded-sm text-xs text-zinc-300 p-2.5 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none font-mono"
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2371717a' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.2em' }}
         >
            {options.map(o => <option key={o} value={o}>{o}</option>)}
         </select>
       </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      
      {/* LEFT COLUMN: Composition, Camera, Film */}
      <div className="space-y-5">
        
        {/* Composition */}
        <Select label="Composition" id="composition" options={COMPOSITIONS} value={state.composition} />

        {/* Hardware Box */}
        <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-md relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>
          <h3 className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-3">Hardware</h3>
          <div className="space-y-3">
            <Select label="Camera Body" id="camera" options={CAMERAS} value={state.camera} />
            <Select label="Lens" id="lens" options={["None", ...(LENSES_BY_GENRE[state.genre] || [])]} value={state.lens} />
          </div>
        </div>

        {/* Film & Color */}
        <div className="space-y-3 pt-1">
            <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Film & Color</label>
            <Select label="" id="film" options={FILMS} value={state.film} />
            <div className="grid grid-cols-2 gap-2">
               <Select label="" id="wb" options={WBS} value={state.wb} />
               <Select label="" id="grain" options={GRAINS} value={state.grain} />
            </div>
            <Select label="" id="lensChar" options={LENS_CHARS} value={state.lensChar} />
        </div>
      </div>

      {/* RIGHT COLUMN: Exposure, Lighting */}
      <div className="space-y-4">
        
        {/* Exposure Triangle */}
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <div>
               <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 block mb-1.5">Focal (mm)</label>
               <input 
                 type="number" 
                 value={state.focal}
                 onChange={(e) => update('focal', e.target.value)}
                 className="w-full bg-[#050505] border border-zinc-800 rounded-sm text-xs text-white p-2.5 text-center focus:border-indigo-500 outline-none font-mono"
               />
            </div>
            <Select label="Aperture" id="aperture" options={APERTURES} value={state.aperture} />
            <Select label="Shutter" id="shutter" options={SHUTTERS} value={state.shutter} />
          </div>
          <Select label="ISO Sensitivity" id="iso" options={ISOS} value={state.iso} />
        </div>

        {/* Lighting Engine */}
        <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-md mt-1">
            <h3 className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-3">Lighting Engine</h3>
            <Select label="" id="lighting" options={LIGHTINGS} value={state.lighting} />
            <div className="mt-3 flex flex-wrap gap-2">
              {LIGHTING_SETUPS.map(setup => (
                <button
                  key={setup.phrase}
                  onClick={() => toggleLighting(setup.phrase)}
                  className={`px-2 py-1 text-[9px] uppercase font-bold tracking-wide rounded-sm border transition ${
                    state.activeLightingSetups.has(setup.phrase)
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_10px_rgba(79,70,229,0.4)]'
                      : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {setup.label}
                </button>
              ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default HardwarePanel;