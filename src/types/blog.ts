export type BlogCategorySlug =
  | 'agriculture'
  | 'agro-products'
  | 'export-import'
  | 'indian-agriculture-markets'
  | 'spices'
  | 'millets'
  | 'fresh-vegetables'
  | 'organic-products'
  | 'buyer-guides'
  | 'trade-logistics';

export type BlogPostStatus = 'draft' | 'published' | 'archived';

export interface BlogCategory {
  slug: BlogCategorySlug;
  name: string;
}

export interface BlogSection {
  heading: string;
  paragraphs: string[];
  list?: string[];
}

export interface BlogArticle {
  slug: string;
  title: string;
  category: string;
  categorySlug: BlogCategorySlug;
  excerpt: string;
  image: string;
  imageAlt: string;
  publishedDate: string;
  readingTime: number;
  author: string;
  seoTitle: string;
  seoDescription: string;
  featured?: boolean;
  sections: BlogSection[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: BlogSection[];
  category: string;
  category_slug: BlogCategorySlug;
  featured_image: string | null;
  featured_image_alt: string | null;
  author: string;
  reading_time: number;
  status: BlogPostStatus;
  seo_title: string | null;
  seo_description: string | null;
  canonical_url: string | null;
  source_notes: string | null;
  review_notes: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}
