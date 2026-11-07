# Verify the install

Two checks tell you whether the library is installed correctly and which renderer each device uses.

## Check 1: capabilities

Render this anywhere:

<<< @/../examples/shared/scenes/CapabilitiesScene.tsx

<Preview id="capabilities" />

### What you should see

| Where you run it | `platform` | `bestRenderer` | `isNativeAvailable` |
|---|---|---|---|
| Android 13+ | `android` | `shader` | `true` |
| Android 12 | `android` | `blur` | `true` |
| Android 7–11 | `android` | `compat` | `true` |
| iOS 26+ | `ios` | `system-glass` | `true` |
| iOS 15–25 | `ios` | `system-material` | `true` |
| Web (Vite, Next.js, Expo web) | `web` | `fallback` | `false` |
| Expo Go | `android` / `ios` | `fallback` | `false` |

### If `isNativeAvailable` is `false` on a phone

| Cause | Fix |
|---|---|
| The app wasn't rebuilt after installing | Rebuild: `npx react-native run-android` / `run-ios`, or `npx expo run:android` / `run:ios` |
| iOS pods weren't installed | `cd ios && pod install` |
| You're in Expo Go | Use a dev build. See [Expo](/installation/expo#expo-go) |
| The New Architecture is off | Turn it on. The old architecture isn't supported |

## Check 2: the logs (Android)

```sh
adb logcat -s LiquidGlass
```

Most setup problems print a one-line explanation here, such as a glass view with no backdrop behind it.

## Check 3: look at it

Glass over a plain colour looks like a plain colour. Put something colourful and scrolling behind it (see the [Quick start](/guide/quick-start)), then scroll:

- **Android, iOS:** the glass blurs and bends the content live.
- **Web:** the glass blurs the content live.

If the glass is a flat solid colour on Android, it has no `GlassBackdrop` behind it, or it's inside one. See [Core concepts](/guide/core-concepts).
