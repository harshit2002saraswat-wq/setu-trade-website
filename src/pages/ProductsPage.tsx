import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { PRODUCT_CATEGORIES } from '@/data/site';
import type { ProductCategorySlug } from '@/types';
import { useSeo } from '@/hooks/useSeo';

type FilterSlug = 'all' | ProductCategorySlug;

interface CatalogEntry {
  id: string;
  name: string;
  description: string;
  image: string;
  routeSlug: string;
  categorySlug: ProductCategorySlug;
  categoryName: string;
}

const FILTERS: { slug: FilterSlug; label: string }[] = [
  { slug: 'all', label: 'All Products' },
  ...PRODUCT_CATEGORIES.map((c) => ({ slug: c.slug, label: c.name })),
];

function buildCatalog(): CatalogEntry[] {
  return PRODUCT_CATEGORIES.flatMap((cat) =>
    cat.items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      image: item.image,
      routeSlug: item.routeSlug,
      categorySlug: cat.slug,
      categoryName: cat.name,
    })),
  );
}

export function ProductsPage() {
  useSeo({
    title: 'Explore Our Products | Setu Trade',
    description:
      'Explore agricultural products sourced from India for international buyers and business requirements.',
    canonicalPath: '/products',
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const activeFilter = (searchParams.get('category') as FilterSlug | null) ?? 'all';
  const [query, setQuery] = useState('');

  const catalog = useMemo(buildCatalog, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalog.filter((entry) => {
      const matchesCategory = activeFilter === 'all' || entry.categorySlug === activeFilter;
      const matchesQuery = q === '' || entry.name.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [catalog, activeFilter, query]);

  const setFilter = (slug: FilterSlug) => {
    const next = new URLSearchParams(searchParams);
    if (slug === 'all') {
      next.delete('category');
    } else {
      next.set('category', slug);
    }
    setSearchParams(next, { replace: true });
  };

  const clearSearch = () => setQuery('');

  return (
    <>
      <Header />
      <div className="pt-[4.5rem]">
        {/* Page header */}
        <section className="border-b border-charcoal-100 bg-white">
          <div className="container-page py-10 sm:py-14">
            <p className="eyebrow">
              <span className="h-px w-8 bg-brand-500" />
              Product Catalogue
            </p>
            <h1 className="section-title mt-4">Explore Our Products</h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-charcoal-600">
              Explore agricultural products sourced from India for international buyers
              and business requirements.
            </p>
          </div>
        </section>

        {/* Search + category filters */}
        <section className="sticky top-[4.5rem] z-30 border-b border-charcoal-100 bg-white/95 backdrop-blur-md">
          <div className="container-page py-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-xs">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products by name..."
                  aria-label="Search products by name"
                  className="w-full rounded-lg border border-charcoal-200 bg-white py-2.5 pl-9 pr-9 text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
                {query && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    aria-label="Clear search"
                    className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-charcoal-400 hover:bg-charcoal-50 hover:text-charcoal-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="-mx-5 overflow-x-auto px-5 lg:mx-0 lg:flex-1 lg:overflow-visible lg:px-0">
                <ul className="flex min-w-max gap-2 lg:min-w-0 lg:flex-wrap lg:justify-end">
                  <li className="flex items-center gap-1.5 pr-1 text-charcoal-400 lg:hidden">
                    <SlidersHorizontal className="h-4 w-4" />
                  </li>
                  {FILTERS.map((f) => {
                    const isActive = activeFilter === f.slug;
                    return (
                      <li key={f.slug}>
                        <button
                          type="button"
                          onClick={() => setFilter(f.slug)}
                          className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                            isActive
                              ? 'bg-brand-700 text-white'
                              : 'bg-charcoal-50 text-charcoal-700 hover:bg-brand-50 hover:text-brand-700'
                          }`}
                          aria-pressed={isActive}
                        >
                          {f.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Product grid */}
        <section className="bg-charcoal-50 py-12 sm:py-16">
          <div className="container-page">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-charcoal-500">
                {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
                {activeFilter !== 'all' && (
                  <span className="text-charcoal-400">
                    {' '}in {FILTERS.find((f) => f.slug === activeFilter)?.label}
                  </span>
                )}
              </p>
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="text-sm font-medium text-brand-700 hover:text-brand-900"
                >
                  Clear search
                </button>
              )}
            </div>

            {filtered.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((entry, i) => (
                  <ProductCard
                    key={entry.id}
                    item={{
                      id: entry.id,
                      name: entry.name,
                      description: entry.description,
                      image: entry.image,
                      routeSlug: entry.routeSlug,
                    }}
                    categoryName={entry.categoryName}
                    index={i}
                  />
                ))}
              </div>
            ) : (
              <NoResults query={query} onReset={() => { setQuery(''); setFilter('all'); }} />
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

function NoResults({ query, onReset }: { query: string; onReset: () => void }) {
  return (
    <div className="rounded-2xl border border-charcoal-100 bg-white py-16 text-center">
      <Search className="mx-auto h-8 w-8 text-charcoal-300" strokeWidth={1.8} />
      <h2 className="mt-4 text-lg font-semibold text-charcoal-900">No products found</h2>
      <p className="mt-2 text-sm text-charcoal-600">
        {query
          ? `No products match "${query}". Try a different search term or category.`
          : 'No products in this category. Try a different category.'}
      </p>
      <button type="button" onClick={onReset} className="btn-secondary mt-6">
        Reset filters
      </button>
    </div>
  );
}
