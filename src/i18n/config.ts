export type TextDirection = 'ltr' | 'rtl';

/** Script-specific web font loaded on demand when the locale is active. */
export type FontScript = 'devanagari' | 'arabic' | 'bengali' | 'thai';

export interface LocaleDefinition {
  /** BCP 47 code, also used as the URL prefix (e.g. /hi, /zh-CN). */
  code: string;
  /** Native language name shown in the language selector. */
  name: string;
  englishName: string;
  /** Short indicator shown in the compact header trigger. */
  short: string;
  dir: TextDirection;
  /** Open Graph locale, e.g. hi_IN. */
  ogLocale: string;
  /** Intl locale used for dates and numbers. */
  intl: string;
  font?: FontScript;
}

/**
 * Supported locales. To add a language: add an entry here, then add
 * `translations/<code>.ts` and `content/<code>/{catalog,blog}.json`.
 * Missing keys always fall back to English.
 */
export const LOCALES = [
  { code: 'en', name: 'English', englishName: 'English', short: 'EN', dir: 'ltr', ogLocale: 'en_US', intl: 'en-US' },
  { code: 'hi', name: 'हिन्दी', englishName: 'Hindi', short: 'HI', dir: 'ltr', ogLocale: 'hi_IN', intl: 'hi-IN', font: 'devanagari' },
  { code: 'ar', name: 'العربية', englishName: 'Arabic', short: 'AR', dir: 'rtl', ogLocale: 'ar_AR', intl: 'ar', font: 'arabic' },
  { code: 'zh-CN', name: '简体中文', englishName: 'Chinese (Simplified)', short: '中文', dir: 'ltr', ogLocale: 'zh_CN', intl: 'zh-CN' },
  { code: 'es', name: 'Español', englishName: 'Spanish', short: 'ES', dir: 'ltr', ogLocale: 'es_ES', intl: 'es-ES' },
  { code: 'fr', name: 'Français', englishName: 'French', short: 'FR', dir: 'ltr', ogLocale: 'fr_FR', intl: 'fr-FR' },
  { code: 'de', name: 'Deutsch', englishName: 'German', short: 'DE', dir: 'ltr', ogLocale: 'de_DE', intl: 'de-DE' },
  { code: 'ru', name: 'Русский', englishName: 'Russian', short: 'RU', dir: 'ltr', ogLocale: 'ru_RU', intl: 'ru-RU' },
  { code: 'pt', name: 'Português', englishName: 'Portuguese', short: 'PT', dir: 'ltr', ogLocale: 'pt_BR', intl: 'pt-BR' },
  { code: 'ja', name: '日本語', englishName: 'Japanese', short: 'JA', dir: 'ltr', ogLocale: 'ja_JP', intl: 'ja-JP' },
  { code: 'ko', name: '한국어', englishName: 'Korean', short: 'KO', dir: 'ltr', ogLocale: 'ko_KR', intl: 'ko-KR' },
  { code: 'tr', name: 'Türkçe', englishName: 'Turkish', short: 'TR', dir: 'ltr', ogLocale: 'tr_TR', intl: 'tr-TR' },
  { code: 'it', name: 'Italiano', englishName: 'Italian', short: 'IT', dir: 'ltr', ogLocale: 'it_IT', intl: 'it-IT' },
  { code: 'nl', name: 'Nederlands', englishName: 'Dutch', short: 'NL', dir: 'ltr', ogLocale: 'nl_NL', intl: 'nl-NL' },
  { code: 'id', name: 'Bahasa Indonesia', englishName: 'Indonesian', short: 'ID', dir: 'ltr', ogLocale: 'id_ID', intl: 'id-ID' },
  { code: 'vi', name: 'Tiếng Việt', englishName: 'Vietnamese', short: 'VI', dir: 'ltr', ogLocale: 'vi_VN', intl: 'vi-VN' },
  { code: 'th', name: 'ไทย', englishName: 'Thai', short: 'TH', dir: 'ltr', ogLocale: 'th_TH', intl: 'th-TH', font: 'thai' },
  { code: 'ms', name: 'Bahasa Melayu', englishName: 'Malay', short: 'MS', dir: 'ltr', ogLocale: 'ms_MY', intl: 'ms-MY' },
  { code: 'bn', name: 'বাংলা', englishName: 'Bengali', short: 'BN', dir: 'ltr', ogLocale: 'bn_IN', intl: 'bn-IN', font: 'bengali' },
  { code: 'ne', name: 'नेपाली', englishName: 'Nepali', short: 'NE', dir: 'ltr', ogLocale: 'ne_NP', intl: 'ne-NP', font: 'devanagari' },
] as const satisfies readonly LocaleDefinition[];

export type Locale = (typeof LOCALES)[number]['code'];

export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_CODES: Locale[] = LOCALES.map((l) => l.code);

const LOCALE_MAP = new Map<string, LocaleDefinition>(LOCALES.map((l) => [l.code, l]));

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && LOCALE_MAP.has(value);
}

export function getLocaleDefinition(locale: Locale): LocaleDefinition {
  return LOCALE_MAP.get(locale) ?? LOCALES[0];
}

/** Case-insensitive match, e.g. "zh-cn" -> "zh-CN". */
export function matchLocaleCaseInsensitive(value: string): Locale | undefined {
  const lower = value.toLowerCase();
  return LOCALE_CODES.find((c) => c.toLowerCase() === lower);
}

/** Map a browser language tag (e.g. "pt-BR", "zh-Hans-CN", "in") to a supported locale. */
export function matchBrowserLanguage(tag: string): Locale | undefined {
  const exact = matchLocaleCaseInsensitive(tag);
  if (exact) return exact;
  const lower = tag.toLowerCase();
  const base = lower.split('-')[0];
  if (base === 'zh') {
    // Traditional-script regions are not covered by Simplified Chinese.
    if (/-(tw|hk|mo|hant)\b/.test(lower)) return undefined;
    return 'zh-CN';
  }
  if (base === 'in') return 'id';
  return LOCALE_CODES.find((c) => c.toLowerCase() === base);
}

/** Remove a locale prefix from a pathname. "/hi/products" -> { locale: "hi", path: "/products" } */
export function stripLocale(pathname: string): { locale: Locale; path: string } {
  const segments = pathname.split('/');
  const first = segments[1];
  if (isLocale(first) && first !== DEFAULT_LOCALE) {
    const rest = '/' + segments.slice(2).join('/');
    return { locale: first, path: rest === '/' ? '/' : rest.replace(/\/$/, '') || '/' };
  }
  return { locale: DEFAULT_LOCALE, path: pathname || '/' };
}

/**
 * Prefix an app path with a locale. English stays unprefixed.
 * Accepts query strings and hashes: localizePath("/#products", "de") -> "/de#products".
 */
export function localizePath(path: string, locale: Locale): string {
  const match = path.match(/^([^?#]*)(.*)$/);
  const pathname = match?.[1] || '/';
  const suffix = match?.[2] ?? '';
  if (locale === DEFAULT_LOCALE) return `${pathname}${suffix}`;
  const normalized = pathname === '/' ? '' : pathname;
  return `/${locale}${normalized}${suffix}`;
}

export const LOCALE_STORAGE_KEY = 'setu-trade-locale';
export const LOCALE_DETECTED_KEY = 'setu-trade-locale-detected';
