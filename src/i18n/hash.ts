/**
 * Stable 32-bit FNV-1a hash of an English source string, base36-encoded.
 * Content dictionaries are keyed by this hash so product/blog data is never
 * duplicated per language — the English data stays the single source of truth.
 * Must stay identical to the implementation in scripts/i18n/shared.mjs.
 */
export function contentKey(source: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < source.length; i++) {
    hash ^= source.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36);
}
