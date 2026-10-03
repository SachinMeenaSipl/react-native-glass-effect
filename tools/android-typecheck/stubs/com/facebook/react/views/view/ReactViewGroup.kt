package com.facebook.react.views.view
import android.content.Context
import android.graphics.Canvas
import android.view.MotionEvent
import android.view.ViewGroup
import com.facebook.react.uimanager.PointerEvents
// Mirrors RN 0.81 ReactViewGroup: open class, overrides below are open.
public open class ReactViewGroup public constructor(context: Context?) : ViewGroup(context) {
  public open var pointerEvents: PointerEvents = PointerEvents.AUTO
  override fun onLayout(changed: Boolean, l: Int, t: Int, r: Int, b: Int) {}
  override fun onInterceptTouchEvent(event: MotionEvent): Boolean = false
  override fun onTouchEvent(event: MotionEvent): Boolean = true
  override fun onSizeChanged(w: Int, h: Int, oldw: Int, oldh: Int) {}
  override fun onAttachedToWindow() { super.onAttachedToWindow() }
  override fun draw(canvas: Canvas) { super.draw(canvas) }
  override fun dispatchDraw(canvas: Canvas) { super.dispatchDraw(canvas) }
  internal open fun recycleView() {}
}
