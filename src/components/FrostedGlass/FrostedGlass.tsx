import { forwardRef } from 'react';
import type { View } from 'react-native';
import { LiquidGlassView, type LiquidGlassViewProps } from '../LiquidGlassView';

export type FrostedGlassProps = Omit<LiquidGlassViewProps, 'iosRenderer'>;

/**
 * The library's own glass, drawn by the same shader on Android and iOS, so both look alike
 * and every prop works on both. Needs a <GlassBackdrop>, like Android always does.
 *
 * ```tsx
 * <FrostedGlass material="thick" blur={30} style={{ padding: 16 }} />
 * ```
 */
export const FrostedGlass = forwardRef<View, FrostedGlassProps>(function FrostedGlass(props, ref) {
  return <LiquidGlassView ref={ref} {...props} iosRenderer="shader" />;
});

FrostedGlass.displayName = 'FrostedGlass';
