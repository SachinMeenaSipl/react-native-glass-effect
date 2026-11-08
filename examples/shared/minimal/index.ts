import type { ComponentType } from 'react';
import FrostedGlassMinimal from './FrostedGlassMinimal';
import GlassAdjusterMinimal from './GlassAdjusterMinimal';
import GlassBackdropMinimal from './GlassBackdropMinimal';
import GlassThemeProviderMinimal from './GlassThemeProviderMinimal';
import LiquidGlassButtonMinimal from './LiquidGlassButtonMinimal';
import LiquidGlassCardMinimal from './LiquidGlassCardMinimal';
import LiquidGlassMinimal from './LiquidGlassMinimal';
import LiquidGlassViewMinimal from './LiquidGlassViewMinimal';

/** The copy-paste examples from the docs, keyed by the component page they belong to. */
export const MINIMAL: Record<string, ComponentType> = {
  'liquid-glass-view': LiquidGlassViewMinimal,
  'glass-backdrop': GlassBackdropMinimal,
  'liquid-glass': LiquidGlassMinimal,
  'frosted-glass': FrostedGlassMinimal,
  'liquid-glass-button': LiquidGlassButtonMinimal,
  'liquid-glass-card': LiquidGlassCardMinimal,
  'glass-adjuster': GlassAdjusterMinimal,
  'glass-theme-provider': GlassThemeProviderMinimal,
};
