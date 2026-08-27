import { describe, expect, it } from 'vitest';
import { productSchema } from '../src/content/schemas/product';
import {
  taxonomySchema,
  type TaxonomyData,
} from '../src/content/schemas/taxonomy';
import type { Product } from '../src/lib/catalog/domain/model';
import type {
  CatalogSourceDto,
  ProductSourceDocument,
  SourceDocument,
  TaxonomySourceDocument,
} from '../src/lib/catalog/source/dto';
import { CatalogSourceError } from '../src/lib/catalog/source/errors';
import {
  mapCatalogSource,
  mapProduct,
  mapTaxonomy,
} from '../src/lib/catalog/source/mapper';
import { readYamlFixture } from './helpers/yaml-fixtures';

function taxonomyDocument<
  Collection extends TaxonomySourceDocument['collection'],
>(
  collection: Collection,
  fixture: 'category.yml' | 'occasion.yaml' | 'recipient.yml' = 'category.yml',
): SourceDocument<Collection, TaxonomyData> {
  const data = taxonomySchema.parse(
    readYamlFixture(`taxonomies/valid/${fixture}`),
  );
  return {
    collection,
    id: data.id,
    filePath: `src/content/${collection}/${fixture}`,
    data,
  };
}

function productDocument(fixture: string): ProductSourceDocument {
  const data = productSchema.parse(
    readYamlFixture(`products/valid/${fixture}`),
  );
  return {
    collection: 'products',
    id: data.id,
    filePath: `src/content/products/${fixture}`,
    data,
  };
}

function publishedProductDocument(): ProductSourceDocument {
  const draft = structuredClone(
    readYamlFixture('products/valid/draft-fixed.yml'),
  ) as Record<string, unknown>;
  const { context: _context, ...published } = draft;
  const media = published.media as Record<string, unknown>;
  const cover = media.cover as Record<string, unknown>;
  const gallery = media.gallery as Record<string, unknown>[];
  cover.category = {
    ...structuredClone(cover),
    src: 'products/fixture-category.svg',
    alt: 'Category-specific fixture image',
  };
  gallery[0] = { ...gallery[0], rights: structuredClone(cover.rights) };
  const data = productSchema.parse({ ...published, status: 'published' });

  return {
    collection: 'products',
    id: data.id,
    filePath: 'src/content/products/published.yml',
    data,
  };
}

