/**
 * Builds lib/web: a copy of lib/module where the native bridge is swapped for the
 * web bridge (native/nativeBridge.web.js). Bundlers that use the "browser" or "node"
 * export conditions (Vite, webpack, Next.js, Expo web) get this entry, so the native
 * component specs are never bundled for the web.
 *
 * Run automatically by `npm run prepare` after react-native-builder-bob.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const src = path.join(root, 'lib', 'module');
const dest = path.join(root, 'lib', 'web');

if (!fs.existsSync(src)) {
  throw new Error('lib/module is missing. Run react-native-builder-bob first.');
}

fs.rmSync(dest, { recursive: true, force: true });
fs.cpSync(src, dest, { recursive: true });

const webBridge = path.join(dest, 'native', 'nativeBridge.web.js');
const nativeBridge = path.join(dest, 'native', 'nativeBridge.js');
fs.copyFileSync(webBridge, nativeBridge);

console.log('Wrote lib/web (native bridge replaced by the web bridge).');
