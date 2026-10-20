export type ProductCategorySlug =
  | 'fresh-vegetables'
  | 'agro-products'
  | 'millets'
  | 'spices'
  | 'dry-fruits'
  | 'nuts'
  | 'organic-products';

export interface ProductItem {
  id: string;
  name: string;
  /** Short factual descriptor shown on cards */
  description: string;
  image: string;
  /** Route slug for the future product detail page, e.g. "potato" -> /products/potato */
  routeSlug: string;
}

export interface ProductCategory {
  slug: ProductCategorySlug;
  name: string;
  tagline: string;
  description: string;
  image: string;
  items: ProductItem[];
}

export interface NavLink {
  label: string;
  href: string;
  /** Absolute route path for route-based nav links (e.g. "/about") */
  route?: string;
  /** Renders the Products mega-menu (built from PRODUCT_CATEGORIES) */
  hasMegaMenu?: boolean;
  children?: NavLink[];
}

export interface MarketRegion {
  name: string;
  coverage: string;
}

export interface ExportStep {
  step: number;
  title: string;
  description: string;
}

export interface ComplianceArea {
  title: string;
  description: string;
}

export interface ProductDetail {
  slug: string;
  name: string;
  category: string;
  categorySlug: ProductCategorySlug;
  description: string;
  image: string;
  origin: string;
  variety: string;
  grade: string;
  size: string;
  packaging: string;
  quantity: string;
  availability: string;
  specifications: string[];
  packagingNote: string;
  qualityNote: string;
  exportInfo: {
    origin: string;
    destination: string;
    incoterm: string;
    documentation: string;
  };
  seoTitle: string;
  seoDescription: string;
  relatedProductSlugs: string[];
}
