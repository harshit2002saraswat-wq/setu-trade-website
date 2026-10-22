import { Link } from '@/i18n/Link';
import { useTranslation } from '@/i18n/context';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { productRoute } from '@/data/site';
import type { ProductItem } from '@/types';

interface ProductCardProps {
  item: ProductItem;
  categoryName: string;
  index?: number;
}

export function ProductCard({ item, categoryName, index }: ProductCardProps) {
  const { t } = useTranslation();
  return (
    <article
      className="card group flex flex-col overflow-hidden hover:shadow-card-hover animate-fade-up"
      style={index !== undefined ? { animationDelay: `${index * 0.06}s` } : undefined}
    >
      <div className="relative h-44 overflow-hidden bg-charcoal-100">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute start-3 top-3">
          <span className="inline-flex rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-brand-700 backdrop-blur-sm">
            {categoryName}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold text-charcoal-900">{item.name}</h3>
        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-charcoal-600">
          {item.description}
        </p>

        <div className="mt-5 flex items-center gap-3">
          <Link
            to={productRoute(item.routeSlug)}
            className="btn-secondary flex-1 px-4 py-2.5 text-sm"
          >
            {t('products.viewProduct')}
            <ArrowUpRight className="h-4 w-4 transition-transform rtl:-scale-x-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:group-hover:-translate-x-0.5" />
          </Link>
          <Link
            to={`/request-quote?product=${item.routeSlug}`}
            className="btn-primary px-4 py-2.5 text-sm"
            aria-label={t('products.requestQuoteFor', { name: item.name })}
          >
            {t('common.requestQuote')}
            <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
          </Link>
        </div>
      </div>
    </article>
  );
}
