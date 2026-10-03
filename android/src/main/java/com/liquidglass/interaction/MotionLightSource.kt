package com.liquidglass.interaction

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import kotlin.math.abs

/**
 * Shared tilt sensor for `motionLighting`. ONE sensor listener serves every glass
 * view in the app; it is registered only while at least one subscriber exists and
 * the app is in the foreground (see [pause] / [resume], wired to React lifecycle).
 *
 * Output: a small angle offset in degrees (±[MAX_OFFSET_DEG]) that is added to the
 * configured light angle, so the rim highlight slides as the phone tilts.
 *
 * Uses GAME_ROTATION_VECTOR (no magnetometer → no compass jumps), falling back to
 * the accelerometer on devices without it. No sensor at all → offset stays 0.
 */
internal object MotionLightSource : SensorEventListener {

  private const val MAX_OFFSET_DEG = 35f
  private const val SMOOTHING = 0.15f
  private const val MIN_CHANGE_DEG = 0.4f

  private val subscribers = LinkedHashSet<() -> Unit>()
  private var sensorManager: SensorManager? = null
  private var sensor: Sensor? = null
  private var registered = false
  private var paused = false

  private val rotation = FloatArray(9)
  private val orientation = FloatArray(3)

  /** Current smoothed offset in degrees. */
  @Volatile var offsetDeg = 0f
    private set
  private var lastNotified = 0f

  fun subscribe(context: Context, listener: () -> Unit) {
    if (sensorManager == null) {
      val sm = context.applicationContext.getSystemService(Context.SENSOR_SERVICE) as? SensorManager
      sensorManager = sm
      sensor = sm?.getDefaultSensor(Sensor.TYPE_GAME_ROTATION_VECTOR)
        ?: sm?.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
    }
    subscribers.add(listener)
    updateRegistration()
  }

  fun unsubscribe(listener: () -> Unit) {
    subscribers.remove(listener)
    updateRegistration()
  }

  fun pause() {
    paused = true
    updateRegistration()
  }

  fun resume() {
    paused = false
    updateRegistration()
  }

  private fun updateRegistration() {
    val want = subscribers.isNotEmpty() && !paused && sensor != null
    val sm = sensorManager ?: return
    if (want && !registered) {
      registered = sm.registerListener(this, sensor, SensorManager.SENSOR_DELAY_GAME)
    } else if (!want && registered) {
      sm.unregisterListener(this)
      registered = false
      offsetDeg = 0f
      lastNotified = 0f
    }
  }

  override fun onSensorChanged(event: SensorEvent) {
    val roll: Float = when (event.sensor.type) {
      Sensor.TYPE_GAME_ROTATION_VECTOR -> {
        SensorManager.getRotationMatrixFromVector(rotation, event.values)
        SensorManager.getOrientation(rotation, orientation)
        Math.toDegrees(orientation[2].toDouble()).toFloat() // left/right tilt
      }
      else -> {
        // Accelerometer x axis: ~±9.8 when the phone is on its side.
        (event.values[0] / SensorManager.GRAVITY_EARTH) * -90f
      }
    }
    val target = roll.coerceIn(-MAX_OFFSET_DEG, MAX_OFFSET_DEG)
    offsetDeg += (target - offsetDeg) * SMOOTHING
    if (abs(offsetDeg - lastNotified) >= MIN_CHANGE_DEG) {
      lastNotified = offsetDeg
      subscribers.toList().forEach { it() }
    }
  }

  override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) = Unit
}
