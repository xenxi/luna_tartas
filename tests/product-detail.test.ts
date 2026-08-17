import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type {
  Catalog,
  PublishedProduct,
} from '../src/lib/catalog/domain/model';
import { getPublishedProducts } from '../src/lib/catalog/domain/queries';
import { routes } from '../src/lib/catalog/domain/routes';
import { formatPriceLabel } from '../src/components/catalog/price';

const product = (
  id: string,
  status: 'draft' | 'published',
): PublishedProduct | { id: string; slug: string; status: 'draft' } =>
  status === 'published'
    ? {
        id,
        slug: id,
        status,
        name: `Product ${id}`,
        summary: `Summary ${id}`,
        description: `Description ${id}`,
        categories: ['category'],
        price: { kind: 'fixed', amountMinor: 250, currency: 'EUR' },
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
      }
    : { id, slug: id, status };

describe('product detail route', () => {
  it('creates product paths only for published products', () => {
    const catalog = {
      categories: [],
      occasions: [],
      recipients: [],
      products: [
        product('published-product', 'published'),
        product('draft-product', 'draft'),
      ],
    } as Catalog;

    expect(
      getPublishedProducts(catalog).map((item) => routes.product(item.slug)),
    ).toEqual(['/productos/published-product/']);
    expect(routes.product('missing-product')).not.toBe(
      '/productos/draft-product/',
    );
  });

  it.each([
    [{ kind: 'fixed', amountMinor: 250, currency: 'EUR' }, '2,50 €'],
    [{ kind: 'from', amountMinor: 250, currency: 'EUR' }, 'Desde 2,50 €'],
    [{ kind: 'on_request' }, 'Consultar precio'],
  ] as const)('keeps price semantics honest: %j', (price, label) => {
    expect(formatPriceLabel(price)).toBe(label);
  });

  it('uses a static semantic detail page without advancing later concerns', () => {
    const page = readFileSync('src/pages/productos/[slug].astro', 'utf8');
    const component = readFileSync(
      'src/components/products/ProductDetail.astro',
      'utf8',
    );

    expect(page).toContain('getStaticPaths');
    expect(page).toContain('getPublishedProducts');
    expect(component).toContain('<Breadcrumb');
    expect(component).toContain('<h1>{product.name}</h1>');
    expect(component).toContain('formatPriceLabel');
    expect(component).toContain('routes.taxonomy');
    expect(`${page}\n${component}`).not.toContain('client:');
    expect(`${page}\n${component}`).not.toContain('ProductJsonLd');
    expect(`${page}\n${component}`).not.toContain('buildProductWhatsAppUrl');
  });
});
