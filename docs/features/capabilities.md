# Capabilities

Ask the device what it can render. Use it to adapt your UI, for example to show a solid header on devices without blur, or to log the renderer in analytics.

<Preview id="capabilities" />

## Example

<<< @/../examples/shared/scenes/CapabilitiesScene.tsx

## `useGlassCapabilities()`

A hook that returns the capabilities and re-reads them when the app returns to the foreground, because battery saver and accessibility settings may have changed.

## `getGlassCapabilities()`

The same values, synchronously, outside React. It never throws: on any problem it reports the fallback.

```ts
import { getGlassCapabilities } from 'react-native-liquid-glass-native';

if (getGlassCapabilities().bestRenderer === 'fallback') {
  // No native glass: Expo Go, web or tests
}
```

## Fields

| Field | Type | What it means |
|---|---|---|
| `platform` | `'android' \| 'ios' \| 'web' \| 'unknown'` | Where the app runs |
| `osVersion` | number | Android API level or iOS major version |
| `bestRenderer` | see below | The best renderer this device can use |
| `supportsBlur` | boolean | The native renderer can blur. `false` when native code is missing |
| `supportsRefraction` | boolean | The refraction shader is available (Android 13+) |
| `isLowRamDevice` | boolean | Android's low-RAM flag. `auto` quality uses `low` |
| `isPowerSaveMode` | boolean | Battery saver is on. `auto` quality uses `low` |
| `reduceTransparency` | boolean | The system Reduce Transparency setting |
| `reduceMotion` | boolean | The system Reduce Motion setting |
| `isNativeAvailable` | boolean | `false` when native code is missing (Expo Go, web, tests) |

## Renderers

| `bestRenderer` | Where | What it is |
|---|---|---|
| `shader` | Android 13+ | GPU blur + refraction + lighting |
| `blur` | Android 12 | GPU blur + lighting |
| `compat` | Android 7–11 | Snapshot + CPU blur |
| `system-glass` | iOS 26+ | `UIGlassEffect` |
| `system-material` | iOS 15–25 | `UIVisualEffectView` materials |
| `fallback` | Expo Go, web, tests | Plain view (CSS blur on the web) |
