/**
 * Clamp a number into [min, max]. Non-finite input (NaN, Infinity, undefined)
 * returns `fallback`, so a bad prop never reaches native code.
 */
export function clamp(
  value: number | undefined | null,
  min: number,
  max: number,
  fallback: number
): number {
  if (value == null || typeof value !== 'number' || !Number.isFinite(value)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, value));
}

/** Clamp to 0..1. */
export function clamp01(value: number | undefined | null, fallback: number): number {
  return clamp(value, 0, 1, fallback);
}
