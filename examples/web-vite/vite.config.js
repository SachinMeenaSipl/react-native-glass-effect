import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Web apps render react-native components through react-native-web.
// The library's "browser" export condition already selects its web build.
export default defineConfig({
  plugins: [react()],
  // Some dependencies expect Node's global object in the browser.
  define: { global: 'globalThis' },
  resolve: {
    alias: { 'react-native': 'react-native-web' },
    // Keep one copy of each, resolved from this app. This also lets the shared
    // example scenes (../shared, outside this folder) import the library.
    dedupe: ['react', 'react-dom', 'react-native-web', 'react-native-liquid-glass-native'],
  },
  // The shared scenes live one folder up.
  server: { fs: { allow: ['..'] } },
});
