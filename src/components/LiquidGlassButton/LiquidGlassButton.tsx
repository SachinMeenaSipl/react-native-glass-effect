import { useCallback, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  type GestureResponderEvent,
} from 'react-native';
import { useReduceMotion } from '../../accessibility/useReduceMotion';
import { isNativeAvailable } from '../../native/nativeBridge';
import { useGlassTheme } from '../../theme/useGlassTheme';
import { splitGlassProps } from '../../utils/splitGlassProps';
import { LiquidGlassView } from '../LiquidGlassView';
import type { GlassButtonSize, LiquidGlassButtonProps } from './LiquidGlassButton.types';

const SIZES: Record<GlassButtonSize, { height: number; paddingHorizontal: number; fontSize: number }> = {
  small: { height: 36, paddingHorizontal: 14, fontSize: 14 },
  medium: { height: 48, paddingHorizontal: 20, fontSize: 16 },
  large: { height: 56, paddingHorizontal: 24, fontSize: 18 },
};

/**
 * Does the native side already animate presses? Then JS must not animate too.
 * Only Android: its glass view observes every touch passing through it.
 * iOS 26's system "interactive" glass only reacts to touches that land on the effect
 * view itself, not on the label inside the button, so iOS keeps the JS spring.
 */
function nativeAnimatesPress(): boolean {
  return isNativeAvailable && Platform.OS === 'android';
}

/**
 * A pill-shaped glass button.
 *
 * ```tsx
 * <LiquidGlassButton title="Continue" onPress={next} />
 * ```
 *
 * Press feedback:
 * - Android: native (light follows the finger, squish + spring).
 * - iOS / web / fallback: a small JS scale spring (iOS 26 adds the system glass response
 *   when the touch lands on the glass itself).
 * - "Reduce motion" on: highlight only, no movement.
 */
export function LiquidGlassButton(props: LiquidGlassButtonProps) {
  const { glass, rest } = splitGlassProps(props);
  const {
    title,
    children,
    size = 'medium',
    style,
    contentStyle,
    textStyle,
    disabled,
    onPressIn,
    onPressOut,
    accessibilityRole,
    accessibilityState,
    ...pressableProps
  } = rest;

  const { resolvedScheme } = useGlassTheme();
  const reduceMotion = useReduceMotion();
  const [pressed, setPressed] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;

  // Disabled buttons get no native touch light / squish either.
  const interactive = !disabled && (glass.interactive ?? true);
  const jsAnimates = !reduceMotion && !(interactive && nativeAnimatesPress());
  const dims = SIZES[size] ?? SIZES.medium;

  const animateTo = useCallback(
    (to: number) => {
      if (!jsAnimates) return;
      Animated.spring(scale, {
        toValue: to,
        useNativeDriver: true,
        speed: 40,
        bounciness: to === 1 ? 8 : 0,
      }).start();
    },
    [jsAnimates, scale]
  );

  const handlePressIn = useCallback(
    (e: GestureResponderEvent) => {
      setPressed(true);
      animateTo(0.96);
      onPressIn?.(e);
    },
    [animateTo, onPressIn]
  );

  const handlePressOut = useCallback(
    (e: GestureResponderEvent) => {
      setPressed(false);
      animateTo(1);
      onPressOut?.(e);
    },
    [animateTo, onPressOut]
  );

  const labelColor = resolvedScheme === 'dark' ? '#FFFFFF' : '#111111';

  return (
    <Animated.View style={[{ transform: [{ scale }] }, disabled && styles.disabled, style]}>
      <Pressable
        {...pressableProps}
        disabled={disabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole={accessibilityRole ?? 'button'}
        accessibilityState={{ ...accessibilityState, disabled: !!disabled }}
      >
        <LiquidGlassView
          {...glass}
          interactive={interactive}
          cornerRadius={glass.cornerRadius ?? dims.height / 2}
          pressed={pressed}
          style={[
            styles.content,
            { minHeight: dims.height, paddingHorizontal: dims.paddingHorizontal },
            contentStyle,
          ]}
        >
          {children ?? (
            <Text
              numberOfLines={1}
              style={[styles.title, { fontSize: dims.fontSize, color: labelColor }, textStyle]}
            >
              {title}
            </Text>
          )}
        </LiquidGlassView>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  title: { fontWeight: '600' },
  disabled: { opacity: 0.5 },
});
