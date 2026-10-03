package com.liquidglass.view

import android.content.Context
import android.graphics.Canvas
import android.graphics.Matrix
import android.graphics.Outline
import android.view.MotionEvent
import android.view.View
import android.view.ViewOutlineProvider
import android.view.ViewTreeObserver
import com.facebook.react.uimanager.PointerEvents
import com.facebook.react.views.view.ReactViewGroup
import com.liquidglass.backdrop.BackdropRegistry
import com.liquidglass.backdrop.GlassBackdropView
import com.liquidglass.backdrop.ViewGeometry
import com.liquidglass.capability.DeviceCapabilities
import com.liquidglass.capability.QualityLevel
import com.liquidglass.capability.QualityResolver
import com.liquidglass.capability.RendererTier
import com.liquidglass.capability.SystemSettingsMonitor
import com.liquidglass.config.GlassConfig
import com.liquidglass.config.GlassConfigTransition
import com.liquidglass.interaction.MotionLightSource
import com.liquidglass.interaction.PressAnimator
import com.liquidglass.interaction.TouchLightController
import com.liquidglass.renderer.GlassFrame
import com.liquidglass.renderer.GlassRenderer
import com.liquidglass.renderer.RendererFactory
import com.liquidglass.renderer.SolidGlassRenderer
import com.liquidglass.renderer.paint.SurfacePainter
import kotlin.math.max
import kotlin.math.min

/**
 * <LiquidGlassView> on Android. This class CONDUCTS; it does not render by itself.
 *
 *   props ──► pending config ──commit──► GlassConfigTransition (animated current config)
 *                                              │
 *   BackdropRegistry ──► boundBackdrop ────────┤
 *   QualityResolver  ──► level ────────────────┤
 *   Touch / Press / Motion ──► light ──────────┤
 *                                              ▼
 *                                   GlassFrame (this frame's inputs)
 *                                              │
 *                          renderer.draw()  ◄──┘   (SHADER / BLUR / COMPAT / SOLID)
 *                          painter.paint()         (tint, sheen, border)
 *                          children               (drawn sharp, on top)
 *
 * WHEN DOES IT REDRAW?
 * - its own props change / a transition is animating
 * - the bound backdrop's content changes (BackdropRegistry.notifyContentChanged)
 * - the glass or backdrop MOVES (checked every frame in [onPreDraw] via matrices,
 *   which catches native-driver animations, Reanimated, scrolling parents...)
 * - touch light / press / tilt animations
 */
class LiquidGlassView(context: Context) : ReactViewGroup(context) {

  /** Written by the ViewManager during a prop batch; applied in [commitConfig]. */
  internal var pending = GlassConfig()

  private val transition = GlassConfigTransition { onVisualChange() }
  private val frame = GlassFrame()
  private val painter = SurfacePainter()
  private var renderer: GlassRenderer = SolidGlassRenderer()
  private var level = QualityLevel.MEDIUM

  /** The backdrop this glass samples. Read by BackdropRegistry. */
  internal var boundBackdrop: GlassBackdropView? = null
    private set

  private var needsRebind = true
  private var needsRendererCheck = true
  private var backdropDirty = true
  private var geometryDirty = true
  private val lastMatrix = Matrix()
  private val backdropBounds = android.graphics.RectF()
  /** frame.sampleRect in screen px, refreshed every draw (for the proximity filter). */
  private val screenSample = android.graphics.RectF()
  private var hasScreenSample = false
  private val probeMatrix = Matrix()
  private var hasLastMatrix = false

  private var animationsOn = true
  private var touchDown = false
  private val touch = TouchLightController { onVisualChange() }
  private val press = PressAnimator { onVisualChange() }
  private var motionSubscribed = false
  private val motionListener: () -> Unit = { onVisualChange() }
  private val settingsListener: () -> Unit = { requestRendererCheck() }

  private var observer: ViewTreeObserver? = null
  private val preDrawListener = ViewTreeObserver.OnPreDrawListener {
    onPreDraw()
    true
  }

  private var outlineRadius = -1f
  private val glassOutline = object : ViewOutlineProvider() {
    override fun getOutline(view: View, outline: Outline) {
      outline.setRoundRect(0, 0, view.width, view.height, currentRadiusPx())
    }
  }

  init {
    setWillNotDraw(false)
    outlineProvider = glassOutline
    clipToOutline = true
  }

  // ======================================================================================
  // Props
  // ======================================================================================

  /** Called once per prop batch (ViewManager.onAfterUpdateTransaction). */
  internal fun commitConfig() {
    val next = pending.sanitized()
    val prev = transition.target
    transition.animateTo(next, allowAnimation = isAttachedToWindow && animationsOn)

    if (next.backdropId != prev.backdropId || next.reduceTransparency != prev.reduceTransparency) {
      needsRebind = true
    }
    if (next.quality != prev.quality || next.reduceTransparency != prev.reduceTransparency) {
      needsRendererCheck = true
    }

    // Glass must own the outline (RN may have set its own while applying style props).
    outlineProvider = glassOutline
    clipToOutline = next.clipContent
    invalidateOutline()

    press.setPressed(next.pressed || touchDown, animationsOn)
    if (!next.interactive) {
      touchDown = false
      touch.reset()
    }
    updateMotionSubscription()
    invalidate()
  }

