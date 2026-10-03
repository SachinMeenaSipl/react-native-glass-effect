package com.liquidglass.view

import android.graphics.Color
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.views.view.ReactViewGroup
import com.facebook.react.views.view.ReactViewManager
import com.liquidglass.config.QualityMode

/**
 * ViewManager for <LiquidGlassView>.
 *
 * WHY ReactViewManager AND NOT A CODEGEN DELEGATE?
 * Glass must behave like a normal <View> (pointerEvents, overflow, hitSlop, nativeID,
 * accessibility, borders...). ReactViewManager already implements all of those as
 * @ReactProp setters. A codegen delegate would bypass them, so we use @ReactProp for
 * our props too and let RN's reflection-based setter handle everything.
 * The TS spec in src/specs/ still drives Fabric's C++ props on both platforms.
 *
 * Every setter only writes into `view.pending`. The whole batch is applied once in
 * [onAfterUpdateTransaction], so a prop update never triggers N redraws or N animations.
 *
 * Prop names and defaults MUST match src/specs/LiquidGlassViewNativeComponent.ts.
 */
class LiquidGlassViewManager : ReactViewManager() {

  override fun getName(): String = NAME

  override fun createViewInstance(context: ThemedReactContext): ReactViewGroup =
    LiquidGlassView(context)

  override fun onAfterUpdateTransaction(view: ReactViewGroup) {
    super.onAfterUpdateTransaction(view)
    (view as? LiquidGlassView)?.commitConfig()
  }

  override fun prepareToRecycleView(
    reactContext: ThemedReactContext,
    view: ReactViewGroup,
  ): ReactViewGroup? {
    (view as? LiquidGlassView)?.resetForRecycle()
    return super.prepareToRecycleView(reactContext, view)
  }

  private inline fun edit(view: ReactViewGroup, block: LiquidGlassView.() -> Unit) {
    (view as? LiquidGlassView)?.block()
  }

  @ReactProp(name = "blurRadius", defaultFloat = 20f)
  fun setBlurRadius(view: ReactViewGroup, value: Float) = edit(view) { pending = pending.copy(blurRadiusDp = value) }

  @ReactProp(name = "tintColor", customType = "Color")
  fun setTintColor(view: ReactViewGroup, value: Int?) = edit(view) { pending = pending.copy(tintColor = value ?: Color.WHITE) }

  @ReactProp(name = "tintOpacity", defaultFloat = 0.12f)
  fun setTintOpacity(view: ReactViewGroup, value: Float) = edit(view) { pending = pending.copy(tintOpacity = value) }

  @ReactProp(name = "refraction", defaultFloat = 0.35f)
  fun setRefraction(view: ReactViewGroup, value: Float) = edit(view) { pending = pending.copy(refraction = value) }

  @ReactProp(name = "distortion", defaultFloat = 0.1f)
  fun setDistortion(view: ReactViewGroup, value: Float) = edit(view) { pending = pending.copy(distortion = value) }

  @ReactProp(name = "illumination", defaultFloat = 0.5f)
  fun setIllumination(view: ReactViewGroup, value: Float) = edit(view) { pending = pending.copy(illumination = value) }

  @ReactProp(name = "lightAngle", defaultFloat = -60f)
  fun setLightAngle(view: ReactViewGroup, value: Float) = edit(view) { pending = pending.copy(lightAngleDeg = value) }

  @ReactProp(name = "chromaticAberration", defaultFloat = 0f)
  fun setChromaticAberration(view: ReactViewGroup, value: Float) = edit(view) { pending = pending.copy(chromaticAberration = value) }

  @ReactProp(name = "edgeWidth", defaultFloat = 16f)
  fun setEdgeWidth(view: ReactViewGroup, value: Float) = edit(view) { pending = pending.copy(edgeWidthDp = value) }

  @ReactProp(name = "cornerRadius", defaultFloat = 24f)
  fun setCornerRadius(view: ReactViewGroup, value: Float) = edit(view) { pending = pending.copy(cornerRadiusDp = value) }

  @ReactProp(name = "glassBorderWidth", defaultFloat = 1f)
  fun setGlassBorderWidth(view: ReactViewGroup, value: Float) = edit(view) { pending = pending.copy(borderWidthDp = value) }

  @ReactProp(name = "glassBorderOpacity", defaultFloat = 0.3f)
  fun setGlassBorderOpacity(view: ReactViewGroup, value: Float) = edit(view) { pending = pending.copy(borderOpacity = value) }

  /** iOS-only prop; accepted and ignored on Android so no warning is logged. */
  @ReactProp(name = "appearance")
  fun setAppearance(view: ReactViewGroup, value: String?) = Unit

  @ReactProp(name = "quality")
  fun setQuality(view: ReactViewGroup, value: String?) = edit(view) { pending = pending.copy(quality = QualityMode.from(value)) }

  @ReactProp(name = "reduceTransparency", defaultBoolean = false)
  fun setReduceTransparency(view: ReactViewGroup, value: Boolean) = edit(view) { pending = pending.copy(reduceTransparency = value) }

  @ReactProp(name = "fallbackColor", customType = "Color")
  fun setFallbackColor(view: ReactViewGroup, value: Int?) =
    edit(view) { pending = pending.copy(fallbackColor = value ?: DEFAULT_FALLBACK) }

  @ReactProp(name = "backdropId")
  fun setBackdropId(view: ReactViewGroup, value: String?) = edit(view) { pending = pending.copy(backdropId = value ?: "") }

  @ReactProp(name = "pressed", defaultBoolean = false)
  fun setPressed(view: ReactViewGroup, value: Boolean) = edit(view) { pending = pending.copy(pressed = value) }

  @ReactProp(name = "interactive", defaultBoolean = false)
  fun setInteractive(view: ReactViewGroup, value: Boolean) = edit(view) { pending = pending.copy(interactive = value) }

  @ReactProp(name = "motionLighting", defaultBoolean = false)
  fun setMotionLighting(view: ReactViewGroup, value: Boolean) = edit(view) { pending = pending.copy(motionLighting = value) }

  @ReactProp(name = "transitionDuration", defaultFloat = 180f)
  fun setTransitionDuration(view: ReactViewGroup, value: Float) = edit(view) { pending = pending.copy(transitionDurationMs = value) }

  @ReactProp(name = "clipContent", defaultBoolean = true)
  fun setClipContent(view: ReactViewGroup, value: Boolean) = edit(view) { pending = pending.copy(clipContent = value) }

  companion object {
    const val NAME = "LiquidGlassView"
    private const val DEFAULT_FALLBACK = 0xFFF2F2F7.toInt()
  }
}
