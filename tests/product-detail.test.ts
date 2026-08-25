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
    const gallery = readFileSync(
      'src/components/products/ProductGallery.astro',
      'utf8',
    );
    const galleryStyles = readFileSync(
      'src/components/products/product-gallery.css',
      'utf8',
    );
    const responsiveMedia = readFileSync(
      'src/components/catalog/ResponsiveMedia.astro',
      'utf8',
    );

    expect(page).toContain('getStaticPaths');
    expect(page).toContain('getPublishedProducts');
    expect(component).toContain('<Breadcrumb');
    expect(component).toContain('<h1>{product.name}</h1>');
    expect(component).toContain('routes.taxonomy');
    expect(component).toContain('<ProductGallery product={product} />');
    expect(component).toContain('data-analytics-view-item');
    expect(component).toContain('createProductAnalyticsData');
    expect(component).toContain('<ProductConversionPanel product={product} />');
    expect(component).toContain('<ProductPersonalization product={product} />');
    const relatedPage = readFileSync(
      'src/pages/productos/[slug].astro',
      'utf8',
    );
    const relatedComponent = readFileSync(
      'src/components/products/ProductRelated.astro',
      'utf8',
    );
    const relatedProjection = readFileSync(
      'src/components/products/product-related.ts',
      'utf8',
    );

    expect(relatedPage).toContain(
      '<ProductRelated catalog={catalog} product={product} />',
    );
    expect(relatedComponent).toContain(
      'projectRelatedProducts(catalog, product)',
    );
    expect(relatedComponent).toContain('itemsWithMedia.length > 0');
    expect(relatedProjection).toContain('getRelatedProducts');
    expect(relatedProjection).toContain('limit = 4');
    expect(relatedProjection).toContain('getPublishedProducts');
    expect(gallery).toContain(
      '[product.media.cover, ...(product.media.gallery ?? [])]',
    );
    expect(gallery).toContain("loading={index === 0 ? 'eager' : 'lazy'}");
    expect(gallery).toContain("fetchPriority={index === 0 ? 'high' : 'auto'}");
    expect(gallery).toContain('alternatives.length > 0');
    expect(gallery).toContain('<dialog');
    expect(gallery).toContain('lightbox.showModal()');
    expect(gallery).toContain("event.key === 'ArrowLeft'");
    expect(gallery).toContain('[data-lightbox-zoom-in]');
    expect(gallery).toContain("'pointermove'");
    expect(gallery).toContain("'wheel'");
    expect(gallery).toContain('data-lightbox-thumbnail');
    expect(gallery).toContain('product-gallery__lightbox-viewer--single');
    expect(gallery).toContain('maximumScale = 5');
    expect(gallery).toContain('fitImageToViewport');
    expect(gallery).toContain('viewportWidth / intrinsicWidth');
    expect(gallery).toContain('translate(-50%, -50%)');
    expect(gallery).toContain(
      "lightboxImage.addEventListener('load', resetTransform)",
    );
    expect(gallery).toContain('aria-live="polite"');
    expect(galleryStyles).toContain('block-size: 100dvh');
    expect(galleryStyles).toContain(
      '.product-gallery__lightbox-viewer--single',
    );
    expect(galleryStyles).toContain('touch-action: none');
    expect(galleryStyles).toContain('@media (max-width: 39.99rem)');
    expect(responsiveMedia).toContain('width={media.width}');
    expect(responsiveMedia).toContain('height={media.height}');
    expect(responsiveMedia).toContain('fetchpriority={fetchPriority}');
    const conversion = readFileSync(
      'src/components/products/ProductConversionPanel.astro',
      'utf8',
    );
    const conversionStyles = readFileSync(
      'src/components/products/product-conversion-panel.css',
      'utf8',
    );

    expect(conversion).toContain('buildProductWhatsAppUrl');
    expect(conversion).toContain(
      'getCanonicalUrl(routes.product(product.slug))',
    );
    expect(conversion).toContain('formatPriceLabel(product.price)');
    expect(conversion).toContain('Pedir por WhatsApp');
    expect(conversion).toContain('target="_blank"');
    expect(conversion).toContain('rel="noopener noreferrer"');
    expect(conversionStyles).toContain('@media (min-width: 48rem)');
    const personalization = readFileSync(
      'src/components/products/ProductPersonalization.astro',
      'utf8',
    );
    const personalizationStyles = readFileSync(
      'src/components/products/product-personalization.css',
      'utf8',
    );

    expect(personalization).toContain("customization.kind === 'available'");
    expect(personalization).toContain('customization.options.map');
    expect(personalization).toContain('trustAndWorkContent.trust.steps.map');
    expect(personalization).toContain('<ol>');
    expect(personalizationStyles).toContain('counter-reset: product-step');
    expect(`${component}\n${personalization}`).not.toContain('FAQ');
    expect(
      `${page}\n${component}\n${gallery}\n${conversion}\n${personalization}\n${relatedPage}\n${relatedComponent}`,
    ).not.toContain('client:');
    expect(page).toContain('createProductJsonLd');
    expect(page).toContain('createBreadcrumbListJsonLd');
    expect(page).toContain('<JsonLd data={productJsonLd} />');
    expect(component).toContain('<Breadcrumb items={breadcrumbs} />');
  });
});
