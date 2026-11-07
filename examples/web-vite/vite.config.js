import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Web apps render react-native components through react-native-web.
// The library's package.json "browser" field already swaps in its web bridge.
export default defineConfig({
  plugins: [react()],
  // Some dependencies expect Node's global object in the browser.
  define: { global: 'globalThis' },
  resolve: {
    alias: { 'react-native': 'react-native-web' },
    // The linked library has its own devDependency copies; keep one React for the app.
    dedupe: ['react', 'react-dom', 'react-native-web'],
  },
});
