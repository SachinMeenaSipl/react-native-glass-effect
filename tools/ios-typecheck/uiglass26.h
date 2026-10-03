// UIGlassEffect as documented for iOS 26 (effectWithStyle:, UIGlassEffectStyleRegular/Clear,
// tintColor, interactive). Used only to type-check the iOS 26 branch against an older SDK.
#import <UIKit/UIKit.h>
typedef NS_ENUM(NSInteger, UIGlassEffectStyle) { UIGlassEffectStyleRegular = 0, UIGlassEffectStyleClear = 1 };
@interface UIGlassEffect : UIVisualEffect
+ (instancetype)effectWithStyle:(UIGlassEffectStyle)style;
@property (nonatomic, copy, nullable) UIColor *tintColor;
@property (nonatomic, getter=isInteractive) BOOL interactive;
@end
