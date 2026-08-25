import { describe, expect, it } from 'vitest';
import { createPageMetadata } from '../src/lib/seo/metadata';
import { siteConfig } from '../src/config/site';
import { routes } from '../src/lib/catalog/domain/routes';

const image = {
  url: 'https://lunatartas.es/images/social-card.jpg',
  alt: 'Detalle artesanal personalizado',
};

describe('page metadata', () => {
  it('builds a unique indexable product head from domain routes and fallback copy', () => {
    const metadata = createPageMetadata({
      title: 'Tarta de pañales personalizada',
      canonicalPath: routes.product('tarta-de-panales-personalizada'),
      fallbackDescription: 'Regalo artesanal para dar la bienvenida a un bebé.',
      image,
      pageType: 'product',
    });

    expect(metadata).toEqual({
      title: 'Tarta de pañales personalizada | Regalos personalizados',
      description: 'Regalo artesanal para dar la bienvenida a un bebé.',
      canonicalUrl:
        'https://lunatartas.es/productos/tarta-de-panales-personalizada/',
      robots: 'index,follow',
      image,
      pageType: 'product',
      ogLocale: 'es_ES',
    });
  });

  it('uses the editorial description before its fallback and keeps technical pages out of the index', () => {
    const metadata = createPageMetadata({
      title: 'Showcase interno',
      canonicalPath: '/_showcase/ui/',
      description: 'Descripción editorial.',
      fallbackDescription: 'No debe usarse.',
      image,
      robots: 'noindex,nofollow',
    });

    expect(metadata.description).toBe('Descripción editorial.');
    expect(metadata.robots).toBe('noindex,nofollow');
  });

  it('allows search discovery links while keeping query pages out of the index', () => {
    const metadata = createPageMetadata({
      title: 'Buscar',
      canonicalPath: routes.search(),
      image,
      robots: 'noindex,follow',
    });

    expect(metadata.canonicalUrl).toBe('https://lunatartas.es/buscar/');
    expect(metadata.robots).toBe('noindex,follow');
  });

  it.each([
    ['empty title', { title: ' ' }],
    ['empty fallback', { fallbackDescription: ' ' }],
    ['relative image', { image: { ...image, url: '/social.jpg' } }],
    [
      'insecure image',
      { image: { ...image, url: 'http://lunatartas.es/social.jpg' } },
    ],
  ])('rejects %s', (_case, overrides) => {
    expect(() =>
      createPageMetadata({
        title: 'Página',
        canonicalPath: routes.home(),
        fallbackDescription: 'Descripción válida.',
        image,
        ...overrides,
      }),
    ).toThrow();
  });

  it('keeps its locale and canonical origin centralised in site config', () => {
    const metadata = createPageMetadata({
      title: 'Inicio',
      canonicalPath: routes.home(),
      image,
    });

    expect(metadata.canonicalUrl).toBe(`${siteConfig.siteUrl}/`);
    expect(metadata.ogLocale).toBe('es_ES');
  });
});
