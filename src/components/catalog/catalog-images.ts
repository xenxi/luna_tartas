/**
 * Mapa de imágenes del catálogo cargadas en tiempo de build mediante import.meta.glob.
 * La clave es la ruta relativa al directorio `src/assets/catalog/` (ej. "tartas/tarta-rosa.png").
 * El valor es el objeto ImageMetadata que Astro usa para optimización.
 *
 * Uso desde componentes .astro:
 *   import { catalogImageMap } from '../catalog/catalog-images';
 *   const imageMetadata = catalogImageMap['tartas/tarta-rosa.png'];
 */
import type { ImageMetadata } from 'astro';

// El glob es relativo al archivo actual (src/components/catalog/).
// Captura todos los formatos de imagen soportados bajo src/assets/catalog/.
const rawGlob = import.meta.glob<{ default: ImageMetadata }>(
  '../../assets/catalog/**/*.{png,jpg,jpeg,webp,avif,svg}',
  { eager: true },
);

// Normalizar las claves del glob (rutas absolutas de módulo) a rutas relativas
// al directorio de assets del catálogo, que coinciden con los valores `src`
// almacenados en el dominio (ej. "tartas/tarta-rosa.png").
const PREFIX = '../../assets/catalog/';

export const catalogImageMap: Readonly<Record<string, ImageMetadata>> =
  Object.fromEntries(
    Object.entries(rawGlob)
      .filter(([key]) => key.startsWith(PREFIX))
      .map(([key, mod]) => [key.slice(PREFIX.length), mod.default]),
  );
