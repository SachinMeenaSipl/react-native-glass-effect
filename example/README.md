# Example app

Five screens that exercise every renderer path and edge case.

| Screen    | What to check                                                                 |
|-----------|-------------------------------------------------------------------------------|
| Scroll    | Header + buttons blur the list **live** while scrolling. No one-frame lag.    |
| Materials | thin / regular / thick / clear look clearly different.                        |
| Play      | Change every knob; changes animate. Touch the lens: light follows the finger. |
| Stress    | Add views past 6 and 12: `quality="auto"` steps down, scrolling stays smooth. |
| Caps      | Device capabilities. Two broken setups that must **not** crash.               |

## Run it

The native `android/` and `ios/` folders are not committed. Generate them once:

```sh
cd example
npx @react-native-community/cli init LiquidGlassExample --version 0.81.4 --skip-install --directory tmp-app
mv tmp-app/android tmp-app/ios . && rm -rf tmp-app
npm install
cd ios && pod install && cd ..
npm run android   # or: npm run ios
```

## Test each Android tier

| Tier             | How                                                              |
|------------------|------------------------------------------------------------------|
| SHADER (13+)     | Any API 33+ emulator/device                                      |
| BLUR (12)        | API 31/32 emulator                                               |
| COMPAT (7–11)    | API 24–30 emulator                                               |
| Software canvas  | Take a screenshot with react-native-view-shot                    |
| Battery saver    | Turn it on in quick settings → glass drops to `low`              |
| Remove animations| Developer options → animator scale off → no squish / transitions |

`adb logcat -s LiquidGlass` shows setup warnings (no backdrop, nested backdrop, shader fallback…).
