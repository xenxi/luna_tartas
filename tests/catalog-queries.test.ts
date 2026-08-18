import { describe, expect, it } from 'vitest';
import type {
  Catalog,
  PublishedProduct,
  Taxonomy,
} from '../src/lib/catalog/domain/model';
import {
  findPublishedProductById,
  findPublishedProductBySlug,
  findPublishedTaxonomyBySlug,
  getFeaturedProducts,
  getProductsForTaxonomy,
  getPublishedProducts,
  getPublishedTaxonomies,
  getRelatedProducts,
} from '../src/lib/catalog/domain/queries';
import { projectTaxonomyDiscovery } from '../src/components/home/taxonomy-discovery';
import {
  formatPriceLabel,
  projectFeaturedProducts,
} from '../src/components/home/featured-products';

const taxonomy = (
  id: string,
  kind: Taxonomy['kind'],
  order: number,
  status: Taxonomy['status'] = 'published',
): Taxonomy => ({
  kind,
  id,
  slug: id,
  name: id,
  summary: id,
  order,
  status,
});

const product = (
  id: string,
  order?: number,
  extra: Partial<PublishedProduct> = {},
): PublishedProduct => ({
  id,
  slug: id,
  status: 'published',
  name: id,
  summary: id,
  description: id,
  categories: ['cakes'],
  price: { kind: 'on_request' },
  media: {
    cover: {
      src: `${id}.jpg`,
      alt: `${id} cake`,
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
  ...(order === undefined ? {} : { order }),
  ...extra,
});

const catalog: Catalog = {
  categories: [
    taxonomy('cakes', 'category', 0),
    taxonomy('cookies', 'category', 1, 'draft'),
  ],
  occasions: [taxonomy('birthday', 'occasion', 0)],
  recipients: [taxonomy('family', 'recipient', 0)],
  products: [
    product('second', 1, { occasions: ['birthday'] }),
    product('first', 1, {
      featured: true,
      occasions: ['birthday'],
      recipients: ['family'],
    }),
    { id: 'draft', slug: 'draft', status: 'draft' },
  ],
};

describe('catalog queries', () => {
  it('filters drafts and applies stable order tie-breaks', () => {
    expect(getPublishedProducts(catalog).map(({ id }) => id)).toEqual([
      'first',
      'second',
    ]);
    expect(getFeaturedProducts(catalog).map(({ id }) => id)).toEqual(['first']);
  });

  it('looks up only published entities and groups products by taxonomy', () => {
    expect(findPublishedProductBySlug(catalog, 'draft')).toBeUndefined();
    expect(findPublishedProductById(catalog, 'first')?.name).toBe('first');
    expect(
      findPublishedTaxonomyBySlug(catalog, 'category', 'cookies'),
    ).toBeUndefined();
    expect(
      getPublishedTaxonomies(catalog, 'category').map(({ id }) => id),
    ).toEqual(['cakes']);
    expect(
      getProductsForTaxonomy(catalog, 'occasion', 'birthday').map(
        ({ id }) => id,
      ),
    ).toEqual(['first', 'second']);
  });

  it('returns related products without the current product or drafts', () => {
    expect(getRelatedProducts(catalog, 'first').map(({ id }) => id)).toEqual([
      'second',
    ]);
    expect(getRelatedProducts(catalog, 'draft')).toEqual([]);
  });

  it('scores shared taxonomies before editorial order and respects the limit', () => {
    const products = [
      product('one', 30, { occasions: ['birthday'] }),
      product('two', 10, { occasions: ['birthday'], recipients: ['family'] }),
      product('three', 0, { recipients: ['family'] }),
      product('unrelated', 0, { categories: ['other'] }),
    ];
    const source = { ...catalog, products };

    expect(getRelatedProducts(source, 'one', 2).map(({ id }) => id)).toEqual([
      'two',
      'three',
    ]);
    expect(getRelatedProducts(source, 'one', 0)).toEqual([]);
    expect(() => getRelatedProducts(source, 'one', -1)).toThrow(
      'non-negative safe integer',
    );
  });

  it('projects three distinct discovery cards from real published products', () => {
    const discovery = projectTaxonomyDiscovery({
      ...catalog,
      products: [
        ...catalog.products,
        product('recipient-choice', 2, {
          categories: ['other'],
          recipients: ['family'],
        }),
      ],
    });

    expect(
      discovery?.cards.map(({ number, href, productName, mediaSource }) => ({
        number,
        href,
        productName,
        mediaSource,
      })),
    ).toEqual([
      {
        number: '01',
        href: '/categorias/',
        productName: 'first',
        mediaSource: { src: 'first.jpg', alt: 'first cake' },
      },
      {
        number: '02',
        href: '/ocasiones/',
        productName: 'second',
        mediaSource: { src: 'second.jpg', alt: 'second cake' },
      },
      {
        number: '03',
        href: '/regalos/',
        productName: 'recipient-choice',
        mediaSource: {
          src: 'recipient-choice.jpg',
          alt: 'recipient-choice cake',
        },
      },
    ]);
    expect(discovery?.intro).toBe(
      'Explora por tipo, ocasión o destinatario y encuentra la opción ideal.',
    );
    expect(discovery?.cards.map(({ description }) => description)).toEqual([
      'cakes y más.',
      'birthday y más.',
      'family y más.',
    ]);
  });

  it('prioritizes featured products, excludes drafts and keeps editorial ties stable', () => {
    const discovery = projectTaxonomyDiscovery({
      categories: [taxonomy('cakes', 'category', 0)],
      occasions: [taxonomy('birthday', 'occasion', 0)],
      recipients: [taxonomy('family', 'recipient', 0)],
      products: [
        product('type-featured', 20, { featured: true }),
        product('occasion-beta', 10, {
          categories: ['unpublished-category'],
          occasions: ['birthday'],
          featured: true,
        }),
        product('occasion-alpha', 10, {
          categories: ['unpublished-category'],
          occasions: ['birthday'],
          featured: true,
        }),
        product('recipient-fallback', 0, {
          categories: ['unpublished-category'],
          recipients: ['family'],
        }),
        { id: 'draft-featured', slug: 'draft-featured', status: 'draft' },
      ],
    });

    expect(discovery?.cards.map(({ productName }) => productName)).toEqual([
      'type-featured',
      'occasion-alpha',
      'recipient-fallback',
    ]);
  });

  it('omits discovery instead of repeating a product as filler', () => {
    const discovery = projectTaxonomyDiscovery({
      categories: [taxonomy('cakes', 'category', 0)],
      occasions: [taxonomy('birthday', 'occasion', 0)],
      recipients: [taxonomy('family', 'recipient', 0)],
      products: [
        product('only-product', 0, {
          occasions: ['birthday'],
          recipients: ['family'],
        }),
      ],
    });

    expect(discovery).toBeUndefined();
  });

  it('projects only featured products and preserves every public price variant', () => {
    const featured = projectFeaturedProducts({
      ...catalog,
      products: [
        product('fixed', 0, {
          featured: true,
          price: { kind: 'fixed', amountMinor: 3000, currency: 'EUR' },
        }),
        product('from', 1, {
          featured: true,
          price: { kind: 'from', amountMinor: 3050, currency: 'EUR' },
        }),
        product('request', 2, {
          featured: true,
          price: { kind: 'on_request' },
        }),
        product('not-featured', 3),
        { id: 'draft', slug: 'draft', status: 'draft' },
      ],
    });

    expect(
      featured.items.map(({ href, priceLabel }) => ({ href, priceLabel })),
    ).toEqual([
      { href: '/productos/fixed/', priceLabel: `30,00\u00a0€` },
      { href: '/productos/from/', priceLabel: `Desde 30,50\u00a0€` },
      { href: '/productos/request/', priceLabel: 'Consultar precio' },
    ]);
    expect(formatPriceLabel({ kind: 'on_request' })).toBe('Consultar precio');
  });
});
