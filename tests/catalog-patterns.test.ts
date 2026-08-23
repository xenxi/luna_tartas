import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type {
  MediaProjection,
  ProductCardProjection,
  TaxonomyCardProjection,
} from '../src/components/catalog/types';

const responsiveMedia = readFileSync(
  'src/components/catalog/ResponsiveMedia.astro',
  'utf8',
);
const productCard = readFileSync(
  'src/components/catalog/ProductCard.astro',
  'utf8',
);
const taxonomyCard = readFileSync(
  'src/components/catalog/TaxonomyCard.astro',
  'utf8',
);
const breadcrumb = readFileSync(
  'src/components/navigation/Breadcrumb.astro',
  'utf8',
);
const cardList = readFileSync('src/components/patterns/CardList.astro', 'utf8');
const contentSection = readFileSync(
  'src/components/patterns/ContentSection.astro',
  'utf8',
);
const catalogStyles = readFileSync(
  'src/components/catalog/catalog.css',
  'utf8',
);
const patternStyles = readFileSync(
  'src/components/patterns/patterns.css',
  'utf8',
);
const taxonomyDiscovery = readFileSync(
  'src/components/home/TaxonomyDiscovery.astro',
  'utf8',
);
const taxonomyDiscoveryProjection = readFileSync(
  'src/components/home/taxonomy-discovery.ts',
  'utf8',
);
const featuredProducts = readFileSync(
  'src/components/home/FeaturedProducts.astro',
  'utf8',
);
const featuredProductsProjection = readFileSync(
  'src/components/home/featured-products.ts',
  'utf8',
);
const publicDiscoverySources = [
  taxonomyDiscovery,
  taxonomyDiscoveryProjection,
  featuredProducts,
  featuredProductsProjection,
  readFileSync('src/components/products/ProductListing.astro', 'utf8'),
  readFileSync('src/components/products/product-listing.ts', 'utf8'),
  readFileSync('src/components/taxonomies/TaxonomyIndex.astro', 'utf8'),
  readFileSync('src/components/taxonomies/TaxonomyLanding.astro', 'utf8'),
  readFileSync('src/pages/categorias/index.astro', 'utf8'),
  readFileSync('src/pages/categorias/[slug].astro', 'utf8'),
  readFileSync('src/pages/ocasiones/index.astro', 'utf8'),
  readFileSync('src/pages/ocasiones/[slug].astro', 'utf8'),
  readFileSync('src/pages/regalos/index.astro', 'utf8'),
  readFileSync('src/pages/regalos/[slug].astro', 'utf8'),
].join('\n');

