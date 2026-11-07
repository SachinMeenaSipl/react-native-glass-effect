import type { ComponentType } from 'react';
import AccessibilityScene from './AccessibilityScene';
import AppearanceScene from './AppearanceScene';
import ButtonScene from './ButtonScene';
import CapabilitiesScene from './CapabilitiesScene';
import CardScene from './CardScene';
import DiagnosticsScene from './DiagnosticsScene';
import FrostedGlassScene from './FrostedGlassScene';
import GlassAdjusterScene from './GlassAdjusterScene';
import GlassBackdropScene from './GlassBackdropScene';
import InteractionScene from './InteractionScene';
import IosRenderersScene from './IosRenderersScene';
import LiquidGlassScene from './LiquidGlassScene';
import LiquidGlassViewScene from './LiquidGlassViewScene';
import MaterialsScene from './MaterialsScene';
import QualityScene from './QualityScene';
import QuickStart from './QuickStart';
import RecipeCardsOverImage from './RecipeCardsOverImage';
import RecipeHeader from './RecipeHeader';
import RecipeModal from './RecipeModal';
import RecipeSettingsToggle from './RecipeSettingsToggle';
import RecipeTabBar from './RecipeTabBar';
import ThemeScene from './ThemeScene';

export interface Scene {
  /** Stable id, used in URLs: the docs embed /demo/#/<id>. */
  id: string;
  title: string;
  group: 'Getting started' | 'Components' | 'Features' | 'Recipes';
  Component: ComponentType;
}

export const SCENES: Scene[] = [
  { id: 'quick-start', title: 'Quick start', group: 'Getting started', Component: QuickStart },
  { id: 'liquid-glass-view', title: 'LiquidGlassView', group: 'Components', Component: LiquidGlassViewScene },
  { id: 'glass-backdrop', title: 'GlassBackdrop', group: 'Components', Component: GlassBackdropScene },
  { id: 'liquid-glass', title: 'LiquidGlass', group: 'Components', Component: LiquidGlassScene },
  { id: 'frosted-glass', title: 'FrostedGlass', group: 'Components', Component: FrostedGlassScene },
  { id: 'liquid-glass-button', title: 'LiquidGlassButton', group: 'Components', Component: ButtonScene },
  { id: 'liquid-glass-card', title: 'LiquidGlassCard', group: 'Components', Component: CardScene },
  { id: 'glass-adjuster', title: 'GlassAdjuster', group: 'Components', Component: GlassAdjusterScene },
  { id: 'glass-theme-provider', title: 'GlassThemeProvider', group: 'Components', Component: ThemeScene },
  { id: 'materials', title: 'Materials', group: 'Features', Component: MaterialsScene },
  { id: 'appearance', title: 'Appearance props', group: 'Features', Component: AppearanceScene },
  { id: 'interaction', title: 'Touch and motion', group: 'Features', Component: InteractionScene },
  { id: 'ios-renderers', title: 'iOS renderers', group: 'Features', Component: IosRenderersScene },
  { id: 'quality', title: 'Quality', group: 'Features', Component: QualityScene },
  { id: 'accessibility', title: 'Accessibility', group: 'Features', Component: AccessibilityScene },
  { id: 'capabilities', title: 'Capabilities', group: 'Features', Component: CapabilitiesScene },
  { id: 'diagnostics', title: 'Diagnostics', group: 'Features', Component: DiagnosticsScene },
  { id: 'recipe-header', title: 'Glass header', group: 'Recipes', Component: RecipeHeader },
  { id: 'recipe-tab-bar', title: 'Glass tab bar', group: 'Recipes', Component: RecipeTabBar },
  { id: 'recipe-cards-over-image', title: 'Cards over images', group: 'Recipes', Component: RecipeCardsOverImage },
  { id: 'recipe-modal', title: 'Glass in a modal', group: 'Recipes', Component: RecipeModal },
  { id: 'recipe-settings-toggle', title: 'Settings toggle', group: 'Recipes', Component: RecipeSettingsToggle },
];

export function findScene(id: string): Scene | undefined {
  return SCENES.find((s) => s.id === id);
}
