import type { TaxonomyKind } from './model';

const taxonomyBases: Record<TaxonomyKind, string> = {
  category: 'categorias',
  occasion: 'ocasiones',
  recipient: 'regalos',
};

function segment(value: string, field: string): string {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
    throw new Error(`${field} must be a lowercase kebab-case URL segment`);
  }
  return value;
}

function withTrailingSlash(path: string): string {
  return `${path}/`;
}

export const routes = {
  home: (): string => '/',
  about: (): string => '/sobre-luna/',
  contact: (): string => '/contacto/',
  shipping: (): string => '/envios-y-entregas/',
  faq: (): string => '/preguntas-frecuentes/',
  underConstruction: (): string => '/en-construccion/',
  products: (): string => '/productos/',
  search: (): string => '/buscar/',
  favorites: (): string => '/favoritos/',
  product: (slug: string): string =>
    withTrailingSlash(`/productos/${segment(slug, 'Product slug')}`),
  taxonomyIndex: (kind: TaxonomyKind): string =>
    withTrailingSlash(`/${taxonomyBases[kind]}`),
  taxonomy: (kind: TaxonomyKind, slug: string): string =>
    withTrailingSlash(
      `/${taxonomyBases[kind]}/${segment(slug, 'Taxonomy slug')}`,
    ),
  catalogJson: (): string => '/catalog.json',
} as const;

export function taxonomyBase(kind: TaxonomyKind): string {
  return taxonomyBases[kind];
}
