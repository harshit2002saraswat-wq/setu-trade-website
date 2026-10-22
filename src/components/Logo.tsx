import { Sprout } from 'lucide-react';
import { Link } from '@/i18n/Link';
import { useTranslation } from '@/i18n/context';

interface LogoProps {
  variant?: 'dark' | 'light';
  className?: string;
}

export function Logo({ variant = 'dark', className = '' }: LogoProps) {
  const { t } = useTranslation();
  const textColor = variant === 'light' ? 'text-white' : 'text-charcoal-900';
  const subColor = variant === 'light' ? 'text-brand-200' : 'text-brand-600';

  return (
    <Link to="/" className={`group flex items-center gap-2.5 ${className}`} aria-label={t('common.homeLabel')}>
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-700 text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
        <Sprout className="h-5 w-5" strokeWidth={2.2} />
      </span>
      <span className="flex flex-col leading-none">
        <span dir="ltr" className={`font-display text-lg font-extrabold tracking-tightest ${textColor}`}>
          SETU<span className="text-brand-500"> TRADE</span>
        </span>
        <span className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${subColor}`}>
          {t('common.brandTagline')}
        </span>
      </span>
    </Link>
  );
}
