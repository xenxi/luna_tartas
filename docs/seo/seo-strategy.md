# Estrategia SEO y descubribilidad

## Objetivo

Representar de forma estática y inequívoca productos e intenciones de regalo para buscadores, personas y agentes lectores de web, sin páginas finas ni datos estructurados engañosos.

## Estrategia de URLs

```text
/
/contacto/
/productos/
/productos/{product-slug}/
/categorias/
/categorias/{category-slug}/
/ocasiones/
/ocasiones/{occasion-slug}/
/regalos/
/regalos/{recipient-slug}/
/catalog.json
```

- Dominio canónico: `https://lunatartas.es`.
- Minúsculas, guiones, sin parámetros para navegación indexable y con barra final en HTML.
- Slug estable separado del nombre. Los cambios crean una entrada explícita en el mapa de redirects.
- Índices/taxonomías sólo se publican si tienen contenido útil; no se generan combinaciones facetadas infinitas.
- `www` redirige al apex cuando la infraestructura se confirme.

## On-page y enlaces

Cada página indexable tiene title único, meta description útil, canonical absoluto, un H1, jerarquía semántica, OpenGraph, imagen social válida y contenido visible equivalente a su promesa. Breadcrumbs y enlaces editoriales conectan home, taxonomías y productos sin depender de JS.

Las taxonomías deben responder a una intención real con introducción aprobada y selección pertinente; no son meros listados duplicados. El contenido no se genera automáticamente para aparentar profundidad.

## Datos estructurados

- `Organization` en alcance global cuando existan datos verificados.
- `WebSite` para identidad/sitio; no se declara SearchAction sin búsqueda funcional.
- `BreadcrumbList` donde la ruta visual exista.
- `Product` en fichas publicadas.
- `Offer` sólo con precio, moneda y condiciones reales. `on_request` no fabrica precio, disponibilidad ni oferta.

JSON-LD se genera desde el mismo modelo validado que el HTML y tiene tests contractuales.

## Crawl e indexación

Sitemap contiene únicamente canonical publicables. `robots.txt` referencia el sitemap y no se usa para retirar URLs del índice. Drafts no se generan. Páginas técnicas o duplicadas se excluyen/noindexan según corresponda. Estados 404, enlaces y assets se revisan en CI/release.

## Migración

M0.1 ratificó una implementación greenfield con migración SEO/contenido todavía posible: no descubrió rutas históricas de contenido, pero los accesos/exports privados siguen `TBD`. Ninguna URL con señales se elimina sin mapeo `old -> new`, respuesta HTTP, responsable y verificación. GitHub Pages se mantiene para el artefacto; Cloudflare Redirect Rules/Bulk Redirects es la capa decidida para 301/308 por path. Los 410 requieren una respuesta edge/origin real. Si no hay acceso o capacidad suficiente, M9.2 cambia el hosting o añade una capa edge explícita antes del corte; un meta refresh estático no cuenta como 301 SEO.

## Agent discoverability

La fuente primaria sigue siendo HTML semántico y JSON-LD. [`/catalog.json`](catalog-json-schema.md) expone una proyección versionable del catálogo publicado con URLs absolutas. No se introduce MCP/UCP ni un agente propio en V1 sin un caso y consumidor demostrados.

## Verificación

Build, sitemap/canonical consistency, ausencia de drafts, tests de JSON-LD, enlaces internos, [`catalog.json`](catalog-json-schema.md) y su comparación con HTML, render sin JS y validación manual con herramientas de resultados enriquecidos/Search Console antes y después del release.
