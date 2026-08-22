# Estrategia de calidad y testing

## Pirámide proporcionada

### Unit/contract

Vitest (o equivalente confirmado en M1) cubre schemas, invariantes agregadas, resolución de relaciones, generación de rutas, builder WhatsApp, metadata y JSON-LD. Los casos negativos prueban mensajes accionables, no sólo que “lanza error”.

### Build/integration

`astro check`/typecheck y `astro build` prueban que el catálogo real produce todas las rutas. Checks sobre `dist` verifican canonical, sitemap, robots, `/catalog.json`, drafts ausentes y enlaces críticos.

### Browser smoke

Un conjunto pequeño cubre home -> listado -> producto -> CTA, navegación por teclado, viewport móvil y ausencia de errores. Se añade Playwright/axe sólo cuando las páginas existen; no se simula un ecommerce inexistente.

### Auditoría

Lighthouse o herramienta equivalente valida budgets de rendimiento/SEO/accessibility en rutas representativas. Los umbrales se miden con perfil móvil/CI estable y al menos tres ejecuciones cuando exista variabilidad; una puntuación aislada no es la única evidencia.

## Presupuestos iniciales M0.2

| Área | Budget/gate V1 | Medición |
| --- | --- | --- |
| Accesibilidad | WCAG 2.2 AA; 0 blocker/critical/serious automatizado; recorrido manual completo por teclado, foco visible, zoom 200%, reflow a 320 px y reduced motion | axe/equivalente + checklist manual en M8.1 |
| Lighthouse móvil | performance >= 90; accessibility, SEO y best-practices >= 95 | rutas home, listado, taxonomía y producto sobre build de producción |
| Core Web Vitals | campo p75: LCP <= 2.5 s, INP <= 200 ms, CLS <= 0.1; antes de tener campo: lab LCP <= 2.5 s, TBT <= 200 ms y CLS <= 0.1 | CrUX/Search Console cuando haya tráfico; Lighthouse/WebPageTest en pre-release |
| HTML | <= 50 KiB gzip por ruta representativa | artefacto `dist` |
| CSS | <= 50 KiB gzip por ruta representativa | requests de build |
| JavaScript | first-party <= 30 KiB gzip por ruta; total inicial incluido third-party <= 100 KiB gzip | requests de build; 0 KiB cliente donde no haya interacción justificada |
| Transferencia inicial | <= 1.5 MiB en viewport 375 px, caché fría | auditoría de red; contenido below-the-fold lazy no cuenta hasta solicitarse |
| Imagen LCP | variante solicitada <= 300 KiB, dimensiones declaradas y prioridad explícita | auditoría de red/HTML |
| Otras imágenes | cada variante solicitada <= 200 KiB y lazy fuera de viewport | auditoría de red/HTML |
| Assets fuente | raster <= 8 MiB y <= 24 MP; SVG <= 250 KiB sin script/referencias externas; binarios del repo aviso 75 MiB/límite 100 MiB | checker de assets desde M2/M8 |

M8.2 puede endurecer estos valores con muestras reales. Relajar un budget requiere evidencia reproducible, impacto, owner y aceptación documentada en la tarea o planificación vigente.

## Matriz de riesgo

Alta prioridad: publicación de datos inválidos, rutas/canonical incorrectos, structured data falso, WhatsApp roto, drafts expuestos e imágenes que degradan Core Web Vitals. Baja prioridad: funciones triviales de presentación sin lógica.

## Contrato CI

```text
npm run lint
npm run typecheck
npm test
npm run build
```

M1 concreta scripts reproducibles. M8 añade smoke/auditorías sin hacer el pipeline frágil por servicios externos. Ningún check crítico se marca como allow-failure para conseguir un verde artificial.

## Matriz de compatibilidad

- Target de implementación: `baseline widely available with downstream`; el lockfile fija los datos usados por tooling.
- Smoke: estable actual y anterior de Chrome, Edge, Firefox y Safari/iOS Safari; Chrome Android estable.
- Sin Internet Explorer. Una feature fuera del target sólo es aditiva y requiere fallback.
- Contenido, navegación y conversión WhatsApp funcionan sin JavaScript; las versiones exactas probadas se registran en M8.3.

## Evidencia

Cada tarea registra sus comandos y resultados. Tests unitarios no sustituyen inspección visual cuando cambia UI; capturas no sustituyen checks automatizados cuando cambia dominio.
