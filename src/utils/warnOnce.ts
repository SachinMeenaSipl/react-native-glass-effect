/**
 * Log a developer warning at most once per unique message.
 * Silent in production builds.
 */
const seen = new Set<string>();

declare const __DEV__: boolean | undefined;

export function warnOnce(message: string): void {
  const isDev = typeof __DEV__ === 'undefined' ? true : __DEV__;
  if (!isDev || seen.has(message)) return;
  seen.add(message);
  // eslint-disable-next-line no-console
  console.warn(`[react-native-liquid-glass] ${message}`);
}

/** Test helper. */
export function __resetWarnings(): void {
  seen.clear();
}
