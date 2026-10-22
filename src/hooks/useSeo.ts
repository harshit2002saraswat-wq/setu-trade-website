import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  DEFAULT_LOCALE,
  LOCALES,
  getLocaleDefinition,
  localizePath,
  stripLocale,
  type Locale,
} from '@/i18n/config';
import { useTranslation } from '@/i18n/context';

interface SeoProps {
  title: string;
  description: string;
  canonicalPath?: string;
  indexable?: boolean;
  /** Optional JSON-LD structured data objects to inject as <script type="application/ld+json"> */
  jsonLd?: object[];
}

const SITE_URL = 'https://setutrade.com';

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  const selector = `link[rel="${rel}"]`;
  let el = document.head.querySelector<HTMLLinkElement>(selector);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

const JSON_LD_ID = 'seo-jsonld';

function upsertJsonLd(data: object[]) {
  let el = document.head.querySelector<HTMLScriptElement>(`script#${JSON_LD_ID}`);
  if (!el) {
    el = document.createElement('script');
    el.id = JSON_LD_ID;
    el.setAttribute('type', 'application/ld+json');
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function clearJsonLd() {
  const el = document.head.querySelector<HTMLScriptElement>(`script#${JSON_LD_ID}`);
  if (el) el.textContent = '';
}

function absoluteUrl(path: string, locale: Locale): string {
  const localized = localizePath(path, locale);
  return localized === '/' ? SITE_URL : `${SITE_URL}${localized}`;
}

const ALTERNATE_ATTR = 'data-i18n-alternate';

function setAlternates(path: string | null) {
  document.head.querySelectorAll(`[${ALTERNATE_ATTR}]`).forEach((el) => el.remove());
  if (path === null) return;
  const entries: [string, string][] = LOCALES.map((l) => [l.code, absoluteUrl(path, l.code)]);
  entries.push(['x-default', absoluteUrl(path, DEFAULT_LOCALE)]);
  for (const [hreflang, href] of entries) {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = hreflang;
    link.href = href;
    link.setAttribute(ALTERNATE_ATTR, '');
    document.head.appendChild(link);
  }
}

function setOgLocaleAlternates(locale: Locale) {
  document.head.querySelectorAll('meta[property="og:locale:alternate"]').forEach((el) => el.remove());
  for (const l of LOCALES) {
    if (l.code === locale) continue;
    const meta = document.createElement('meta');
    meta.setAttribute('property', 'og:locale:alternate');
    meta.setAttribute('content', l.ogLocale);
    document.head.appendChild(meta);
  }
}

/**
 * `canonicalPath` is the language-neutral path (e.g. "/products/potato").
 * The hook localizes it for the active language and emits hreflang alternates.
 * Pass `indexable: false` for pages that should not advertise alternates (e.g. 404).
 */
export function useSeo({ title, description, canonicalPath, jsonLd, indexable = true }: SeoProps) {
  const { locale } = useTranslation();
  const { pathname } = useLocation();
  const neutralPath = canonicalPath ?? stripLocale(pathname).path;

  useEffect(() => {
    document.title = title;

    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:site_name', 'Setu Trade');
    upsertMeta('property', 'og:locale', getLocaleDefinition(locale).ogLocale);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    setOgLocaleAlternates(locale);

    const canonical = absoluteUrl(neutralPath, locale);
    upsertLink('canonical', canonical);
    upsertMeta('property', 'og:url', canonical);
    setAlternates(indexable ? neutralPath : null);

    if (jsonLd && jsonLd.length > 0) {
      upsertJsonLd(jsonLd);
    } else {
      clearJsonLd();
    }
  }, [title, description, neutralPath, jsonLd, locale, indexable]);
}

export { SITE_URL };
