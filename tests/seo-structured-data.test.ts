import { describe, expect, it } from 'vitest';
import type { Price, PublishedProduct } from '../src/lib/catalog/domain/model';
import { productBreadcrumb } from '../src/lib/seo/navigation';
import { createBreadcrumbListJsonLd } from '../src/lib/seo/structured-data/breadcrumb';
import { serializeJsonLd } from '../src/lib/seo/structured-data/json-ld';
import { createProductJsonLd } from '../src/lib/seo/structured-data/product';
import { createFaqPageJsonLd } from '../src/lib/seo/structured-data/faq';
import { routes } from '../src/lib/catalog/domain/routes';

const imageUrls = [
  'https://lunatartas.es/_astro/product-cover.webp',
  'https://lunatartas.es/_astro/product-detail.webp',
];

function product(price: Price): PublishedProduct {
  return {
    id: 'tarta-especial',
    slug: 'tarta-especial',
    status: 'published',
    name: 'Tarta especial',
    summary: 'Resumen visible.',
    description: 'Descripción visible y aprobada.',
    categories: ['tartas'],
    price,
    media: {
      cover: {
        src: 'tartas/cover.webp',
        alt: 'Tarta especial',
        rights: {
          owner: 'Luna',
          licenseOrPermission: 'Aprobado',
          evidence: 'Handoff',
        },
      },
    },
    customization: { kind: 'none' },
    approval: {
      source: 'Handoff',
      sourceDate: '2026-08-17',
      approvedBy: 'Propietario',
      approvedAt: '2026-08-17',
    },
  };
}

describe('product structured data', () => {
  it('serializes a fixed price as an exact Offer', () => {
    expect(
      createProductJsonLd({
        product: product({ kind: 'fixed', amountMinor: 250, currency: 'EUR' }),
        imageUrls,
      }),
    ).toMatchInlineSnapshot(`
      {
        "@context": "https://schema.org",
        "@id": "https://lunatartas.es/productos/tarta-especial/",
        "@type": "Product",
        "description": "Descripción visible y aprobada.",
        "image": [
          "https://lunatartas.es/_astro/product-cover.webp",
          "https://lunatartas.es/_astro/product-detail.webp",
        ],
        "name": "Tarta especial",
        "offers": {
          "@type": "Offer",
          "price": "2.50",
          "priceCurrency": "EUR",
          "url": "https://lunatartas.es/productos/tarta-especial/",
        },
        "url": "https://lunatartas.es/productos/tarta-especial/",
      }
    `);
  });

  it('represents a visible starting price without inventing a maximum or count', () => {
    const document = createProductJsonLd({
      product: product({ kind: 'from', amountMinor: 2000, currency: 'EUR' }),
      imageUrls,
    });

    expect(document.offers).toMatchInlineSnapshot(`
      {
        "@type": "AggregateOffer",
        "lowPrice": "20.00",
        "priceCurrency": "EUR",
        "url": "https://lunatartas.es/productos/tarta-especial/",
      }
    `);
    expect(document.offers).not.toHaveProperty('highPrice');
    expect(document.offers).not.toHaveProperty('offerCount');
  });

  it('keeps an on-request product free from a fictional Offer', () => {
    const document = createProductJsonLd({
      product: product({ kind: 'on_request' }),
      imageUrls,
    });

    expect(document).toMatchInlineSnapshot(`
      {
        "@context": "https://schema.org",
        "@id": "https://lunatartas.es/productos/tarta-especial/",
        "@type": "Product",
        "description": "Descripción visible y aprobada.",
        "image": [
          "https://lunatartas.es/_astro/product-cover.webp",
          "https://lunatartas.es/_astro/product-detail.webp",
        ],
        "name": "Tarta especial",
        "url": "https://lunatartas.es/productos/tarta-especial/",
      }
    `);
    expect(document).not.toHaveProperty('offers');
  });

  it('uses canonical HTTPS images and rejects absent or external images', () => {
    const fixedProduct = product({
      kind: 'fixed',
      amountMinor: 1,
      currency: 'EUR',
    });

    expect(() =>
      createProductJsonLd({ product: fixedProduct, imageUrls: [] }),
    ).toThrow('at least one visible image');
    expect(() =>
      createProductJsonLd({
        product: fixedProduct,
        imageUrls: ['/image.webp'],
      }),
    ).toThrow('must be absolute');
    expect(() =>
      createProductJsonLd({
        product: fixedProduct,
        imageUrls: ['https://cdn.example/image.webp'],
      }),
    ).toThrow('configured HTTPS origin');
  });
});

describe('breadcrumb structured data', () => {
  it('uses the visual breadcrumb projection and its canonical current route', () => {
    expect(
      createBreadcrumbListJsonLd({
        items: productBreadcrumb('Tarta especial'),
        currentPath: routes.product('tarta-especial'),
      }),
    ).toMatchInlineSnapshot(`
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "item": "https://lunatartas.es/",
            "name": "Inicio",
            "position": 1,
          },
          {
            "@type": "ListItem",
            "item": "https://lunatartas.es/productos/",
            "name": "Productos",
            "position": 2,
          },
          {
            "@type": "ListItem",
            "item": "https://lunatartas.es/productos/tarta-especial/",
            "name": "Tarta especial",
            "position": 3,
          },
        ],
      }
    `);
  });

  it('rejects a breadcrumb without a final current item', () => {
    expect(() =>
      createBreadcrumbListJsonLd({
        items: [{ label: 'Inicio', href: '/' }],
        currentPath: routes.home(),
      }),
    ).toThrow('one final current item');
  });
});

describe('FAQ structured data', () => {
  it('projects the same visible questions and answers into FAQPage', () => {
    const sections = [
      {
        id: 'pedidos' as const,
        shortTitle: 'Pedidos',
        title: 'Pedidos y personalización',
        intro: 'Introducción visible.',
        items: [
          {
            question: '¿Cómo hago un pedido?',
            answer: 'Escríbenos y te ayudaremos.',
          },
        ],
      },
    ];

    expect(createFaqPageJsonLd(sections)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '¿Cómo hago un pedido?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Escríbenos y te ayudaremos.',
          },
        },
      ],
    });
    expect(() => createFaqPageJsonLd([])).toThrow(
      'at least one visible question',
    );
  });
});

describe('JSON-LD serialization', () => {
  it('cannot be closed by editorial text and remains valid JSON', () => {
    const document = { name: '</script><p>unsafe</p>' };
    const serialized = serializeJsonLd(document);

    expect(serialized).not.toContain('</script>');
    expect(JSON.parse(serialized)).toEqual(document);
  });
});
