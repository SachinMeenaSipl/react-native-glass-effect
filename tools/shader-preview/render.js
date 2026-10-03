// Validates the AGSL program from GlassShaderSource.kt with Skia (the engine Android uses)
// and renders a preview that mimics RenderNodeGlassRenderer + SurfacePainter.
const fs = require('fs');
const CanvasKitInit = require('canvaskit-wasm/bin/full/canvaskit.js');

const kt = fs.readFileSync(require('path').join(__dirname, '../../android/src/main/java/com/liquidglass/shader/GlassShaderSource.kt'), 'utf8');
const AGSL = kt.split('const val AGSL: String = """')[1].split('"""')[0];

CanvasKitInit({ locateFile: (f) => require.resolve('canvaskit-wasm/bin/full/' + f) }).then((CK) => {
  let errs = '';
  const effect = CK.RuntimeEffect.Make(AGSL, (e) => (errs += e));
  if (!effect) { console.log('SHADER COMPILE FAILED:\n' + errs); process.exit(1); }
  console.log('shader compiled OK; uniforms:', effect.getUniformCount(), 'floats:', effect.getUniformFloatCount());
  for (let i = 0; i < effect.getUniformCount(); i++) console.log('  ', effect.getUniformName(i));

  const W = 900, H = 1200, D = 3; // density 3 like a modern phone
  // ---- busy backdrop ------------------------------------------------------------
  const bgSurf = CK.MakeSurface(W, H); const bg = bgSurf.getCanvas();
  const colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#9D4EDD', '#FF9F1C', '#2EC4B6'];
  const p = new CK.Paint(); p.setAntiAlias(true);
  for (let i = 0; i < 12; i++) { p.setColor(CK.parseColorString(colors[i % 7])); bg.drawRect(CK.LTRBRect(0, i * 100, W, i * 100 + 100), p); }
  for (let i = 0; i < 18; i++) { p.setColor(CK.parseColorString(colors[(i + 3) % 7])); bg.drawCircle((i * 173) % W, (i * 311) % H, 60 + (i % 4) * 25, p); }
  p.setColor(CK.WHITE); for (let x = 0; x < W; x += 60) bg.drawRect(CK.LTRBRect(x, 0, x + 8, H), p); // thin stripes show refraction
  const backdrop = bgSurf.makeImageSnapshot();

  const out = CK.MakeSurface(W, H); const c = out.getCanvas();
  // DEBUG_BLACK=1: draw glass over black instead of the backdrop. Any backdrop detail that
  // still shows inside a glass means the glass output is (partly) transparent.
  if (process.env.DEBUG_BLACK) c.clear(CK.BLACK); else c.drawImage(backdrop, 0, 0, null);

  const sat = 1.35, r = 0.2126, g = 0.7152, b = 0.0722;
  const satM = [r*(1-sat)+sat, g*(1-sat), b*(1-sat), 0, 0,  r*(1-sat), g*(1-sat)+sat, b*(1-sat), 0, 0,  r*(1-sat), g*(1-sat), b*(1-sat)+sat, 0, 0,  0,0,0,1,0];

  function glass(x, y, w, h, o) {
    const blurPx = o.blur * D, edge = o.edge * D, radius = Math.min(o.radius * D, Math.min(w, h) / 2);
    const pad = Math.min(Math.ceil(blurPx * 2 + edge * o.refraction + 4), 256);
    // sampleRect = glass + pad, clipped to the backdrop (same as LiquidGlassView.computeSampleRect)
    const sl = Math.max(x - pad, 0), st = Math.max(y - pad, 0);
    const sr = Math.min(x + w + pad, W), sb = Math.min(y + h + pad, H);
    const ox = sl - x, oy = st - y; // origin in glass-local px (uOrigin)
    // 1. glassNode: backdrop lined up, then blur with CLAMP edges + saturation.
    // CanvasKit's saveLayer blur treats pixels outside the layer as transparent, while
    // Android's RenderEffect TileMode.CLAMP repeats edge pixels. Emulate CLAMP explicitly:
    // extend the edge pixels outward by 3 sigma, blur, then crop back.
    const nw = sr - sl, nh = sb - st, sigma = blurPx / 2, E = Math.ceil(sigma * 3) + 2;
    const raw = CK.MakeSurface(nw, nh); raw.getCanvas().drawImage(backdrop, -sl, -st, null);
    const rawImg = raw.makeImageSnapshot();
    const ext = CK.MakeSurface(nw + 2 * E, nh + 2 * E); const ec = ext.getCanvas();
    const clampPaint = new CK.Paint();
    clampPaint.setShader(rawImg.makeShaderOptions(CK.TileMode.Clamp, CK.TileMode.Clamp, CK.FilterMode.Linear, CK.MipmapMode.None, CK.Matrix.translated(E, E)));
    ec.drawRect(CK.XYWHRect(0, 0, nw + 2 * E, nh + 2 * E), clampPaint);
    const extImg = ext.makeImageSnapshot();
    const node = CK.MakeSurface(nw, nh); const nc = node.getCanvas();
    const fp = new CK.Paint();
    fp.setImageFilter(CK.ImageFilter.MakeCompose(CK.ImageFilter.MakeColorFilter(CK.ColorFilter.MakeMatrix(satM), null),
      CK.ImageFilter.MakeBlur(sigma, sigma, CK.TileMode.Clamp, null)));
    nc.saveLayer(fp); nc.drawImage(extImg, -E, -E, null); nc.restore();
    const content = node.makeImageSnapshot();
    // 2. AGSL on top (same uniform order as GlassShader.effectFor)
    const a = o.lightAngle * Math.PI / 180;
    const u = [w, h, ox, oy, radius, edge, o.refraction, o.distortion, o.chroma, o.illumination,
               Math.cos(a), Math.sin(a), o.touch ? o.touch[0] : 0, o.touch ? o.touch[1] : 0, o.touch ? 1 : 0, o.press || 0];
    const child = content.makeShaderOptions(CK.TileMode.Clamp, CK.TileMode.Clamp, CK.FilterMode.Linear, CK.MipmapMode.None);
    const sh = effect.makeShaderWithChildren(u, [child]);
    const sp = new CK.Paint(); sp.setShader(sh);
    const rr = CK.RRectXY(CK.XYWHRect(x, y, w, h), radius, radius);
    c.save(); c.clipRRect(rr, CK.ClipOp.Intersect, true); c.translate(sl, st);
    c.drawRect(CK.XYWHRect(0, 0, sr - sl, sb - st), sp); c.restore();
    // 3. SurfacePainter: tint + border (lighter on lit side)
    const tp = new CK.Paint(); tp.setAntiAlias(true); tp.setColor(CK.Color(255, 255, 255, o.tint)); c.drawRRect(rr, tp);
    const bw = 1 * D, cx = x + w / 2, cy = y + h / 2, reach = Math.hypot(w, h) / 2;
    const bp = new CK.Paint(); bp.setAntiAlias(true); bp.setStyle(CK.PaintStyle.Stroke); bp.setStrokeWidth(bw);
    bp.setShader(CK.Shader.MakeLinearGradient([cx + Math.cos(a) * reach, cy + Math.sin(a) * reach], [cx - Math.cos(a) * reach, cy - Math.sin(a) * reach],
      [CK.Color4f(1,1,1,o.border), CK.Color4f(1,1,1,o.border*0.3), CK.Color4f(1,1,1,o.border*0.65)], [0, 0.55, 1], CK.TileMode.Clamp));
    c.drawRRect(CK.RRectXY(CK.XYWHRect(x + bw/2, y + bw/2, w - bw, h - bw), radius - bw/2, radius - bw/2), bp);
  }
  const base = { lightAngle: -60, edge: 16, radius: 24, border: 0.3 };
  glass(60, 80, 780, 190, { ...base, blur: 20, refraction: 0.35, distortion: 0.1, chroma: 0, illumination: 0.5, tint: 0.14, radius: 32 });            // regular header
  glass(60, 340, 370, 300, { ...base, blur: 10, refraction: 0.25, distortion: 0.05, chroma: 0, illumination: 0.4, tint: 0.08 });                       // thin
  glass(470, 340, 370, 300, { ...base, blur: 36, refraction: 0.3, distortion: 0.08, chroma: 0, illumination: 0.45, tint: 0.28, edge: 18 });            // thick
  glass(60, 700, 780, 260, { ...base, blur: 4, refraction: 0.5, distortion: 0.15, chroma: 0.15, illumination: 0.6, tint: 0.04, edge: 20, radius: 48, border: 0.35 }); // clear
  glass(0, 1110, 900, 90, { ...base, blur: 36, refraction: 0.3, distortion: 0.08, chroma: 0, illumination: 0.45, tint: 0.28, radius: 0 }); // tab bar flush with screen edge
  glass(250, 980, 400, 110, { ...base, blur: 20, refraction: 0.35, distortion: 0.1, chroma: 0, illumination: 0.5, tint: 0.14, radius: 100, touch: [120, 60], press: 1 }); // pressed pill

  fs.writeFileSync(require('path').join(__dirname, process.env.DEBUG_BLACK ? 'preview-black.png' : 'preview.png'), Buffer.from(out.makeImageSnapshot().encodeToBytes()));
  console.log('wrote preview.png');
});
