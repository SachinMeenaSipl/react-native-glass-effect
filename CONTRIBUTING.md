# Contributing

1. Read [AGENTS.md](AGENTS.md). It has the repo map, the rules, and recipes for common changes.
2. `npm install && npm run typecheck && npm test && npm run check:android && npm run check:ios` must pass. For shader changes, also run `npm run preview:shader` and look at the image.
3. For native changes, run the example app on:
   - an Android **API 33+** device (shader tier)
   - an Android **API 31/32** emulator (blur tier)
   - an Android **API 24–30** emulator (compat tier)
   - an iOS 26 simulator and an iOS 17/18 simulator
4. Go through every screen of the example app (see `example/README.md`). Nothing may crash, and `adb logcat -s LiquidGlass` should only show expected warnings.
5. Update the docs in the same PR: the pages under `docs/` (components, features, installation) for API changes, the architecture docs for internals. Preview the site with `cd website && npm install && npm run dev`.

## Repository layout for docs and examples

| Folder | What it is |
|---|---|
| `docs/` | The documentation site's pages (Markdown). `docs/public/` holds images and previews |
| `website/` | The VitePress setup that builds `docs/` into the site, plus the live demo |
| `examples/shared/scenes/` | The example screens shown on the docs pages, in the Vite gallery and in the Expo app |
| `examples/shared/minimal/` | The copy-paste examples on the component pages: React Native and the library only |
| `examples/liquid-glass-expo/` | Expo app: every scene, running natively |
| `examples/web-vite/` | Vite app: every scene in the browser, also built into the site at `/demo/` |
| `examples/next-app/` | Next.js app with server rendering |
| `example/` | React Native CLI test bench for every renderer path |

## Documentation rules

- Document only what the code does. Check `src/` and the native code before writing a claim; mark anything you couldn't verify as untested.
- Code on the docs pages comes from real files (`<<< @/../examples/...`), never pasted, so it can't drift. `npm run typecheck` type-checks every documented example.
- Versions and test status live on one page: `docs/reference/compatibility.md`. Update it when you test a new setup.
- Use the terms and status labels in `docs/reference/glossary.md`.

## Checking examples

```sh
npm run typecheck                     # includes every documented example
cd examples/web-vite && npm install && npm run build && npm run preview
# open http://localhost:4173/#/<scene-id> or #/minimal/<page-id>
```

To capture Android previews, run the Expo app (`examples/liquid-glass-expo`) on an emulator, open each scene, and save the screenshots as `docs/public/previews/android/<scene-id>.jpg` (540 px wide).

## Continuous integration

| Workflow | Runs on | Does |
|---|---|---|
| `.github/workflows/ci.yml` | GitHub Actions | Typecheck, tests, build, Android and iOS checks |
| `.github/workflows/docs.yml` | GitHub Actions, pushes to `main` | Builds the docs site and publishes it to the `gh-pages` branch |
| `.github/workflows/example-apk.yml` | GitHub Actions | Builds the example APK and publishes a GitHub Release |
| `codemagic.yaml` | Codemagic, pushes to `main` and `v*` tags | Builds the example APK and emails a download link |

## Release

1. Update `CHANGELOG.md` and the version in `package.json`.
2. `npm run prepare` (builds `lib/` and `lib/web/`).
3. `npm pack --dry-run` and check the file list (no `example/`, no `__tests__`).
4. `npm publish`.
5. Tag the release (`git tag vX.Y.Z && git push origin vX.Y.Z`). The tag builds the example APK.
