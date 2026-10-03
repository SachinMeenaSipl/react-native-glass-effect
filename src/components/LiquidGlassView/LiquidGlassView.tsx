import { forwardRef } from 'react';
import { Platform, type View } from 'react-native';
import { NativeGlassView, isNativeAvailable } from '../../native/nativeBridge';
import { splitGlassProps } from '../../utils/splitGlassProps';
import { warnOnce } from '../../utils/warnOnce';
import { FallbackGlass } from './FallbackGlass';
import type { LiquidGlassViewProps } from './LiquidGlassView.types';
import { useResolvedGlass } from './useResolvedGlass';

/**
 * The core glass surface. Every other component is built from this.
 *
 * ```tsx
 * <LiquidGlassView material="regular" style={{ padding: 16 }}>
 *   <Text>Hello</Text>
 * </LiquidGlassView>
 * ```
 *
 * Android: put the content you want to see through the glass inside a
 * <GlassBackdrop>, and render the glass OUTSIDE (on top of) that backdrop.
 */
export const LiquidGlassView = forwardRef<View, LiquidGlassViewProps>(function LiquidGlassView(
  props,
  ref
) {
  const { glass: glassProps, rest } = splitGlassProps(props);
  const { style, children, pressed, ...viewProps } = rest;
  const glass = useResolvedGlass(glassProps, style);

  if (!NativeGlassView) {
    if (!isNativeAvailable && Platform.OS !== 'web') {
      warnOnce(
        'Native code not found, rendering a plain fallback. Rebuild the app after installing ' +
          '(npx react-native run-android / pod install). Expo Go is not supported — use a dev build.'
      );
    }
    return (
      <FallbackGlass ref={ref} glass={glass} style={style} {...viewProps}>
        {children}
      </FallbackGlass>
    );
  }

  return (
    <NativeGlassView
      ref={ref as never}
      {...viewProps}
      // Keep RN's own borderRadius in sync so shadows/hit-testing match the glass shape.
      style={[{ borderRadius: glass.cornerRadius }, style]}
      blurRadius={glass.blurRadius}
      tintColor={glass.tintColor}
      tintOpacity={glass.tintOpacity}
      refraction={glass.refraction}
      distortion={glass.distortion}
      illumination={glass.illumination}
      lightAngle={glass.lightAngle}
      chromaticAberration={glass.chromaticAberration}
      edgeWidth={glass.edgeWidth}
      cornerRadius={glass.cornerRadius}
      glassBorderWidth={glass.glassBorderWidth}
      glassBorderOpacity={glass.glassBorderOpacity}
      appearance={glass.appearance}
      quality={glass.quality}
      reduceTransparency={glass.reduceTransparency}
      fallbackColor={glass.fallbackColor}
      backdropId={glass.backdropId}
      pressed={pressed ?? false}
      interactive={glass.interactive}
      motionLighting={glass.motionLighting}
      transitionDuration={glass.transitionDuration}
      clipContent={glass.clipContent}
    >
      {children}
    </NativeGlassView>
  );
});

LiquidGlassView.displayName = 'LiquidGlassView';
