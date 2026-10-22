import { useEffect, useId, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { LOCALES, getLocaleDefinition, localizePath, stripLocale, type Locale } from '@/i18n/config';
import { useTranslation } from '@/i18n/context';
import { persistLocale } from '@/i18n/LocaleLayout';

function useSwitchLocale() {
  const location = useLocation();
  const navigate = useNavigate();
  return (next: Locale) => {
    persistLocale(next);
    const { path } = stripLocale(location.pathname);
    navigate(localizePath(`${path}${location.search}${location.hash}`, next));
  };
}

/** Compact header dropdown. */
export function LanguageSwitcher() {
  const { locale, t } = useTranslation();
  const switchLocale = useSwitchLocale();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const current = getLocaleDefinition(locale);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    containerRef.current?.querySelector<HTMLButtonElement>('[aria-current="true"]')?.focus();
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`${t('language.label')}: ${current.name}`}
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
          open ? 'bg-brand-50 text-brand-800' : 'text-charcoal-700 hover:bg-brand-50 hover:text-brand-800'
        }`}
      >
        <Globe className="h-4 w-4" aria-hidden="true" />
        <span>{current.short}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {open && (
        <div
          id={listId}
          className="absolute end-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-charcoal-100 bg-white shadow-card-hover animate-fade-in"
        >
          <p className="border-b border-charcoal-100 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-charcoal-500">
            {t('language.select')}
          </p>
          <ul className="max-h-[min(26rem,70vh)] overflow-y-auto py-1.5">
            {LOCALES.map((l) => {
              const active = l.code === locale;
              return (
                <li key={l.code}>
                  <button
                    type="button"
                    lang={l.code}
                    aria-current={active ? 'true' : undefined}
                    onClick={() => {
                      setOpen(false);
                      if (!active) switchLocale(l.code);
                    }}
                    className={`flex w-full items-center justify-between gap-3 px-4 py-2 text-start text-sm transition-colors focus:outline-none focus-visible:bg-brand-50 ${
                      active ? 'bg-brand-50 font-semibold text-brand-800' : 'text-charcoal-700 hover:bg-charcoal-50'
                    }`}
                  >
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate">{l.name}</span>
                      {l.name !== l.englishName && (
                        <span className="truncate text-xs font-normal text-charcoal-500" lang="en">
                          {l.englishName}
                        </span>
                      )}
                    </span>
                    {active && <Check className="h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

/** Full list used inside the mobile menu. */
export function MobileLanguageList({ onSelect }: { onSelect: () => void }) {
  const { locale, t } = useTranslation();
  const switchLocale = useSwitchLocale();
  const [expanded, setExpanded] = useState(false);
  const current = getLocaleDefinition(locale);

  return (
    <div className="border-b border-charcoal-50">
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between py-3.5 text-start text-base font-medium text-charcoal-800"
      >
        <span className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-brand-700" aria-hidden="true" />
          {t('language.label')}
        </span>
        <span className="flex items-center gap-1.5 text-sm text-charcoal-500">
          {current.name}
          <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} aria-hidden="true" />
        </span>
      </button>
      {expanded && (
        <ul className="grid grid-cols-2 gap-1.5 pb-4">
          {LOCALES.map((l) => {
            const active = l.code === locale;
            return (
              <li key={l.code}>
                <button
                  type="button"
                  lang={l.code}
                  aria-current={active ? 'true' : undefined}
                  onClick={() => {
                    onSelect();
                    if (!active) switchLocale(l.code);
                  }}
                  className={`w-full rounded-lg px-3 py-2 text-start text-sm ${
                    active ? 'bg-brand-50 font-semibold text-brand-800' : 'text-charcoal-700 hover:bg-charcoal-50'
                  }`}
                >
                  {l.name}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
