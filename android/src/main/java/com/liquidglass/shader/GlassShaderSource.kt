package com.liquidglass.shader

/**
 * The AGSL (Android Graphics Shading Language) program for Android 13+.
 *
 * It runs once per pixel of the glass, AFTER the backdrop was blurred and saturated.
 * `content` is that blurred backdrop. Its coordinate (0,0) sits at `uOrigin` in glass-local
 * px (usually negative: the sampled area extends past the glass by the blur padding, but is
 * clipped to the backdrop so screen-edge glass never samples empty pixels).
 *
 * Plain-language walkthrough:
 *
 *  1. SHAPE     sdRoundRect() says how far a pixel is from the rounded edge
 *               (negative = inside). Pixels outside are passed through untouched.
 *
 *  2. RIM       `rim` is 1 right at the edge and fades to 0 at `uEdge` px inside.
 *               `bend` is a smoothed version of it. The glass is "thick" only at the rim.
 *
 *  3. NORMAL    The direction the edge faces (outward), from the shape's gradient.
 *               Top edge → (0,-1), right edge → (1,0), corners → diagonal.
 *
 *  4. LENS      The whole surface magnifies slightly (`uDistortion`), a bit more while
 *               pressed (`uPress`), like looking through a thick drop of water.
 *
 *  5. REFRACT   Near the rim, we read the backdrop from further INSIDE, along the
 *               normal (`uRefraction`). This is the signature "bent edge" look.
 *
 *  6. RGB SPLIT Optional (`uChroma`): red and blue are read at slightly different
 *               offsets at the rim, like a real prism edge. Quality "high" only.
 *
 *  7. LIGHT     - specular: rim facing the light (`uLightDir`) gets brighter
 *               - gloss: a thin bright line right on the edge (strongest facing the light)
 *               - back-light: the opposite rim glows faintly (light passing through)
 *               - touch: a soft glow under the finger (`uTouch.xy`, strength `uTouch.z`)
 *               - press: slight overall brightening
 *
 * All maths is done in float; the result is converted to half4 at the end.
 * Colours are premultiplied, so light is scaled by alpha and clamped to it.
 */
internal object GlassShaderSource {
  const val CONTENT = "content"

  const val AGSL: String = """
uniform shader content;
uniform float2 uSize;
uniform float2 uOrigin;
uniform float uRadius;
uniform float uEdge;
uniform float uRefraction;
uniform float uDistortion;
uniform float uChroma;
uniform float uIllumination;
uniform float2 uLightDir;
uniform float3 uTouch;
uniform float uPress;

float sdRoundRect(float2 p, float2 halfSize, float r) {
  float2 q = abs(p) - halfSize + float2(r, r);
  return length(max(q, float2(0.0, 0.0))) + min(max(q.x, q.y), 0.0) - r;
}

float4 sampleAt(float2 pos) {
  return float4(content.eval(pos));
}

half4 main(float2 fragCoord) {
  float2 halfSize = uSize * 0.5;
  float2 local = fragCoord + uOrigin;
  float2 p = local - halfSize;

  // 1. shape
  float d = sdRoundRect(p, halfSize, uRadius);
  if (d > 1.0) {
    return content.eval(fragCoord);
  }

  // 2. rim
  float edgeW = max(uEdge, 1.0);
  float depth = clamp(-d / edgeW, 0.0, 1.0);
  float rim = 1.0 - depth;
  float bend = rim * rim * (3.0 - 2.0 * rim);

  // 3. outward normal
  float2 ex = float2(1.0, 0.0);
  float2 ey = float2(0.0, 1.0);
  float2 grad = float2(
    sdRoundRect(p + ex, halfSize, uRadius) - sdRoundRect(p - ex, halfSize, uRadius),
    sdRoundRect(p + ey, halfSize, uRadius) - sdRoundRect(p - ey, halfSize, uRadius));
  float gl = length(grad);
  float2 n = float2(0.0, 0.0);
  if (gl > 0.0001) {
    n = grad / gl;
  }

  // 4. lens + 5. refraction
  float mag = 1.0 - uDistortion * 0.12 - uPress * 0.025;
  float2 bent = p * mag - n * bend * uRefraction * edgeW;
  float2 samplePos = bent + halfSize - uOrigin;

  // 6. optional RGB split
  float4 color;
  if (uChroma > 0.001) {
    float2 split = n * bend * uChroma * 4.0;
    float4 mid = sampleAt(samplePos);
    color = float4(sampleAt(samplePos - split).r, mid.g, sampleAt(samplePos + split).b, mid.a);
  } else {
    color = sampleAt(samplePos);
  }

  // 7. light
  float facing = max(dot(n, uLightDir), 0.0);
  float spec = facing * facing * bend * uIllumination * 0.55;
  float back = pow(max(dot(n, -uLightDir), 0.0), 3.0) * bend * uIllumination * 0.2;
  float glowR = max(min(uSize.x, uSize.y) * 0.5, 24.0);
  float2 tv = local - uTouch.xy;
  float glow = uTouch.z * exp(-dot(tv, tv) / (2.0 * glowR * glowR)) * 0.28;
  // crisp glossy line hugging the edge: brightest facing the light, never fully dark
  float line = exp(-depth * edgeW / max(edgeW * 0.09, 1.0));
  float gloss = line * (0.25 + 0.75 * facing * facing) * uIllumination * 0.65;
  float light = spec + back + gloss + glow + uPress * 0.05;

  float3 lit = min(color.rgb + float3(light, light, light) * color.a, float3(color.a, color.a, color.a));
  return half4(float4(lit, color.a));
}
"""
}
