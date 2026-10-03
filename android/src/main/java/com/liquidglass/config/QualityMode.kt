package com.liquidglass.config

/** The `quality` prop as sent from JS. */
enum class QualityMode {
  AUTO, HIGH, MEDIUM, LOW, STATIC;

  companion object {
    fun from(value: String?): QualityMode = when (value) {
      "high" -> HIGH
      "medium" -> MEDIUM
      "low" -> LOW
      "static" -> STATIC
      else -> AUTO
    }
  }
}
