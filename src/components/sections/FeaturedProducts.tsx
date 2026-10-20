import { PRODUCT_CATEGORIES } from '@/data/site';
import { ProductCard } from '@/components/ProductCard';
import type { ProductItem } from '@/types';

const FEATURED_SLUGS = ['potato', 'wheat', 'bajra', 'jowar', 'mustard', 'paddy-rice', 'turmeric', 'cashew-nuts', 'raisins', 'green-chilli', 'chickpeas', 'cardamom'];

function findFeatured(): { item: ProductItem; categoryName: string }[] {
  const found: { item: ProductItem; categoryName: string }[] = [];
  for (const slug of FEATURED_SLUGS) {
    for (const cat of PRODUCT_CATEGORIES) {
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
  const featured = findFeatured();

  return (
    <section id="featured-products" className="scroll-mt-24 bg-charcoal-50 py-20 sm:py-28">
      <div className="container-page">
        <div className="max-w-3xl">
          <p className="eyebrow">
            <span className="h-px w-8 bg-brand-500" />
            Featured
          </p>
          <h2 className="section-title mt-4">Featured Products</h2>
          <p className="mt-4 text-lg leading-relaxed text-charcoal-600">
            A selection of agricultural products from our catalogue, available for
            international buyer enquiries.
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
