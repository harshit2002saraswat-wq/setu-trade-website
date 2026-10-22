import { useLocation } from 'react-router-dom';
import { Link } from '@/i18n/Link';
import { useTranslation } from '@/i18n/context';
import { ArrowRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useSeo } from '@/hooks/useSeo';

export function NotFoundPage() {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  useSeo({
    title: t('notFound.seoTitle'),
    description: t('notFound.seoDescription'),
    indexable: false,
  });

  return (
    <>
      <Header />
      <div className="flex min-h-[70vh] items-center justify-center bg-white pt-[4.5rem]">
        <div className="container-page max-w-lg text-center">
          <span className="text-6xl font-extrabold text-brand-200">404</span>
          <h1 className="mt-4 text-2xl font-bold text-charcoal-900">{t('notFound.title')}</h1>
          <p className="mt-3 text-base leading-relaxed text-charcoal-600">
            {t('notFound.message', { path: pathname })}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/" className="btn-primary">
              {t('common.backToHome')}
              <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
            </Link>
            <Link to="/products" className="btn-secondary">
              {t('notFound.browse')}
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
