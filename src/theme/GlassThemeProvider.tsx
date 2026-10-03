import { useContext, useMemo, type ReactNode } from 'react';
import { GlassThemeContext } from './GlassThemeContext';
import { mergeTheme } from './mergeTheme';
import type { GlassThemeOverrides } from './types';

export interface GlassThemeProviderProps {
  theme?: GlassThemeOverrides;
  children: ReactNode;
}

/**
 * Optional. Set app-wide glass defaults once instead of on every component.
 *
 * ```tsx
 * <GlassThemeProvider theme={{ defaultMaterial: 'thick', materials: { thick: { blur: 40 } } }}>
 *   <App />
 * </GlassThemeProvider>
 * ```
 * Providers can be nested; the inner one overrides the outer one.
 */
export function GlassThemeProvider({ theme, children }: GlassThemeProviderProps) {
  const parent = useContext(GlassThemeContext);
  const value = useMemo(() => mergeTheme(parent, theme), [parent, theme]);
  return <GlassThemeContext.Provider value={value}>{children}</GlassThemeContext.Provider>;
}
