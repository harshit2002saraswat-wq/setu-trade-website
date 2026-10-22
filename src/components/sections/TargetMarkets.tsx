import { Globe2 } from 'lucide-react';
import { TARGET_MARKETS } from '@/data/site';
import { useTranslation } from '@/i18n/context';

export function TargetMarkets() {
  const { t, tc } = useTranslation();
  return (
    <section id="target-markets" className="scroll-mt-24 bg-charcoal-50 py-20 sm:py-28">
      <div className="container-page">
        <div className="max-w-3xl">
          <p className="eyebrow">
            <span className="h-px w-8 bg-brand-500" />
            {t('home.markets.eyebrow')}
          </p>
          <h2 className="section-title mt-4">{t('home.markets.title')}</h2>
          <p className="mt-4 text-lg leading-relaxed text-charcoal-600">
            {t('home.markets.subtitle')}
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TARGET_MARKETS.map((region, i) => (
            <div
              key={region.name}
              className="card p-6 hover:shadow-card-hover animate-fade-up"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <Globe2 className="h-7 w-7 text-brand-600" strokeWidth={1.8} />
              <h3 className="mt-4 text-lg font-semibold text-charcoal-900">{tc(region.name)}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-charcoal-600">{tc(region.coverage)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
