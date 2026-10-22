import { useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from 'react';
import { Navigate, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  DEFAULT_LOCALE,
  LOCALE_DETECTED_KEY,
  LOCALE_STORAGE_KEY,
  getLocaleDefinition,
  isLocale,
  localizePath,
  matchBrowserLanguage,
  matchLocaleCaseInsensitive,
  type FontScript,
  type Locale,
} from '@/i18n/config';
import { I18nContext, createI18nValue } from '@/i18n/context';
import { loadBlogDictionary, loadLocaleResources, type LocaleResources } from '@/i18n/resources';
import type { ContentDictionary } from '@/i18n/types';

const FONT_URLS: Record<FontScript, string> = {
  devanagari: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700;800&display=swap',
  arabic: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700;800&display=swap',
  bengali: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700;800&display=swap',
  thai: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;500;600;700;800&display=swap',
};

function ensureFont(script: FontScript | undefined) {
  if (!script) return;
  const id = `font-${script}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = FONT_URLS[script];
  document.head.appendChild(link);
}

function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable (private mode); the URL remains the source of truth.
  }
}

export function persistLocale(locale: Locale) {
  writeStorage(LOCALE_STORAGE_KEY, locale);
  writeStorage(LOCALE_DETECTED_KEY, '1');
}

/** Initial-load preference handling runs once per page load, never on in-app navigation. */
let initialPreferenceHandled = false;

function resolvePreferredLocale(): Locale | undefined {
  const stored = readStorage(LOCALE_STORAGE_KEY);
  if (isLocale(stored)) return stored;
  if (readStorage(LOCALE_DETECTED_KEY)) return undefined;

  writeStorage(LOCALE_DETECTED_KEY, '1');
  const candidates = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const tag of candidates) {
    if (!tag) continue;
    const match = matchBrowserLanguage(tag);
    if (match) {
      if (match !== DEFAULT_LOCALE) writeStorage(LOCALE_STORAGE_KEY, match);
      return match;
    }
  }
  return undefined;
}

function LocaleRoot({ locale, children }: { locale: Locale; children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const needsBlog = /^\/(?:[^/]+\/)?blog(?:\/|$)/.test(location.pathname);
  const [resources, setResources] = useState<{ locale: Locale; data: LocaleResources } | null>(
    locale === DEFAULT_LOCALE ? { locale, data: { messages: {}, catalog: {} } } : null,
  );
  const [blog, setBlog] = useState<{ locale: Locale; data: ContentDictionary } | null>(
    locale === DEFAULT_LOCALE ? { locale, data: {} } : null,
  );

  useEffect(() => {
    let active = true;
    loadLocaleResources(locale).then((data) => {
      if (active) setResources({ locale, data });
    });
    return () => {
      active = false;
    };
  }, [locale]);

  useEffect(() => {
    if (!needsBlog || blog?.locale === locale) return;
    let active = true;
    loadBlogDictionary(locale).then((data) => {
      if (active) setBlog({ locale, data });
    });
    return () => {
      active = false;
    };
  }, [locale, needsBlog, blog?.locale]);

  useLayoutEffect(() => {
    const def = getLocaleDefinition(locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = def.dir;
    ensureFont(def.font);
  }, [locale]);

  useEffect(() => {
    if (initialPreferenceHandled) return;
    initialPreferenceHandled = true;
    if (locale !== DEFAULT_LOCALE) return;
    const preferred = resolvePreferredLocale();
    if (preferred && preferred !== DEFAULT_LOCALE) {
      navigate(localizePath(`${location.pathname}${location.search}${location.hash}`, preferred), {
        replace: true,
      });
    }
  }, [locale, location, navigate]);

  const resourcesReady = resources?.locale === locale;
  const blogReady = !needsBlog || blog?.locale === locale;

  const value = useMemo(
    () =>
      createI18nValue(
        locale,
        resourcesReady ? resources.data.messages : {},
        resourcesReady ? resources.data.catalog : {},
        blog?.locale === locale ? blog.data : {},
      ),
    [locale, resourcesReady, resources, blog],
  );

  if (!resourcesReady || !blogReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white" role="status" aria-live="polite">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-700" />
        <span className="sr-only">Loading</span>
      </div>
    );
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/**
 * Route layout for public pages. English is served unprefixed; every other
 * locale lives under /:lang. Unknown prefixes render the 404 page in English.
 */
export function LocaleLayout({ notFound }: { notFound: ReactNode }) {
  const { lang } = useParams();
  const location = useLocation();

  if (lang === undefined) {
    return (
      <LocaleRoot locale={DEFAULT_LOCALE}>
        <Outlet />
      </LocaleRoot>
    );
  }

  const rest = location.pathname.slice(lang.length + 1);

  if (lang === DEFAULT_LOCALE) {
    return <Navigate replace to={`${rest || '/'}${location.search}${location.hash}`} />;
  }

  if (!isLocale(lang)) {
    const corrected = matchLocaleCaseInsensitive(lang);
    if (corrected && corrected !== DEFAULT_LOCALE) {
      return <Navigate replace to={`/${corrected}${rest}${location.search}${location.hash}`} />;
    }
    return <LocaleRoot locale={DEFAULT_LOCALE}>{notFound}</LocaleRoot>;
  }

  return (
    <LocaleRoot key={lang} locale={lang}>
      <Outlet />
    </LocaleRoot>
  );
}
