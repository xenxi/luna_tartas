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
  readonly emptyMessage: string;
  readonly items: readonly TaxonomyCardProjection[];
}

const sectionDefinitions: readonly Omit<TaxonomyDiscoverySection, 'items'>[] = [
  {
    kind: 'category',
    id: 'discover-categories',
    title: 'Explora por tipo',
    intro: 'Encuentra una creación que encaje con lo que imaginas.',
    emptyMessage: 'Pronto podrás explorar nuestras categorías.',
  },
  {
    kind: 'occasion',
    id: 'discover-occasions',
    title: 'Elige una ocasión',
    intro: 'Un punto de partida para celebrar cada momento.',
    emptyMessage: 'Pronto podrás explorar nuestras ocasiones.',
  },
  {
    kind: 'recipient',
    id: 'discover-recipients',
    title: 'Piensa en quién lo recibe',
    intro: 'Ideas para encontrar un regalo con intención.',
    emptyMessage: 'Pronto podrás explorar regalos para cada persona.',
  },
];

export function projectTaxonomyDiscovery(
  catalog: Catalog,
): readonly TaxonomyDiscoverySection[] {
  return sectionDefinitions.map((section) => ({
    ...section,
    items: getPublishedTaxonomies(catalog, section.kind).map((taxonomy) => ({
      href: routes.taxonomy(section.kind, taxonomy.slug),
      name: taxonomy.name,
      summary: taxonomy.summary,
      itemCountLabel: `${getProductsForTaxonomy(catalog, section.kind, taxonomy.id).length} ideas`,
    })),
  }));
}
