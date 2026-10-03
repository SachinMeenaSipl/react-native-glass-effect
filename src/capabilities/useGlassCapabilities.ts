import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { getGlassCapabilities } from './getGlassCapabilities';
import type { GlassCapabilities } from './types';

/**
 * Capabilities as React state. Re-reads when the app returns to the
 * foreground, because battery saver / accessibility settings may have changed.
 */
export function useGlassCapabilities(): GlassCapabilities {
  const [caps, setCaps] = useState(getGlassCapabilities);
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') setCaps(getGlassCapabilities());
    });
    return () => sub.remove();
  }, []);
  return caps;
}
