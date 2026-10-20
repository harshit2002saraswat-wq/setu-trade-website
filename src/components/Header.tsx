import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { NAV_LINKS, PRODUCT_CATEGORIES, productRoute } from '@/data/site';
import type { NavLink } from '@/types';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const goHome = (hash: string) => {
    setMobileOpen(false);
    setMegaOpen(false);
    if (location.pathname !== '/') {
      navigate(`/${hash}`);
    } else {
      const el = document.getElementById(hash.replace('#', ''));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-charcoal-100 bg-white/95 backdrop-blur-md shadow-sm'
          : 'border-b border-transparent bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Primary">
          {NAV_LINKS.map((link) =>
            link.hasMegaMenu ? (
              <MegaMenuLink
                key={link.href}
                link={link}
                open={megaOpen}
                onEnter={() => setMegaOpen(true)}
                onLeave={() => setMegaOpen(false)}
              />
            ) : link.route ? (
              <Link
                key={link.href}
                to={link.route}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-charcoal-700 transition-colors hover:bg-brand-50 hover:text-brand-800"
              >
                {link.label}
              </Link>
            ) : (
              <button
                key={link.href}
                type="button"
                onClick={() => goHome(link.href)}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-charcoal-700 transition-colors hover:bg-brand-50 hover:text-brand-800"
              >
                {link.label}
              </button>
            )
          )}
        </nav>

        <div className="hidden xl:block">
          <Link
            to="/request-quote"
            className="btn-primary text-sm"
          >
            Request a Quote
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-charcoal-800 hover:bg-charcoal-50 xl:hidden"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <MobileMenu open={mobileOpen} onClose={closeMobile} onNavigate={goHome} />
    </header>
  );
}

function MegaMenuLink({
  link,
  open,
  onEnter,
  onLeave,
}: {
  link: NavLink;
  open: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <div className="relative" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <Link
        to="/products"
        className={`flex items-center gap-1 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
          open ? 'bg-brand-50 text-brand-800' : 'text-charcoal-700 hover:bg-brand-50 hover:text-brand-800'
        }`}
      >
        {link.label}
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </Link>

      {open && (
        <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3">
          <div className="w-[min(56rem,92vw)] overflow-hidden rounded-2xl border border-charcoal-100 bg-white shadow-card-hover animate-fade-in">
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 p-7 lg:grid-cols-4">
              {PRODUCT_CATEGORIES.map((cat) => (
                <div key={cat.slug} className="min-w-0">
                  <Link
                    to={`/products?category=${cat.slug}`}
                    className="group/cat block w-full border-b border-charcoal-100 pb-2 text-left"
                  >
                    <span className="text-sm font-bold text-charcoal-900 transition-colors group-hover/cat:text-brand-700">
                      {cat.name}
                    </span>
                  </Link>
                  <ul className="mt-3 space-y-1.5">
                    {cat.items.map((item) => (
                      <li key={item.id}>
                        <Link
                          to={productRoute(item.routeSlug)}
                          className="block text-[13px] leading-snug text-charcoal-600 transition-colors hover:text-brand-700"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-charcoal-100 bg-charcoal-50/60 px-7 py-4">
              <p className="text-sm text-charcoal-600">
                Looking for a specific product or grade?
              </p>
              <Link
                to="/request-quote"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-900"
              >
                Request a Quote
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MobileMenu({
  open,
  onClose,
  onNavigate,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (hash: string) => void;
}) {
  const [productsExpanded, setProductsExpanded] = useState(false);

  useEffect(() => {
    if (!open) setProductsExpanded(false);
  }, [open]);

  if (!open) return null;

  return (
    <div className="xl:hidden">
      <div className="container-page max-h-[calc(100vh-4.5rem)] overflow-y-auto bg-white pb-8">
        <nav className="flex flex-col" aria-label="Mobile">
          <ul>
            {NAV_LINKS.map((link) =>
              link.hasMegaMenu ? (
                <li key={link.href} className="border-b border-charcoal-50">
                  <div className="flex items-center">
                    <Link
                      to="/products"
                      onClick={onClose}
                      className="flex-1 py-3.5 text-left text-base font-semibold text-charcoal-900"
                    >
                      {link.label}
                    </Link>
                    <button
                      type="button"
                      aria-label={`Expand ${link.label}`}
                      aria-expanded={productsExpanded}
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-charcoal-500 hover:bg-charcoal-50"
                      onClick={() => setProductsExpanded((v) => !v)}
                    >
                      <ChevronDown
                        className={`h-5 w-5 transition-transform duration-200 ${
                          productsExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>
                  {productsExpanded && (
                    <div className="space-y-4 pb-4 pl-3">
                      {PRODUCT_CATEGORIES.map((cat) => (
                        <div key={cat.slug}>
                          <Link
                            to={`/products?category=${cat.slug}`}
                            onClick={onClose}
                            className="text-sm font-semibold text-brand-700"
                          >
                            {cat.name}
                          </Link>
                          <ul className="mt-1.5 space-y-1.5 pl-3">
                            {cat.items.map((item) => (
                              <li key={item.id}>
                                <Link
                                  to={productRoute(item.routeSlug)}
                                  onClick={onClose}
                                  className="block text-[13px] text-charcoal-600"
                                >
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              ) : link.route ? (
                <li key={link.href} className="border-b border-charcoal-50">
                  <Link
                    to={link.route}
                    onClick={onClose}
                    className="block w-full py-3.5 text-left text-base font-medium text-charcoal-800"
                  >
                    {link.label}
                  </Link>
                </li>
              ) : (
                <li key={link.href} className="border-b border-charcoal-50">
                  <button
                    type="button"
                    onClick={() => onNavigate(link.href)}
                    className="block w-full py-3.5 text-left text-base font-medium text-charcoal-800"
                  >
                    {link.label}
                  </button>
                </li>
              )
            )}
          </ul>

          <div className="mt-5">
            <Link
              to="/request-quote"
              onClick={onClose}
              className="btn-primary w-full text-base"
            >
              Request a Quote
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
