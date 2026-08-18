import {
  getPublishedProducts,
  getPublishedTaxonomies,
} from '../../lib/catalog/domain/queries';
import { routes } from '../../lib/catalog/domain/routes';
import type {
  Catalog,
  PublishedProduct,
  TaxonomyKind,
} from '../../lib/catalog/domain/model';

export interface TaxonomyDiscoveryCard {
  readonly kind: TaxonomyKind;
  readonly number: string;
  readonly title: string;
  readonly description: string;
  readonly actionLabel: string;
  readonly href: string;
  readonly productName: string;
  readonly mediaSource: {
    readonly src: string;
    readonly alt: string;
  };
}

export interface TaxonomyDiscoveryProjection {
  readonly title: string;
  readonly intro: string;
  readonly cards: readonly TaxonomyDiscoveryCard[];
}

interface DiscoveryDefinition {
  readonly kind: TaxonomyKind;
  readonly number: string;
  readonly title: string;
  readonly actionLabel: string;
}

const cardDefinitions: readonly DiscoveryDefinition[] = [
  {
    kind: 'category',
    number: '01',
    title: 'Por tipo',
    actionLabel: 'Ver tipos',
  },
  {
    kind: 'occasion',
    number: '02',
    title: 'Por ocasión',
    actionLabel: 'Ver ocasiones',
  },
  {
    kind: 'recipient',
    number: '03',
    title: 'Para quién',
    actionLabel: 'Ver destinatarios',
  },
];

function hasPublishedTaxonomy(
  product: PublishedProduct,
  kind: TaxonomyKind,
  taxonomyIds: ReadonlySet<string>,
): boolean {
  const productTaxonomyIds =
    kind === 'category'
      ? product.categories
      : kind === 'occasion'
        ? (product.occasions ?? [])
        : (product.recipients ?? []);

  return productTaxonomyIds.some((taxonomyId) => taxonomyIds.has(taxonomyId));
}

function selectProductForDimension(
  catalog: Catalog,
  kind: TaxonomyKind,
  excludedProductIds: ReadonlySet<string>,
): PublishedProduct | undefined {
  const publishedTaxonomyIds = new Set(
    getPublishedTaxonomies(catalog, kind).map(({ id }) => id),
  );
  const candidates = getPublishedProducts(catalog).filter(
    (product) =>
      !excludedProductIds.has(product.id) &&
      hasPublishedTaxonomy(product, kind, publishedTaxonomyIds),
  );

  return (
    candidates.find((product) => product.featured === true) ?? candidates[0]
  );
}

function describeDimension(catalog: Catalog, kind: TaxonomyKind): string {
  const names = getPublishedTaxonomies(catalog, kind)
    .map(({ name }) => name)
    .slice(0, 3);

  return `${new Intl.ListFormat('es', {
    style: 'long',
    type: 'conjunction',
  }).format(names)} y más.`;
}

export function projectTaxonomyDiscovery(
  catalog: Catalog,
): TaxonomyDiscoveryProjection | undefined {
  const selectedProductIds = new Set<string>();
  const cards = cardDefinitions.flatMap((definition) => {
    const product = selectProductForDimension(
      catalog,
      definition.kind,
      selectedProductIds,
    );

    if (product === undefined) return [];

    selectedProductIds.add(product.id);
    return [
      {
        ...definition,
        description: describeDimension(catalog, definition.kind),
        href: routes.taxonomyIndex(definition.kind),
        productName: product.name,
        mediaSource: {
          src: product.media.cover.src,
          alt: product.media.cover.alt,
        },
      },
    ];
  });

  return cards.length === cardDefinitions.length
    ? {
        title: 'Encuentra el regalo perfecto',
        intro:
          'Explora por tipo, ocasión o destinatario y encuentra la opción ideal.',
        cards,
      }
    : undefined;
}
