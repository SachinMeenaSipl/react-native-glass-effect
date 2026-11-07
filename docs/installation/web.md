# Install: Web (React with Vite)

Use the library in a React web app. Components render through [react-native-web](https://necolas.github.io/react-native-web/), and the glass uses CSS `backdrop-filter`.

Tested with Vite 8, React 19 and react-native-web 0.21 in Chrome-based browsers.

## What works on the web

| Feature | Web |
|---|---|
| Live background blur | ✅ CSS `backdrop-filter` |
| Tint, tint opacity, border, corner radius | ✅ |
| Materials and themes | ✅ |
| `LiquidGlassButton` press feedback | ✅ JS scale |
| Refraction, distortion, RGB split | — (no CSS equivalent) |
| Touch light, tilt lighting | — |

Props that have no web equivalent are accepted and ignored. They never throw.

## Step 1: create a Vite app (or use yours)

```sh
npm create vite@latest my-app -- --template react
cd my-app
```

## Step 2: install

```sh
npm install react-native-liquid-glass-native react-native-web
```

`react` and `react-dom` come with the Vite template.

## Step 3: configure Vite

`vite.config.js`:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Some dependencies expect Node's global object in the browser.
  define: { global: 'globalThis' },
  resolve: {
    // Components import 'react-native'; on the web that's react-native-web.
    alias: { 'react-native': 'react-native-web' },
    // Keep one copy of React (avoids "Invalid hook call").
    dedupe: ['react', 'react-dom', 'react-native-web'],
  },
});
```

| Setting | Why |
|---|---|
| `alias` | The library's components import from `react-native` |
| `define.global` | Without it the page fails with `global is not defined` |
| `dedupe` | Two copies of React break hooks |

You don't need to configure anything for the library itself: its `browser` export condition makes Vite load the web build.

## Step 4: give the app a full-height root

React Native layouts use flexbox from the root. Make the root element a full-height flex column in `index.html`:

```html
<div id="root" style="display: flex; flex-direction: column; height: 100vh"></div>
```

Without this, screens that use `flex: 1` collapse to zero height.

## Step 5: render with AppRegistry

`src/main.jsx`:

```jsx
import { AppRegistry } from 'react-native';
import App from './App';

AppRegistry.registerComponent('App', () => App);
AppRegistry.runApplication('App', { rootTag: document.getElementById('root') });
```

`AppRegistry` (from react-native-web) adds the base styles React Native layouts expect.

## Step 6: first glass

`src/App.jsx`:

```jsx
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, LiquidGlassView } from 'react-native-liquid-glass-native';

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: '#0b0b14' }}>
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <ScrollView>
          {['#ff6b6b', '#feca57', '#48dbfb', '#5f27cd', '#1dd1a1'].map((color) => (
            <View key={color} style={{ height: 160, margin: 16, borderRadius: 24, backgroundColor: color }} />
          ))}
        </ScrollView>
      </GlassBackdrop>

      <LiquidGlassView style={styles.header}>
        <Text style={styles.title}>Hello, web</Text>
      </LiquidGlassView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { position: 'absolute', top: 24, left: 16, right: 16, padding: 16 },
  title: { color: '#fff', fontSize: 20, fontWeight: '700' },
});
```

```sh
npm run dev
```

Scroll the page: the header blurs the colours behind it.

## Browser support

`backdrop-filter` works in current Chrome, Edge, Safari and Firefox. In a browser without it, glass shows its tint and border without blur.

## Other bundlers (webpack, Rspack, Parcel)

The same three things apply in any bundler:

1. Alias `react-native` to `react-native-web`.
2. Make sure there's one copy of React.
3. Provide `global` if the bundler doesn't.

::: info
Only Vite and Next.js have been tested so far.
:::

## Next

- [Verify the install](/installation/verify)
- [Next.js](/installation/nextjs) if you need server rendering
