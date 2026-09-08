# Portada — Desktop

Estado: `AWAITING_VISUAL_APPROVAL`.

Referencia: imagen aportada por el usuario, `ChatGPT Image 8 sept 2026, 16_32_47.png` (914 × 1721).
Esta revisión continúa los cambios locales existentes y se limita a la portada de escritorio.

## Implementación

- Escala compartida de composición, acotada a 1440 px, con estilos exclusivos de la portada.
- Escena de ambientación con conejito, jerarquía tipográfica, botones, beneficios y accesos laterales.
- Borde del hero: relleno y trazo comparten exactamente el mismo trazado y viewBox SVG. La frase se coloca dentro del mismo contenedor y tiene espacio inferior propio.
- Navegación en cuadrícula; logotipo alineado, indicador de página activa y foco de teclado rosa visible.
- Nubes, corazones, proceso de cuatro pasos, mosaico, cierre floral, pie en columnas y enlace para volver arriba.
- Textos editoriales de descubrimiento centralizados en `src/content/home/discovery.ts`. Consultas, rutas y selección de productos mantienen el catálogo como fuente.

## Verificación

- Astro check: 199 archivos, sin errores, avisos ni sugerencias.
- Build: 35 páginas estáticas.
- ESLint: PASS.
- Pruebas: 303 casos; actualizadas las expectativas del texto sustituido por el de la referencia y del recurso de imagen utilizado.
- Auditorías de enlaces, accesibilidad, responsive, SEO y rendimiento: PASS.
- Navegador: 768, 914, 1024, 1280, 1440, 1920 y 2560 px; sin solapamientos de navegación ni desbordamientos horizontales. La frase queda dentro del hero en todos los tamaños comprobados. Ver `browser-audit.json`.
- Teclado: Tab muestra el foco en Productos; búsqueda abre y cierra con Escape; controles de consentimiento accesibles.
- Comprobación de regresión a 390 px: los nuevos elementos exclusivos de escritorio permanecen ocultos; sin desbordamiento horizontal. No constituye implementación ni aprobación de Mobile.

## Revisión manual pendiente

- `home-914.png`: composición completa de la versión compilada.
- `hero-1440.png`: hero, borde y navegación.
- `navigation-focus-1440.png`: foco con Tab.

La implementación no es una reproducción píxel a píxel: conserva fotografías reales del catálogo, logotipo y recursos decorativos disponibles. La escena del hero es una recreación generada. Los tres canales sociales son los configurados; cuenta y carrito enlazan a la página existente de próxima disponibilidad, sin simular funciones de compra. Se conservan el consentimiento real y los enlaces y textos legales del proyecto.

La aprobación visual corresponde al usuario conforme a `AGENTS.md`; las comprobaciones técnicas no la sustituyen.

## Recurso generado

Herramienta: ImageGen integrada. Archivo: `src/assets/home/hero-bunny-reference.png` (1817 × 866). Originales anteriores conservados. Astro produce versiones AVIF, WebP y JPEG.

Prompt utilizado:

> Use case: product-mockup. Create a production website hero background matching ONLY the top photographic scene of the attached reference website. Output wide landscape 2.1:1. Recreate faithfully the beige knitted plush floppy-eared bunny holding a pink heart sitting atop a luxurious three-tier white diaper cake with burlap bands, pink and ivory daisies, delicate eucalyptus and pink heart decorations. Large wooden heart plaque reads exactly 'Pequeñas cosas que hacen grandes historias' with a small drawn pink heart beneath. Cake occupies x=49% to 86%, starting y=12%, ending y=99%, ears fully visible. Background is softly blurred blush pink satin curtains, cozy pink blankets at bottom and soft out-of-focus flowers. Left 45% mostly empty cream pink space for live HTML headline. Match the reference photographic handcrafted texture, warm light, saturated pink details. Retain the floral branches at bottom right. No website text, no navigation, no logo, no buttons, no badges, no floating drawn hearts, no handwritten tagline outside the plaque, no wave bottom border. Reference image is visual guidance, recreate only hero photography, do not output a website screenshot.
