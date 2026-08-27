import { describe, expect, it } from 'vitest';
import type {
  Catalog,
  PublishedProduct,
  Taxonomy,
} from '../src/lib/catalog/domain/model';
import {
  createPublicCatalog,
  type PublicCatalogCoverResolver,
} from '../src/lib/catalog/public-projection';

const coverResolver: PublicCatalogCoverResolver = (media) => ({
  url: `https://lunatartas.es/_astro/${media.src.replaceAll('/', '-')}.webp`,
  alt: media.alt,
  width: 960,
  height: 720,
});

const taxonomy = (id: string, kind: Taxonomy['kind']): Taxonomy => ({
  id,
  kind,
  slug: id,
  name: id,
  summary: `${id} summary`,
  status: 'published',
  order: 1,
});

const product = (price: PublishedProduct['price']): PublishedProduct => {
  const identity = price.kind.replace('_', '-');

  return {
    id: `product-${identity}`,
    slug: `product-${identity}`,
    status: 'published',
    name: `Product ${price.kind}`,
    summary: `Product ${price.kind} summary`,
    description: `Product ${price.kind} description`,
    categories: ['category'],
    occasions: ['occasion'],
    recipients: ['recipient'],
    price,
    media: {
      cover: {
        src: `${price.kind}.jpg`,
        alt: `${price.kind} image`,
        rights: {
          owner: 'owner',
          licenseOrPermission: 'permission',
          evidence: 'evidence',
        },
      },
    },
    customization:
      price.kind === 'on_request'
        ? { kind: 'none' }
        : {
            kind: 'available',
            options: ['Name'],
            description: 'Personalized text',
          },
    approval: {
      source: 'internal approval',
      sourceDate: '2026-01-01',
      approvedBy: 'owner',
      approvedAt: '2026-01-01',
    },
    inventory: { mode: 'stock', quantity: 3 },
  };
};

describe('public catalog projection', () => {
  it('is deterministic and keeps the catalog on its public surface only', async () => {
    const catalog: Catalog = {
      categories: [
        taxonomy('category', 'category'),
        { ...taxonomy('draft-category', 'category'), status: 'draft' },
      ],
      occasions: [taxonomy('occasion', 'occasion')],
      recipients: [taxonomy('recipient', 'recipient')],
      products: [
        product({ kind: 'fixed', amountMinor: 20, currency: 'EUR' }),
        { id: 'draft', slug: 'draft', status: 'draft' },
        { id: 'archived', slug: 'archived', status: 'archived' },
      ],
    };
    const [first, second] = await Promise.all([
      createPublicCatalog(catalog, coverResolver),
      createPublicCatalog(catalog, coverResolver),
    ]);
    const serialized = JSON.stringify(first);

    expect(JSON.stringify(second)).toBe(serialized);
    expect(first).toMatchObject({ schemaVersion: '1.0' });
    expect(first).not.toHaveProperty('generatedAt');
    expect(first.products.map((item) => item.id)).not.toContain('draft');
    expect(first.products.map((item) => item.id)).not.toContain('archived');
    expect(first.products).not.toHaveLength(0);
    expect(first.taxonomies.category.map((item) => item.id)).toEqual([
      'category',
    ]);
    expect(serialized).not.toMatch(
      /approval|rights|evidence|licenseOrPermission|gallery|status|inventory/i,
    );

    for (const item of first.products) {
      expect(item.url).toMatch(/^https:\/\/lunatartas\.es\/productos\/.+\/$/);
      expect(item.cover.url).toMatch(/^https:\/\/lunatartas\.es\/_astro\//);
      expect(item.cover).toMatchObject({ width: 960, height: 720 });
      expect(Object.keys(item.taxonomies)).toEqual([
        'category',
        'occasion',
        'recipient',
      ]);
    }
  });

  it('projects public relationships, exact decimal prices and customization variants', async () => {
    const catalog: Catalog = {
      categories: [taxonomy('category', 'category')],
      occasions: [taxonomy('occasion', 'occasion')],
      recipients: [taxonomy('recipient', 'recipient')],
      products: [
        product({ kind: 'fixed', amountMinor: 20, currency: 'EUR' }),
        product({ kind: 'from', amountMinor: 2000, currency: 'EUR' }),
        product({ kind: 'on_request' }),
        { id: 'draft', slug: 'draft', status: 'draft' },
      ],
    };

    const document = await createPublicCatalog(catalog, coverResolver);

    expect(document.products).toMatchObject([
      {
        id: 'product-fixed',
        price: { kind: 'fixed', amount: '0.20', currency: 'EUR' },
        customization: {
          kind: 'available',
          options: ['Name'],
          description: 'Personalized text',
        },
        taxonomies: {
          category: [
            {
              id: 'category',
              url: 'https://lunatartas.es/categorias/category/',
            },
          ],
        },
      },
      {
        id: 'product-from',
        price: { kind: 'from', amount: '20.00', currency: 'EUR' },
      },
      {
        id: 'product-on-request',
        price: { kind: 'on_request' },
        customization: { kind: 'none' },
      },
    ]);
    expect(document.products.map((item) => item.id)).not.toContain('draft');
  });

  it('rejects covers that cannot be published on the configured origin', async () => {
    const catalog: Catalog = {
      categories: [taxonomy('category', 'category')],
      occasions: [taxonomy('occasion', 'occasion')],
      recipients: [taxonomy('recipient', 'recipient')],
      products: [product({ kind: 'on_request' })],
    };

    await expect(
      createPublicCatalog(catalog, (media, publishedProduct) => ({
        ...coverResolver(media, publishedProduct),
        url: 'https://example.com/image.webp',
      })),
    ).rejects.toThrow(
      'Public catalog cover URL must use the configured HTTPS origin',
    );
  });
});