describe('catalog and contextual navigation patterns', () => {
  it('accepts explicit typed presentation projections', () => {
    const media: MediaProjection = {
      src: '/media/sample.webp',
      alt: 'Tarta de muestra',
      width: 800,
      height: 600,
      sources: [{ srcSet: '/media/sample.avif', type: 'image/avif' }],
    };
    const product: ProductCardProjection = {
      href: '/productos/muestra/',
      name: 'Muestra',
      summary: 'Resumen',
      priceLabel: '30 €',
      media,
    };
    const taxonomy: TaxonomyCardProjection = {
      href: '/categorias/muestra/',
      name: 'Categoría',
      summary: 'Resumen',
    };

    expect(product.media?.width).toBe(800);
    expect(taxonomy.href).toBe('/categorias/muestra/');
  });

  it('reserves media space and emits dimensioned responsive images', () => {
    expect(responsiveMedia).toContain('<picture>');
    expect(responsiveMedia).toContain('<source');
    expect(responsiveMedia).toContain('width={media.width}');
    expect(responsiveMedia).toContain('height={media.height}');
    expect(responsiveMedia).toContain('sizes={media.sizes}');
    expect(responsiveMedia).toContain('loading={loading}');
    expect(catalogStyles).toContain('aspect-ratio: var(--media-aspect)');
  });

  it('uses one heading link per card without wrapping arbitrary interactions', () => {
    expect(productCard.match(/<a\b/g)).toHaveLength(1);
    expect(taxonomyCard.match(/<a\b/g)).toHaveLength(1);
    expect(productCard).toContain('<article');
    expect(productCard).not.toContain('data-analytics-select-item');
    expect(taxonomyCard).toContain('<article');
    expect(productCard).not.toMatch(/<a[^>]*>[\s\S]*<slot/);
    expect(taxonomyCard).not.toMatch(/<a[^>]*>[\s\S]*<slot/);
  });

  it('keeps breadcrumb, section headings and populated collections semantic', () => {
    expect(breadcrumb).toContain('<nav');
    expect(breadcrumb).toContain('<ol>');
    expect(breadcrumb).toContain('aria-current="page"');
    expect(breadcrumb).toContain("item.href.startsWith('/')");
    expect(contentSection).toContain('<section');
    expect(contentSection).toContain('aria-labelledby={titleId}');
    expect(cardList).toContain('<ul');
    expect(patternStyles).toContain('list-style: none');
  });

  it('shows honest missing-media and empty-collection states without hydration', () => {
    expect(responsiveMedia).toContain('Imagen no disponible');
    expect(responsiveMedia).toContain('data-media-state="missing"');
    expect(cardList).toContain('data-content-state="empty"');
    expect(cardList).toContain('{emptyMessage}');
    expect(
      [responsiveMedia, productCard, taxonomyCard, breadcrumb, cardList].join(
        '\n',
      ),
    ).not.toContain('client:');
  });

  it('keeps home discovery static-media and driven by taxonomy routes', () => {
    expect(taxonomyDiscovery).toContain('<section');
    expect(taxonomyDiscovery).toContain("import { Image } from 'astro:assets'");
    expect(taxonomyDiscovery).toContain('giftFinderTypeImage');
    expect(taxonomyDiscovery).not.toContain('catalogImageMap');
    expect(taxonomyDiscovery).not.toContain('buildMediaProjection');
    expect(taxonomyDiscovery).toContain('<Ornament');
    expect(taxonomyDiscovery).toContain('variant="heart"');
    expect(taxonomyDiscovery).toContain('{discovery.intro}');
    expect(taxonomyDiscovery).toContain('{card.description}');
    expect(taxonomyDiscoveryProjection).toContain('getPublishedTaxonomies');
    expect(taxonomyDiscoveryProjection).toContain('routes.taxonomyIndex');
    expect(taxonomyDiscoveryProjection).not.toMatch(/categories:\s*\[/);
    expect(taxonomyDiscoveryProjection).not.toMatch(/occasions:\s*\[/);
    expect(taxonomyDiscoveryProjection).not.toMatch(/recipients:\s*\[/);
  });

  it('keeps featured products semantic and free of client hydration', () => {
    expect(featuredProducts).toContain('<section');
    expect(featuredProducts).toContain('<ResponsiveMedia');
    expect(featuredProducts).toContain('<Ornament');
    expect(featuredProducts).toContain('featured-products__gallery');
    expect(featuredProducts).toContain('mosaicItems.length === 5');
    expect(featuredProducts).toContain('aria-label={`Ver ${product.name}`}');
    expect(featuredProductsProjection).toContain('getFeaturedProducts');
    expect(featuredProductsProjection).toContain('getPublishedProducts');
    expect(featuredProductsProjection).toContain('routes.product');
    expect(featuredProductsProjection).toContain('INSPIRACIÓN QUE EMOCIONA');
    expect(featuredProductsProjection).toContain('Ver más regalos');
    expect(featuredProductsProjection).not.toContain('client:');
  });

  it('does not publish discovery placeholders or empty modules', () => {
    expect(publicDiscoverySources).not.toMatch(/Pronto podrás/i);
    expect(taxonomyDiscovery).toContain('discovery &&');
    expect(featuredProducts).toContain('mosaicItems.length === 5');
    expect(publicDiscoverySources).not.toContain('data-content-state="empty"');
  });
});
