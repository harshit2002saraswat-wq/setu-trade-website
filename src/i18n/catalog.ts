import { useMemo } from 'react';
import { PRODUCT_CATEGORIES } from '@/data/site';
import { useTranslation } from '@/i18n/context';
import type { ProductCategory, ProductDetail } from '@/types';

/** Product categories with names/descriptions translated for the active locale. Slugs and IDs are untouched. */
export function useLocalizedCategories(): ProductCategory[] {
  const { tc } = useTranslation();
  return useMemo(
    () =>
      PRODUCT_CATEGORIES.map((cat) => ({
        ...cat,
        name: tc(cat.name),
        tagline: tc(cat.tagline),
        description: tc(cat.description),
        items: cat.items.map((item) => ({ ...item, name: tc(item.name), description: tc(item.description) })),
      })),
    [tc],
  );
}

/** Translate every human-readable field of a product detail record. */
export function localizeProductDetail(detail: ProductDetail, tc: (s: string) => string): ProductDetail {
  return {
    ...detail,
    name: tc(detail.name),
    category: tc(detail.category),
    description: tc(detail.description),
    origin: tc(detail.origin),
    variety: tc(detail.variety),
    grade: tc(detail.grade),
    size: tc(detail.size),
    packaging: tc(detail.packaging),
    quantity: tc(detail.quantity),
    availability: tc(detail.availability),
    specifications: detail.specifications.map(tc),
    packagingNote: tc(detail.packagingNote),
    qualityNote: tc(detail.qualityNote),
    exportInfo: {
      origin: tc(detail.exportInfo.origin),
      destination: tc(detail.exportInfo.destination),
      incoterm: tc(detail.exportInfo.incoterm),
      documentation: tc(detail.exportInfo.documentation),
    },
    seoTitle: tc(detail.seoTitle),
    seoDescription: tc(detail.seoDescription),
  };
}
