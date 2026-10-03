/**
 * The ONLY place that touches native code from JS.
 *
 * Every component imports native pieces from here, never from `specs/` directly.
 * That keeps the "is native linked?" decision in one spot.
 *
 * Web gets `nativeBridge.web.ts` instead (everything null → JS fallbacks).
 */
import { Platform } from 'react-native';
import NativeGlassBackdrop from '../specs/GlassBackdropNativeComponent';
import NativeLiquidGlassModule from '../specs/NativeLiquidGlassModule';
import NativeLiquidGlassView from '../specs/LiquidGlassViewNativeComponent';

/**
 * True when the native library is compiled into the app.
 * False in Expo Go, in Jest, or when the app was not rebuilt after install.
 */
export const isNativeAvailable: boolean = NativeLiquidGlassModule != null;

export const nativeModule = NativeLiquidGlassModule;

export const NativeGlassView = isNativeAvailable ? NativeLiquidGlassView : null;

/** Backdrop sampling is only needed on Android. iOS samples the screen itself. */
export const NativeBackdrop =
  isNativeAvailable && Platform.OS === 'android' ? NativeGlassBackdrop : null;
