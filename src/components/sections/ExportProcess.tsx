import { EXPORT_STEPS } from '@/data/site';
import { useTranslation } from '@/i18n/context';

export function ExportProcess() {
  const { t, tc } = useTranslation();
  return (
    <section id="export-process" className="scroll-mt-24 bg-brand-950 py-20 sm:py-28">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="eyebrow text-brand-300">
            <span className="h-px w-8 bg-brand-400" />
            {t('home.process.eyebrow')}
          </p>
          <h2 className="mt-4 text-3xl font-bold leading-[1.15] text-white sm:text-4xl">
            {t('home.process.title')}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-brand-200">
            {t('home.process.subtitle')}
          </p>
        </div>

        <ol className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {EXPORT_STEPS.map((s, i) => (
            <li
              key={s.step}
              className="relative rounded-2xl border border-brand-900 bg-brand-900/40 p-6 animate-fade-up"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <span className="font-display text-4xl font-extrabold text-brand-500/50">
                {String(s.step).padStart(2, '0')}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-white">{tc(s.title)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-200">{tc(s.description)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
