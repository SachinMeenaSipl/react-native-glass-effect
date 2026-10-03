import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * System "reduce motion" / "remove animations" setting, live.
 * Used by LiquidGlassButton to skip its press animation.
 * (Native animations check the same setting on their own.)
 */
export function useReduceMotion(): boolean {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((v) => mounted && setEnabled(v))
      .catch(() => undefined);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setEnabled);
    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);
  return enabled;
}
