import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type {
  Catalog,
  PublishedProduct,
} from '../src/lib/catalog/domain/model';
import { projectProductListing } from '../src/components/products/product-listing';

const product = (
  id: string,
  order: number,
  extra: Partial<PublishedProduct> = {},
): PublishedProduct => ({
  id,
  slug: id,
  status: 'published',
  name: id,
  summary: `${id} summary`,
  description: `${id} description`,
  categories: ['gifts'],
  price: { kind: 'on_request' },
  media: {
    cover: {
      src: `${id}.jpg`,
      alt: `${id} image`,
      rights: {
        owner: 'owner',
        licenseOrPermission: 'permission',
        evidence: 'evidence',
      },
    },
  },
  customization: { kind: 'none' },
  approval: {
    source: 'source',
    sourceDate: '2026-01-01',
    approvedBy: 'editor',
    approvedAt: '2026-01-01',
  },
  order,
  ...extra,
});

const emptyCatalog: Catalog = {
  categories: [],
  occasions: [],
  recipients: [],
  products: [],
};

describe('product index listing', () => {
  it('projects all published products in domain order and builds product routes', () => {
    const listing = projectProductListing({
      ...emptyCatalog,
      products: [
        product('second', 2),
        { id: 'draft', slug: 'draft', status: 'draft' },
        product('first', 1, {
          price: { kind: 'fixed', amountMinor: 3000, currency: 'EUR' },
        }),
      ],
    });

    expect(
      listing.items.map(({ href, name, priceLabel }) => ({
        href,
        name,
        priceLabel,
      })),
    ).toEqual([
      { href: '/productos/first/', name: 'first', priceLabel: '30,00\u00a0€' },
      {
        href: '/productos/second/',
        name: 'second',
        priceLabel: 'Consultar precio',
      },
    ]);
  });

  it('keeps the empty catalog out of the public module without client code', () => {
    const page = readFileSync('src/pages/productos/index.astro', 'utf8');
    const component = readFileSync(
      'src/components/products/ProductListing.astro',
      'utf8',
    );

    expect(projectProductListing(emptyCatalog).items).toEqual([]);
    expect(page.match(/<h1\b/g)).toHaveLength(1);
    expect(component).toContain('listing.items.length > 0');
    expect(component).toContain('<CardList');
    expect(component).toContain('<ProductCard');
    expect(component).not.toMatch(/Pronto podrás/i);
    expect(page).not.toContain('client:');
  });
});
