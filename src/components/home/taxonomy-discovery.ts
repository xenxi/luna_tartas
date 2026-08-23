import { getPublishedTaxonomies } from '../../lib/catalog/domain/queries';
import { routes } from '../../lib/catalog/domain/routes';
import type { Catalog, TaxonomyKind } from '../../lib/catalog/domain/model';

export interface TaxonomyDiscoveryCard {
  readonly kind: TaxonomyKind;
  readonly number: string;
  readonly title: string;
  readonly description: string;
  readonly actionLabel: string;
  readonly href: string;
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
  const cards = cardDefinitions.flatMap((definition) => {
    if (getPublishedTaxonomies(catalog, definition.kind).length === 0) {
      return [];
    }

    return [
      {
        ...definition,
        description: describeDimension(catalog, definition.kind),
        href: routes.taxonomyIndex(definition.kind),
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
