import { getCanonicalUrl, siteConfig } from '../../config/site';
import {
  getProductsForTaxonomy,
  getPublishedProducts,
  getPublishedTaxonomies,
} from '../catalog/domain/queries';
import { routes } from '../catalog/domain/routes';
import type { Catalog, TaxonomyKind } from '../catalog/domain/model';

const taxonomyKinds: readonly TaxonomyKind[] = [
  'category',
  'occasion',
  'recipient',
];

export function getIndexablePaths(catalog: Catalog): readonly string[] {
  const paths = [
    routes.home(),
    routes.about(),
    routes.contact(),
    routes.shipping(),
    routes.faq(),
    routes.privacy(),
    routes.terms(),
    routes.products(),
  ];

  for (const kind of taxonomyKinds) {
    paths.push(routes.taxonomyIndex(kind));
  }

  paths.push(
    ...getPublishedProducts(catalog).map((product) =>
      routes.product(product.slug),
    ),
  );

  for (const kind of taxonomyKinds) {
    paths.push(
      ...getPublishedTaxonomies(catalog, kind)
        .filter(
          (taxonomy) =>
            getProductsForTaxonomy(catalog, kind, taxonomy.id).length > 0,
        )
        .map((taxonomy) => routes.taxonomy(kind, taxonomy.slug)),
    );
  }

  return Object.freeze(paths);
}

function escapeXml(value: string): string {
  return value.replace(/[<>&'\"]/g, (character) => {
    const entities: Record<string, string> = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      "'": '&apos;',
      '"': '&quot;',
    };
    return entities[character];
  });
}

export function createSitemapXml(paths: readonly string[]): string {
  const urls = paths.map((path) => getCanonicalUrl(path));
  const uniqueUrls = new Set(urls);

  if (uniqueUrls.size !== urls.length) {
    throw new Error('Sitemap paths must be unique');
  }

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`)
    .join('\n')}\n</urlset>\n`;
}

export function createRobotsTxt(): string {
  return `User-agent: *\nAllow: /\nSitemap: ${siteConfig.siteUrl}/sitemap.xml\n`;
}
