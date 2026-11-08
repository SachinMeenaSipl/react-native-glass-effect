---
description: "Use Liquid Glass in Expo. Install in an Expo dev build or EAS build with no config plugin, what happens in Expo Go, and Expo web setup."
---

# Install: Expo

The library works in **Expo dev builds** and **EAS builds**, with no config plugin. It also works in **Expo web**.

| Where | Result |
|---|---|
| Dev build / EAS build (Android, iOS) | Full native glass, the same as bare React Native |
| Expo web | CSS blur glass |
| Expo Go | A plain tinted fallback (see [Expo Go](#expo-go)) |

Tested with Expo SDK 58 (React Native 0.88) on an Android emulator and in the browser.

## Step 1: install the package

```sh
npx expo install react-native-liquid-glass-native
```

## Step 2: build and run a dev build

```sh
npx expo run:android
npx expo run:ios      # needs a Mac with Xcode
```

`expo run` runs `npx expo prebuild` for you, which generates the `android/` and `ios/` folders and autolinks the library. You don't need a config plugin.

### With EAS Build

If you build in the cloud with EAS, nothing changes: the library autolinks during the EAS build.

```sh
eas build --profile development --platform android
```

::: info
EAS Build hasn't been tested yet with this library. Local `expo run` builds have.
:::

## Step 3: first glass

Replace `App.tsx`:

```tsx
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, LiquidGlassView, useGlassCapabilities } from 'react-native-liquid-glass-native';

export default function App() {
  const caps = useGlassCapabilities();

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
        <Text style={styles.title}>Hello, Expo</Text>
        <Text style={styles.body}>renderer: {caps.bestRenderer}</Text>
      </LiquidGlassView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { position: 'absolute', top: 60, left: 16, right: 16, padding: 16 },
  title: { color: '#fff', fontSize: 20, fontWeight: '700' },
  body: { color: '#fff', marginTop: 4 },
});
```

On an Android 13+ device the header shows `renderer: shader`.

## Expo Go

Expo Go only runs native modules that are built into the Expo Go app. This library isn't one of them, so in Expo Go:

- Every component renders a plain tinted view at the right size. Your layout still works.
- `useGlassCapabilities().isNativeAvailable` is `false` and `bestRenderer` is `"fallback"`.
- A one-time warning tells you to use a dev build.

To see real glass, use a dev build (Step 2).

## Expo web

Install the web dependencies Expo needs:

```sh
npx expo install react-dom react-native-web @expo/metro-runtime
```

Run it:

```sh
npx expo start --web
```

Expo's bundler picks the library's web build automatically. No extra config. On the web, glass uses CSS `backdrop-filter`: blur, tint, border and corners work; refraction and touch lighting don't. See [Platform support](/reference/platform-support).

## Using the library from a monorepo or a local folder

If you link the library from a folder outside your app (for example while contributing), Metro can load a second copy of React from the library's own `node_modules`. That causes "Invalid hook call". Force React and the library to resolve from your app in `metro.config.js`:

```js
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);
config.watchFolders = [path.resolve(projectRoot, '../path-to-library')];

const singletons = ['react', 'react-native', 'react-native-liquid-glass-native'];
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const isSingleton = singletons.some((name) => moduleName === name || moduleName.startsWith(`${name}/`));
  const ctx = isSingleton ? { ...context, originModulePath: path.join(projectRoot, 'index.ts') } : context;
  return context.resolveRequest(ctx, moduleName, platform);
};

module.exports = config;
```

You don't need this when you install the library from npm.

## Windows: Android build fails with `ninja: ... No such file or directory`

Windows limits file paths to 260 characters, and the native (CMake) build repeats your project path inside its own paths. A project in a deep folder, such as OneDrive, can go over the limit. Either:

1. Enable Windows long paths (needs admin, then restart): set `HKLM\SYSTEM\CurrentControlSet\Control\FileSystem\LongPathsEnabled` to `1`, or
2. Point the native build at a short folder in `android/app/build.gradle`:

   ```groovy
   android {
     externalNativeBuild {
       cmake {
         buildStagingDirectory 'C:/lgx-cmake/app'
       }
     }
   }
   ```

   `android/` is regenerated by `prebuild`, so re-apply this after `npx expo prebuild --clean`.

## Known limitations

- **Expo Go** shows the plain fallback, never real glass.
- **Tested** with Expo SDK 58 on Android (local dev builds and a cloud release build). iOS dev builds and EAS Build haven't been tested yet. See [Compatibility](/reference/compatibility).
- There's **no config plugin**: none is needed, so there are no Expo config options for the library.
- Everything in the [React Native known limitations](/installation/react-native#known-limitations) applies to dev builds too.

## Next

[Verify the install](/installation/verify), then the [Quick start](/guide/quick-start).
