import { discoveryContent } from '../../content/home/discovery';
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

const cardDefinitions = discoveryContent.cards;

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
        href: routes.taxonomyIndex(definition.kind),
      },
    ];
  });

  return cards.length === cardDefinitions.length
    ? {
        title: discoveryContent.title,
        intro: discoveryContent.intro,
        cards,
      }
    : undefined;
}
