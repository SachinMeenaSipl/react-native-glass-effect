# Shader preview

Compiles `GlassShaderSource.kt`'s AGSL with **Skia**, the engine Android runs it on, and renders `preview.png`. The preview runs the same pipeline as the Android renderer: backdrop → blur → saturation → shader → tint → border.

```sh
cd tools/shader-preview
npm install
npm run preview      # prints uniform list, writes preview.png
```

| Glass in the preview | Material |
|---|---|
| Top pill | regular |
| Middle left / right | thin / thick |
| Wide pill | clear (refraction + RGB split) |
| Bottom pill | regular, **pressed**, with a touch light |

Use it to catch compile errors and see visual changes before trying a device. CanvasKit's SkSL is very close to Android's AGSL but not identical, so always confirm on a real Android 13+ device.
