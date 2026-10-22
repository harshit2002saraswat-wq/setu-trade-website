import { useLocation } from 'react-router-dom';
import { Mail, MapPin, Phone, Sprout, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Link, useLocalizedNavigate } from '@/i18n/Link';
import { useTranslation } from '@/i18n/context';
import { useLocalizedCategories } from '@/i18n/catalog';
import { stripLocale } from '@/i18n/config';

export function Footer() {
  const location = useLocation();
  const navigate = useLocalizedNavigate();
  const { t } = useTranslation();
  const categories = useLocalizedCategories();

  const goHome = (hash: string) => {
    if (stripLocale(location.pathname).path !== '/') {
      navigate(`/${hash}`);
    } else {
      const el = document.getElementById(hash.replace('#', ''));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="contact" className="scroll-mt-24 border-t border-brand-900/20 bg-brand-950 text-brand-100">
      <div className="container-page py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo variant="light" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-brand-200">
              {t('footer.about')}
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <span className="text-brand-200">{t('footer.location')}</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <Link to="/contact" className="text-brand-200 hover:text-white">
                  {t('footer.contactLink')}
                </Link>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <span className="text-brand-200">{t('footer.phone')}</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-400">
              {t('footer.products')}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={`/products?category=${cat.slug}`}
                    className="text-brand-200 transition-colors hover:text-white"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-400">
              {t('footer.company')}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to="/about" className="text-brand-200 hover:text-white">{t('footer.aboutUs')}</Link></li>
              <li><Link to="/products" className="text-brand-200 hover:text-white">{t('nav.products')}</Link></li>
              <li><Link to="/blog" className="text-brand-200 hover:text-white">{t('nav.insights')}</Link></li>
              <li><Link to="/suppliers" className="text-brand-200 hover:text-white">{t('nav.suppliers')}</Link></li>
              <li><Link to="/contact" className="text-brand-200 hover:text-white">{t('nav.contact')}</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-400">
              {t('footer.workWithUs')}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <button type="button" onClick={() => goHome('#request-quote')} className="group inline-flex items-center gap-1.5 text-brand-200 hover:text-white">
                  {t('common.requestQuote')}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform rtl:-scale-x-100 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                </button>
              </li>
              <li>
                <Link to="/suppliers" className="group inline-flex items-center gap-1.5 text-brand-200 hover:text-white">
                  {t('common.becomeSupplier')}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform rtl:-scale-x-100 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                </Link>
              </li>
              <li><Link to="/contact" className="text-brand-200 hover:text-white">{t('nav.contact')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-brand-900 pt-6 sm:flex-row sm:items-center">
          <p className="flex items-center gap-2 text-xs text-brand-300">
            <Sprout className="h-3.5 w-3.5" />
            {t('footer.rights', { year: new Date().getFullYear() })}
          </p>
          <p className="text-xs text-brand-400">
            {t('footer.builtFor')}
          </p>
        </div>
      </div>
    </footer>
  );
}