  /** View recycling (Fabric): forget everything from the previous owner. */
  internal fun resetForRecycle() {
    pending = GlassConfig()
    transition.reset()
    touch.reset()
    press.reset()
    touchDown = false
    renderer.release()
    renderer = SolidGlassRenderer()
    boundBackdrop = null
    needsRebind = true
    needsRendererCheck = true
    hasLastMatrix = false
    hasScreenSample = false
  }

  // ======================================================================================
  // Signals from the registry / system
  // ======================================================================================

  internal fun requestRebind() {
    needsRebind = true
    invalidate()
  }

  internal fun onGlassCountChanged() = requestRendererCheck()

  /**
   * Does this glass sample (overlap) [screenRect]? Unknown yet (never drawn) → true,
   * so a glass is never starved of updates.
   */
  internal fun samplesScreenRect(screenRect: android.graphics.RectF): Boolean =
    !hasScreenSample || android.graphics.RectF.intersects(screenSample, screenRect)

  internal fun onBackdropContentChanged() {
    backdropDirty = true
    invalidate()
  }

  private fun requestRendererCheck() {
    needsRendererCheck = true
    invalidate()
  }

  private fun onVisualChange() {
    val r = currentRadiusPx()
    if (r != outlineRadius) {
      outlineRadius = r
      invalidateOutline()
    }
    invalidate()
  }

  // ======================================================================================
  // Lifecycle
  // ======================================================================================

  override fun onAttachedToWindow() {
    super.onAttachedToWindow()
    animationsOn = !DeviceCapabilities.isReduceMotion(context)
    BackdropRegistry.addGlass(this)
    com.liquidglass.util.GlassStats.liveGlassViews++
    observer = viewTreeObserver.also { it.addOnPreDrawListener(preDrawListener) }
    SystemSettingsMonitor.add(context, settingsListener)
    needsRebind = true
    needsRendererCheck = true
    hasLastMatrix = false
    updateMotionSubscription()
  }

  override fun onDetachedFromWindow() {
    observer?.let { if (it.isAlive) it.removeOnPreDrawListener(preDrawListener) }
    if (viewTreeObserver.isAlive) viewTreeObserver.removeOnPreDrawListener(preDrawListener)
    observer = null

    boundBackdrop = null
    hasScreenSample = false
    BackdropRegistry.removeGlass(this)
    com.liquidglass.util.GlassStats.liveGlassViews--
    SystemSettingsMonitor.remove(settingsListener)
    updateMotionSubscription()

    transition.finish()
    touch.reset()
    press.reset()
    touchDown = false
    renderer.release()
    super.onDetachedFromWindow()
  }

  override fun onSizeChanged(w: Int, h: Int, oldw: Int, oldh: Int) {
    super.onSizeChanged(w, h, oldw, oldh)
    geometryDirty = true
    invalidateOutline()
  }

  // ======================================================================================
  // Per-frame checks
  // ======================================================================================

  /** Runs before every frame the window draws. Cheap: two matrix walks + compares. */
  private fun onPreDraw() {
    ensureBinding()
    ensureRenderer()
    // A 0-sized or hidden glass never reaches onDraw, so lastMatrix
    // would never update and we would invalidate on EVERY frame forever. Skip it.
    if (width <= 0 || height <= 0 || !isShown) return
    val backdrop = boundBackdrop ?: return
    if (ViewGeometry.backdropToGlass(this, backdrop, probeMatrix)) {
      if (!hasLastMatrix || probeMatrix != lastMatrix) {
        geometryDirty = true
        invalidate()
      }
    }
    // Content changes arrive via BackdropRegistry.notifyContentChanged (proximity-filtered),
    // not by comparing versions here: that would redraw on EVERY change anywhere.
  }

  private fun ensureBinding() {
    if (!needsRebind || !isAttachedToWindow) return
    needsRebind = false
    val cfg = transition.target
    val next = if (cfg.reduceTransparency) null else BackdropRegistry.resolve(this, cfg.backdropId)
    if (next !== boundBackdrop) {
      boundBackdrop = next
      backdropDirty = true
      geometryDirty = true
      hasLastMatrix = false
      needsRendererCheck = true
    }
    // Always refresh: a backdrop that detached and re-attached (navigation) stopped
    // recording even though it is still the same object.
    BackdropRegistry.updateRecordingFlags()
  }

  private fun ensureRenderer() {
    if (!needsRendererCheck || !isAttachedToWindow) return
    needsRendererCheck = false
    val cfg = transition.target
    level = QualityResolver.resolve(
      cfg.quality, context, RendererTier.best(), BackdropRegistry.glassCountIn(rootView)
    )
    val kind = RendererFactory.choose(cfg, level, boundBackdrop != null, isHardwareAccelerated)
    if (kind != renderer.kind) {
      renderer.release()
      renderer = RendererFactory.create(kind)
      backdropDirty = true
      geometryDirty = true
    }
  }

