---
description: "Liquid Glass in Next.js with the App Router and server rendering. Turbopack and webpack alias setup for react-native-web, plus a client component example."
---

# Install: Next.js

Use the library in a Next.js app with the App Router, including server-side rendering and static prerendering.

Tested with Next.js 16 (Turbopack), React 19 and react-native-web 0.21: `next build` prerenders the page and the browser hydrates it.

## Step 1: install

```sh
npm install react-native-liquid-glass-native react-native-web
```

## Step 2: configure Next.js

`next.config.mjs`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Components import 'react-native'; on the web that's react-native-web.
  turbopack: {
    resolveAlias: { 'react-native': 'react-native-web' },
  },
  // The same alias for `next build --webpack` / older setups.
  webpack(config) {
    config.resolve.alias = { ...config.resolve.alias, 'react-native$': 'react-native-web' };
    return config;
  },
};

export default nextConfig;
```

Turbopack aliases use plain names (`'react-native'`). Webpack uses `'react-native$'` so that only the exact import matches.

## Step 3: full-height body

React Native layouts use flexbox and expect the root to have a height. In `app/layout.tsx`:

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, height: '100vh' }}>{children}</body>
    </html>
  );
}
```

## Step 4: a client component with glass

Components with hooks or event handlers must be client components. Put `'use client'` at the top of the file that uses glass:

`app/components/GlassDemo.tsx`:

```tsx
'use client';

import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, LiquidGlassButton, LiquidGlassView } from 'react-native-liquid-glass-native';

export default function GlassDemo() {
  return (
    <View style={styles.root}>
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <ScrollView>
          {['#ff6b6b', '#feca57', '#48dbfb', '#5f27cd', '#1dd1a1'].map((color) => (
            <View key={color} style={{ height: 160, margin: 16, borderRadius: 24, backgroundColor: color }} />
          ))}
        </ScrollView>
      </GlassBackdrop>

      <LiquidGlassView style={styles.header}>
        <Text style={styles.title}>Hello, Next.js</Text>
      </LiquidGlassView>

      <LiquidGlassButton title="Continue" style={styles.cta} onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, height: '100%', backgroundColor: '#0b0b14' },
  header: { position: 'absolute', top: 24, left: 16, right: 16, padding: 16 },
  title: { color: '#fff', fontSize: 20, fontWeight: '700' },
  cta: { position: 'absolute', bottom: 32, alignSelf: 'center' },
});
```

`app/page.tsx` (a server component) renders it:

```tsx
import GlassDemo from './components/GlassDemo';

export default function Page() {
  return <GlassDemo />;
}
```

## Step 5: build

```sh
npm run build
npm start
```

The page prerenders on the server and hydrates in the browser.

## Server rendering notes

- The library doesn't read `window`, `document` or `navigator` when it's imported, so pages can prerender.
- On the server and in the browser, the library loads its web build (`lib/web`) through the `node` and `browser` export conditions. Native code is never bundled.
- `useGlassCapabilities()` returns `platform: "web"` and `bestRenderer: "fallback"`.

## Known limitations

- The same as [the web](/installation/web#known-limitations): the CSS renderer, without refraction or touch lighting.
- Files that use glass components with hooks or event handlers need `'use client'`.
- Tested with Next.js 16 and Turbopack. The webpack alias is provided for `next build --webpack` but hasn't been tested.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `Module not found: Can't resolve 'react-native/...'` | The `react-native` alias is missing. Check Step 2 |
| The page is cut off or blank below the content | The body has no height. Check Step 3 |
| "You're importing a component that needs useState" | Add `'use client'` to the file that uses glass |

## Next

[Verify the install](/installation/verify), then the [Quick start](/guide/quick-start).
