import { warnOnce } from '../utils/warnOnce';
import { QUALITY_VALUES, type GlassQuality } from './types';

/**
 * Validate a quality value. Anything unknown becomes `fallback` with a dev warning.
 * The actual "auto" decision (GPU, RAM, battery saver, number of glass views)
 * is made natively — see android/.../capability/QualityResolver.kt.
 */
export function normalizeQuality(
  value: unknown,
  fallback: GlassQuality = 'auto'
): GlassQuality {
  if (value === undefined) return fallback;
  if (typeof value === 'string' && (QUALITY_VALUES as string[]).includes(value)) {
    return value as GlassQuality;
  }
  warnOnce(
    `Unknown quality "${String(value)}". Using "${fallback}". ` +
      `Valid values: ${QUALITY_VALUES.join(', ')}.`
  );
  return fallback;
}
