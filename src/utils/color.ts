/**
 * Tiny colour helpers used ONLY by the JS fallback renderer (web / not linked).
 * Native renderers receive real colours and apply opacity themselves.
 */

/**
 * Turn "#RGB", "#RRGGBB" or "#RRGGBBAA" into "rgba(r, g, b, a)".
 * Returns null for anything else (named colours, PlatformColor, rgb()...),
 * so the caller can fall back to a safe colour.
 */
export function hexWithAlpha(color: unknown, alpha: number): string | null {
  if (typeof color !== 'string' || !color.startsWith('#')) return null;
  let hex = color.slice(1);
  if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
  if (hex.length !== 6 && hex.length !== 8) return null;
  const n = Number.parseInt(hex.slice(0, 6), 16);
  if (Number.isNaN(n)) return null;
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const a = Math.max(0, Math.min(1, alpha));
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
