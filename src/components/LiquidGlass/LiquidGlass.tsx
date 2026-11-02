import { forwardRef } from 'react';
import { Platform, type View } from 'react-native';
import { LiquidGlassView, type LiquidGlassViewProps } from '../LiquidGlassView';

export interface LiquidGlassProps extends Omit<LiquidGlassViewProps, 'material'> {
  /** 'regular' is the everyday Liquid Glass; 'clear' is a see-through lens. Default 'regular'. */
  variant?: 'regular' | 'clear';
}

/**
 * Apple-style Liquid Glass on both platforms.
 *
 * iOS 26+ uses Apple's own glass. Android uses the library's shader, tuned to match it.
 * On iOS the system owns most of the look, so only `tint`, `tintOpacity`, `cornerRadius` and
 * the border apply. Pass `iosRenderer="shader"` to make every value adjustable there too.
 *
 * ```tsx
 * <LiquidGlass style={{ padding: 16 }}><Text>Hello</Text></LiquidGlass>
 * ```
 */
export const LiquidGlass = forwardRef<View, LiquidGlassProps>(function LiquidGlass(
  { variant = 'regular', tintOpacity, iosRenderer = 'system', ...props },
  ref
) {
  // Apple's glass already has its own frost; the material's tint is for the shader.
  const systemGlass = Platform.OS === 'ios' && iosRenderer === 'system';
  return (
    <LiquidGlassView
      ref={ref}
      {...props}
      material={variant === 'clear' ? 'liquidClear' : 'liquid'}
      iosRenderer={iosRenderer}
      tintOpacity={tintOpacity ?? (systemGlass ? 0 : undefined)}
    />
  );
});

LiquidGlass.displayName = 'LiquidGlass';
