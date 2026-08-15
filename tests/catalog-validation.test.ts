import { describe, expect, it } from 'vitest';
import type {
  Catalog,
  PublishedProduct,
  Taxonomy,
  TaxonomyKind,
} from '../src/lib/catalog/domain/model';
import {
  assertValidCatalog,
  CatalogValidationError,
  collectCatalogIssues,
} from '../src/lib/catalog/domain/validation';

function taxonomy(
  kind: TaxonomyKind,
  id: string,
  status: Taxonomy['status'] = 'published',
): Taxonomy {
  return {
    kind,
    id,
    slug: id,
    name: `Name ${id}`,
    summary: `Summary ${id}`,
    status,
    order: 0,
  };
}

function publishedProduct(
  overrides: Partial<PublishedProduct> = {},
): PublishedProduct {
  return {
    id: 'product-one',
    slug: 'product-one',
    status: 'published',
    name: 'Product one',
    summary: 'An approved summary',
    description: 'An approved description',
    categories: ['cakes'],
    occasions: ['birthdays'],
    recipients: ['families'],
    price: { kind: 'fixed', amountMinor: 2500, currency: 'EUR' },
    media: {
      cover: {
        src: 'products/product-one.svg',
        alt: 'Decorated celebration cake',
        rights: {
          owner: 'Photographer',
          licenseOrPermission: 'Written permission',
          evidence: 'Approval record 2026-08-15',
        },
      },
    },
    customization: { kind: 'none' },
    approval: {
      source: 'Approved catalog sheet',
      sourceDate: '2026-08-15',
      approvedBy: 'Catalog owner',
      approvedAt: '2026-08-15',
    },
    ...overrides,
  };
}

function validCatalog(product = publishedProduct()): Catalog {
  return {
    categories: [taxonomy('category', 'cakes')],
    occasions: [taxonomy('occasion', 'birthdays')],
    recipients: [taxonomy('recipient', 'families')],
    products: [product],
  };
}

describe('aggregate catalog validation', () => {
  it('accepts coherent identities, relationships, publication and currency', () => {
    expect(() => assertValidCatalog(validCatalog(), ['EUR'])).not.toThrow();
  });

  it.each([
    ['categories', 'duplicate-id'],
    ['products', 'duplicate-id'],
  ] as const)('rejects duplicate IDs in %s', (collection, code) => {
    const catalog = validCatalog();
    const duplicated = {
      ...catalog,
      [collection]: [...catalog[collection], catalog[collection][0]],
    };
    expect(collectCatalogIssues(duplicated, ['EUR'])).toEqual(
      expect.arrayContaining([expect.objectContaining({ code, field: 'id' })]),
    );
  });

  it('rejects duplicate slugs and invalid domain IDs/slugs independently', () => {
    const catalog = validCatalog();
    const issues = collectCatalogIssues(
      {
        ...catalog,
        categories: [
          catalog.categories[0],
          { ...taxonomy('category', 'other'), slug: 'cakes' },
        ],
        products: [{ ...catalog.products[0], id: 'Bad_ID', slug: 'Bad Slug' }],
      },
      ['EUR'],
    );
    expect(issues.map(({ code }) => code)).toEqual(
      expect.arrayContaining(['duplicate-slug', 'invalid-id', 'invalid-slug']),
    );
  });

  it('checks missing, duplicate and non-publicable relationship targets', () => {
    const catalog = validCatalog(
      publishedProduct({
        categories: ['cakes', 'cakes'],
        occasions: ['unknown-occasion'],
        recipients: ['families'],
      }),
    );
    const issues = collectCatalogIssues(
      {
        ...catalog,
        recipients: [taxonomy('recipient', 'families', 'draft')],
      },
      ['EUR'],
    );
    expect(issues.map(({ code }) => code)).toEqual(
      expect.arrayContaining([
        'duplicate-reference',
        'missing-reference',
        'unpublished-reference',
      ]),
    );
  });

  it('allows a draft product to reference an existing draft taxonomy', () => {
    const catalog: Catalog = {
      categories: [taxonomy('category', 'work-in-progress', 'draft')],
      occasions: [],
      recipients: [],
      products: [
        {
          id: 'draft-product',
          slug: 'draft-product',
          status: 'draft',
          categories: ['work-in-progress'],
        },
      ],
    };
    expect(collectCatalogIssues(catalog, ['EUR'])).toEqual([]);
  });

  it('keeps TBD placeholders out of published taxonomy copy', () => {
    const catalog = validCatalog();
    const issues = collectCatalogIssues(
      {
        ...catalog,
        categories: [{ ...catalog.categories[0], summary: 'TBD' }],
      },
      ['EUR'],
    );
    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'invalid-publication',
          entity: 'categories/cakes',
          field: 'summary',
        }),
      ]),
    );
  });

  it('enforces meaningful cover/gallery alt, rights and publication blocks', () => {
    const product = publishedProduct({
      media: {
        cover: {
          ...publishedProduct().media.cover,
          alt: 'product one',
          rights: {
            ...publishedProduct().media.cover.rights,
            evidence: 'TBD',
          },
        },
        gallery: [
          {
            ...publishedProduct().media.cover,
            alt: 'TBD',
          },
        ],
      },
      approval: {
        ...publishedProduct().approval,
        approvedBy: 'TBD',
      },
    });
    const issues = collectCatalogIssues(validCatalog(product), ['EUR']);
    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'invalid-alt' }),
        expect.objectContaining({
          code: 'invalid-publication',
          field: 'media.cover.rights',
        }),
        expect.objectContaining({
          code: 'invalid-publication',
          field: 'approval',
        }),
      ]),
    );
  });

  it.each([
    [{ kind: 'fixed', amountMinor: 0, currency: 'EUR' }, 'invalid-price'],
    [
      { kind: 'from', amountMinor: 1000, currency: 'USD' },
      'unsupported-currency',
    ],
  ] as const)('rejects incoherent priced variants', (price, code) => {
    const issues = collectCatalogIssues(
      validCatalog(publishedProduct({ price })),
      ['EUR'],
    );
    expect(issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ code })]),
    );
  });

  it('accepts on_request without inventing amount or currency', () => {
    expect(
      collectCatalogIssues(
        validCatalog(publishedProduct({ price: { kind: 'on_request' } })),
        ['EUR'],
      ),
    ).toEqual([]);
  });

  it('aggregates multiple actionable failures in one error', () => {
    const catalog = validCatalog(
      publishedProduct({
        categories: ['missing'],
        price: { kind: 'fixed', amountMinor: 1, currency: 'USD' },
      }),
    );
    expect(() => assertValidCatalog(catalog, ['EUR'])).toThrowError(
      expect.objectContaining({
        name: 'CatalogValidationError',
        issues: expect.arrayContaining([
          expect.objectContaining({ code: 'missing-reference' }),
          expect.objectContaining({ code: 'unsupported-currency' }),
        ]),
        message: expect.stringMatching(
          /products\/product-one:categories[\s\S]*products\/product-one:price.currency/,
        ),
      }),
    );
    expect(CatalogValidationError).toBeTypeOf('function');
  });
});
