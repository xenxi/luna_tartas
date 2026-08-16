import {
  getProductsForTaxonomy,
  getPublishedTaxonomies,
} from '../../lib/catalog/domain/queries';
import { routes } from '../../lib/catalog/domain/routes';
import type { Catalog, TaxonomyKind } from '../../lib/catalog/domain/model';
import type { TaxonomyCardProjection } from '../catalog/types';

export interface TaxonomyDiscoverySection {
  readonly kind: TaxonomyKind;
  readonly id: string;
  readonly title: string;
  readonly intro: string;
  readonly items: readonly TaxonomyCardProjection[];
}

const sectionDefinitions: readonly Omit<TaxonomyDiscoverySection, 'items'>[] = [
  {
    kind: 'category',
    id: 'discover-categories',
    title: 'Explora por tipo',
    intro: 'Encuentra una creación que encaje con lo que imaginas.',
  },
  {
    kind: 'occasion',
    id: 'discover-occasions',
    title: 'Elige una ocasión',
    intro: 'Un punto de partida para celebrar cada momento.',
  },
  {
    kind: 'recipient',
    id: 'discover-recipients',
    title: 'Piensa en quién lo recibe',
    intro: 'Ideas para encontrar un regalo con intención.',
  },
];

export function projectTaxonomyDiscovery(
  catalog: Catalog,
): readonly TaxonomyDiscoverySection[] {
  return sectionDefinitions
    .map((section) => ({
      ...section,
      items: getPublishedTaxonomies(catalog, section.kind).flatMap(
        (taxonomy) => {
          const productCount = getProductsForTaxonomy(
            catalog,
            section.kind,
            taxonomy.id,
          ).length;

          return productCount > 0
            ? [
                {
                  href: routes.taxonomy(section.kind, taxonomy.slug),
                  name: taxonomy.name,
                  summary: taxonomy.summary,
                  itemCountLabel: `${productCount} ideas`,
                },
              ]
            : [];
        },
      ),
    }))
    .filter((section) => section.items.length > 0);
}
