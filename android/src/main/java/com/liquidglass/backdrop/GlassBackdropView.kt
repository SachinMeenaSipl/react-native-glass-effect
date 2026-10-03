package com.liquidglass.backdrop

import android.content.Context
import android.graphics.Canvas
import android.graphics.Rect
import android.graphics.RenderNode
import android.os.Build
import android.view.View
import android.view.ViewParent
import androidx.annotation.RequiresApi
import com.facebook.react.views.view.ReactViewGroup

/**
 * <GlassBackdrop> — the "what is behind the glass" source.
 *
 * HOW DYNAMIC BACKGROUND CAPTURE WORKS (Android 12+):
 *
 *   draw(canvas)
 *     ├─ record everything this view draws into [contentNode]  (a GPU display list,
 *     │   NOT pixels — recording is cheap and nothing is copied)
 *     └─ draw [contentNode] onto the real canvas               (so the screen looks normal)
 *
 *   LiquidGlassView.onDraw
 *     └─ draws the SAME [contentNode] again, moved to line up with the glass,
 *        through blur + saturation + refraction effects.
 *
 * Because a RenderNode references its children's RenderNodes, scrolling, animations
 * and video (TextureView) inside the backdrop show up in the glass automatically.
 *
 * CHANGE SIGNALS: any invalidation inside this subtree bumps [contentVersion] and tells
 * bound glass views to redraw in the same frame (see [BackdropRegistry.notifyContentChanged]).
 *
 * Recording only happens while at least one glass view is bound ([isRecordingEnabled]),
 * so an unused backdrop costs nothing.
 *
 * Below Android 12 the compat renderer draws this view into a small bitmap instead.
 */
class GlassBackdropView(context: Context) : ReactViewGroup(context) {

  var backdropId: String = ""
    set(value) {
      if (field != value) {
        field = value
        BackdropRegistry.onBackdropsChanged()
      }
    }

  /**
   * GPU display list of this view's content (Android 12+).
   * Stored as Any? so this class still loads on Android 7–11, where RenderNode
   * is not a public class. Always go through [contentNode].
   */
  private var nodeHolder: Any? = null

  @RequiresApi(Build.VERSION_CODES.S)
  internal fun contentNode(): RenderNode =
    (nodeHolder as RenderNode?) ?: RenderNode("GlassBackdrop").also { nodeHolder = it }

  /** Increments whenever anything inside might have changed. */
  internal var contentVersion: Long = 0L
    private set

  internal var isRecordingEnabled: Boolean = false
    private set

  /** Called by the registry when the first glass binds / the last one unbinds. */
  internal fun setRecordingEnabled(enabled: Boolean) {
    if (isRecordingEnabled == enabled) return
    isRecordingEnabled = enabled
    if (!enabled && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) contentNode().discardDisplayList()
    invalidate()
  }

  /** True when the display list is ready to be sampled by glass views. */
  internal fun hasRecordedContent(): Boolean =
    Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && contentNode().hasDisplayList()

  override fun onAttachedToWindow() {
    super.onAttachedToWindow()
    BackdropRegistry.addBackdrop(this)
  }

  override fun onDetachedFromWindow() {
    BackdropRegistry.removeBackdrop(this)
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) contentNode().discardDisplayList()
    isRecordingEnabled = false
    super.onDetachedFromWindow()
  }

  override fun draw(canvas: Canvas) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S &&
      isRecordingEnabled && canvas.isHardwareAccelerated && width > 0 && height > 0
    ) {
      val node = contentNode()
      node.setPosition(0, 0, width, height)
      val recording = node.beginRecording(width, height)
      try {
        super.draw(recording)
      } finally {
        node.endRecording()
      }
      canvas.drawRenderNode(node)
    } else {
      // Software canvas (screenshots), old Android, or no glass bound: normal drawing.
      super.draw(canvas)
    }
  }

  // ---- change detection --------------------------------------------------------------

  override fun invalidate() {
    super.invalidate()
    markChanged(null) // the backdrop itself changed: affects every glass
  }

  /**
   * API 26+: called for every invalidation anywhere below this view. [target] is the view
   * that changed, so glass views far away from it can skip redrawing.
   */
  override fun onDescendantInvalidated(child: View, target: View) {
    super.onDescendantInvalidated(child, target)
    markChanged(target)
  }

  /** API 24–25 path for the same signal. */
  @Deprecated("Deprecated in Android API; still used on API 24-25")
  @Suppress("DEPRECATION")
  override fun invalidateChildInParent(location: IntArray?, dirty: Rect?): ViewParent? {
    markChanged(null)
    return super.invalidateChildInParent(location, dirty)
  }

  private fun markChanged(target: View?) {
    contentVersion++
    BackdropRegistry.notifyContentChanged(this, target)
  }
}
