import { ProductCard } from '@/components/ProductCard';
import { useTranslation } from '@/i18n/context';
import { useLocalizedCategories } from '@/i18n/catalog';
import type { ProductCategory, ProductItem } from '@/types';

const FEATURED_SLUGS = ['potato', 'wheat', 'bajra', 'jowar', 'mustard', 'paddy-rice', 'turmeric', 'cashew-nuts', 'raisins', 'green-chilli', 'chickpeas', 'cardamom'];

function findFeatured(categories: ProductCategory[]): { item: ProductItem; categoryName: string }[] {
  const found: { item: ProductItem; categoryName: string }[] = [];
  for (const slug of FEATURED_SLUGS) {
    for (const cat of categories) {
      const item = cat.items.find((i) => i.routeSlug === slug);
      if (item) {
        found.push({ item, categoryName: cat.name });
        break;
      }
    }
  }
  return found;
}

export function FeaturedProducts() {
  const { t } = useTranslation();
  const featured = findFeatured(useLocalizedCategories());

  return (
    <section id="featured-products" className="scroll-mt-24 bg-charcoal-50 py-20 sm:py-28">
      <div className="container-page">
        <div className="max-w-3xl">
          <p className="eyebrow">
            <span className="h-px w-8 bg-brand-500" />
            {t('home.featured.eyebrow')}
          </p>
          <h2 className="section-title mt-4">{t('home.featured.title')}</h2>
          <p className="mt-4 text-lg leading-relaxed text-charcoal-600">
            {t('home.featured.subtitle')}
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featured.map(({ item, categoryName }, i) => (
            <ProductCard
              key={item.id}
              item={item}
              categoryName={categoryName}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
