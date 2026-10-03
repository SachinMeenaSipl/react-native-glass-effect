import { forwardRef } from 'react';
import { View, type ViewProps } from 'react-native';
import { NativeBackdrop } from '../../native/nativeBridge';

export interface GlassBackdropProps extends ViewProps {
  /**
   * Optional name. Glass views pick the right backdrop automatically;
   * use this only when a screen has more than one backdrop.
   */
  backdropId?: string;
}

/**
 * Wrap the content that glass should blur (images, lists, gradients...).
 *
 * RULE: glass views go NEXT TO / ON TOP OF the backdrop, never inside it.
 *
 * ```tsx
 * <View style={{ flex: 1 }}>
 *   <GlassBackdrop style={StyleSheet.absoluteFill}>
 *     <ScrollView>...</ScrollView>
 *   </GlassBackdrop>
 *   <LiquidGlassView style={styles.header} />   // on top, outside the backdrop
 * </View>
 * ```
 *
 * On iOS and web this is a plain <View> (those platforms blur the screen directly),
 * so the same code works everywhere.
 */
export const GlassBackdrop = forwardRef<View, GlassBackdropProps>(function GlassBackdrop(
  { backdropId, ...props },
  ref
) {
  if (NativeBackdrop) {
    return <NativeBackdrop ref={ref as never} backdropId={backdropId ?? ''} {...props} />;
  }
  return <View ref={ref} collapsable={false} {...props} />;
});

GlassBackdrop.displayName = 'GlassBackdrop';
