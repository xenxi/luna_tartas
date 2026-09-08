# Rediseño responsive — revisión visual pendiente

Estado: `AWAITING_VISUAL_APPROVAL`. Las comprobaciones técnicas no constituyen
aprobación visual. Alcance solicitado: portada y lenguaje común de todas las
vistas, escritorio y móvil, con adaptación a tablet y monitores anchos.

## Cambios

- Paleta marfil y rosa, texto con contraste, tipografía editorial, botones
  redondeados y contenedores máximos compartidos por catálogo y fichas.
- Hero con la tarta original, fondo retocado y composición responsive.
- Tarjetas de descubrimiento con sus productos originales y encuadres
  optimizados; las tres quedan visibles en vertical en móvil y tablet.
- Cuatro pasos de trabajo, panel de inspiración y selección móvil alimentados
  por el catálogo; navegación superior con menú nativo en pantallas pequeñas.
- Contraste corregido en navegación, categorías, fichas y páginas editoriales;
  listas verticales en Sobre Luna y decoración contenida en Preguntas frecuentes.
- Enlaces de producto opcionales a TikTok, Instagram, Wallapop y Vinted,
  definidos en YAML y recogidos en el contrato fuente 2.1.0. Si faltan, no
  aparece el bloque. No se inventaron URLs para productos existentes.

## Comprobaciones

- Build estático: 35 páginas.
- TypeScript: 0 errores y 0 avisos. ESLint y Prettier: PASS.
- Vitest: 303 tests PASS, incluidos validación, aislamiento del adaptador y
  proyección de los enlaces opcionales.
- Gates de esquema, responsive, accesibilidad, enlaces, SEO, catálogo, datos
  estructurados y rendimiento: PASS.
- Chromium: 34 rutas × 6 anchos (320, 390, 768, 1024, 1440 y 2560 px), sin
  desbordamiento horizontal ni títulos/acciones fuera del viewport.
- Axe: 11 vistas representativas × escritorio/móvil, sin incidencias WCAG
  A/AA detectadas. Resultado estructurado en `browser-audit.json`.
- Interacciones: menú y FAQ con teclado; búsqueda; favoritos persistentes;
  rechazo de medición. Menú, descubrimiento y enlaces de contacto también
  comprobados sin JavaScript.

Estas pruebas usaron la preview del build en Chromium. No equivalen a una
revisión manual en Safari o dispositivos físicos.

## Capturas

- [Escritorio, 1440 px](home-1440.png)
- [Móvil, 390 px](home-390.png)
- [Tablet, 768 px](home-768.png)
- [Monitor ancho, 2560 px](home-2560.png)

Comparar estas capturas y la implementación navegable con las referencias
aportadas por el usuario. La aprobación visual explícita sigue pendiente.

## Imagen del hero

Herramienta: imagegen integrada, edición de imagen. Fuente original conservada:
`src/assets/home/tarta-hero.png`. Resultado incorporado al proyecto:
`src/assets/home/tarta-hero-editorial.png`; Astro genera las variantes AVIF,
WebP y JPEG de presentación.

Prompt empleado:

> Use case: precise-object-edit. Asset: wide ecommerce hero photograph,
> 1536x1024 landscape. Edit the supplied diaper cake photo: preserve the EXACT
> existing handmade two-tier white diaper cake, green fairy paper topper,
> burlap ribbons, pastel paper flowers and foliage, dimensions and craft
> details. Only improve the background and lighting. Replace the
> dark/transparent left edge with seamless very pale warm pink ivory fabric
> backdrop, softly lit. Keep entire cake on right half, fully visible with top
> and base breathing room, at about x=1100, y=550; left 48 percent intentionally
> quiet pale blush negative space for HTML heading. Pink linen at bottom,
> subtle softly defocused flowers on far right, high-end natural editorial
> product photography, airy pastel blush not orange or brown, soft realistic
> shadows, no strong gradient bands. Opaque background throughout. NO added
> text, logos, watermark, no teddy bear, no bunny, do not replace or redesign
> the actual product.
