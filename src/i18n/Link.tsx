import { forwardRef, useCallback } from 'react';
import {
  Link as RouterLink,
  useNavigate,
  type LinkProps,
  type NavigateOptions,
  type To,
} from 'react-router-dom';
import { localizePath, type Locale } from '@/i18n/config';
import { useTranslation } from '@/i18n/context';

function localizeTo(to: To, locale: Locale): To {
  if (typeof to === 'string') {
    return to.startsWith('/') ? localizePath(to, locale) : to;
  }
  if (to.pathname?.startsWith('/')) {
    return { ...to, pathname: localizePath(to.pathname, locale) };
  }
  return to;
}

/** Drop-in replacement for react-router's Link that keeps the active language prefix. */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function LocalizedLink({ to, ...rest }, ref) {
  const { locale } = useTranslation();
  return <RouterLink ref={ref} to={localizeTo(to, locale)} {...rest} />;
});

/** useNavigate that keeps the active language prefix for absolute app paths. */
export function useLocalizedNavigate() {
  const navigate = useNavigate();
  const { locale } = useTranslation();
  return useCallback(
    (to: To, options?: NavigateOptions) => navigate(localizeTo(to, locale), options),
    [navigate, locale],
  );
}
