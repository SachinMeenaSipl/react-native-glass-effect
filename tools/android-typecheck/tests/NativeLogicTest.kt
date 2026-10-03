// JVM tests for pure Kotlin logic (no device). Run via tools/android-typecheck/check.sh

import com.liquidglass.config.GlassConfig
import kotlin.math.abs

fun set(o: Any, name: String, v: Any) { val f = o.javaClass.getDeclaredField(name); f.isAccessible = true; f.set(o, v) }
fun get(o: Any, name: String): Any = o.javaClass.getDeclaredField(name).also { it.isAccessible = true }.get(o)

fun blur(pixels: IntArray, w: Int, h: Int, r: Int): IntArray {
  val sb = Class.forName("com.liquidglass.compat.StackBlur").getDeclaredConstructor().newInstance()
  val wh = w * h
  set(sb, "pix", pixels.copyOf()); set(sb, "rCh", IntArray(wh)); set(sb, "gCh", IntArray(wh))
  set(sb, "bCh", IntArray(wh)); set(sb, "aCh", IntArray(wh)); set(sb, "vmin", IntArray(maxOf(w, h)))
  val m = sb.javaClass.getDeclaredMethod("blurPixels", Int::class.java, Int::class.java, Int::class.java)
  m.isAccessible = true; m.invoke(sb, w, h, r)
  return get(sb, "pix") as IntArray
}
fun argb(a: Int, r: Int, g: Int, b: Int) = (a shl 24) or (r shl 16) or (g shl 8) or b
fun ch(p: Int, s: Int) = (p ushr s) and 0xff
var fails = 0
fun check(name: String, ok: Boolean) { println((if (ok) "PASS " else "FAIL ") + name); if (!ok) fails++ }

fun main() {
  // 1. uniform image stays uniform (no drift, alpha intact)
  val w = 40; val h = 30; val c = argb(255, 200, 100, 50)
  val u = blur(IntArray(w * h) { c }, w, h, 8)
  check("uniform stays uniform", u.all { it == c })

  // 2. single bright pixel spreads symmetrically and energy is ~conserved
  val imp = IntArray(w * h) { argb(255, 0, 0, 0) }; imp[15 * w + 20] = argb(255, 255, 255, 255)
  val b = blur(imp, w, h, 4)
  val left = ch(b[15 * w + 18], 16); val right = ch(b[15 * w + 22], 16)
  val up = ch(b[13 * w + 20], 16); val down = ch(b[17 * w + 20], 16)
  check("impulse spreads (centre < 255, neighbours > 0)", ch(b[15 * w + 20], 16) in 1..254 && left > 0)
  check("horizontal symmetry", abs(left - right) <= 1)
  check("vertical symmetry", abs(up - down) <= 1)
  val sum = b.sumOf { ch(it, 16) }
  check("energy roughly conserved (sum=$sum ~255)", sum in 180..330)

  // 3. hard edge becomes a gradient, monotonic
  val edge = IntArray(w * h) { i -> if (i % w < w / 2) argb(255, 0, 0, 0) else argb(255, 255, 255, 255) }
  val e = blur(edge, w, h, 5)
  val row = (0 until w).map { ch(e[10 * w + it], 16) }
  check("edge gradient monotonic", row.zipWithNext().all { (a, b) -> b >= a })
  check("edge actually softened", row[w / 2 - 2] in 1..254)

  // 4. tiny images and max radius don't crash
  blur(IntArray(2 * 2) { c }, 2, 2, 25); blur(IntArray(3 * 50) { c }, 3, 50, 25)
  check("tiny image + radius 25 no crash", true)

  // 5. angle interpolation takes the short way
  check("lerpAngle 170->-170 goes via 180", abs(GlassConfig.lerpAngle(170f, -170f, 0.5f) - 180f) < 0.01f)
  check("lerpAngle -60->30 midpoint -15", abs(GlassConfig.lerpAngle(-60f, 30f, 0.5f) + 15f) < 0.01f)

  // 6. colour blend
  check("lerpColor midpoint", GlassConfig.lerpColor(argb(255,0,0,0), argb(255,200,100,50), 0.5f) == argb(255,100,50,25))
  check("lerpColor ends", GlassConfig.lerpColor(argb(0,10,20,30), argb(255,1,2,3), 1f) == argb(255,1,2,3))
  // 7. sanitize clamps garbage
  val s = GlassConfig(blurRadiusDp = Float.NaN, refraction = 9f, borderWidthDp = -3f, transitionDurationMs = 1e9f).sanitized()
  check("sanitized clamps", s.blurRadiusDp == 20f && s.refraction == 1f && s.borderWidthDp == 0f && s.transitionDurationMs == 2000f)
  // 8. looksLike ignores non-visual fields
  check("looksLike ignores flags", GlassConfig().looksLike(GlassConfig(pressed = true, backdropId = "x")) && !GlassConfig().looksLike(GlassConfig(blurRadiusDp = 5f)))

  println(if (fails == 0) "ALL PASSED" else "$fails FAILED")
}
