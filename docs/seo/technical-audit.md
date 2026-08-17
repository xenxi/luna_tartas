# Auditoría SEO técnica pre-analytics (M6.7)

**Fecha:** 2026-08-17
**Artefacto auditado:** build local de `main` (25 páginas HTML: 24 indexables + `404.html`), generado con `npm run build` sobre el catálogo validado (8 productos, 4 categorías, 4 ocasiones, 3 recipients publicados).
**Objetivo:** cerrar G6 con evidencia sobre todo el artefacto antes de introducir medición.

## Resumen ejecutivo

| Severidad | Abiertos | Estado                                                                                  |
| --------- | -------- | --------------------------------------------------------------------------------------- |
| Crítico   | 0        | —                                                                                       |
| Alto      | 0        | 1 resuelto en esta auditoría (titles/H2 duplicaban preposición en landings `/regalos/`) |
| Medio     | 2        | documentados con propietario (favicon ausente; landings taxonómicos de contenido fino)  |
| Bajo      | 1        | documentado (2 titles de categoría superan 70 caracteres)                               |

## Verificaciones ejecutadas (todas PASS, 2026-08-17)

| Verificación                                                                                       | Resultado                                           |
| -------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| `npm run lint`                                                                                     | PASS                                                |
| `npm run typecheck` (`astro check`)                                                                | PASS: 0 errores, 0 warnings, 0 hints (119 archivos) |
| `npm test`                                                                                         | PASS: 30 archivos, 201 tests                        |
| `npm run build`                                                                                    | PASS: 25 páginas                                    |
| `npm run verify:seo` (title/description/robots/canonical/OG/Twitter + imagen social existente)     | PASS: 24 páginas HTML indexables                    |
| `npm run verify:crawl` (sitemap ↔ canonical ↔ robots, robots.txt, 404 noindex)                     | PASS: 24 URLs indexables                            |
| `npm run verify:links` (enlaces internos rotos, huérfanos, breadcrumb con un único `aria-current`) | PASS: 0 rotos, 0 huérfanos, 0 issues                |
| `npm run verify:structured-data` (JSON-LD contract tests)                                          | PASS: 8 páginas de producto + identidad home        |
| `npm run verify:catalog` (catalog.json ↔ HTML/assets/canonical)                                    | PASS: 8 productos / 8 HTML                          |
| `git diff --check`                                                                                 | PASS                                                |

## Cobertura del alcance

### Titles, descriptions, canonical, headings y OG

Barrido sobre los 25 HTML del artefacto:

- **Titles únicos:** 25/25 únicos. Rango 43–72 caracteres; sufijo coherente `| Regalos personalizados`.
- **Meta descriptions únicas:** 25/25 únicas; las 24 indexables están entre 56 y 119 caracteres.
- **Canonical:** exactamente uno por página, absoluto HTTPS en el apex y con barra final; coincide con sitemap (verify:crawl) y con `catalog.json` (verify:catalog).
- **H1 único:** 25/25 páginas con exactamente un `<h1>`; jerarquía posterior H2/H3 por secciones y cards.
- **OG/Twitter:** `og:title`, `og:description`, `og:url`, `og:type` (`product` sólo en fichas), `og:locale=es_ES`, `og:image` + `og:image:alt` y `twitter:card=summary_large_image` en todas las páginas; la imagen social existe en el artefacto (verify:seo).
- **Idioma:** `lang="es"` en los 25 documentos.
- **Imágenes:** todas las `<img>` llevan `alt` descriptivo no vacío y `width`/`height` enteros (reserva de aspecto, sin CLS).

### Crawl e indexación

- `robots.txt`: `User-agent: * / Allow: / / Sitemap: https://lunatartas.es/sitemap.xml` (contrato verificado).
- `sitemap.xml`: 24 URLs únicas, todas apex HTTPS con barra final; sin rutas técnicas (`/_showcase/`) ni drafts.
- `404.html`: `noindex,nofollow`, fuera del sitemap.
- Drafts y contenido `FIXTURE`: ausentes del artefacto (cubierto además por la suite de dominio).

