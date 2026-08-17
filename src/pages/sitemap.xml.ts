import type { APIRoute } from 'astro';
import { loadCatalog } from '../lib/catalog/source';
import { createSitemapXml, getIndexablePaths } from '../lib/seo/crawl';

export const GET: APIRoute = async () => {
  const catalog = await loadCatalog();

  return new Response(createSitemapXml(getIndexablePaths(catalog)), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