  // ======================================================================================
  // Drawing
  // ======================================================================================

  override fun draw(canvas: Canvas) {
    val s = press.scale(squish = transition.current.interactive && animationsOn)
    if (s == 1f) {
      super.draw(canvas)
      return
    }
    // Squish via the canvas, never View.scaleX/Y, so RN/Reanimated transforms are untouched.
    val save = canvas.save()
    canvas.scale(s, s, width / 2f, height / 2f)
    super.draw(canvas)
    canvas.restoreToCount(save)
  }

  override fun onDraw(canvas: Canvas) {
    super.onDraw(canvas)
    if (width <= 0 || height <= 0) return
    ensureBinding()
    ensureRenderer()

    val cfg = transition.current
    val density = resources.displayMetrics.density
    val backdrop = boundBackdrop

    frame.width = width
    frame.height = height
    frame.density = density
    frame.config = cfg
    frame.level = level
    frame.shape.update(width, height, cfg.cornerRadiusDp * density)
    frame.backdrop = backdrop
    frame.hasGeometry = backdrop != null &&
      ViewGeometry.backdropToGlass(this, backdrop, frame.backdropToGlass)
    if (frame.hasGeometry && backdrop != null) {
      if (!hasLastMatrix || frame.backdropToGlass != lastMatrix) geometryDirty = true
      lastMatrix.set(frame.backdropToGlass)
      hasLastMatrix = true
      computeSampleRect(backdrop)
      if (frame.sampleRect.isEmpty) frame.hasGeometry = false // glass is off its backdrop
      screenSample.set(frame.sampleRect)
      ViewGeometry.toScreen(this, screenSample)
      hasScreenSample = true
    }
    frame.backdropChanged = backdropDirty
    frame.geometryChanged = geometryDirty
    frame.contentScale = press.scale(squish = cfg.interactive && animationsOn)
    frame.redrawAfterMs = -1L
    fillLight(cfg)

    com.liquidglass.util.GlassStats.glassDraws++
    val litByShader = renderer.draw(canvas, frame)
    painter.paint(canvas, frame, lightingDoneByShader = litByShader, drawTint = !cfg.reduceTransparency)

    // Bookkeeping: keep "dirty" only if a throttled renderer deferred the work.
    val deferred = frame.redrawAfterMs >= 0L
    backdropDirty = deferred && frame.backdropChanged
    geometryDirty = deferred && frame.geometryChanged
    if (deferred) postInvalidateDelayed(max(1L, frame.redrawAfterMs))
  }

  /** glass + padding, intersected with the backdrop's bounds mapped into glass space. */
  private fun computeSampleRect(backdrop: GlassBackdropView) {
    val pad = frame.padPx.toFloat()
    val sample = frame.sampleRect
    sample.set(-pad, -pad, width + pad, height + pad)
    backdropBounds.set(0f, 0f, backdrop.width.toFloat(), backdrop.height.toFloat())
    frame.backdropToGlass.mapRect(backdropBounds)
    if (!sample.intersect(backdropBounds)) {
      sample.setEmpty()
      return
    }
    // Whole pixels: RenderNodes and bitmaps are integer-sized.
    sample.set(
      kotlin.math.floor(sample.left), kotlin.math.floor(sample.top),
      kotlin.math.ceil(sample.right), kotlin.math.ceil(sample.bottom)
    )
  }

  private fun fillLight(cfg: GlassConfig) {
    val tilt = if (cfg.motionLighting && animationsOn) MotionLightSource.offsetDeg else 0f
    val light = frame.light
    light.setAngle(cfg.lightAngleDeg + tilt)
    light.touchX = touch.x
    light.touchY = touch.y
    light.touchStrength = if (cfg.interactive) touch.strength else 0f
    light.press = press.amount.coerceAtLeast(0f)
  }

  private fun currentRadiusPx(): Float {
    val r = transition.current.cornerRadiusDp * resources.displayMetrics.density
    return r.coerceIn(0f, min(width, height) / 2f)
  }

  // ======================================================================================
  // Touch (observe only — never steals events from children or JS)
  // ======================================================================================

  override fun dispatchTouchEvent(ev: MotionEvent): Boolean {
    val cfg = transition.target
    if (cfg.interactive && pointerEvents != PointerEvents.NONE) {
      touch.onTouch(ev, animationsOn)
      when (ev.actionMasked) {
        MotionEvent.ACTION_DOWN -> {
          touchDown = true
          press.setPressed(true, animationsOn)
        }
        MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> {
          touchDown = false
          press.setPressed(cfg.pressed, animationsOn)
        }
      }
    }
    return super.dispatchTouchEvent(ev)
  }

  // ======================================================================================
  // Motion lighting
  // ======================================================================================

  private fun updateMotionSubscription() {
    val want = isAttachedToWindow && transition.target.motionLighting && animationsOn
    if (want && !motionSubscribed) {
      MotionLightSource.subscribe(context, motionListener)
      motionSubscribed = true
    } else if (!want && motionSubscribed) {
      MotionLightSource.unsubscribe(motionListener)
      motionSubscribed = false
    }
  }
}
