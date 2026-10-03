import { forwardRef } from 'react';
import type { View } from 'react-native';
import { LiquidGlassView, type LiquidGlassViewProps } from '../LiquidGlassView';

export interface LiquidGlassCardProps extends LiquidGlassViewProps {
  /** Inner padding in dp. Default 16. */
  padding?: number;
}

/**
 * A padded glass container for grouped content.
 * Same props as LiquidGlassView, plus `padding`. Default material: "regular".
 *
 * ```tsx
 * <LiquidGlassCard>
 *   <Text>Weather</Text>
 * </LiquidGlassCard>
 * ```
 */
export const LiquidGlassCard = forwardRef<View, LiquidGlassCardProps>(function LiquidGlassCard(
  { padding = 16, style, ...props },
  ref
) {
  return <LiquidGlassView ref={ref} {...props} style={[{ padding }, style]} />;
});

LiquidGlassCard.displayName = 'LiquidGlassCard';
