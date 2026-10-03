package com.liquidglass.backdrop

import android.graphics.Matrix
import android.graphics.Rect
import android.graphics.RectF
import android.os.Build
import android.view.View

/**
 * Where is the backdrop relative to the glass? Main thread only (shared temp objects).
 */
internal object ViewGeometry {

  private val glassToScreen = Matrix()
  private val backdropToScreen = Matrix()
  private val screenToGlass = Matrix()
  private val a = IntArray(2)
  private val b = IntArray(2)

  /**
   * Fill [out] with the matrix that maps BACKDROP-local coordinates to GLASS-local ones.
   * Drawing the backdrop with this matrix makes it line up exactly with the screen.
   *
   * API 29+: full matrices → handles translate, scale, rotate, scroll, Reanimated transforms.
   * API 24–28: window positions only → translation is exact, scale/rotation are ignored.
   *
   * @return false if the glass has a degenerate transform (e.g. scale 0) — skip drawing.
   */
  fun backdropToGlass(glass: View, backdrop: View, out: Matrix): Boolean {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
      glassToScreen.reset()
      glass.transformMatrixToGlobal(glassToScreen)
      backdropToScreen.reset()
      backdrop.transformMatrixToGlobal(backdropToScreen)
      if (!glassToScreen.invert(screenToGlass)) return false
      out.set(backdropToScreen)
      out.postConcat(screenToGlass)
      return true
    }
    glass.getLocationInWindow(a)
    backdrop.getLocationInWindow(b)
    out.setTranslate((b[0] - a[0]).toFloat(), (b[1] - a[1]).toFloat())
    return true
  }

  private val tmp = Matrix()

  /** Map [rect] (in [view]-local px) to screen px, in place. Handles transforms on API 29+. */
  fun toScreen(view: View, rect: RectF) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
      tmp.reset()
      view.transformMatrixToGlobal(tmp)
      tmp.mapRect(rect)
    } else {
      view.getLocationOnScreen(a)
      rect.offset(a[0].toFloat(), a[1].toFloat())
    }
  }

  fun screenRect(view: View, out: Rect) {
    view.getLocationOnScreen(a)
    out.set(a[0], a[1], a[0] + view.width, a[1] + view.height)
  }

  /** Is [ancestor] a parent (at any depth) of [view]? */
  fun isAncestor(ancestor: View, view: View): Boolean {
    var p = view.parent
    while (p != null) {
      if (p === ancestor) return true
      p = p.parent
    }
    return false
  }
}
