import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { createProductAnalyticsData } from '../src/lib/analytics/product';
import { trackSafely } from '../src/lib/analytics/instrumentation';
import type { PublishedProduct } from '../src/lib/catalog/domain/model';

const product: PublishedProduct = {
  id: 'sample-product',
  slug: 'sample-product',
  status: 'published',
  name: 'Producto de muestra',
  summary: 'Resumen',
  description: 'Descripción',
  categories: ['categoria-principal'],
  price: { kind: 'from', amountMinor: 1250, currency: 'EUR' },
  media: {
    cover: {
      src: 'sample.jpg',
      alt: 'Producto de muestra',
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
};

describe('view and selection instrumentation', () => {
  it('projects only public product context with optional price and list position', () => {
    expect(createProductAnalyticsData(product)).toEqual({
      productId: 'sample-product',
      productName: 'Producto de muestra',
      category: 'categoria-principal',
    });
  });

  it('keeps product instrumentation declarative and disabled analytics script conditional', () => {
    const card = readFileSync(
      'src/components/catalog/ProductCard.astro',
      'utf8',
    );
    const detail = readFileSync(
      'src/components/products/ProductDetail.astro',
      'utf8',
    );
    const instrumentation = readFileSync(
      'src/components/site/AnalyticsInstrumentation.astro',
      'utf8',
    );
    const actionLink = readFileSync(
      'src/components/ui/ActionLink.astro',
      'utf8',
    );
    const conversion = readFileSync(
      'src/components/products/ProductConversionPanel.astro',
      'utf8',
    );
    const footer = readFileSync('src/components/site/SiteFooter.astro', 'utf8');

    expect(card).not.toContain('data-analytics-select-item');
    expect(detail).toContain('data-analytics-view-item');
    expect(actionLink).toContain('data-analytics-contact-whatsapp');
    expect(conversion).toContain("event: 'contact_whatsapp'");
    expect(footer).toContain('data-analytics-contact-whatsapp');
    expect(instrumentation).toContain('siteConfig.analytics.enabled &&');
    expect(instrumentation).toContain('bindAnalyticsInstrumentation');
    expect(`${card}${detail}`).not.toContain('gtag');
  });

  it('swallows adapter failures so the native CTA remains usable', () => {
    expect(() =>
      trackSafely(
        {
          load: async () => false,
          track: () => {
            throw new Error('tracker unavailable');
          },
        },
        { name: 'contact_whatsapp' },
      ),
    ).not.toThrow();
  });
});
