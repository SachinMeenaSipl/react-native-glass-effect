import { createContext } from 'react';
import { defaultTheme } from './defaultTheme';
import type { GlassTheme } from './types';

export const GlassThemeContext = createContext<GlassTheme>(defaultTheme);
GlassThemeContext.displayName = 'GlassThemeContext';