### Enlaces internos

- 0 enlaces rotos, 0 páginas indexables huérfanas, breadcrumbs visuales con un único elemento actual por página (verify:links).

### JSON-LD

- Contract tests locales PASS (`verify:structured-data` + `seo-structured-data.test.ts` + `seo-organization.test.ts`).
- **Muestras externas válidas (2026-08-17):** los 6 documentos JSON-LD representativos (Organization y WebSite de la home; Product con `Offer`, Product con `AggregateOffer` y sus dos `BreadcrumbList`) se extrajeron del artefacto y se validaron contra el validador oficial de schema.org (`https://validator.schema.org/validate`): **0 errores en los 6 documentos**.
- Sin `aggregateRating`/`review` inventados; `on_request` no fabrica oferta, precio, disponibilidad ni condiciones comerciales (verify:structured-data lo exige).

### catalog.json

- Schema `1.0`, determinista (sin `generatedAt`), 8 productos y taxonomías publicados, URLs canónicas absolutas, portadas optimizadas existentes, sin campos editoriales/internos (verify:catalog + `public-catalog.test.ts`).

### Render sin JavaScript

- 0 etiquetas `<script>` ejecutables en las 25 páginas (sólo bloques `application/ld+json`); navegación, menú móvil (`details`/`summary`), breadcrumbs, CTAs de WhatsApp y 404 funcionan íntegramente sin JS.

## Corrección aplicada en esta auditoría

**Alto (resuelto):** las landings de recipient componían el title y el encabezado de productos concatenando el prefijo con el nombre editorial, que ya empieza por «Para …»: `Regalos para Para bebés`, `Ideas para para bebés`. Se normaliza el nombre de presentación en `src/pages/regalos/[slug].astro` (se retira el prefijo inicial y se ajusta la capitalización) y se añade guarda contractual en `tests/taxonomy-listing.test.ts`. Resultado tras el rebuild: `Regalos para bebés`, `Regalos para niños`, `Regalos para alguien especial`, `Ideas para bebés`.

## Issues abiertos (medios/bajos, con propietario)

| ID    | Severidad | Issue                                                                                                                                                                                                                                                                                               | Por qué no bloquea G6                                                                                                                                     | Propietario / gate de salida                                                                                                          |
| ----- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| AUD-1 | Medio     | Ninguna página declara `rel="icon"`; el favicon de marca está `BLOCKED` por falta de masters y derechos (M3.1, `visual-direction.md`). Política vigente: ningún monograma o símbolo provisional en producción.                                                                                      | No afecta a crawl, indexación ni datos estructurados; afecta a presentación en pestañas/SERP.                                                             | Propietario: marca (Luna). Salida: incorporar masters aprobados en M9.1 (carga de contenido/activos de marca).                        |
| AUD-2 | Medio     | Las 14 landings taxonómicas publican 50–133 palabras visibles (introducción aprobada + lista de productos). La estrategia permite landings con contenido útil, pero estas páginas comparten plantilla y se apoyan en las cards; existe riesgo de «contenido fino» si el volumen editorial no crece. | Cumplen el contrato (introducción única aprobada, intención real, productos pertinentes, sin contenido autogenerado); la mejora es editorial, no técnica. | Propietario: contenido (Luna). Salida: enriquecimiento editorial aprobado en M9.1; la estrategia prohíbe rellenar con texto generado. |
| AUD-3 | Bajo      | Los titles de `/categorias/laminas-personalizadas/` (71) y `/categorias/papeleria-personalizada/` (72) superan ligeramente la ventana de 70 caracteres; Google puede reescribirlos en SERP.                                                                                                         | Son únicos, correctos y no truncan información esencial; no hay directriz de longitud contractual.                                                        | Propietario: contenido (Luna). Salida: opcionalmente ajustar el sufijo o los `seo.title` en M9.1.                                     |

## Fuera de alcance (registrado)

- Redirects de migración/release, DNS y `www → apex`: pendientes de la capa Cloudflare decidida en la estrategia (M9.2).
- Validación en Search Console: requiere propiedad verificada en producción (G9).
