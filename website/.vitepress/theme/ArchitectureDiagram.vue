<template>
  <figure class="lg-diagram">
    <svg viewBox="0 0 820 560" role="img" aria-labelledby="arch-title arch-desc">
      <title id="arch-title">Library architecture</title>
      <desc id="arch-desc">
        Your app uses the public components. The JS layer resolves theme, material and props into flat values.
        Metro loads the native build for Android and iOS; web bundlers load the web build. Android draws with
        a RenderNode backdrop, GPU blur and an AGSL shader; iOS uses Apple's glass or the library's Metal renderer;
        the web uses CSS backdrop-filter. Without native code, a plain tinted view is drawn.
      </desc>
      <defs>
        <marker id="arch-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" class="d-arrowhead" />
        </marker>
      </defs>

      <rect x="250" y="10" width="320" height="50" rx="12" class="d-box" />
      <text x="410" y="41" class="d-title" text-anchor="middle">Your app (React Native, Expo or web)</text>

      <line x1="410" y1="60" x2="410" y2="84" class="d-line" marker-end="url(#arch-arrow)" />
      <rect x="110" y="86" width="600" height="62" rx="12" class="d-box d-accent" />
      <text x="410" y="111" class="d-title" text-anchor="middle">Public API (src/index.ts)</text>
      <text x="410" y="133" class="d-sub" text-anchor="middle">LiquidGlassView · GlassBackdrop · LiquidGlass · FrostedGlass · Button · Card · Adjuster · Theme</text>

      <line x1="410" y1="148" x2="410" y2="172" class="d-line" marker-end="url(#arch-arrow)" />
      <rect x="110" y="174" width="600" height="62" rx="12" class="d-box" />
      <text x="410" y="199" class="d-title" text-anchor="middle">JS layer</text>
      <text x="410" y="221" class="d-sub" text-anchor="middle">theme + material + props → flat, clamped values (resolveMaterial, useResolvedGlass)</text>

      <line x1="142" y1="236" x2="142" y2="286" class="d-line" marker-end="url(#arch-arrow)" />
      <line x1="410" y1="236" x2="410" y2="286" class="d-line" marker-end="url(#arch-arrow)" />
      <line x1="677" y1="236" x2="677" y2="286" class="d-line" marker-end="url(#arch-arrow)" />
      <text x="152" y="266" class="d-note">Metro → lib/module</text>
      <text x="667" y="266" class="d-note" text-anchor="end">web bundlers → lib/web</text>

      <rect x="20" y="288" width="245" height="196" rx="12" class="d-box" />
      <text x="142" y="314" class="d-title" text-anchor="middle">Android · Kotlin</text>
      <text x="38" y="342" class="d-sub">GlassBackdrop records a RenderNode</text>
      <text x="38" y="364" class="d-sub">→ GPU blur (Android 12+)</text>
      <text x="38" y="386" class="d-sub">→ AGSL refraction shader (13+)</text>
      <text x="38" y="408" class="d-sub">→ tint, rim light, border</text>
      <text x="38" y="440" class="d-sub">Android 7–11: snapshot +</text>
      <text x="38" y="462" class="d-sub">CPU blur instead</text>

      <rect x="287" y="288" width="246" height="196" rx="12" class="d-box" />
      <text x="410" y="314" class="d-title" text-anchor="middle">iOS · Objective-C++</text>
      <text x="305" y="342" class="d-sub">iosRenderer="system" (default):</text>
      <text x="305" y="364" class="d-sub">UIGlassEffect (iOS 26+)</text>
      <text x="305" y="386" class="d-sub">UIVisualEffectView (15–25)</text>
      <text x="305" y="418" class="d-sub">iosRenderer="shader":</text>
      <text x="305" y="440" class="d-sub">Metal renderer sampling the</text>
      <text x="305" y="462" class="d-sub">GlassBackdrop, like Android</text>

      <rect x="555" y="288" width="245" height="196" rx="12" class="d-box" />
      <text x="677" y="314" class="d-title" text-anchor="middle">Web · CSS renderer</text>
      <text x="573" y="342" class="d-sub">react-native-web View with</text>
      <text x="573" y="364" class="d-sub">backdrop-filter: blur()</text>
      <text x="573" y="386" class="d-sub">saturate(160%)</text>
      <text x="573" y="408" class="d-sub">+ tint, border, corners</text>
      <text x="573" y="440" class="d-sub">No refraction or touch</text>
      <text x="573" y="462" class="d-sub">light on the web</text>

      <rect x="110" y="506" width="600" height="44" rx="12" class="d-box d-muted" />
      <text x="410" y="533" class="d-sub" text-anchor="middle">No native code (Expo Go, tests): a plain tinted view, so layouts still work</text>
    </svg>
    <figcaption>How a glass view gets from your component to pixels on each platform.</figcaption>
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
.d-note {
  fill: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 600;
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
