import { getImage } from 'astro:assets';
import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { catalogImageMap } from '../../components/catalog/catalog-images';
import { loadCatalog } from '../../lib/catalog/source';
import { getCanonicalUrl } from '../../config/site';

export const GET: APIRoute = async () => {
  const catalog = await loadCatalog();
  const products = await Promise.all(
    catalog.products
      .filter((p) => p.status === 'published')
      .map(async (p) => {
        const src = p.media.cover.src;
        const bytes = await readFile(`src/assets/catalog/${src}`);
        const sha = createHash('sha1')
          .update(`blob ${bytes.length}\0`)
          .update(bytes)
          .digest('hex');
        const thumbnail = await getImage({
          src: catalogImageMap[src],
          width: 320,
          format: 'webp',
        });
        return {
          id: p.id,
          cover: { blobSha: sha, url: getCanonicalUrl(thumbnail.src) },
        };
      }),
  );
  return new Response(
    JSON.stringify({
      version: 1,
      commit: process.env.GITHUB_SHA ?? null,
      products,
    }),
    { headers: { 'Content-Type': 'application/json' } },
  );
};
