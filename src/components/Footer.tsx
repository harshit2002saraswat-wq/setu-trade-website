import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, MapPin, Phone, Sprout, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { PRODUCT_CATEGORIES } from '@/data/site';

export function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const goHome = (hash: string) => {
    if (location.pathname !== '/') {
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
              India-based exporter of fresh vegetables, agro products, millets, spices, dry fruits,
              nuts and organic produce — connecting international buyers with quality Indian agriculture.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <span className="text-brand-200">India</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <Link to="/contact" className="text-brand-200 hover:text-white">
                  Contact us for enquiries
                </Link>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <span className="text-brand-200">Available on request</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-400">
              Products
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {PRODUCT_CATEGORIES.map((cat) => (
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
              Company
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to="/about" className="text-brand-200 hover:text-white">About Us</Link></li>
              <li><Link to="/products" className="text-brand-200 hover:text-white">Products</Link></li>
              <li><Link to="/suppliers" className="text-brand-200 hover:text-white">Suppliers</Link></li>
              <li><Link to="/contact" className="text-brand-200 hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-400">
              Work with us
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <button type="button" onClick={() => goHome('#request-quote')} className="group inline-flex items-center gap-1.5 text-brand-200 hover:text-white">
                  Request a Quote
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </li>
              <li>
                <Link to="/suppliers" className="group inline-flex items-center gap-1.5 text-brand-200 hover:text-white">
                  Become a Supplier
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </li>
              <li><Link to="/contact" className="text-brand-200 hover:text-white">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-brand-900 pt-6 sm:flex-row sm:items-center">
          <p className="flex items-center gap-2 text-xs text-brand-300">
            <Sprout className="h-3.5 w-3.5" />
            &copy; {new Date().getFullYear()} Setu Trade. All rights reserved.
          </p>
          <p className="text-xs text-brand-400">
            Built for international agricultural trade.
          </p>
        </div>
      </div>
    </footer>
  );
}
