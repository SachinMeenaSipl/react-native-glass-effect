import { Platform } from 'react-native';
import { isNativeAvailable, nativeModule } from '../native/nativeBridge';
import { warnOnce } from '../utils/warnOnce';
import type { GlassCapabilities, GlassRenderer } from './types';

const RENDERERS: ReadonlyArray<GlassRenderer> = [
  'shader',
  'blur',
  'compat',
  'system-glass',
  'system-material',
  'fallback',
];

function fallbackCapabilities(): GlassCapabilities {
  const platform =
    Platform.OS === 'android' || Platform.OS === 'ios' || Platform.OS === 'web'
      ? Platform.OS
      : 'unknown';
  return {
    platform,
    osVersion: typeof Platform.Version === 'number' ? Platform.Version : parseFloat(String(Platform.Version)) || 0,
    bestRenderer: 'fallback',
    supportsBlur: false,
    supportsRefraction: false,
    isLowRamDevice: false,
    isPowerSaveMode: false,
    reduceTransparency: false,
    reduceMotion: false,
    isNativeAvailable: false,
  };
}

/**
 * Ask native what this device can render. Synchronous and cheap.
 * Never throws: on any problem it reports the JS fallback.
 */
export function getGlassCapabilities(): GlassCapabilities {
  if (!isNativeAvailable || !nativeModule) return fallbackCapabilities();
  try {
    const raw = nativeModule.getCapabilities();
    const renderer = (RENDERERS as string[]).includes(raw.bestRenderer)
      ? (raw.bestRenderer as GlassRenderer)
      : 'fallback';
    return {
      platform: raw.platform === 'ios' ? 'ios' : 'android',
      osVersion: raw.osVersion,
      bestRenderer: renderer,
      supportsBlur: raw.supportsBlur,
      supportsRefraction: raw.supportsRefraction,
      isLowRamDevice: raw.isLowRamDevice,
      isPowerSaveMode: raw.isPowerSaveMode,
      reduceTransparency: raw.reduceTransparency,
      reduceMotion: raw.reduceMotion,
      isNativeAvailable: true,
    };
  } catch (e) {
    warnOnce(`getCapabilities failed: ${String(e)}`);
    return fallbackCapabilities();
  }
}
