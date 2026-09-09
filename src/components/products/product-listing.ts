import {
  getPublishedProducts,
  getPublishedTaxonomies,
} from '../../lib/catalog/domain/queries';
import { productsIndexContent } from '../../content/products-index';
import type { Catalog, PublishedProduct } from '../../lib/catalog/domain/model';
import { routes } from '../../lib/catalog/domain/routes';
import { formatPriceLabel } from '../catalog/price';
import type { ProductCardProjection } from '../catalog/types';

export interface ProductListingItemProjection extends ProductCardProjection {
  readonly occasionIds: readonly string[];
  readonly priceAmountMinor: number | null;
}

export interface ProductListingProjection {
  readonly title: string;
  readonly intro: string;
  readonly items: readonly ProductListingItemProjection[];
  readonly filters: readonly {
    readonly id: string;
    readonly label: string;
    readonly href: string;
  }[];
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
  const products = getPublishedProducts(catalog);
  return {
    title: productsIndexContent.title,
    intro: productsIndexContent.intro,
    filters: getPublishedTaxonomies(catalog, 'occasion')
      .filter((occasion) =>
        products.some((product) => product.occasions?.includes(occasion.id)),
      )
      .map((occasion) => ({
        id: occasion.id,
        label: occasion.name,
        href: routes.taxonomy('occasion', occasion.slug),
      })),
    items: products.map((product) => ({
      id: product.slug,
      href: routes.product(product.slug),
      name: product.name,
      summary: product.summary,
      priceLabel: formatPriceLabel(product.price),
      occasionIds: product.occasions ?? [],
      priceAmountMinor:
        product.price.kind === 'on_request' ? null : product.price.amountMinor,
    })),
  };
}
