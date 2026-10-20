import { useEffect } from 'react';

interface SeoProps {
  title: string;
  description: string;
  canonicalPath?: string;
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

export function useSeo({ title, description, canonicalPath, jsonLd }: SeoProps) {
  useEffect(() => {
    document.title = title;

    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:site_name', 'Setu Trade');
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);

    const canonical = canonicalPath ? `${SITE_URL}${canonicalPath}` : SITE_URL;
    upsertLink('canonical', canonical);
    upsertMeta('property', 'og:url', canonical);

    if (jsonLd && jsonLd.length > 0) {
      upsertJsonLd(jsonLd);
    } else {
      clearJsonLd();
    }
  }, [title, description, canonicalPath, jsonLd]);
}

export { SITE_URL };
