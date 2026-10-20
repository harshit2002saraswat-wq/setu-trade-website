import { Link, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useSeo } from '@/hooks/useSeo';

export function NotFoundPage() {
  const { pathname } = useLocation();

  useSeo({
    title: 'Page Not Found | Setu Trade',
    description: 'The page you are looking for could not be found.',
  });

  return (
    <>
      <Header />
      <div className="flex min-h-[70vh] items-center justify-center bg-white pt-[4.5rem]">
        <div className="container-page max-w-lg text-center">
          <span className="text-6xl font-extrabold text-brand-200">404</span>
          <h1 className="mt-4 text-2xl font-bold text-charcoal-900">Page Not Found</h1>
          <p className="mt-3 text-base leading-relaxed text-charcoal-600">
            The page <span className="font-medium text-charcoal-800">{pathname}</span> could not be found.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/" className="btn-primary">
              Back to Home
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/products" className="btn-secondary">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
