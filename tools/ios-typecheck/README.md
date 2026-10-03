# iOS typecheck (no Xcode needed)

```sh
npm run check:ios
```

Runs `clang -fsyntax-only -Werror` on `ios/*.mm` against **real** headers:

| Headers | Source |
|---|---|
| UIKit / Foundation / QuartzCore… | iPhoneOS 16.5 SDK from github.com/theos/sdks |
| React Native (Fabric, TurboModules) | `node_modules/react-native`, laid out like CocoaPods |
| folly, fmt, glog, double-conversion, fast_float, boost | the exact versions RN 0.81 pins |
| `RNLiquidGlassSpec` | RN codegen run on `src/specs` |
| iOS 26 `UIGlassEffect` | `uiglass26.h`: declared exactly as Apple documents it, since the 16.5 SDK predates it |

It catches wrong UIKit/RN API use, generated-props mismatches, and ObjC/C++ syntax errors. It does not link, run, or check Info.plist/pod configuration. `pod install` + Xcode in the example app is still the final check.

The first run downloads about 120 MB into `.cache/`; after that it takes seconds.
