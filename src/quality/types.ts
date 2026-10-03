/**
 * How much GPU/CPU a glass surface may spend.
 *
 * | Mode   | Android 13+           | Android 12         | Android 7–11 (compat)     | iOS              |
 * |--------|-----------------------|--------------------|---------------------------|------------------|
 * | auto   | picked per device     | picked per device  | picked per device         | system decides   |
 * | high   | blur+refraction+RGB   | blur               | snapshot every frame      | system decides   |
 * | medium | blur+refraction       | blur               | snapshot every 2 frames   | system decides   |
 * | low    | blur only             | blur               | snapshot ~10×/s, 1/8 res  | system decides   |
 * | static | snapshot once         | snapshot once      | snapshot once             | system decides   |
 */
export type GlassQuality = 'auto' | 'high' | 'medium' | 'low' | 'static';

export const QUALITY_VALUES: ReadonlyArray<GlassQuality> = [
  'auto',
  'high',
  'medium',
  'low',
  'static',
];
