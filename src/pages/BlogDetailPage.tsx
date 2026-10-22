import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChevronRight, Clock, Calendar, User, FileText, Loader2, AlertCircle } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BlogCard } from '@/components/BlogCard';
import { formatDate } from '@/data/blog';
import { fetchPublishedPostBySlug, fetchRelatedPosts } from '@/lib/blogApi';
import type { BlogPost } from '@/types/blog';
import { useSeo } from '@/hooks/useSeo';

const FALLBACK_IMAGE = 'https://images.pexels.com/photos/16244327/pexels-photo-16244327.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

export function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loadingState, setLoadingState] = useState<'loading' | 'success' | 'error' | 'notfound'>('loading');

  useSeo({
    title: post?.seo_title ?? 'Article | Setu Trade Insights',
    description: post?.seo_description ?? 'Setu Trade Insights article',
    canonicalPath: post ? `/blog/${post.slug}` : '/blog',
    jsonLd: post ? [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt,
        image: [post.featured_image || FALLBACK_IMAGE],
        datePublished: post.published_at || post.created_at,
        author: { '@type': 'Organization', name: post.author },
        publisher: { '@type': 'Organization', name: 'Setu Trade' },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://setutrade.com/blog/${post.slug}`,
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://setutrade.com/' },
          { '@type': 'ListItem', position: 2, name: 'Insights', item: 'https://setutrade.com/blog' },
          { '@type': 'ListItem', position: 3, name: post.category, item: `https://setutrade.com/blog?category=${post.category_slug}` },
          { '@type': 'ListItem', position: 4, name: post.title, item: `https://setutrade.com/blog/${post.slug}` },
        ],
      },
    ] : undefined,
  });

  useEffect(() => {
    if (!slug) {
      setLoadingState('notfound');
      return;
    }

    let cancelled = false;
    setLoadingState('loading');
    window.scrollTo(0, 0);

    fetchPublishedPostBySlug(slug)
      .then((data) => {
        if (cancelled) return;
        if (!data) {
          setLoadingState('notfound');
          return;
        }
        setPost(data);
        setLoadingState('success');
        fetchRelatedPosts(slug, data.category_slug, 3)
          .then((rel) => { if (!cancelled) setRelated(rel); })
          .catch(() => {});
      })
      .catch(() => {
        if (!cancelled) setLoadingState('error');
      });

    return () => { cancelled = true; };
  }, [slug]);

  if (loadingState === 'loading') {
    return (
      <>
        <Header />
        <div className="flex min-h-[60vh] items-center justify-center bg-white pt-[4.5rem]">
          <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
        </div>
        <Footer />
      </>
    );
  }

  if (loadingState === 'error') {
    return (
      <>
        <Header />
        <div className="flex min-h-[60vh] items-center justify-center bg-white pt-[4.5rem]">
          <div className="text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
            <p className="mt-3 text-sm font-medium text-red-800">Could not load the article.</p>
            <button type="button" onClick={() => window.location.reload()} className="btn-secondary mt-5">
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (loadingState === 'notfound' || !post) {
    return (
      <>
        <Header />
        <div className="flex min-h-[70vh] items-center justify-center bg-white pt-[4.5rem]">
          <div className="container-page max-w-lg text-center">
            <span className="text-6xl font-extrabold text-brand-200">404</span>
            <h1 className="mt-4 text-2xl font-bold text-charcoal-900">Article Not Found</h1>
            <p className="mt-3 text-base leading-relaxed text-charcoal-600">
              The article you are looking for may not be available or the link may be incorrect.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/blog" className="btn-primary">
                Back to Insights
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/" className="btn-secondary">Back to Home</Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const dateStr = post.published_at || post.created_at;
  const imageUrl = post.featured_image || FALLBACK_IMAGE;
  const imageAlt = post.featured_image_alt || post.title;

  return (
    <>
      <Header />
      <div className="pt-[4.5rem]">
        {/* Breadcrumb */}
        <div className="border-b border-charcoal-100 bg-white">
          <div className="container-page py-4">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-charcoal-500">
              <Link to="/" className="hover:text-brand-700">Home</Link>
              <ChevronRight className="h-3.5 w-3.5 text-charcoal-300" />
              <Link to="/blog" className="hover:text-brand-700">Insights</Link>
              <ChevronRight className="h-3.5 w-3.5 text-charcoal-300" />
              <Link to={`/blog?category=${post.category_slug}`} className="hover:text-brand-700">{post.category}</Link>
              <ChevronRight className="h-3.5 w-3.5 text-charcoal-300" />
              <span className="font-medium text-charcoal-800 line-clamp-1">{post.title}</span>
            </nav>
          </div>
        </div>

        {/* Article Hero */}
        <section className="bg-white py-10 sm:py-14">
          <div className="container-page max-w-4xl">
            <Link to={`/blog?category=${post.category_slug}`} className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-100">
              {post.category}
            </Link>
            <h1 className="mt-5 text-3xl font-extrabold leading-[1.15] text-charcoal-900 sm:text-4xl">
              {post.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-charcoal-500">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formatDate(dateStr)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {post.reading_time} min read
              </span>
              <span className="inline-flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {post.author}
              </span>
            </div>
            <p className="mt-6 text-lg leading-relaxed text-charcoal-600">{post.excerpt}</p>
          </div>
        </section>

        {/* Hero Image */}
        <section className="bg-white pb-10 sm:pb-14">
          <div className="container-page max-w-4xl">
            <div className="relative overflow-hidden rounded-2xl border border-charcoal-100 shadow-card">
              <img src={imageUrl} alt={imageAlt} className="h-56 w-full object-cover sm:h-72 lg:h-80" />
            </div>
          </div>
        </section>

        {/* Article Body */}
        <section className="bg-white pb-14 sm:pb-20">
          <div className="container-page max-w-3xl">
            <div className="space-y-10">
              {post.content.map((section, idx) => (
                <div key={idx}>
                  <h2 className="text-xl font-bold text-charcoal-900 sm:text-2xl">{section.heading}</h2>
                  <div className="mt-4 space-y-4">
                    {section.paragraphs.map((para, i) => (
                      <p key={i} className="text-base leading-[1.8] text-charcoal-700">{para}</p>
                    ))}
                  </div>
                  {section.list && (
                    <ul className="mt-5 space-y-2.5">
                      {section.list.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-base leading-relaxed text-charcoal-700">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* Regulatory disclaimer */}
            <div className="mt-12 rounded-xl border border-charcoal-100 bg-charcoal-50 p-5">
              <p className="flex items-start gap-2 text-sm leading-relaxed text-charcoal-600">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-charcoal-400" />
                <span>
                  This article is provided for general informational purposes and does not
                  constitute legal, regulatory or trade advice. Export and import regulations,
                  documentation requirements and quality standards can change over time and
                  vary by destination market. Always verify current requirements with the
                  relevant authorities before placing an order.
                </span>
              </p>
            </div>

            {/* Back to blog */}
            <div className="mt-10 border-t border-charcoal-100 pt-8">
              <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-900">
                <ArrowLeft className="h-4 w-4" />
                Back to all articles
              </Link>
            </div>
          </div>
        </section>

        {/* Related articles */}
        {related.length > 0 && (
          <section className="bg-charcoal-50 py-14">
            <div className="container-page">
              <div className="flex items-end justify-between">
                <h2 className="text-2xl font-bold text-charcoal-900">Related Articles</h2>
                <Link to="/blog" className="hidden items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-900 sm:inline-flex">
                  View all articles
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((rel, i) => (
                  <BlogCard key={rel.id} article={rel} index={i} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="bg-brand-950 py-16">
          <div className="container-page">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">Have a Product Requirement?</h2>
              <p className="mt-3 text-base leading-relaxed text-brand-200">
                Tell us what agricultural product you are looking for, along with quantity,
                specification and destination.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link to="/products" className="btn-primary text-base">
                  Explore Products
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/contact" className="btn border border-brand-700 bg-brand-900/40 px-5 py-3 text-base text-white hover:bg-brand-800/60">
                  Contact Setu Trade
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
