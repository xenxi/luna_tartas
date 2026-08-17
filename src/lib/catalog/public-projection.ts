import { getCanonicalUrl, siteConfig } from '../../config/site';
import type {
  Catalog,
  Customization,
  Price,
  PublishedMediaItem,
  PublishedProduct,
  Taxonomy,
  TaxonomyKind,
} from './domain/model';
import { getPublishedProducts, getPublishedTaxonomies } from './domain/queries';
import { routes } from './domain/routes';

export const CATALOG_SCHEMA_VERSION = '1.0';

export interface PublicCatalogTaxonomy {
  readonly id: string;
  readonly name: string;
  readonly summary: string;
  readonly url: string;
}

export interface PublicCatalogCover {
  readonly url: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
}

export interface PublicCatalogPrice {
  readonly kind: Price['kind'];
  readonly amount?: string;
  readonly currency?: string;
}

export interface PublicCatalogCustomization {
  readonly kind: Customization['kind'];
  readonly options?: readonly string[];
  readonly description?: string;
}

export interface PublicCatalogProduct {
  readonly id: string;
  readonly name: string;
  readonly summary: string;
  readonly url: string;
  readonly taxonomies: Readonly<
    Record<TaxonomyKind, readonly PublicCatalogTaxonomy[]>
  >;
  readonly price: PublicCatalogPrice;
  readonly cover: PublicCatalogCover;
  readonly customization: PublicCatalogCustomization;
}

export interface PublicCatalogDocument {
  readonly schemaVersion: typeof CATALOG_SCHEMA_VERSION;
  readonly taxonomies: Readonly<
    Record<TaxonomyKind, readonly PublicCatalogTaxonomy[]>
  >;
  readonly products: readonly PublicCatalogProduct[];
}

export type PublicCatalogCoverResolver = (
  media: PublishedMediaItem,
  product: PublishedProduct,
) => Promise<PublicCatalogCover> | PublicCatalogCover;

const taxonomyKinds: readonly TaxonomyKind[] = [
  'category',
  'occasion',
  'recipient',
];

function toTaxonomy(taxonomy: Taxonomy): PublicCatalogTaxonomy {
  return Object.freeze({
    id: taxonomy.id,
    name: taxonomy.name,
    summary: taxonomy.summary,
    url: getCanonicalUrl(routes.taxonomy(taxonomy.kind, taxonomy.slug)),
  });
}

function selectedTaxonomyIds(
  product: PublishedProduct,
  kind: TaxonomyKind,
): readonly string[] {
  if (kind === 'category') return product.categories;
  if (kind === 'occasion') return product.occasions ?? [];
  return product.recipients ?? [];
}

function productTaxonomies(
  publishedTaxonomies: Readonly<Record<TaxonomyKind, readonly Taxonomy[]>>,
  product: PublishedProduct,
): PublicCatalogProduct['taxonomies'] {
  return Object.freeze(
    Object.fromEntries(
      taxonomyKinds.map((kind) => {
        const taxonomiesById = new Map(
          publishedTaxonomies[kind].map((taxonomy) => [taxonomy.id, taxonomy]),
        );
        const taxonomies = selectedTaxonomyIds(product, kind).map((id) => {
          const taxonomy = taxonomiesById.get(id);

          if (taxonomy === undefined) {
            throw new Error(
              `Published product ${product.id} references a non-public ${kind}: ${id}`,
            );
          }

          return toTaxonomy(taxonomy);
        });

        return [kind, Object.freeze(taxonomies)];
      }),
    ) as Record<TaxonomyKind, readonly PublicCatalogTaxonomy[]>,
  );
}

function formatAmount(amountMinor: number): string {
  const units = Math.floor(amountMinor / 100);
  const cents = amountMinor % 100;
  return `${units}.${cents.toString().padStart(2, '0')}`;
}

function toPrice(price: Price): PublicCatalogPrice {
  if (price.kind === 'on_request') return Object.freeze({ kind: price.kind });

  return Object.freeze({
    kind: price.kind,
    amount: formatAmount(price.amountMinor),
    currency: price.currency,
  });
}

function toCustomization(
  customization: Customization,
): PublicCatalogCustomization {
  if (customization.kind === 'none') {
    return Object.freeze({ kind: customization.kind });
  }

  return Object.freeze({
    kind: customization.kind,
    options: Object.freeze([...customization.options]),
    description: customization.description,
  });
}

function validateCover(cover: PublicCatalogCover): PublicCatalogCover {
  let url: URL;

  try {
    url = new URL(cover.url);
  } catch {
    throw new Error('Public catalog cover URL must be absolute');
  }

  if (url.protocol !== 'https:' || url.origin !== siteConfig.siteUrl) {
    throw new Error(
      'Public catalog cover URL must use the configured HTTPS origin',
    );
  }

  if (typeof cover.alt !== 'string' || cover.alt.trim() === '') {
    throw new Error('Public catalog cover alt must be non-empty');
  }

  if (
    !Number.isSafeInteger(cover.width) ||
    !Number.isSafeInteger(cover.height) ||
    cover.width <= 0 ||
    cover.height <= 0
  ) {
    throw new Error(
      'Public catalog cover dimensions must be positive integers',
    );
  }

  return Object.freeze({
    url: url.href,
    alt: cover.alt.trim(),
    width: cover.width,
    height: cover.height,
  });
}

/**
 * Projects the validated editorial catalog to its stable, public-only contract.
 * It intentionally omits generatedAt: identical source content must yield bytes
 * identical across builds, so deploy time is not part of this schema.
 */
export async function createPublicCatalog(
  catalog: Catalog,
  resolveCover: PublicCatalogCoverResolver,
): Promise<PublicCatalogDocument> {
  const publishedTaxonomies = Object.freeze(
    Object.fromEntries(
      taxonomyKinds.map((kind) => [
        kind,
        getPublishedTaxonomies(catalog, kind),
      ]),
    ) as Record<TaxonomyKind, readonly Taxonomy[]>,
  );
  const taxonomies = Object.freeze(
    Object.fromEntries(
      taxonomyKinds.map((kind) => [
        kind,
        Object.freeze(publishedTaxonomies[kind].map(toTaxonomy)),
      ]),
    ) as Record<TaxonomyKind, readonly PublicCatalogTaxonomy[]>,
  );

  const products = await Promise.all(
    getPublishedProducts(catalog).map(async (product) =>
      Object.freeze({
        id: product.id,
        name: product.name,
        summary: product.summary,
        url: getCanonicalUrl(routes.product(product.slug)),
        taxonomies: productTaxonomies(publishedTaxonomies, product),
        price: toPrice(product.price),
        cover: validateCover(await resolveCover(product.media.cover, product)),
        customization: toCustomization(product.customization),
      }),
    ),
  );

  return Object.freeze({
    schemaVersion: CATALOG_SCHEMA_VERSION,
    taxonomies,
    products: Object.freeze(products),
  });
}
