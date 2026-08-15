import { fileURLToPath } from 'node:url';
import { parseDocument } from 'yaml';
import { describe, expect, it } from 'vitest';
import { catalogConfig } from '../src/config/catalog';
import { productSchema } from '../src/content/schemas/product';
import {
  taxonomySchema,
  type TaxonomyData,
} from '../src/content/schemas/taxonomy';
import {
  getPublishedProducts,
  getPublishedTaxonomies,
} from '../src/lib/catalog/domain/queries';
import type {
  CatalogCollection,
  CatalogSourceDto,
  ProductSourceDocument,
  SourceDocument,
} from '../src/lib/catalog/source/dto';
import { loadCatalogSource } from '../src/lib/catalog/source/pipeline';

const fixtureFiles = import.meta.glob(
  './fixtures/catalog/content/**/*.{yml,yaml}',
  { eager: true, import: 'default', query: '?raw' },
) as Record<string, string>;

const assetRoot = fileURLToPath(
  new URL('./fixtures/catalog/assets/', import.meta.url),
);

function sourceFromFixtures(): CatalogSourceDto {
  const source: {
    categories: SourceDocument<'categories', TaxonomyData>[];
    occasions: SourceDocument<'occasions', TaxonomyData>[];
    recipients: SourceDocument<'recipients', TaxonomyData>[];
    products: ProductSourceDocument[];
  } = { categories: [], occasions: [], recipients: [], products: [] };

  for (const [filePath, yaml] of Object.entries(fixtureFiles)) {
    const match = filePath.match(
      /\/content\/(categories|occasions|recipients|products)\/[^/]+\.ya?ml$/,
    );
    if (match === null) throw new Error(`Unexpected fixture path: ${filePath}`);
    const collection = match[1] as CatalogCollection;
    const parsed = parseDocument(yaml);
    if (parsed.errors.length > 0) {
      throw new Error(`${filePath}: ${parsed.errors[0]?.message}`);
    }
    const data =
      collection === 'products'
        ? productSchema.parse(parsed.toJS())
        : taxonomySchema.parse(parsed.toJS());
    const document = { collection, id: data.id, filePath, data };

    if (collection === 'products') {
      source.products.push(document as ProductSourceDocument);
    } else if (collection === 'categories') {
      source.categories.push(
        document as SourceDocument<'categories', TaxonomyData>,
      );
    } else if (collection === 'occasions') {
      source.occasions.push(
        document as SourceDocument<'occasions', TaxonomyData>,
      );
    } else {
      source.recipients.push(
        document as SourceDocument<'recipients', TaxonomyData>,
      );
    }
  }
  return source;
}

function reverseSource(source: CatalogSourceDto): CatalogSourceDto {
  return {
    categories: [...source.categories].reverse(),
    occasions: [...source.occasions].reverse(),
    recipients: [...source.recipients].reverse(),
    products: [...source.products].reverse(),
  };
}

function expectDeepFrozen(value: unknown): void {
  if (value === null || typeof value !== 'object') return;
  expect(Object.isFrozen(value)).toBe(true);
  Object.values(value).forEach(expectDeepFrozen);
}

describe('representative non-production catalog pipeline', () => {
  it('loads schemas, mappings, relations, every price variant and real media', async () => {
    const catalog = await loadCatalogSource(sourceFromFixtures(), {
      allowedCurrencies: catalogConfig.allowedCurrencies,
      assetRoot,
    });

    expect(catalog).toMatchObject({
      categories: [{ id: 'fixture-celebration' }, { id: 'fixture-gift' }],
      occasions: [{ id: 'fixture-anniversary' }, { id: 'fixture-birthday' }],
      recipients: [{ id: 'fixture-family' }, { id: 'fixture-friends' }],
    });
    expect(catalog.products.map(({ id, price }) => [id, price?.kind])).toEqual([
      ['fixture-fixed', 'fixed'],
      ['fixture-from', 'from'],
      ['fixture-on-request', 'on_request'],
    ]);
    expect(catalog.products[0]).toMatchObject({
      categories: ['fixture-celebration', 'fixture-gift'],
      occasions: ['fixture-birthday', 'fixture-anniversary'],
      recipients: ['fixture-family', 'fixture-friends'],
      media: { gallery: [{ src: 'products/fixture-detail.svg' }] },
    });
    expect(
      catalog.products.every((product) => product.status === 'draft'),
    ).toBe(true);
    expect(catalog.products.every((product) => !('context' in product))).toBe(
      true,
    );
  });

  it('returns deeply immutable output in stable ID order', async () => {
    const options = {
      allowedCurrencies: catalogConfig.allowedCurrencies,
      assetRoot,
    };
    const source = sourceFromFixtures();
    const first = await loadCatalogSource(source, options);
    const second = await loadCatalogSource(reverseSource(source), options);

    expect(second).toEqual(first);
    expectDeepFrozen(first);
    expect(() =>
      (first.products as unknown as unknown[]).push({ id: 'mutation' }),
    ).toThrow(TypeError);
  });

  it('keeps every fixture and draft outside public queries', async () => {
    const catalog = await loadCatalogSource(sourceFromFixtures(), {
      allowedCurrencies: catalogConfig.allowedCurrencies,
      assetRoot,
    });

    expect(getPublishedProducts(catalog)).toEqual([]);
    expect(getPublishedTaxonomies(catalog, 'category')).toEqual([]);
    expect(getPublishedTaxonomies(catalog, 'occasion')).toEqual([]);
    expect(getPublishedTaxonomies(catalog, 'recipient')).toEqual([]);
  });
});
