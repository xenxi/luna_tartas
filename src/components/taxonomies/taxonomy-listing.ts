import {
  getProductsForTaxonomy,
  getPublishedTaxonomies,
} from '../../lib/catalog/domain/queries';
import type {
  Catalog,
  PublishedProduct,
  Taxonomy,
  TaxonomyKind,
} from '../../lib/catalog/domain/model';
import { routes } from '../../lib/catalog/domain/routes';
import { formatPriceLabel } from '../catalog/price';
import type {
  ProductCardProjection,
  TaxonomyCardProjection,
} from '../catalog/types';

export interface TaxonomyIndexProjection {
  readonly items: readonly TaxonomyCardProjection[];
}

export interface TaxonomyLandingProjection {
  readonly taxonomy: Taxonomy;
  readonly products: readonly ProductCardProjection[];
}

function productProjection(product: PublishedProduct): ProductCardProjection {
  return {
    href: routes.product(product.slug),
    name: product.name,
    summary: product.summary,
    priceLabel: formatPriceLabel(product.price),
  };
}

export function getTaxonomiesWithProducts(
  catalog: Catalog,
  kind: TaxonomyKind,
): readonly Taxonomy[] {
  return getPublishedTaxonomies(catalog, kind).filter(
    (taxonomy) => getProductsForTaxonomy(catalog, kind, taxonomy.id).length > 0,
  );
}

export function projectTaxonomyIndex(
  catalog: Catalog,
  kind: TaxonomyKind,
  itemLabel: string,
): TaxonomyIndexProjection {
  return {
    items: getTaxonomiesWithProducts(catalog, kind).map((taxonomy) => ({
      href: routes.taxonomy(kind, taxonomy.slug),
      name: taxonomy.name,
      summary: taxonomy.summary,
      itemCountLabel: `${getProductsForTaxonomy(catalog, kind, taxonomy.id).length} ${itemLabel}`,
    })),
  };
}

export function projectTaxonomyLanding(
  catalog: Catalog,
  kind: TaxonomyKind,
  taxonomy: Taxonomy,
): TaxonomyLandingProjection {
  return {
    taxonomy,
    products: getProductsForTaxonomy(catalog, kind, taxonomy.id).map(
      productProjection,
    ),
  };
}
