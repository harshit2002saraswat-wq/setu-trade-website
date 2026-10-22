import { createContext, useContext } from 'react';
import { DEFAULT_LOCALE, getLocaleDefinition, localizePath, type Locale, type TextDirection } from '@/i18n/config';
import { contentKey } from '@/i18n/hash';
import { en } from '@/i18n/translations/en';
import type {
  ContentDictionary,
  InterpolationValues,
  LocaleMessages,
  MessageKey,
  MessageListKey,
} from '@/i18n/types';

export interface I18nValue {
  locale: Locale;
  dir: TextDirection;
  /** UI string by typed key, with {placeholder} interpolation. */
  t: (key: MessageKey, values?: InterpolationValues) => string;
  /** UI string list by typed key. */
  ta: (key: MessageListKey) => readonly string[];
  /** Translate catalog/site data (products, categories, markets). Falls back to the English source. */
  tc: (source: string | undefined | null) => string;
  /** Translate blog content. Falls back to the English source. */
  tb: (source: string | undefined | null) => string;
  /** Localize an internal path, e.g. lp("/products") -> "/hi/products". */
  lp: (path: string) => string;
  formatDate: (date: string | Date, options?: Intl.DateTimeFormatOptions) => string;
  formatNumber: (value: number) => string;
}

function lookup(tree: unknown, key: string): unknown {
  let node: unknown = tree;
  for (const part of key.split('.')) {
    if (node == null || typeof node !== 'object') return undefined;
    node = (node as Record<string, unknown>)[part];
  }
  return node;
}

function interpolate(template: string, values?: InterpolationValues): string {
  if (!values) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in values ? String(values[name]) : match,
  );
}

function makeContentTranslator(dictionary: ContentDictionary) {
  const hasEntries = Object.keys(dictionary).length > 0;
  return (source: string | undefined | null): string => {
    if (!source) return source ?? '';
    if (!hasEntries) return source;
    return dictionary[contentKey(source)] ?? source;
  };
}

export function createI18nValue(
  locale: Locale,
  messages: LocaleMessages,
  catalog: ContentDictionary,
  blog: ContentDictionary,
): I18nValue {
  const def = getLocaleDefinition(locale);
  const dateFormatter = new Map<string, Intl.DateTimeFormat>();
  const numberFormatter = new Intl.NumberFormat(def.intl);

  return {
    locale,
    dir: def.dir,
    t: (key, values) => {
      const value = lookup(messages, key);
      const resolved = typeof value === 'string' && value ? value : lookup(en, key);
      return interpolate(typeof resolved === 'string' ? resolved : key, values);
    },
    ta: (key) => {
      const value = lookup(messages, key);
      if (Array.isArray(value) && value.length) return value as string[];
      const fallback = lookup(en, key);
      return Array.isArray(fallback) ? (fallback as string[]) : [];
    },
    tc: makeContentTranslator(catalog),
    tb: makeContentTranslator(blog),
    lp: (path) => localizePath(path, locale),
    formatDate: (date, options = { year: 'numeric', month: 'long', day: 'numeric' }) => {
      const cacheKey = JSON.stringify(options);
      let formatter = dateFormatter.get(cacheKey);
      if (!formatter) {
        formatter = new Intl.DateTimeFormat(def.intl, options);
        dateFormatter.set(cacheKey, formatter);
      }
      const d = typeof date === 'string' ? new Date(date) : date;
      return Number.isNaN(d.getTime()) ? '' : formatter.format(d);
    },
    formatNumber: (value) => numberFormatter.format(value),
  };
}

export const I18nContext = createContext<I18nValue>(createI18nValue(DEFAULT_LOCALE, {}, {}, {}));

export function useTranslation(): I18nValue {
  return useContext(I18nContext);
}
