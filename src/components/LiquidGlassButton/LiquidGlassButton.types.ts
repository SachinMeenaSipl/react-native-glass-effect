import type { ReactNode } from 'react';
import type { PressableProps, StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { GlassAppearanceProps } from '../../materials/types';

export type GlassButtonSize = 'small' | 'medium' | 'large';

export interface LiquidGlassButtonProps
  extends Omit<PressableProps, 'style' | 'children'>,
    GlassAppearanceProps {
  /** Text label. Ignored when `children` is given. */
  title?: string;
  /** Custom content (icon + text, etc.). */
  children?: ReactNode;
  /** Default "medium" (48 dp tall). */
  size?: GlassButtonSize;
  /** Outer style (margins, width, position). */
  style?: StyleProp<ViewStyle>;
  /** Style for the inner row that holds the content. */
  contentStyle?: StyleProp<ViewStyle>;
  /** Style for `title`. */
  textStyle?: StyleProp<TextStyle>;
}
