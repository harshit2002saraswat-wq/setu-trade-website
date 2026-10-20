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
