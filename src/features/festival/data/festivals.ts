import type { FestivalDoc } from '../types/festival';

import festA from './antihero-fest.sample.json';
import festB from './doom-valley.sample.json';
import festC from './bloodstock-2026.json';

export type FestivalMeta = {
  id: string;
  name: string;
  location?: string;
  dates?: string;
  image?: string;
};

const docs: Record<string, FestivalDoc> = {
  'antihero-fest-2026': festA as FestivalDoc,
  'doom-valley-2026': festB as FestivalDoc,
  'bloodstock-2026': festC as FestivalDoc,
};

export const FESTIVALS: FestivalMeta[] = [
  {
    id: 'antihero-fest-2026',
    name: 'Antihero Fest',
    location: 'Kansas City',
    dates: 'Jul 17–18, 2026',
    image: '/festivals/antihero-fest.jpg',
  },
  {
    id: 'doom-valley-2026',
    name: 'Doom Valley',
    location: 'Chicago',
    dates: 'Aug 22–23, 2026',
    image: '/festivals/doom-valley.jpg',
  },
  {
    id: 'bloodstock-2026',
    name: 'Bloodstock Open Air 2026',
    location: 'Derbyshire, UK',
    dates: 'Aug 6–9, 2026',
    image: '/festivals/bloodstock-2026.jpg',
  },
];

export function getFestivalDoc(id: string): FestivalDoc | null {
  return docs[id] ?? null;
}
