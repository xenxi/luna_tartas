import type {
  Catalog,
  PublishedProduct,
  Taxonomy,
  TaxonomyKind,
} from './model';

function byEditorialOrder<T extends { readonly order: number }>(
  left: T,
  right: T,
): number {
  return left.order - right.order;
}

function byNameAndId<T extends { readonly name: string; readonly id: string }>(
  left: T,
  right: T,
): number {
  return (
    left.name.localeCompare(right.name, 'es') || left.id.localeCompare(right.id)
  );
}

function byProductOrder(
  left: PublishedProduct,
  right: PublishedProduct,
): number {
  return (
    (left.order ?? Number.MAX_SAFE_INTEGER) -
      (right.order ?? Number.MAX_SAFE_INTEGER) ||
    left.name.localeCompare(right.name, 'es') ||
    left.id.localeCompare(right.id)
  );
}

function publishedProducts(catalog: Catalog): PublishedProduct[] {
  return catalog.products
    .filter(
      (product): product is PublishedProduct => product.status === 'published',
    )
    .sort(byProductOrder);
}

export function getPublishedProducts(
  catalog: Catalog,
): readonly PublishedProduct[] {
  return publishedProducts(catalog);
}

export function getFeaturedProducts(
  catalog: Catalog,
): readonly PublishedProduct[] {
  return publishedProducts(catalog).filter(
    (product) => product.featured === true,
  );
}

export function getPublishedTaxonomies(
  catalog: Catalog,
  kind: TaxonomyKind,
): readonly Taxonomy[] {
  const collection =
    kind === 'category'
      ? catalog.categories
      : kind === 'occasion'
        ? catalog.occasions
        : catalog.recipients;

  return collection
    .filter((taxonomy) => taxonomy.status === 'published')
    .sort(
      (left, right) =>
        byEditorialOrder(left, right) || byNameAndId(left, right),
    );
}

export function findPublishedProductBySlug(
  catalog: Catalog,
  slug: string,
): PublishedProduct | undefined {
  return publishedProducts(catalog).find((product) => product.slug === slug);
}

export function findPublishedProductById(
  catalog: Catalog,
  id: string,
): PublishedProduct | undefined {
  return publishedProducts(catalog).find((product) => product.id === id);
}

export function findPublishedTaxonomyBySlug(
  catalog: Catalog,
  kind: TaxonomyKind,
  slug: string,
): Taxonomy | undefined {
  return getPublishedTaxonomies(catalog, kind).find(
    (taxonomy) => taxonomy.slug === slug,
  );
}

export function findPublishedTaxonomyById(
  catalog: Catalog,
  kind: TaxonomyKind,
  id: string,
): Taxonomy | undefined {
  return getPublishedTaxonomies(catalog, kind).find(
    (taxonomy) => taxonomy.id === id,
  );
}

function taxonomyProductIds(
  product: PublishedProduct,
  kind: TaxonomyKind,
): readonly string[] {
  return kind === 'category'
    ? product.categories
    : kind === 'occasion'
      ? (product.occasions ?? [])
      : (product.recipients ?? []);
}

export function getProductsForTaxonomy(
  catalog: Catalog,
  kind: TaxonomyKind,
  taxonomyId: string,
): readonly PublishedProduct[] {
  return publishedProducts(catalog).filter((product) =>
    taxonomyProductIds(product, kind).includes(taxonomyId),
  );
}

export function getRelatedProducts(
  catalog: Catalog,
  productId: string,
  limit = 4,
): readonly PublishedProduct[] {
  if (!Number.isSafeInteger(limit) || limit < 0) {
    throw new Error(
      'Related product limit must be a non-negative safe integer',
    );
  }

  const current = findPublishedProductById(catalog, productId);
  if (current === undefined || limit === 0) return [];

  const currentTaxonomies = new Set([
    ...current.categories,
    ...(current.occasions ?? []),
    ...(current.recipients ?? []),
  ]);

  return publishedProducts(catalog)
    .filter((product) => product.id !== current.id)
    .map((product) => {
      const shared = [
        ...product.categories,
        ...(product.occasions ?? []),
        ...(product.recipients ?? []),
      ].filter((id) => currentTaxonomies.has(id)).length;
      return { product, shared };
    })
    .filter(({ shared }) => shared > 0)
    .sort(
      (left, right) =>
        right.shared - left.shared ||
        byProductOrder(left.product, right.product),
    )
    .slice(0, limit)
    .map(({ product }) => product);
}
