package com.liquidglass.compat

import android.graphics.Bitmap
import kotlin.math.abs
import kotlin.math.max
import kotlin.math.min

/**
 * CPU blur for Android 7–11 (and software canvases), based on Mario Klingemann's
 * Stack Blur. Close to a Gaussian, linear time in the radius, no GPU needed.
 *
 * It runs on SMALL bitmaps only (1/4 or 1/8 of the glass size), which keeps it
 * around a millisecond or two on mid-range phones.
 *
 * All working buffers are kept on the instance and reused between frames.
 */
internal class StackBlur {

  private var pix = IntArray(0)
  private var rCh = IntArray(0)
  private var gCh = IntArray(0)
  private var bCh = IntArray(0)
  private var aCh = IntArray(0)
  private var vmin = IntArray(0)
  private var dv = IntArray(0)
  private var dvRadius = -1

  /** Blur [bitmap] in place. [radius] is in bitmap pixels, clamped to 1..MAX_RADIUS. */
  fun blur(bitmap: Bitmap, radius: Int) {
    val r = radius.coerceIn(0, MAX_RADIUS)
    if (r < 1) return
    val w = bitmap.width
    val h = bitmap.height
    if (w < 2 || h < 2) return
    val wh = w * h
    if (pix.size < wh) {
      pix = IntArray(wh); rCh = IntArray(wh); gCh = IntArray(wh); bCh = IntArray(wh); aCh = IntArray(wh)
    }
    if (vmin.size < max(w, h)) vmin = IntArray(max(w, h))
    bitmap.getPixels(pix, 0, w, 0, 0, w, h)
    blurPixels(w, h, r)
    bitmap.setPixels(pix, 0, w, 0, 0, w, h)
  }

  private fun divTable(radius: Int): IntArray {
    if (radius != dvRadius) {
      val div = radius + radius + 1
      var divsum = (div + 1) shr 1
      divsum *= divsum
      dv = IntArray(256 * divsum) { it / divsum }
      dvRadius = radius
    }
    return dv
  }

  private fun blurPixels(w: Int, h: Int, radius: Int) {
    val wm = w - 1
    val hm = h - 1
    val div = radius + radius + 1
    val r1 = radius + 1
    val dv = divTable(radius)
    val stack = Array(div) { IntArray(4) }

    var yi = 0
    var yw = 0

    // Horizontal pass
    for (y in 0 until h) {
      var rs = 0; var gs = 0; var bs = 0; var ass = 0
      var rin = 0; var gin = 0; var bin = 0; var ain = 0
      var rout = 0; var gout = 0; var bout = 0; var aout = 0
      for (i in -radius..radius) {
        val p = pix[yi + min(wm, max(i, 0))]
        val sir = stack[i + radius]
        sir[0] = (p shr 16) and 0xff
        sir[1] = (p shr 8) and 0xff
        sir[2] = p and 0xff
        sir[3] = (p ushr 24) and 0xff
        val rbs = r1 - abs(i)
        rs += sir[0] * rbs; gs += sir[1] * rbs; bs += sir[2] * rbs; ass += sir[3] * rbs
        if (i > 0) {
          rin += sir[0]; gin += sir[1]; bin += sir[2]; ain += sir[3]
        } else {
          rout += sir[0]; gout += sir[1]; bout += sir[2]; aout += sir[3]
        }
      }
      var sp = radius
      for (x in 0 until w) {
        rCh[yi] = dv[rs]; gCh[yi] = dv[gs]; bCh[yi] = dv[bs]; aCh[yi] = dv[ass]
        rs -= rout; gs -= gout; bs -= bout; ass -= aout
        var sir = stack[(sp - radius + div) % div]
        rout -= sir[0]; gout -= sir[1]; bout -= sir[2]; aout -= sir[3]
        if (y == 0) vmin[x] = min(x + radius + 1, wm)
        val p = pix[yw + vmin[x]]
        sir[0] = (p shr 16) and 0xff
        sir[1] = (p shr 8) and 0xff
        sir[2] = p and 0xff
        sir[3] = (p ushr 24) and 0xff
        rin += sir[0]; gin += sir[1]; bin += sir[2]; ain += sir[3]
        rs += rin; gs += gin; bs += bin; ass += ain
        sp = (sp + 1) % div
        sir = stack[sp]
        rout += sir[0]; gout += sir[1]; bout += sir[2]; aout += sir[3]
        rin -= sir[0]; gin -= sir[1]; bin -= sir[2]; ain -= sir[3]
        yi++
      }
      yw += w
    }

    // Vertical pass
    for (x in 0 until w) {
      var rs = 0; var gs = 0; var bs = 0; var ass = 0
      var rin = 0; var gin = 0; var bin = 0; var ain = 0
      var rout = 0; var gout = 0; var bout = 0; var aout = 0
      var yp = -radius * w
      for (i in -radius..radius) {
        yi = max(0, yp) + x
        val sir = stack[i + radius]
        sir[0] = rCh[yi]; sir[1] = gCh[yi]; sir[2] = bCh[yi]; sir[3] = aCh[yi]
        val rbs = r1 - abs(i)
        rs += rCh[yi] * rbs; gs += gCh[yi] * rbs; bs += bCh[yi] * rbs; ass += aCh[yi] * rbs
        if (i > 0) {
          rin += sir[0]; gin += sir[1]; bin += sir[2]; ain += sir[3]
        } else {
          rout += sir[0]; gout += sir[1]; bout += sir[2]; aout += sir[3]
        }
        if (i < hm) yp += w
      }
      yi = x
      var sp = radius
      for (y in 0 until h) {
        pix[yi] = (dv[ass] shl 24) or (dv[rs] shl 16) or (dv[gs] shl 8) or dv[bs]
        rs -= rout; gs -= gout; bs -= bout; ass -= aout
        var sir = stack[(sp - radius + div) % div]
        rout -= sir[0]; gout -= sir[1]; bout -= sir[2]; aout -= sir[3]
        if (x == 0) vmin[y] = min(y + r1, hm) * w
        val p = x + vmin[y]
        sir[0] = rCh[p]; sir[1] = gCh[p]; sir[2] = bCh[p]; sir[3] = aCh[p]
        rin += sir[0]; gin += sir[1]; bin += sir[2]; ain += sir[3]
        rs += rin; gs += gin; bs += bin; ass += ain
        sp = (sp + 1) % div
        sir = stack[sp]
        rout += sir[0]; gout += sir[1]; bout += sir[2]; aout += sir[3]
        rin -= sir[0]; gin -= sir[1]; bin -= sir[2]; ain -= sir[3]
        yi += w
      }
    }
  }

  fun release() {
    pix = IntArray(0); rCh = IntArray(0); gCh = IntArray(0); bCh = IntArray(0); aCh = IntArray(0)
    vmin = IntArray(0); dv = IntArray(0); dvRadius = -1
  }

  companion object {
    const val MAX_RADIUS = 25
  }
}
