import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock, Calendar } from 'lucide-react';
import type { BlogArticle } from '@/types/blog';
import { formatDate } from '@/data/blog';

interface BlogCardProps {
  article: BlogArticle;
  index?: number;
}

export function BlogCard({ article, index }: BlogCardProps) {
  return (
    <article
      className="card group flex flex-col overflow-hidden hover:shadow-card-hover animate-fade-up"
      style={index !== undefined ? { animationDelay: `${index * 0.06}s` } : undefined}
    >
      <Link to={`/blog/${article.slug}`} className="block">
        <div className="relative h-44 overflow-hidden bg-charcoal-100">
          <img
            src={article.image}
            alt={article.imageAlt}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute left-3 top-3">
            <span className="inline-flex rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-brand-700 backdrop-blur-sm">
              {article.category}
            </span>
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold leading-snug text-charcoal-900">
          <Link to={`/blog/${article.slug}`} className="transition-colors hover:text-brand-700">
            {article.title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal-600 line-clamp-3">
          {article.excerpt}
        </p>

        <div className="mt-5 flex items-center gap-4 text-xs text-charcoal-500">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(article.publishedDate)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {article.readingTime} min read
          </span>
        </div>

        <Link
          to={`/blog/${article.slug}`}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-900"
        >
          Read More
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </article>
  );
}
