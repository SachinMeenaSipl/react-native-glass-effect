package com.liquidglass.capability

/**
 * The concrete budget a glass view renders with, after "auto" is resolved.
 *
 * | Level  | Shader tier (13+)          | Compat tier (≤11)                     |
 * |--------|----------------------------|---------------------------------------|
 * | HIGH   | refraction + RGB split     | re-capture every frame, 1/4 res       |
 * | MEDIUM | refraction, no RGB split   | re-capture every 2nd frame, 1/4 res   |
 * | LOW    | blur only (no shader)      | re-capture ~10×/s, 1/8 res            |
 * | STATIC | capture once, never update | capture once, never update            |
 */
enum class QualityLevel {
  HIGH, MEDIUM, LOW, STATIC;

  fun downgrade(): QualityLevel = when (this) {
    HIGH -> MEDIUM
    MEDIUM -> LOW
    LOW, STATIC -> this
  }
}
