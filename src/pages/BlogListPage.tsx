import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, X, SlidersHorizontal, ArrowRight, Clock, Calendar } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BlogCard } from '@/components/BlogCard';
import {
  BLOG_ARTICLES,
  BLOG_CATEGORIES,
  getFeaturedArticle,
  formatDate,
} from '@/data/blog';
import type { BlogCategorySlug } from '@/types/blog';
import { useSeo } from '@/hooks/useSeo';

type FilterSlug = 'all' | BlogCategorySlug;

const FILTERS: { slug: FilterSlug; label: string }[] = [
  { slug: 'all', label: 'All Articles' },
  ...BLOG_CATEGORIES.map((c) => ({ slug: c.slug as FilterSlug, label: c.name })),
];

export function BlogListPage() {
  useSeo({
    title: 'Setu Trade Insights — Indian Agriculture & Export Blog',
    description:
      'Insights on Indian agriculture, agro-products, export markets, spices, millets, fresh vegetables, organic products and international trade logistics for B2B buyers.',
    canonicalPath: '/blog',
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const activeFilter = (searchParams.get('category') as FilterSlug | null) ?? 'all';
  const [query, setQuery] = useState('');

  const featured = useMemo(() => getFeaturedArticle(), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return BLOG_ARTICLES.filter((article) => {
      const matchesCategory = activeFilter === 'all' || article.categorySlug === activeFilter;
      const matchesQuery =
        q === '' ||
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [activeFilter, query]);

  const showFeatured = activeFilter === 'all' && query === '' && featured;

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

  const articleCount = showFeatured ? filtered.length + 1 : filtered.length;

  return (
    <>
      <Header />
      <div className="pt-[4.5rem]">
        {/* Hero */}
        <section className="relative isolate overflow-hidden bg-brand-950">
          <div className="absolute inset-0 -z-10">
            <img
              src="https://images.pexels.com/photos/40063710/pexels-photo-40063710.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
              alt=""
              className="h-full w-full object-cover opacity-20 animate-slow-zoom"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-brand-950/70 via-brand-950/80 to-brand-950" />
          </div>
          <div className="container-page py-16 sm:py-20 lg:py-24">
            <div className="max-w-3xl">
              <p className="eyebrow text-brand-300 animate-fade-up">
                <span className="h-px w-8 bg-brand-400" />
                Insights
              </p>
              <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] text-white sm:text-5xl animate-fade-up" style={{ animationDelay: '0.08s' }}>
                Setu Trade Insights
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-100 animate-fade-up" style={{ animationDelay: '0.16s' }}>
                Articles and guides on Indian agriculture, agro-products, export markets
                and international trade — covering spices, millets, fresh vegetables,
                organic products, buyer guides and logistics for B2B buyers.
              </p>
            </div>
          </div>
        </section>

        {/* Featured article */}
        {showFeatured && featured && (
          <section className="bg-white py-10 sm:py-12">
            <div className="container-page">
              <p className="eyebrow mb-5">
                <span className="h-px w-8 bg-brand-500" />
                Featured Article
              </p>
              <Link
                to={`/blog/${featured.slug}`}
                className="card group grid overflow-hidden hover:shadow-card-hover lg:grid-cols-2"
              >
                <div className="relative h-56 overflow-hidden bg-charcoal-100 lg:h-full">
                  <img
                    src={featured.image}
                    alt={featured.imageAlt}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute left-4 top-4">
                    <span className="inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-700 backdrop-blur-sm">
                      {featured.category}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col justify-center p-7 lg:p-10">
                  <div className="flex items-center gap-4 text-xs text-charcoal-500">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(featured.publishedDate)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {featured.readingTime} min read
                    </span>
                  </div>
                  <h2 className="mt-4 text-2xl font-bold leading-snug text-charcoal-900 sm:text-3xl">
                    {featured.title}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-charcoal-600">
                    {featured.excerpt}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 group-hover:text-brand-900">
                    Read Article
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </div>
          </section>
        )}

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
                  placeholder="Search articles..."
                  aria-label="Search articles"
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

        {/* Blog grid */}
        <section className="bg-charcoal-50 py-12 sm:py-16">
          <div className="container-page">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-charcoal-500">
                {articleCount} {articleCount === 1 ? 'article' : 'articles'}
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
                {filtered.map((article, i) => (
                  <BlogCard
                    key={article.slug}
                    article={article}
                    index={i}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-charcoal-100 bg-white py-16 text-center">
                <Search className="mx-auto h-8 w-8 text-charcoal-300" strokeWidth={1.8} />
                <h2 className="mt-4 text-lg font-semibold text-charcoal-900">No articles found</h2>
                <p className="mt-2 text-sm text-charcoal-600">
                  {query
                    ? `No articles match "${query}". Try a different search term or category.`
                    : 'No articles in this category. Try a different category.'}
                </p>
                <button
                  type="button"
                  onClick={() => { setQuery(''); setFilter('all'); }}
                  className="btn-secondary mt-6"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