describe('catalog source mapping', () => {
  it.each([
    ['categories', 'category.yml', 'category'],
    ['occasions', 'occasion.yaml', 'occasion'],
    ['recipients', 'recipient.yml', 'recipient'],
  ] as const)(
    'maps %s to the explicit %s domain kind',
    (collection, fixture, expectedKind) => {
      const source = taxonomyDocument(collection, fixture);
      const mapped = mapTaxonomy(source);

      expect(mapped).toMatchObject({
        kind: expectedKind,
        id: source.data.id,
        slug: source.data.slug,
        seo: source.data.seo,
      });
      expect(mapped).not.toHaveProperty('context');
      expect(mapped).not.toBe(source.data);
    },
  );

  it.each([
    ['draft-fixed.yml', 'fixed', 12345],
    ['draft-from.yml', 'from', 5000],
    ['draft-on-request.yml', 'on_request', undefined],
  ])(
    'maps the %s price union without losing its discriminator',
    (fixture, kind, amountMinor) => {
      const mapped = mapProduct(productDocument(fixture));

      expect(mapped.price?.kind).toBe(kind);
      expect(
        mapped.price !== undefined && 'amountMinor' in mapped.price
          ? mapped.price.amountMinor
          : undefined,
      ).toBe(amountMinor);
    },
  );

  it('keeps an incomplete draft explicit and removes source-only context', () => {
    const mapped = mapProduct(productDocument('draft-minimal.yml'));

    expect(mapped).toEqual({
      id: 'fixture-product-minimal',
      slug: 'fixture-product-minimal',
      status: 'draft',
      name: undefined,
      summary: undefined,
      description: undefined,
      categories: undefined,
      occasions: undefined,
      recipients: undefined,
      price: undefined,
      media: undefined,
      customization: undefined,
      featured: undefined,
      order: undefined,
      seo: undefined,
      approval: undefined,
      inventory: { mode: 'made-to-order' },
    });
    expect(mapped).not.toHaveProperty('context');
  });

  it('maps archived as its own domain branch and preserves stock', () => {
    const data = productSchema.parse(
      readYamlFixture('products/valid/draft-minimal.yml'),
    );
    const archived = productSchema.parse({
      id: data.id,
      slug: data.slug,
      status: 'archived',
      inventory: { mode: 'stock', quantity: 7 },
    });
    const mapped = mapProduct({
      collection: 'products',
      id: archived.id,
      data: archived,
    });

    expect(mapped).toMatchObject({
      status: 'archived',
      inventory: { mode: 'stock', quantity: 7 },
    });
  });

  it('maps every required published block and copies nested arrays', () => {
    const source = publishedProductDocument();
    const mapped = mapProduct(source);

    expect(mapped.status).toBe('published');
    if (mapped.status !== 'published' || source.data.status !== 'published') {
      throw new Error('Expected published products');
    }
    expect(mapped.media.cover.rights).toEqual(source.data.media.cover.rights);
    expect(mapped.media.cover.rights).not.toBe(source.data.media.cover.rights);
    expect(mapped.media.cover.category).toEqual(
      source.data.media.cover.category,
    );
    expect(mapped.media.cover.category).not.toBe(
      source.data.media.cover.category,
    );
    expect(mapped.categories).not.toBe(source.data.categories);
    expect(mapped.customization).not.toBe(source.data.customization);
    expect(mapped.approval).not.toBe(source.data.approval);
  });

  it('returns a domain catalog with no source document wrappers', () => {
    const category = taxonomyDocument('categories');
    const product = productDocument('draft-minimal.yml');
    const source: CatalogSourceDto = {
      categories: [category],
      occasions: [],
      recipients: [],
      products: [product],
    };

    const catalog = mapCatalogSource(source);

    expect(catalog.categories[0]).toMatchObject({ id: category.id });
    expect(catalog.products[0]).toMatchObject({ id: product.id });
    expect(catalog.categories[0]).not.toHaveProperty('data');
    expect(catalog.products[0]).not.toHaveProperty('filePath');
  });

  it('reports an ID mismatch with collection, file, entry and field', () => {
    const document = taxonomyDocument('categories');

    expect(() => mapTaxonomy({ ...document, id: 'different-id' })).toThrowError(
      expect.objectContaining({
        name: 'CatalogSourceError',
        message: expect.stringContaining(
          'src/content/categories/category.yml:id:',
        ),
        context: {
          collection: 'categories',
          entryId: 'different-id',
          filePath: 'src/content/categories/category.yml',
          field: 'id',
        },
      }),
    );
  });

  it('contextualizes an impossible source discriminator at the mapping boundary', () => {
    const document = productDocument('draft-fixed.yml');
    const invalidData = structuredClone(document.data) as unknown as Record<
      string,
      unknown
    >;
    invalidData.price = { kind: 'future-price' };

    expect(() =>
      mapProduct({
        ...document,
        data: invalidData,
      } as unknown as ProductSourceDocument),
    ).toThrowError(CatalogSourceError);

    try {
      mapProduct({
        ...document,
        data: invalidData,
      } as unknown as ProductSourceDocument);
    } catch (error) {
      expect(error).toMatchObject({
        message: expect.stringContaining(':price.kind:'),
        context: expect.objectContaining({
          collection: 'products',
          entryId: document.id,
          field: 'price.kind',
        }),
      });
    }
  });

  it('exposes readonly domain collections to consumers', () => {
    const catalog = mapCatalogSource({
      categories: [],
      occasions: [],
      recipients: [],
      products: [],
    });
    const products: readonly Product[] = catalog.products;

    expect(products).toEqual([]);
  });
});
