/**
 * Genera una MediaProjection a partir de una ImageMetadata de Astro y el alt text.
 * Usa la API `getImage` de astro:assets para obtener la URL optimizada, dimensiones
 * y sources para `<picture>`.
 *
 * Se debe llamar desde el frontmatter de componentes .astro (contexto de build).
 */
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import type { MediaProjection } from './types';

export async function buildMediaProjection(
  imageMetadata: ImageMetadata,
  alt: string,
  options?: {
    sizes?: string;
    widths?: number[];
  },
): Promise<MediaProjection> {
  const widths = options?.widths ?? [320, 480, 640, 800];
  const sizes =
    options?.sizes ??
    '(min-width: 60rem) 25vw, (min-width: 40rem) 40vw, calc(50vw - 2rem)';

  // El <img> mantiene JPEG como fallback compatible; AVIF y WebP viven en
  // <source>, por delante del fallback, para no depender de un formato moderno.
  const fallbackSources = await Promise.all(
    widths.map((width) =>
      getImage({ src: imageMetadata, format: 'jpg', width }),
    ),
  );

  // Generamos sources AVIF y WebP para distintos anchos
  const avifSources = await Promise.all(
    widths.map((w) =>
      getImage({ src: imageMetadata, format: 'avif', width: w }),
    ),
  );
  const webpSources = await Promise.all(
    widths.map((w) =>
      getImage({ src: imageMetadata, format: 'webp', width: w }),
    ),
  );

  return {
    src: fallbackSources[fallbackSources.length - 1].src,
    srcSet: fallbackSources
      .map((image, index) => `${image.src} ${widths[index]}w`)
      .join(', '),
    alt,
    width: imageMetadata.width,
    height: imageMetadata.height,
    sizes,
    sources: [
      {
        type: 'image/avif',
        srcSet: avifSources
          .map((img, i) => `${img.src} ${widths[i]}w`)
          .join(', '),
      },
      {
        type: 'image/webp',
        srcSet: webpSources
          .map((img, i) => `${img.src} ${widths[i]}w`)
          .join(', '),
      },
    ],
  };
}
