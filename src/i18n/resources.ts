import type { Locale } from '@/i18n/config';
import type { ContentDictionary, LocaleMessages } from '@/i18n/types';

/**
 * Each non-English resource is code-split by Vite and fetched only when that
 * locale is active. English is bundled with the app as the fallback.
 */
const messageModules = import.meta.glob<{ default: LocaleMessages }>([
  './translations/*.ts',
  '!./translations/en.ts',
]);
const catalogModules = import.meta.glob<{ default: ContentDictionary }>('./content/*/catalog.json');
const blogModules = import.meta.glob<{ default: ContentDictionary }>('./content/*/blog.json');

export interface LocaleResources {
  messages: LocaleMessages;
  catalog: ContentDictionary;
}

const resourceCache = new Map<Locale, Promise<LocaleResources>>();
const blogCache = new Map<Locale, Promise<ContentDictionary>>();

async function loadModule<T>(modules: Record<string, () => Promise<{ default: T }>>, path: string, fallback: T): Promise<T> {
  const loader = modules[path];
  if (!loader) return fallback;
  try {
    return (await loader()).default;
  } catch {
    return fallback;
  }
}

export function loadLocaleResources(locale: Locale): Promise<LocaleResources> {
  if (locale === 'en') return Promise.resolve({ messages: {}, catalog: {} });
  let pending = resourceCache.get(locale);
  if (!pending) {
    pending = Promise.all([
      loadModule(messageModules, `./translations/${locale}.ts`, {} as LocaleMessages),
      loadModule(catalogModules, `./content/${locale}/catalog.json`, {} as ContentDictionary),
    ]).then(([messages, catalog]) => ({ messages, catalog }));
    resourceCache.set(locale, pending);
  }
  return pending;
}

export function loadBlogDictionary(locale: Locale): Promise<ContentDictionary> {
  if (locale === 'en') return Promise.resolve({});
  let pending = blogCache.get(locale);
  if (!pending) {
    pending = loadModule(blogModules, `./content/${locale}/blog.json`, {} as ContentDictionary);
    blogCache.set(locale, pending);
  }
  return pending;
}
