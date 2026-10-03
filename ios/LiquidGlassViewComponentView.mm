#import "LiquidGlassViewComponentView.h"

#import <React/RCTConversions.h>
#import <react/renderer/components/RNLiquidGlassSpec/ComponentDescriptors.h>
#import <react/renderer/components/RNLiquidGlassSpec/Props.h>
#import <react/renderer/components/RNLiquidGlassSpec/RCTComponentViewHelpers.h>

using namespace facebook::react;

#if defined(__IPHONE_26_0) && __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_26_0
#define LG_HAS_GLASS_SDK 1
#else
#define LG_HAS_GLASS_SDK 0
#endif

/**
 * Holds React children ABOVE the glass layers.
 * Returns nil when the touch hits empty space, so the glass view itself becomes
 * the touch target (RN's touch handler only understands component views).
 */
@interface LGChildContainerView : UIView
@end

@implementation LGChildContainerView
- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
  UIView *hit = [super hitTest:point withEvent:event];
  return hit == self ? nil : hit;
}
@end

@interface LiquidGlassViewComponentView () <RCTLiquidGlassViewViewProtocol>
@end

static NSInteger gLiveGlassViews = 0;

NSInteger LGLiveGlassViewCount(void)
{
  return gLiveGlassViews;
}

@implementation LiquidGlassViewComponentView {
  UIVisualEffectView *_effectView;   // blur / system glass
  UIView *_tintView;                 // pre-iOS 26 tint layer
  CAGradientLayer *_sheenLayer;      // pre-iOS 26 light sheen
  UIView *_fallbackView;             // reduce transparency: opaque colour
  LGChildContainerView *_childContainer;
  BOOL _hasAppliedProps;
  BOOL _countedLive;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<LiquidGlassViewComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const LiquidGlassViewProps>();
    _props = defaultProps;

    UIViewAutoresizing fill = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;

    _effectView = [[UIVisualEffectView alloc] initWithEffect:nil];
    _effectView.frame = self.bounds;
    _effectView.autoresizingMask = fill;
    _effectView.userInteractionEnabled = NO;
    _effectView.clipsToBounds = YES;
    _effectView.layer.cornerCurve = kCACornerCurveContinuous;

    _tintView = [[UIView alloc] initWithFrame:self.bounds];
    _tintView.autoresizingMask = fill;
    _tintView.userInteractionEnabled = NO;
    [_effectView.contentView addSubview:_tintView];

    _sheenLayer = [CAGradientLayer layer];
    [_effectView.contentView.layer addSublayer:_sheenLayer];

    _fallbackView = [[UIView alloc] initWithFrame:self.bounds];
    _fallbackView.autoresizingMask = fill;
    _fallbackView.userInteractionEnabled = NO;
    _fallbackView.hidden = YES;
    _fallbackView.layer.cornerCurve = kCACornerCurveContinuous;

    _childContainer = [[LGChildContainerView alloc] initWithFrame:self.bounds];
    _childContainer.autoresizingMask = fill;

    [self addSubview:_effectView];
    [self addSubview:_fallbackView];
    [self addSubview:_childContainer];

    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(accessibilityChanged)
                                                 name:UIAccessibilityReduceTransparencyStatusDidChangeNotification
                                               object:nil];
  }
  return self;
}

- (void)dealloc
{
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

#pragma mark - Children go into the container, above the glass

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [_childContainer insertSubview:childComponentView atIndex:index];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [childComponentView removeFromSuperview];
}

#pragma mark - Props

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &p = *std::static_pointer_cast<const LiquidGlassViewProps>(props);
  [super updateProps:props oldProps:oldProps];
  [self applyProps:p];
  _hasAppliedProps = YES;
}

- (void)accessibilityChanged
{
  [self applyProps:*std::static_pointer_cast<const LiquidGlassViewProps>(_props)];
}

