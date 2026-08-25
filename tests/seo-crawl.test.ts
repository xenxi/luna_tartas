import { describe, expect, it } from 'vitest';
import {
  createRobotsTxt,
  createSitemapXml,
  getIndexablePaths,
} from '../src/lib/seo/crawl';
import type {
  Catalog,
  PublishedProduct,
  Taxonomy,
} from '../src/lib/catalog/domain/model';

const publishedProduct: PublishedProduct = {
  id: 'published-product',
  slug: 'published-product',
  status: 'published',
  name: 'Published product',
  summary: 'Published summary',
  description: 'Published description',
  categories: ['filled-category'],
  price: { kind: 'on_request' },
  media: {
    cover: {
      src: 'product.jpg',
      alt: 'Published product image',
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
    approvedBy: 'owner',
    approvedAt: '2026-01-01',
  },
};

const taxonomy = (
  id: string,
  kind: Taxonomy['kind'],
  status: Taxonomy['status'] = 'published',
): Taxonomy => ({
  id,
  kind,
  slug: id,
  name: id,
  summary: `${id} summary`,
  status,
  order: 1,
});

describe('crawl projection', () => {
  it('includes only public routes with useful content', () => {
    const catalog: Catalog = {
      categories: [
        taxonomy('filled-category', 'category'),
        taxonomy('empty-category', 'category'),
      ],
      occasions: [taxonomy('draft-occasion', 'occasion', 'draft')],
      recipients: [taxonomy('empty-recipient', 'recipient')],
      products: [
        publishedProduct,
        { id: 'draft-product', slug: 'draft-product', status: 'draft' },
      ],
    };

    expect(getIndexablePaths(catalog)).toEqual([
      '/',
      '/sobre-luna/',
      '/envios-y-entregas/',
      '/productos/',
      '/categorias/',
      '/ocasiones/',
      '/regalos/',
      '/productos/published-product/',
      '/categorias/filled-category/',
    ]);
  });

  it('serializes unique canonical HTTPS URLs and a sitemap reference for crawlers', () => {
    const sitemap = createSitemapXml(['/', '/productos/']);

    expect(sitemap).toContain('<loc>https://lunatartas.es/</loc>');
    expect(sitemap).toContain('<loc>https://lunatartas.es/productos/</loc>');
    expect(
      [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]),
    ).toEqual(['https://lunatartas.es/', 'https://lunatartas.es/productos/']);
    expect(createRobotsTxt()).toBe(
      'User-agent: *\nAllow: /\nSitemap: https://lunatartas.es/sitemap.xml\n',
    );
    expect(() => createSitemapXml(['/', '/'])).toThrow(
      'Sitemap paths must be unique',
    );
  });
});
