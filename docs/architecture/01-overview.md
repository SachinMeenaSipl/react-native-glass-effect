# 01 · Overview

## Layers

```
┌───────────────────────────────────────────────────────────────┐
│  App code                                                     │
│  <GlassBackdrop>  <LiquidGlassView>  <LiquidGlassButton> …    │
└──────────────────────────────┬────────────────────────────────┘
                               │
┌──────────────────────────────▼────────────────────────────────┐
│  JS layer (src/)                                              │
│  components → useResolvedGlass → resolveMaterial (+theme)     │
│  nativeBridge: native available?  yes → native / no → JS      │
└──────────────────────────────┬────────────────────────────────┘
                               │ flat props (dp, 0..1, colours)
                               │ Fabric + codegen (src/specs)
             ┌─────────────────┴──────────────────┐
┌────────────▼─────────────┐          ┌───────────▼───────────┐
│ Android (the renderer)   │          │ iOS (system glass)    │
│ backdrop capture         │          │ UIGlassEffect (26+)   │
│ GPU blur / AGSL shader   │          │ UIBlurEffect (15–25)  │
│ compat snapshot          │          │                       │
│ touch / press / tilt     │          │                       │
└──────────────────────────┘          └───────────────────────┘
```

## Responsibilities

| Layer | Owns | Does NOT own |
|---|---|---|
| JS | Material presets, theme, defaults, validation, accessibility (iOS setting), fallbacks when native is missing | Pixels, performance decisions |
| Android | Background capture, rendering tiers, `quality="auto"`, animation, device capabilities | Knowing what "regular" means |
| iOS | Mapping flat props onto system effects | Custom rendering |

## One prop's journey

`<LiquidGlassView material="thick" blur={30} />`

1. `useResolvedGlass` reads the theme (`defaultMaterial`, overrides, colour scheme).
2. `resolveMaterial` merges the thick preset, then the theme override, then the prop `blur=30`, applies `intensity`, and clamps. Result: `{ blurRadius: 30, tintOpacity: 0.28, … }`.
3. Fabric sends the flat props to native.
4. **Android**: `LiquidGlassViewManager` writes each value into `view.pending`. At the end of the batch, `commitConfig()` starts a 180 ms native transition from the old config to the new one.
5. Every frame, `onDraw` builds a `GlassFrame` and the active renderer draws it.

## Folder = responsibility

Each folder has one job. If you can't say which folder a change belongs to, the change is probably doing two things. The map is in [AGENTS.md](../../AGENTS.md#2-repo-map).
