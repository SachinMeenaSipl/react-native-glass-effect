# Android typecheck (no SDK needed)

```sh
npm run check:android
```

| Step | What it proves |
|---|---|
| Downloads Kotlin 2.1.20 + `android.jar` (API 34) from GitHub, once, into `.cache/` | — |
| Runs RN codegen on `src/specs` | Specs are valid; the Java module spec is generated |
| Compiles all `android/` Kotlin with `-Werror` | No syntax/type errors, no warnings, Android APIs exist with the used signatures |
| Runs `tests/NativeLogicTest.kt` on the JVM | StackBlur maths, angle/colour interpolation, config clamping |

`stubs/` holds the React Native 0.81 classes we touch (ReactViewGroup, ReactViewManager, BaseReactPackage…), with signatures copied from `node_modules/react-native/ReactAndroid`. **If you upgrade RN or use a new RN class, update the stub from the real source.**

This does not replace building the example app with Gradle. It just makes the edit–compile loop seconds instead of minutes, and it works in sandboxes that can't reach Google Maven.
