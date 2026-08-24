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
  projectFeaturedProducts,
  selectFeaturedProductMosaic,
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

  it('projects one static-image card per published taxonomy dimension', () => {
    const discovery = projectTaxonomyDiscovery(catalog);

    expect(
      discovery?.cards.map(({ number, href, title }) => ({
        number,
        href,
        title,
      })),
    ).toEqual([
      { number: '01', href: '/categorias/', title: 'Por tipo' },
      { number: '02', href: '/ocasiones/', title: 'Por ocasión' },
      { number: '03', href: '/regalos/', title: 'Para quién' },
    ]);
    expect(discovery?.intro).toBe(
      'Explora por tipo, ocasión o destinatario y encuentra la opción ideal.',
    );
    expect(discovery?.cards.map(({ description }) => description)).toEqual([
      'Tartas de pañales, significado del nombre, láminas personalizadas y más detalles para decorar bonito.',
      'Cumpleaños, bautizo, comunión, invitaciones, recordatorios y detalles para tu evento.',
      'family y más.',
    ]);
  });

  it('does not project the section when a taxonomy dimension is unavailable', () => {
    const discovery = projectTaxonomyDiscovery({
      categories: [taxonomy('cakes', 'category', 0)],
      occasions: [taxonomy('birthday', 'occasion', 0)],
      recipients: [],
      products: catalog.products,
    });

    expect(discovery).toBeUndefined();
  });

  it('projects a five-product editorial mosaic with featured category coverage', () => {
    const featured = projectFeaturedProducts({
      ...catalog,
      categories: [
        taxonomy('cakes', 'category', 0),
        taxonomy('paper', 'category', 1),
        taxonomy('packs', 'category', 2),
        taxonomy('prints', 'category', 3),
      ],
      products: [
        product('cake', 0, {
          featured: true,
        }),
        product('paper', 1, {
          featured: true,
          categories: ['paper'],
        }),
        product('pack', 2, {
          featured: true,
          categories: ['packs', 'paper'],
        }),
        product('print', 3, {
          featured: true,
          categories: ['prints'],
        }),
        product('published-fallback', 4, { categories: ['paper'] }),
        { id: 'draft', slug: 'draft', status: 'draft' },
      ],
    });

    expect(featured).toMatchObject({
      eyebrow: 'INSPIRACIÓN QUE EMOCIONA',
      title: 'Ideas que emocionan',
      intro:
        'Regalos únicos y personalizados para cada historia, cada persona y cada ocasión.',
      action: { href: '/productos/', label: 'Ver más regalos' },
    });
    expect(featured?.items).toHaveLength(5);
    expect(featured?.items.map(({ href }) => href)).toEqual([
      '/productos/cake/',
      '/productos/paper/',
      '/productos/pack/',
      '/productos/print/',
      '/productos/published-fallback/',
    ]);
    expect(featured?.items.filter(({ primary }) => primary)).toHaveLength(1);

    const selected = selectFeaturedProductMosaic(
      {
        ...catalog,
        categories: [
          taxonomy('cakes', 'category', 0),
          taxonomy('paper', 'category', 1),
          taxonomy('packs', 'category', 2),
          taxonomy('prints', 'category', 3),
        ],
        products: [
          product('cake', 0, { featured: true }),
          product('paper', 1, { featured: true, categories: ['paper'] }),
          product('pack', 2, {
            featured: true,
            categories: ['packs', 'paper'],
          }),
          product('print', 3, { featured: true, categories: ['prints'] }),
          product('published-fallback', 4, { categories: ['paper'] }),
          { id: 'draft', slug: 'draft', status: 'draft' },
        ],
      },
      { rng: () => 0.5 },
    );
    expect(selected).toHaveLength(5);
    expect(selected.every(({ status }) => status === 'published')).toBe(true);
    expect(new Set(selected.flatMap(({ categories }) => categories))).toEqual(
      new Set(['cakes', 'paper', 'packs', 'prints']),
    );
    expect(selected.slice(0, 4).every(({ featured: value }) => value)).toBe(
      true,
    );
  });
});
