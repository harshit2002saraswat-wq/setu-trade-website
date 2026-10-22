import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock, Calendar } from 'lucide-react';
import type { BlogArticle, BlogPost } from '@/types/blog';
import { formatDate } from '@/data/blog';

interface BlogCardProps {
  article: BlogArticle | BlogPost;
  index?: number;
}

function isBlogPost(a: BlogArticle | BlogPost): a is BlogPost {
  return 'category_slug' in a;
}

function getSlug(a: BlogArticle | BlogPost): string {
  return a.slug;
}

function getTitle(a: BlogArticle | BlogPost): string {
  return a.title;
}

function getCategory(a: BlogArticle | BlogPost): string {
  return isBlogPost(a) ? a.category : a.category;
}

function getExcerpt(a: BlogArticle | BlogPost): string {
  return a.excerpt;
}

function getImage(a: BlogArticle | BlogPost): string {
  if (isBlogPost(a)) {
    return a.featured_image || 'https://images.pexels.com/photos/16244327/pexels-photo-16244327.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
  }
  return a.image;
}

function getImageAlt(a: BlogArticle | BlogPost): string {
  if (isBlogPost(a)) {
    return a.featured_image_alt || a.title;
  }
  return a.imageAlt;
}

function getDate(a: BlogArticle | BlogPost): string {
  if (isBlogPost(a)) {
    return a.published_at || a.created_at;
  }
  return a.publishedDate;
}

function getReadingTime(a: BlogArticle | BlogPost): number {
  return a.readingTime;
}

export function BlogCard({ article, index }: BlogCardProps) {
  return (
    <article
      className="card group flex flex-col overflow-hidden hover:shadow-card-hover animate-fade-up"
      style={index !== undefined ? { animationDelay: `${index * 0.06}s` } : undefined}
    >
      <Link to={`/blog/${getSlug(article)}`} className="block">
        <div className="relative h-44 overflow-hidden bg-charcoal-100">
          <img
            src={getImage(article)}
            alt={getImageAlt(article)}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute left-3 top-3">
            <span className="inline-flex rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-brand-700 backdrop-blur-sm">
              {getCategory(article)}
            </span>
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold leading-snug text-charcoal-900">
          <Link to={`/blog/${getSlug(article)}`} className="transition-colors hover:text-brand-700">
            {getTitle(article)}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal-600 line-clamp-3">
          {getExcerpt(article)}
        </p>

        <div className="mt-5 flex items-center gap-4 text-xs text-charcoal-500">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(getDate(article))}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {getReadingTime(article)} min read
          </span>
        </div>

        <Link
          to={`/blog/${getSlug(article)}`}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-900"
        >
          Read More
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </article>
  );
}
