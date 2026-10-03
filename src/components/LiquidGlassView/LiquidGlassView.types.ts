import type { ViewProps } from 'react-native';
import type { GlassAppearanceProps } from '../../materials/types';

export interface LiquidGlassViewProps extends ViewProps, GlassAppearanceProps {
  /**
   * Advanced: force the "pressed" highlight. LiquidGlassButton sets this for you.
   */
  pressed?: boolean;
}
