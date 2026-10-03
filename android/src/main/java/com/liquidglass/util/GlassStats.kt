package com.liquidglass.util

/**
 * Cheap performance counters (plain Long increments on the main thread), exposed to JS via
 * LiquidGlassModule.getStats() for profiling. Always on: the cost is a few additions per frame.
 */
internal object GlassStats {
  var glassDraws = 0L
  var gpuBlurPasses = 0L
  var shaderPasses = 0L
  var compatCaptures = 0L
  var compatCaptureNanos = 0L
  var skippedFarChanges = 0L
  var solidDraws = 0L
  var liveGlassViews = 0

  fun reset() {
    glassDraws = 0; gpuBlurPasses = 0; shaderPasses = 0; compatCaptures = 0
    compatCaptureNanos = 0; skippedFarChanges = 0; solidDraws = 0
  }
}
