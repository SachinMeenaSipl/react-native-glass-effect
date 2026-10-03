# Contributing

1. Read [AGENTS.md](AGENTS.md). It has the repo map, the rules, and recipes for common changes.
2. `npm install && npm run typecheck && npm test && npm run check:android && npm run check:ios` must pass. For shader changes, also run `npm run preview:shader` and look at the image.
3. For native changes, run the example app on:
   - an Android **API 33+** device (shader tier)
   - an Android **API 31/32** emulator (blur tier)
   - an Android **API 24–30** emulator (compat tier)
   - an iOS 26 simulator and an iOS 17/18 simulator
4. Go through every screen of the example app (see `example/README.md`). Nothing may crash, and `adb logcat -s LiquidGlass` should only show expected warnings.
5. Update the docs in the same PR: the user guide for API changes, the architecture docs for internals.

## Release

1. Update `CHANGELOG.md` and the version in `package.json`.
2. `npm run prepare` (builds `lib/`).
3. `npm pack --dry-run` and check the file list (no `example/`, no `__tests__`).
4. `npm publish`.
