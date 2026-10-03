/**
 * Codegen spec for the native <GlassBackdrop> (Android only).
 *
 * A GlassBackdrop records everything it draws into a GPU display list
 * (RenderNode). LiquidGlassViews then re-draw that display list, blurred and
 * refracted, behind their own content. That is how Android glass "sees" what
 * is behind it.
 *
 * iOS does not need this: UIVisualEffectView samples the screen itself.
 * On iOS the JS component renders a plain <View>, so this native component is
 * excluded from iOS codegen.
 */
import type { HostComponent, ViewProps } from 'react-native';
import type { WithDefault } from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

export interface NativeGlassBackdropProps extends ViewProps {
  /** Optional id so a LiquidGlassView can target this backdrop explicitly. */
  backdropId?: WithDefault<string, ''>;
}

export default codegenNativeComponent<NativeGlassBackdropProps>(
  'GlassBackdrop',
  { excludedPlatforms: ['iOS'] }
) as HostComponent<NativeGlassBackdropProps>;
