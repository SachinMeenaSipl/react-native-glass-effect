import { forwardRef } from 'react';
import { Platform, View, type ViewProps, type ViewStyle } from 'react-native';
import { hexWithAlpha } from '../../utils/color';
import type { ResolvedGlassProps } from './useResolvedGlass';

interface FallbackGlassProps extends ViewProps {
  glass: ResolvedGlassProps;
}

/**
 * Pure-JS glass used when native code is not available (Expo Go, web, tests).
 *
 * - Web: real blur through CSS `backdrop-filter`.
 * - Native without the library linked: semi-opaque tinted surface + border.
 *
 * It never crashes and keeps the same layout, so screens look acceptable
 * while a developer is still setting things up.
 */
export const FallbackGlass = forwardRef<View, FallbackGlassProps>(function FallbackGlass(
  { glass, style, children, ...rest },
  ref
) {
  const useSolid = glass.reduceTransparency;
  const tinted = hexWithAlpha(glass.tintColor, Math.max(glass.tintOpacity, 0.55));

  const surface: ViewStyle = {
    borderRadius: glass.cornerRadius,
    overflow: glass.clipContent ? 'hidden' : 'visible',
    borderWidth: glass.glassBorderWidth,
    borderColor: `rgba(255, 255, 255, ${glass.glassBorderOpacity})`,
    backgroundColor: useSolid ? glass.fallbackColor : (tinted ?? glass.fallbackColor),
  };

  if (Platform.OS === 'web' && !useSolid) {
    const webTint = hexWithAlpha(glass.tintColor, glass.tintOpacity);
    Object.assign(surface, {
      backgroundColor: webTint ?? 'rgba(255,255,255,0.12)',
      backdropFilter: `blur(${glass.blurRadius}px) saturate(160%)`,
      WebkitBackdropFilter: `blur(${glass.blurRadius}px) saturate(160%)`,
    });
  }

  return (
    <View ref={ref} {...rest} style={[surface, style]}>
      {children}
    </View>
  );
});
