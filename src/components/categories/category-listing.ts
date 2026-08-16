import {
  getProductsForTaxonomy,
  getPublishedTaxonomies,
} from '../../lib/catalog/domain/queries';
import type {
  Catalog,
  PublishedProduct,
  Taxonomy,
} from '../../lib/catalog/domain/model';
import { routes } from '../../lib/catalog/domain/routes';
import { formatPriceLabel } from '../catalog/price';
import type {
  ProductCardProjection,
  TaxonomyCardProjection,
} from '../catalog/types';

export interface CategoryIndexProjection {
  readonly items: readonly TaxonomyCardProjection[];
}

export interface CategoryLandingProjection {
  readonly category: Taxonomy;
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

export function getCategoriesWithProducts(
  catalog: Catalog,
): readonly Taxonomy[] {
  return getPublishedTaxonomies(catalog, 'category').filter(
    (category) =>
      getProductsForTaxonomy(catalog, 'category', category.id).length > 0,
  );
}

export function projectCategoryIndex(
  catalog: Catalog,
): CategoryIndexProjection {
  return {
    items: getCategoriesWithProducts(catalog).map((category) => ({
      href: routes.taxonomy('category', category.slug),
      name: category.name,
      summary: category.summary,
      itemCountLabel: `${getProductsForTaxonomy(catalog, 'category', category.id).length} productos`,
    })),
  };
}

export function projectCategoryLanding(
  catalog: Catalog,
  category: Taxonomy,
): CategoryLandingProjection {
  return {
    category,
    products: getProductsForTaxonomy(catalog, 'category', category.id).map(
      productProjection,
    ),
  };
}
