import {
  getPublishedProducts,
  getRelatedProducts,
} from '../../lib/catalog/domain/queries';
import type { Catalog, PublishedProduct } from '../../lib/catalog/domain/model';
import { routes } from '../../lib/catalog/domain/routes';
import { formatPriceLabel } from '../catalog/price';
import type { ProductCardProjection } from '../catalog/types';

export interface ProductRelatedProjection {
  readonly title: string;
  readonly intro: string;
  readonly items: readonly ProductCardProjection[];
}

export function projectRelatedProducts(
  catalog: Catalog,
  product: PublishedProduct,
  limit = 4,
): ProductRelatedProjection {
  const related = getRelatedProducts(catalog, product.id, limit);
  const selectedIds = new Set(related.map(({ id }) => id));
  const suggestions = [
    ...related,
    ...getPublishedProducts(catalog).filter(
      (candidate) =>
        candidate.id !== product.id && !selectedIds.has(candidate.id),
    ),
  ].slice(0, limit);

  return {
    title: 'También puede interesarte',
    intro: 'Otras creaciones hechas para convertir momentos en recuerdos.',
    items: suggestions.map((related) => ({
      id: related.slug,
      href: routes.product(related.slug),
      name: related.name,
      summary: related.summary,
      priceLabel: formatPriceLabel(related.price),
      eyebrow: 'Otra idea de Luna',
    })),
  };
}
