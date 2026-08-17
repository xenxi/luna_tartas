import { getImage } from 'astro:assets';
import type { APIRoute } from 'astro';
import { catalogImageMap } from '../components/catalog/catalog-images';
import { getCanonicalUrl } from '../config/site';
import { createPublicCatalog } from '../lib/catalog/public-projection';
import { loadCatalog } from '../lib/catalog/source';

export const GET: APIRoute = async () => {
  const catalog = await loadCatalog();
  const document = await createPublicCatalog(
    catalog,
    async (media, product) => {
      const image = catalogImageMap[media.src];

      if (image === undefined) {
        throw new Error(`Public catalog image is missing for ${product.id}`);
      }

      const optimized = await getImage({
        src: image,
        format: 'webp',
        width: 960,
      });

      return {
        url: getCanonicalUrl(optimized.src),
        alt: media.alt,
        width: optimized.attributes.width,
        height: optimized.attributes.height,
      };
    },
  );

  return new Response(`${JSON.stringify(document, null, 2)}\n`, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      // GitHub Pages may override static headers; this is the safe cache policy
      // when the endpoint is served by a platform that preserves them.
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
};
