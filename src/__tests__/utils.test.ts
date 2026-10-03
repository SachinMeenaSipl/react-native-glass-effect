import type { GlassAppearanceProps } from '../materials/types';
import { clamp, clamp01 } from '../utils/clamp';
import { hexWithAlpha } from '../utils/color';
import { resolveCornerRadius } from '../utils/cornerRadius';
import { GLASS_PROP_KEYS, splitGlassProps } from '../utils/splitGlassProps';

// Compile-time guard: every GlassAppearanceProps key must be in GLASS_PROP_KEYS.
type Missing = Exclude<keyof GlassAppearanceProps, (typeof GLASS_PROP_KEYS)[number]>;
const allKeysListed: [Missing] extends [never] ? true : Missing = true;

describe('clamp', () => {
  it('clamps and handles bad input', () => {
    expect(clamp(5, 0, 1, 0.5)).toBe(1);
    expect(clamp(-5, 0, 1, 0.5)).toBe(0);
    expect(clamp(undefined, 0, 1, 0.5)).toBe(0.5);
    expect(clamp(NaN, 0, 1, 0.5)).toBe(0.5);
    expect(clamp01(null, 0.3)).toBe(0.3);
  });
});

describe('hexWithAlpha', () => {
  it('converts short, long and 8-digit hex', () => {
    expect(hexWithAlpha('#fff', 0.5)).toBe('rgba(255, 255, 255, 0.5)');
    expect(hexWithAlpha('#1C1C1E', 1)).toBe('rgba(28, 28, 30, 1)');
    expect(hexWithAlpha('#FF000080', 0.2)).toBe('rgba(255, 0, 0, 0.2)');
  });
  it('returns null for non-hex colours', () => {
    expect(hexWithAlpha('red', 1)).toBeNull();
    expect(hexWithAlpha({ semantic: [] }, 1)).toBeNull();
    expect(hexWithAlpha('#zzzzzz', 1)).toBeNull();
    expect(hexWithAlpha('#12345', 1)).toBeNull();
  });
});

describe('resolveCornerRadius', () => {
  it('prop > style > theme', () => {
    expect(resolveCornerRadius(10, 20, 30)).toBe(10);
    expect(resolveCornerRadius(undefined, 20, 30)).toBe(20);
    expect(resolveCornerRadius(undefined, '50%', 30)).toBe(30);
    expect(resolveCornerRadius(-4, undefined, 30)).toBe(0);
  });
});

describe('splitGlassProps', () => {
  it('separates glass props from everything else', () => {
    expect(allKeysListed).toBe(true);
    const { glass, rest } = splitGlassProps({
      material: 'thin',
      blur: 3,
      testID: 'x',
      onLayout: undefined,
    } as GlassAppearanceProps & { testID: string; onLayout: undefined });
    expect(glass).toEqual({ material: 'thin', blur: 3 });
    expect(rest).toEqual({ testID: 'x', onLayout: undefined });
  });
});
