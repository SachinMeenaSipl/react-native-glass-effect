import { useContext } from 'react';
import { useColorScheme } from 'react-native';
import { GlassThemeContext } from './GlassThemeContext';
import type { GlassTheme } from './types';

/** Current theme plus the colour scheme actually in effect. */
export function useGlassTheme(): GlassTheme & { resolvedScheme: 'light' | 'dark' } {
  const theme = useContext(GlassThemeContext);
  const system = useColorScheme();
  const resolvedScheme =
    theme.colorScheme === 'auto' ? (system === 'dark' ? 'dark' : 'light') : theme.colorScheme;
  return { ...theme, resolvedScheme };
}
