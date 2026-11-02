#import <QuartzCore/QuartzCore.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/** Plain floats only, so Objective-C and the Metal shader agree on the layout. Lengths are px. */
typedef struct {
  float sizeX, sizeY;
  float originX, originY;     // captured area's top-left, in glass-local px
  float captureX, captureY;   // captured area's size in px
  float radius, edge;
  float refraction, distortion, chroma, illumination;
  float lightX, lightY;
  float touchX, touchY, touchStrength, press;
  float tintR, tintG, tintB, tintA;
  float borderWidth, borderOpacity;
} LGShaderUniforms;

/**
 * iOS twin of Android's RenderNodeGlassRenderer: capture → blur → AGSL-equivalent shader,
 * plus the tint and border that SurfacePainter draws on Android.
 * The fragment shader is a port of GlassShaderSource.kt; keep steps 1–7 in sync.
 * Main thread only.
 */
@interface LGShaderRenderer : NSObject

/** Nil when this device cannot run it (no Metal, shader compile failure). */
+ (nullable instancetype)create;

@property (nonatomic, readonly) CAMetalLayer *layer;

/**
 * Draws one frame. `blurPx` is the blur radius in px. Lengths in `uniforms`
 * are px, except the origin/capture fields, which this method fills in.
 * Returns NO when the glass does not overlap the backdrop, so nothing could be drawn.
 */
- (BOOL)drawGlass:(UIView *)glass
         backdrop:(UIView *)backdrop
         uniforms:(LGShaderUniforms)uniforms
           blurPx:(CGFloat)blurPx
            force:(BOOL)force;

- (void)releaseResources;

@end

NS_ASSUME_NONNULL_END
