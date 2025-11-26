
export interface PresetData {
  genre?: string;
  camera?: string;
  lens?: string;
  focal?: number | string;
  aperture?: string;
  shutter?: string;
  iso?: string;
  lighting?: string;
  composition?: string;
  film?: string;
  wb?: string;
  grain?: string;
  lensChar?: string;
  productSubgenre?: string;
  lightingSetups?: string[];
  vibe?: string;
}

export interface Preset {
  id: string;
  title: string;
  desc: string;
  category: string;
  data: PresetData;
}

export interface HardwareState {
  scene: string;
  location: string;
  datetime: string; // ISO string
  
  genre: string;
  camera: string;
  lens: string;
  focal: string;
  
  aperture: string;
  shutter: string;
  iso: string;
  
  film: string;
  wb: string;
  grain: string;
  lensChar: string;
  
  lighting: string;
  activeLightingSetups: Set<string>;
  
  composition: string;
  productSubgenre: string;
  
  ar: string; // "16:9", "1:1", etc.
  model: 'midjourney' | 'flux' | 'dalle';
  
  presetId: string;
  photographerStyle: string;
  presetDescription: string;
  vibe: string;
}

export interface GeneratedPrompts {
  main: string;
  cine: string;
  grit: string;
  prod: string;
}
