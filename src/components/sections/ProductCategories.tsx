import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PRODUCT_CATEGORIES, productRoute } from '@/data/site';
import type { ProductCategory } from '@/types';

export function ProductCategories() {
  return (
    <section id="products" className="scroll-mt-24 bg-charcoal-50 py-20 sm:py-28">
      <div className="container-page">
        <div className="max-w-3xl">
          <p className="eyebrow">
            <span className="h-px w-8 bg-brand-500" />
            Our Product Range
          </p>
          <h2 className="section-title mt-4">Explore Our Products</h2>
          <p className="mt-4 text-lg leading-relaxed text-charcoal-600">
            Explore agricultural products sourced from India for international buyers
            and business requirements.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCT_CATEGORIES.map((cat, i) => (
            <CategoryCard key={cat.slug} category={cat} index={i} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/products" className="btn-secondary">
            Browse All Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ category, index }: { category: ProductCategory; index: number }) {
  const navigate = useNavigate();
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: '60px', threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      ref={ref}
      className={`card group flex flex-col overflow-hidden hover:shadow-card-hover hover:-translate-y-1.5 ${
        visible ? 'animate-fade-up' : 'opacity-0'
      }`}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Image — moderate height, subtle gradient */}
      <div className="relative h-40 overflow-hidden bg-charcoal-100">
        <img
          src={category.image}
          alt={category.name}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/30 via-transparent to-transparent" />
        <div className="absolute left-4 top-4">
          <span className="inline-flex rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-700 backdrop-blur-sm">
            {category.tagline}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-charcoal-900">{category.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-charcoal-600">
          {category.description}
        </p>

        {/* Compact product tags */}
        <div className="mt-4 flex flex-wrap items-center gap-x-1.5 gap-y-2">
          {category.items.slice(0, 5).map((item, idx) => (
            <span key={item.id} className="inline-flex items-center">
              {idx > 0 && (
                <span className="mr-1.5 text-xs text-charcoal-300" aria-hidden="true">
                  &middot;
                </span>
              )}
              <Link
                to={productRoute(item.routeSlug)}
                className="text-xs font-medium text-charcoal-600 transition-colors hover:text-brand-700"
              >
                {item.name}
              </Link>
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-5 pt-4 border-t border-charcoal-100">
          <button
            type="button"
            onClick={() => navigate(`/products?category=${category.slug}`)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded"
          >
            Explore Products
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </article>
  );
}