- (void)applyProps:(const LiquidGlassViewProps &)p
{
  const CGFloat radius = MAX(0, p.cornerRadius);
  const BOOL reduce = p.reduceTransparency || UIAccessibilityIsReduceTransparencyEnabled();

  UIColor *tint = RCTUIColorFromSharedColor(p.tintColor) ?: UIColor.whiteColor;
  UIColor *fallback = RCTUIColorFromSharedColor(p.fallbackColor) ?: [UIColor secondarySystemBackgroundColor];
  const CGFloat tintOpacity = MIN(MAX(p.tintOpacity, 0), 1);

  // Shape
  _effectView.layer.cornerRadius = radius;
  _fallbackView.layer.cornerRadius = radius;
  self.layer.cornerRadius = radius;
  self.layer.cornerCurve = kCACornerCurveContinuous;
  self.clipsToBounds = p.clipContent;
  _childContainer.clipsToBounds = p.clipContent;
  _childContainer.layer.cornerRadius = p.clipContent ? radius : 0;
  _childContainer.layer.cornerCurve = kCACornerCurveContinuous;

  // Border (on the effect view, so it never fights RN's own style.border*)
  _effectView.layer.borderWidth = MAX(0, p.glassBorderWidth);
  _effectView.layer.borderColor =
      [UIColor colorWithWhite:1 alpha:MIN(MAX(p.glassBorderOpacity, 0), 1)].CGColor;

  // Reduce transparency → opaque surface
  _fallbackView.backgroundColor = fallback;
  _fallbackView.hidden = !reduce;
  _effectView.hidden = reduce;
  if (reduce) {
    return;
  }

  UIVisualEffect *effect = nil;
  BOOL systemGlass = NO;

#if LG_HAS_GLASS_SDK
  if (@available(iOS 26.0, *)) {
    UIGlassEffectStyle style = p.appearance == LiquidGlassViewAppearance::Clear ? UIGlassEffectStyleClear
                                                                                : UIGlassEffectStyleRegular;
    UIGlassEffect *glass = [UIGlassEffect effectWithStyle:style];
    glass.tintColor = tintOpacity > 0 ? [tint colorWithAlphaComponent:tintOpacity] : nil;
    glass.interactive = p.interactive;
    effect = glass;
    systemGlass = YES;
    // Interactive glass must receive touches. RN still resolves the touch to this component
    // (RCTSurfaceTouchHandler walks up superviews), so JS handlers keep working.
    _effectView.userInteractionEnabled = p.interactive;
  }
#endif

  if (!systemGlass) {
    effect = [UIBlurEffect effectWithStyle:[self blurStyleFor:p]];
    _effectView.userInteractionEnabled = NO;
  }

  // Pre-26: we draw tint + sheen ourselves. iOS 26: the system glass does both.
  _tintView.hidden = systemGlass;
  _sheenLayer.hidden = systemGlass;
  if (!systemGlass) {
    _tintView.backgroundColor = [tint colorWithAlphaComponent:tintOpacity];
    [self updateSheenWithAngle:p.lightAngle
                  illumination:MIN(MAX(p.illumination, 0), 1) + (p.pressed ? 0.25 : 0)];
  }

  const BOOL animate = _hasAppliedProps && p.transitionDuration > 0 && !UIAccessibilityIsReduceMotionEnabled();
  if (animate) {
    [UIView animateWithDuration:p.transitionDuration / 1000.0
                     animations:^{
                       self->_effectView.effect = effect;
                     }];
  } else {
    _effectView.effect = effect;
  }
}

/** Map the blur radius (dp) onto the closest system material. */
- (UIBlurEffectStyle)blurStyleFor:(const LiquidGlassViewProps &)p
{
  if (p.appearance == LiquidGlassViewAppearance::Clear || p.blurRadius <= 6) {
    return UIBlurEffectStyleSystemUltraThinMaterial;
  }
  if (p.blurRadius <= 14) {
    return UIBlurEffectStyleSystemThinMaterial;
  }
  if (p.blurRadius <= 26) {
    return UIBlurEffectStyleSystemMaterial;
  }
  return UIBlurEffectStyleSystemThickMaterial;
}

- (void)updateSheenWithAngle:(CGFloat)degrees illumination:(CGFloat)illumination
{
  const CGFloat rad = degrees * M_PI / 180.0;
  const CGFloat dx = cos(rad) * 0.5;
  const CGFloat dy = sin(rad) * 0.5;
  _sheenLayer.startPoint = CGPointMake(0.5 + dx, 0.5 + dy); // lit side
  _sheenLayer.endPoint = CGPointMake(0.5 - dx, 0.5 - dy);
  _sheenLayer.colors = @[
    (id)[UIColor colorWithWhite:1 alpha:0.22 * illumination].CGColor,
    (id)[UIColor colorWithWhite:1 alpha:0.04 * illumination].CGColor,
    (id)UIColor.clearColor.CGColor,
  ];
  _sheenLayer.locations = @[ @0, @0.35, @0.5 ];
}

- (void)layoutSubviews
{
  [super layoutSubviews];
  [CATransaction begin];
  [CATransaction setDisableActions:YES];
  _sheenLayer.frame = _effectView.contentView.bounds;
  [CATransaction commit];
}

#pragma mark - Stats

- (void)didMoveToWindow
{
  [super didMoveToWindow];
  if (self.window && !_countedLive) {
    gLiveGlassViews++;
    _countedLive = YES;
  } else if (!self.window && _countedLive) {
    gLiveGlassViews--;
    _countedLive = NO;
  }
}

#pragma mark - Recycling

- (void)prepareForRecycle
{
  [super prepareForRecycle];
  _hasAppliedProps = NO;
  _effectView.effect = nil;
}

@end

Class<RCTComponentViewProtocol> LiquidGlassViewCls(void)
{
  return LiquidGlassViewComponentView.class;
}
