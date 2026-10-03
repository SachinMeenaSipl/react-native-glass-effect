/**
 * Decide the glass corner radius.
 *
 * Priority: `cornerRadius` prop  →  `style.borderRadius`  →  theme default.
 * Percentage strings ("50%") are not supported by the native renderer, so they
 * fall through to the next source. Negative values become 0.
 *
 * Clamping to half the view's shortest side happens natively, because only
 * native knows the final laid-out size.
 */
export function resolveCornerRadius(
  prop: number | undefined,
  styleBorderRadius: unknown,
  themeDefault: number
): number {
  if (typeof prop === 'number' && Number.isFinite(prop)) return Math.max(0, prop);
  if (typeof styleBorderRadius === 'number' && Number.isFinite(styleBorderRadius)) {
    return Math.max(0, styleBorderRadius);
  }
  return Math.max(0, themeDefault);
}
