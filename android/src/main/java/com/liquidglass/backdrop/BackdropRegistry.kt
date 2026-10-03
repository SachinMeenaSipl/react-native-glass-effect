package com.liquidglass.backdrop

import android.graphics.Rect
import android.graphics.RectF
import android.view.View
import java.util.WeakHashMap
import com.liquidglass.util.GlassLog
import com.liquidglass.view.LiquidGlassView
import java.lang.ref.WeakReference

/**
 * Keeps track of every attached backdrop and glass view, and answers
 * "which backdrop should this glass sample?".
 *
 * Main thread only. Holds WEAK references so it can never leak a screen.
 *
 * Matching rules (in order):
 * 1. Only backdrops in the SAME WINDOW (a Modal is its own window).
 * 2. Never a backdrop that CONTAINS the glass (that would sample itself → infinite loop).
 * 3. If the glass has `backdropId`, only a backdrop with that id.
 * 4. Otherwise the backdrop that overlaps the glass most on screen;
 *    ties go to the most recently attached.
 */
internal object BackdropRegistry {

  private val backdrops = ArrayList<WeakReference<GlassBackdropView>>()
  private val glasses = ArrayList<WeakReference<LiquidGlassView>>()
  private var notifying = false
  private const val CHANGE_MARGIN_DP = 16f

  private val tmpA = Rect()
  private val tmpB = Rect()
  private val changed = RectF()
  private val current = RectF()
  /** Last known screen rect of each view that invalidated, so a MOVED view also refreshes
   *  glass over the spot it left (otherwise a "ghost" would stay behind the glass). */
  private val lastTargetRects = WeakHashMap<View, RectF>()

  // ---- backdrops ---------------------------------------------------------------------

  fun addBackdrop(backdrop: GlassBackdropView) {
    prune()
    if (backdrops.none { it.get() === backdrop }) backdrops.add(WeakReference(backdrop))
    onBackdropsChanged()
  }

  fun removeBackdrop(backdrop: GlassBackdropView) {
    backdrops.removeAll { it.get() == null || it.get() === backdrop }
    onBackdropsChanged()
  }

  /** A backdrop appeared, disappeared or changed id: every glass re-picks its backdrop. */
  fun onBackdropsChanged() {
    liveGlasses().forEach { it.requestRebind() }
  }

  // ---- glass views -------------------------------------------------------------------

  fun addGlass(glass: LiquidGlassView) {
    prune()
    if (glasses.none { it.get() === glass }) glasses.add(WeakReference(glass))
    onGlassCountChanged(glass.rootView)
  }

  fun removeGlass(glass: LiquidGlassView) {
    val root = glass.rootView
    glasses.removeAll { it.get() == null || it.get() === glass }
    onGlassCountChanged(root)
    updateRecordingFlags()
  }

  fun glassCountIn(root: View?): Int =
    liveGlasses().count { it.isAttachedToWindow && it.rootView === root }

  private fun onGlassCountChanged(root: View?) {
    liveGlasses().filter { it.rootView === root }.forEach { it.onGlassCountChanged() }
  }

  // ---- matching ----------------------------------------------------------------------

  fun resolve(glass: LiquidGlassView, backdropId: String): GlassBackdropView? {
    val root = glass.rootView
    val sameWindow = liveBackdrops().filter { it.isAttachedToWindow && it.rootView === root }
    val candidates = sameWindow.filter { !ViewGeometry.isAncestor(it, glass) }

    if (candidates.size < sameWindow.size && candidates.isEmpty()) {
      GlassLog.warnOnce(
        "nested",
        "A LiquidGlassView is INSIDE a GlassBackdrop, so it cannot sample it. " +
          "Move the glass outside the backdrop (as a sibling rendered on top). " +
          "See docs/user-guide/03-core-concepts.md"
      )
    }

    if (backdropId.isNotEmpty()) {
      val match = candidates.lastOrNull { it.backdropId == backdropId }
      if (match == null) {
        GlassLog.warnOnce(
          "id:$backdropId",
          "No GlassBackdrop with backdropId=\"$backdropId\" in this window. Rendering solid fallback."
        )
      }
      return match
    }

    return when (candidates.size) {
      0 -> {
        if (sameWindow.isEmpty()) {
          GlassLog.warnOnce(
            "none",
            "LiquidGlassView has no GlassBackdrop to sample, so it renders a solid fallback. " +
              "Wrap your background content in <GlassBackdrop>. (Inside a Modal, add one inside the Modal.)"
          )
        }
        null
      }
      1 -> candidates[0]
      else -> bestOverlap(glass, candidates)
    }
  }

  private fun bestOverlap(glass: View, candidates: List<GlassBackdropView>): GlassBackdropView {
    ViewGeometry.screenRect(glass, tmpA)
    var best = candidates.last()
    var bestArea = -1L
    // Iterate newest → oldest so ties keep the newest.
    for (candidate in candidates.asReversed()) {
      ViewGeometry.screenRect(candidate, tmpB)
      val area = if (tmpB.intersect(tmpA)) tmpB.width().toLong() * tmpB.height() else 0L
      if (area > bestArea) {
        bestArea = area
        best = candidate
      }
    }
    return best
  }

  /** Backdrops only record their display list while some glass samples them. */
  fun updateRecordingFlags() {
    val bound = liveGlasses().mapNotNull { it.boundBackdrop }.toSet()
    liveBackdrops().forEach { it.setRecordingEnabled(it in bound) }
  }

  // ---- change propagation ------------------------------------------------------------

  /**
   * Something inside [backdrop] was invalidated → redraw the glass views that sample it.
   *
   * PROXIMITY FILTER: when [target] (the view that changed) is known, only glass views whose
   * sample area overlaps the target's old OR new screen rect are redrawn. A spinner in one
   * corner therefore no longer re-blurs every glass on screen each frame.
   * [target] == null means "anything may have changed" → every bound glass redraws.
   *
   * The re-entrancy guard stops invalidation ping-pong between nested setups.
   */
  fun notifyContentChanged(backdrop: GlassBackdropView, target: View?) {
    if (notifying || glasses.isEmpty()) return
    notifying = true
    try {
      var hasRect = false
      if (target != null && target !== backdrop && target.isAttachedToWindow) {
        current.set(0f, 0f, target.width.toFloat(), target.height.toFloat())
        ViewGeometry.toScreen(target, current)
        changed.set(current)
        lastTargetRects[target]?.let { changed.union(it) }
        (lastTargetRects.getOrPut(target) { RectF() }).set(current)
        // Views can paint outside their bounds (shadows, overflow: visible children):
        // widen the area a little so nearby glass isn't missed.
        val margin = CHANGE_MARGIN_DP * target.resources.displayMetrics.density
        changed.inset(-margin, -margin)
        hasRect = true
      }
      for (ref in glasses) {
        val glass = ref.get() ?: continue
        if (glass.boundBackdrop !== backdrop) continue
        if (!hasRect || glass.samplesScreenRect(changed)) glass.onBackdropContentChanged()
        else com.liquidglass.util.GlassStats.skippedFarChanges++
      }
    } finally {
      notifying = false
    }
  }

  // ---- housekeeping ------------------------------------------------------------------

  private fun liveBackdrops(): List<GlassBackdropView> = backdrops.mapNotNull { it.get() }
  private fun liveGlasses(): List<LiquidGlassView> = glasses.mapNotNull { it.get() }

  private fun prune() {
    backdrops.removeAll { it.get() == null }
    glasses.removeAll { it.get() == null }
  }
}
