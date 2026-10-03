#import <React/RCTViewComponentView.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * Fabric component view for <LiquidGlassView> on iOS.
 *
 * iOS 26+  : UIGlassEffect (Apple's real Liquid Glass), tint + interactive.
 * iOS 15–25: UIVisualEffectView system material + tint + light sheen + border.
 *
 * The system samples the screen itself, so iOS never needs <GlassBackdrop>.
 */
@interface LiquidGlassViewComponentView : RCTViewComponentView
@end

/** Number of glass views currently in a window (for getStats). Main thread only. */
FOUNDATION_EXPORT NSInteger LGLiveGlassViewCount(void);

NS_ASSUME_NONNULL_END
