import { getPublishedProducts } from '../../lib/catalog/domain/queries';
import type { Catalog, PublishedProduct } from '../../lib/catalog/domain/model';
import { routes } from '../../lib/catalog/domain/routes';
import { formatPriceLabel } from '../catalog/price';
import type { ProductCardProjection } from '../catalog/types';

export interface ProductListingProjection {
  readonly title: string;
  readonly intro: string;
  readonly items: readonly ProductCardProjection[];
}

export function indexPublishedProductsByListingHref(
  products: readonly PublishedProduct[],
): ReadonlyMap<string, PublishedProduct> {
  // The validated slug is the stable identity encoded in every listing route.
  return new Map(
    products.map((product) => [routes.product(product.slug), product]),
  );
}

export function projectProductListing(
  catalog: Catalog,
): ProductListingProjection {
  return {
    title: 'Todas nuestras ideas',
    intro: 'Explora regalos personalizados para encontrar el detalle adecuado.',
    items: getPublishedProducts(catalog).map((product) => ({
      id: product.slug,
      href: routes.product(product.slug),
      name: product.name,
      summary: product.summary,
      priceLabel: formatPriceLabel(product.price),
    })),
  };
}
