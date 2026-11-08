<template>
  <figure class="lg-diagram">
    <svg viewBox="0 0 860 330" role="img" aria-labelledby="android-title android-desc">
      <title id="android-title">How a glass frame is drawn on Android</title>
      <desc id="android-desc">
        GlassBackdrop records its children into a RenderNode. Each frame, LiquidGlassView checks whether it moved
        or the backdrop content changed nearby, and redraws only then. The renderer replays the backdrop node aligned
        to the glass, through GPU blur, saturation and, on Android 13 and newer, the AGSL refraction shader. The
        surface painter adds tint, sheen and border, then children draw on top. On Android 7 to 11 a bitmap snapshot
        blurred on the CPU replaces the GPU steps.
      </desc>
      <defs>
        <marker id="and-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" class="d-arrowhead" />
        </marker>
      </defs>

      <rect x="10" y="20" width="150" height="150" rx="12" class="d-box d-accent" />
      <text x="85" y="48" class="d-title" text-anchor="middle">1. Record</text>
      <text x="22" y="76" class="d-sub">GlassBackdropView</text>
      <text x="22" y="96" class="d-sub">draws its children</text>
      <text x="22" y="116" class="d-sub">into a RenderNode</text>
      <text x="22" y="136" class="d-sub">(GPU display list,</text>
      <text x="22" y="156" class="d-sub">not pixels)</text>

      <line x1="160" y1="95" x2="182" y2="95" class="d-line" marker-end="url(#and-arrow)" />
      <rect x="184" y="20" width="150" height="150" rx="12" class="d-box" />
      <text x="259" y="48" class="d-title" text-anchor="middle">2. Check</text>
      <text x="196" y="76" class="d-sub">LiquidGlassView</text>
      <text x="196" y="96" class="d-sub">onPreDraw: did it</text>
      <text x="196" y="116" class="d-sub">move, or did content</text>
      <text x="196" y="136" class="d-sub">change nearby?</text>
      <text x="196" y="156" class="d-sub">Far changes skipped</text>

      <line x1="334" y1="95" x2="356" y2="95" class="d-line" marker-end="url(#and-arrow)" />
      <rect x="358" y="20" width="168" height="150" rx="12" class="d-box" />
      <text x="442" y="48" class="d-title" text-anchor="middle">3. Render</text>
      <text x="370" y="76" class="d-sub">Replay the backdrop</text>
      <text x="370" y="96" class="d-sub">node, aligned to glass</text>
      <text x="370" y="116" class="d-sub">→ GPU blur (12+)</text>
      <text x="370" y="136" class="d-sub">→ saturation</text>
      <text x="370" y="156" class="d-sub">→ AGSL shader (13+)</text>

      <line x1="526" y1="95" x2="548" y2="95" class="d-line" marker-end="url(#and-arrow)" />
      <rect x="550" y="20" width="140" height="150" rx="12" class="d-box" />
      <text x="620" y="48" class="d-title" text-anchor="middle">4. Paint</text>
      <text x="562" y="76" class="d-sub">SurfacePainter:</text>
      <text x="562" y="96" class="d-sub">tint, sheen</text>
      <text x="562" y="116" class="d-sub">(when the shader</text>
      <text x="562" y="136" class="d-sub">didn't light it),</text>
      <text x="562" y="156" class="d-sub">border</text>

      <line x1="690" y1="95" x2="712" y2="95" class="d-line" marker-end="url(#and-arrow)" />
      <rect x="714" y="20" width="136" height="150" rx="12" class="d-box" />
      <text x="782" y="48" class="d-title" text-anchor="middle">5. Children</text>
      <text x="726" y="76" class="d-sub">Your text and</text>
      <text x="726" y="96" class="d-sub">icons draw on top,</text>
      <text x="726" y="116" class="d-sub">sharp, clipped to</text>
      <text x="726" y="136" class="d-sub">the rounded shape</text>

      <path d="M442,170 L442,214" class="d-line" marker-end="url(#and-arrow)" />
      <rect x="250" y="216" width="384" height="96" rx="12" class="d-box d-muted" />
      <text x="442" y="244" class="d-title" text-anchor="middle">Android 7–11 (compat renderer)</text>
      <text x="442" y="270" class="d-sub" text-anchor="middle">BackdropSnapshot captures a bitmap → StackBlur on the CPU</text>
      <text x="442" y="292" class="d-sub" text-anchor="middle">re-captured at most every 32 ms (medium) or 100 ms (low)</text>
    </svg>
    <figcaption>One frame on Android. Source: android/src/main/java/com/liquidglass.</figcaption>
  </figure>
</template>

<style scoped>
.lg-diagram {
  margin: 24px 0;
  overflow-x: auto;
}
.lg-diagram svg {
  display: block;
  width: 100%;
  height: auto;
}
/* On phones, keep the text readable and let the diagram scroll sideways. */
@media (max-width: 640px) {
  .lg-diagram svg {
    min-width: 600px;
  }
}
.lg-diagram figcaption {
  margin-top: 8px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  text-align: center;
}
.d-box {
  fill: var(--vp-c-bg-soft);
  stroke: var(--vp-c-divider);
  stroke-width: 1.5;
}
.d-accent {
  stroke: var(--vp-c-brand-1);
}
.d-muted {
  fill: var(--vp-c-bg-alt);
  stroke-dasharray: 5 4;
}
.d-title {
  fill: var(--vp-c-text-1);
  font-size: 15px;
  font-weight: 700;
}
.d-sub {
  fill: var(--vp-c-text-2);
  font-size: 13px;
}
.d-line {
  fill: none;
  stroke: var(--vp-c-text-3);
  stroke-width: 1.5;
}
.d-arrowhead {
  fill: var(--vp-c-text-3);
}
</style>
