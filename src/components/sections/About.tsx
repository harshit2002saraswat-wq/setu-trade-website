import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/Link';
import { useTranslation } from '@/i18n/context';

const ABOUT_IMAGE =
  'https://images.pexels.com/photos/20238486/pexels-photo-20238486.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

export function About() {
  const { t } = useTranslation();
  return (
    <section id="about" className="scroll-mt-24 bg-white py-20 sm:py-28">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-3xl">
              <img
                src={ABOUT_IMAGE}
                alt={t('home.about.imageAlt')}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/30 to-transparent" />
            </div>
          </div>

          <div className="lg:col-span-6">
            <p className="eyebrow">
              <span className="h-px w-8 bg-brand-500" />
              {t('home.about.eyebrow')}
            </p>
            <h2 className="section-title mt-4">
              {t('home.about.title')}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-charcoal-600">
              {t('home.about.p1')}
            </p>
            <p className="mt-4 text-base leading-relaxed text-charcoal-600">
              {t('home.about.p2')}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/about" className="btn-primary">
                {t('common.learnMore')}
                <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
              </Link>
              <Link to="/contact" className="btn-secondary">
                {t('home.about.contact')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
