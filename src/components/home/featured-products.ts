import { getFeaturedProducts } from '../../lib/catalog/domain/queries';
import type { Catalog } from '../../lib/catalog/domain/model';
import { routes } from '../../lib/catalog/domain/routes';
import { formatPriceLabel } from '../catalog/price';
import type { ProductCardProjection } from '../catalog/types';

export interface FeaturedProductsProjection {
  readonly title: string;
  readonly intro: string;
  readonly items: readonly ProductCardProjection[];
}

export { formatPriceLabel } from '../catalog/price';

export function projectFeaturedProducts(
  catalog: Catalog,
): FeaturedProductsProjection {
  return {
    title: 'Ideas para regalar',
    intro: 'Una selección de creaciones para encontrar tu próximo detalle.',
    items: getFeaturedProducts(catalog).map((product) => ({
      href: routes.product(product.slug),
      name: product.name,
      summary: product.summary,
      priceLabel: formatPriceLabel(product.price),
      eyebrow: 'Destacado',
    })),
  };
}
