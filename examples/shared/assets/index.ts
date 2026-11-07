/// <reference path="./images.d.ts" />
import type { ImageSourcePropType } from 'react-native';
import art1 from './art-1.jpg';
import art2 from './art-2.jpg';
import art3 from './art-3.jpg';
import art4 from './art-4.jpg';
import art5 from './art-5.jpg';
import art6 from './art-6.jpg';
import art7 from './art-7.jpg';
import art8 from './art-8.jpg';
import auroraJpg from './aurora.jpg';
import mapJpg from './map.jpg';

// Metro gives an asset id, Vite a URL string. <Image> accepts both once wrapped.
const source = (asset: unknown): ImageSourcePropType =>
  typeof asset === 'string' ? { uri: asset } : (asset as ImageSourcePropType);

export const aurora = source(auroraJpg);
export const map = source(mapJpg);

/** Generated artwork used as album covers, photos and app icons in the examples. */
export const ART = [
  { title: 'Golden Hour', artist: 'Lumen', image: source(art1) },
  { title: 'Ripple', artist: 'Blue Static', image: source(art2) },
  { title: 'Solar', artist: 'Aria Vale', image: source(art3) },
  { title: 'Tidal', artist: 'Northbound', image: source(art4) },
  { title: 'Pulse', artist: 'Field Notes', image: source(art5) },
  { title: 'Prism', artist: 'Kite Theory', image: source(art6) },
  { title: 'Ascent', artist: 'Low Orbit', image: source(art7) },
  { title: 'Equalizer', artist: 'Midnight FM', image: source(art8) },
];
