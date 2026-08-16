import { getPublishedProducts } from '../../lib/catalog/domain/queries';
import type { Catalog } from '../../lib/catalog/domain/model';
import { routes } from '../../lib/catalog/domain/routes';
import { formatPriceLabel } from '../catalog/price';
import type { ProductCardProjection } from '../catalog/types';

export interface ProductListingProjection {
  readonly title: string;
  readonly intro: string;
  readonly emptyMessage: string;
  readonly items: readonly ProductCardProjection[];
}

export function projectProductListing(
  catalog: Catalog,
): ProductListingProjection {
  return {
    title: 'Todas nuestras ideas',
    intro: 'Explora regalos personalizados para encontrar el detalle adecuado.',
    emptyMessage: 'Pronto podrás descubrir aquí nuestro catálogo de regalos.',
    items: getPublishedProducts(catalog).map((product) => ({
      href: routes.product(product.slug),
      name: product.name,
      summary: product.summary,
      priceLabel: formatPriceLabel(product.price),
    })),
  };
}
