import type {
  PublicCatalogDocument,
  PublicCatalogProduct,
  PublicCatalogTaxonomy,
} from '../catalog/public-projection';
import type { TaxonomyKind } from '../catalog/domain/model';
import { normalizeQuery } from './normalize-query';
import type { SearchEntry, SearchField, SearchIndex } from './types';

const taxonomyKinds: readonly TaxonomyKind[] = [
  'category',
  'occasion',
  'recipient',
];

function field(value: string | undefined, weight: number): SearchField | null {
  if (value === undefined || value.trim() === '') return null;
  return { value, normalized: normalizeQuery(value), weight };
}

function definedFields(
  values: readonly (SearchField | null)[],
): readonly SearchField[] {
  return values.filter((value): value is SearchField => value !== null);
}

function taxonomyFields(
  taxonomy: PublicCatalogTaxonomy,
): readonly SearchField[] {
  return definedFields([
    field(taxonomy.name, 100),
    field(taxonomy.summary, 28),
  ]);
}

function taxonomyText(
  product: PublicCatalogProduct,
  kind: TaxonomyKind,
): string | undefined {
  const values = product.taxonomies[kind].flatMap((taxonomy) => [
    taxonomy.name,
    taxonomy.summary,
  ]);
  return values.length === 0 ? undefined : values.join(' ');
}

function productFields(product: PublicCatalogProduct): readonly SearchField[] {
  const customization =
    product.customization.kind === 'available'
      ? [
          ...(product.customization.options ?? []),
          product.customization.description ?? '',
        ].join(' ')
      : undefined;

  return definedFields([
    field(product.name, 120),
    field(taxonomyText(product, 'category'), 72),
    field(taxonomyText(product, 'occasion'), 68),
    field(taxonomyText(product, 'recipient'), 64),
    field(product.summary, 38),
    field(customization, 24),
    field(product.id.replaceAll('-', ' '), 10),
  ]);
}

export function createSearchIndex(catalog: PublicCatalogDocument): SearchIndex {
  const entries: SearchEntry[] = catalog.products.map((product) => ({
    key: `product:${product.id}`,
    kind: 'product',
    id: product.id,
    name: product.name,
    summary: product.summary,
    url: product.url,
    normalizedName: normalizeQuery(product.name),
    fields: productFields(product),
    product,
  }));

  for (const kind of taxonomyKinds) {
    entries.push(
      ...catalog.taxonomies[kind].map((taxonomy) => ({
        key: `${kind}:${taxonomy.id}`,
        kind,
        id: taxonomy.id,
        name: taxonomy.name,
        summary: taxonomy.summary,
        url: taxonomy.url,
        normalizedName: normalizeQuery(taxonomy.name),
        fields: taxonomyFields(taxonomy),
        taxonomy,
      })),
    );
  }

  return Object.freeze({ entries: Object.freeze(entries) });
}
