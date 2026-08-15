# ROADMAP — Luna Estudio

Única fuente de verdad sobre prioridad, estado y siguiente tarea. Última actualización: 2026-08-15.

## Uso

- Estados válidos: `PENDING`, `IN_PROGRESS`, `BLOCKED`, `DONE`.
- Sólo una submilestone puede estar `IN_PROGRESS`.
- Se ejecuta exclusivamente la tarea solicitada; no se anticipa la siguiente.
- `DONE` exige todos los criterios y verificaciones en `PASS`, con evidencia registrada aquí.
- Orden normal: de arriba abajo. Una tarea posterior sólo puede comenzar si todas sus dependencias están `DONE`.
- **Siguiente tarea:** `M0.3 — Contrato de entradas y readiness V1`.

## Gates de programa

| Gate | Condición objetiva |
| --- | --- |
| G0 Discovery cerrado | inventario o ausencia documentada, decisiones bloqueantes resueltas y entradas V1 con propietario |
| G1 Plataforma reproducible | instalación limpia + lint + typecheck + test + build + CI + artefacto Pages |
| G2 Catálogo confiable | schemas, relaciones, errores, queries y fixtures pasan; ningún draft se proyecta |
| G3 Sistema visual | foundations/primitives/patterns accesibles y aprobados en viewports objetivo |
| G4 Descubrimiento | home, índices y taxonomías estáticas funcionan con contenido representativo |
| G5 Conversión | fichas y ambos WhatsApp flows funcionan sin JS y están cubiertos |
| G6 SEO/agents | metadata, crawl, JSON-LD, enlaces y catalog JSON son consistentes |
| G7 Medición | eventos aprobados, privacidad resuelta y recepción validada sin PII |
| G8 Release candidate | accesibilidad, performance, responsive, seguridad y suite completa aprobados |
| G9 Producción | contenido, redirects, DNS, HTTPS, Search Console, analytics, monitor y rollback verificados |

---

# M0 — Discovery + Architecture

**Estado:** PENDING  
**Gate:** G0.

## M0.1 — Inventario verificable de producción, SEO y activos

**Estado:** DONE  
**Objetivo:** convertir el estado externo desconocido en evidencia útil para migración.  
**Alcance:** dominio y variantes, DNS/Cloudflare, hosting anterior, robots/sitemaps, URLs, Search Console/Analytics disponibles, backlinks aportados, logo/favicon/fotos/textos y repositorios/exports; registrar fuente, fecha, propietario y disponibilidad.  
**Fuera de alcance:** decidir diseño, crear Astro, copiar contenido sin derechos o cambiar DNS.  
**Dependencias:** ninguna.  
**Archivos/áreas previstas:** `docs/discovery/current-state.md`, `docs/seo/url-inventory.csv`, actualización puntual de `docs/architecture/risks-and-open-decisions.md`.  
**Contratos afectados:** migración, URLs, SEO, assets, deployment.  
**Criterios de aceptación:** inventario trazable; cada ausencia marcada `TBD` con propietario/siguiente acción; clasificación greenfield/migración ratificada; ninguna URL conocida queda sin estado.  
**Verificación:** revisar fuentes/accesos; comprobar dominio, variantes y remoto; validar CSV sin duplicados y con columnas acordadas.  
**Modelo recomendado:** SOL.  
**Razón del modelo:** auditoría incompleta y SEO histórico requieren razonamiento transversal.  
**Evidencia:** PASS (2026-08-15) — `docs/discovery/current-state.md` registra fuentes, fecha, disponibilidad, owner y siguiente acción; clasificación ratificada: código greenfield con migración SEO/contenido posible. Dominio: A/AAAA y NS Cloudflare contrastados, `www` NXDOMAIN, HTTP(S)/robots/sitemap inconclusos y documentados sin inferir origen. Remoto: API GitHub pública + `git ls-remote` confirman repo público vacío, 0 refs y Pages desactivado. Assets/exports/accesos ausentes quedan `TBD`. `Import-Csv docs/seo/url-inventory.csv`: 8 URLs, 9 columnas requeridas, 0 duplicados, 0 filas incompletas; ninguna URL conocida sin estado.  

## M0.2 — Cierre de decisiones técnicas y presupuestos iniciales

**Estado:** DONE  
**Objetivo:** ratificar las decisiones que condicionan scaffold y operación.  
**Alcance:** confirmar Astro/SSG/Pages, repositorio público como frontera de seguridad, npm/Node, trailing slash, capa de redirects, política de imágenes/repo, soporte de navegadores, targets de accesibilidad/performance y criterios para dependencias.  
**Fuera de alcance:** instalar paquetes, implementar pipeline o elegir estética final.  
**Dependencias:** M0.1.  
**Archivos/áreas previstas:** `docs/architecture/architecture.md`, `deployment.md`, `risks-and-open-decisions.md`; ADR sólo si cambia una decisión con alternativa real.  
**Contratos afectados:** arquitectura, deployment, URLs, calidad.  
**Criterios de aceptación:** decisiones explícitas con consecuencias; blockers con dueño; Pages sigue o se sustituye sólo con evidencia; budgets medibles.  
**Verificación:** revisión cruzada de contratos y resolución de contradicciones/TBD bloqueantes para M1.  
**Modelo recomendado:** SOL.  
**Razón del modelo:** decisiones irreversibles y transversales dominan el trabajo.  
**Evidencia:** PASS (2026-08-15) — `architecture.md` ratifica Astro 6/SSG sin adapter, Node `24.19.0` + npm `11.17.0`, URLs con barra final, Pages condicionado, Cloudflare 301/308 y fallback para 410, frontera pública, hard limits de assets, Baseline, WCAG 2.2 AA y criterios de dependencias; `deployment.md` fija flujo oficial Pages, permisos/owners, DNS/redirects y criterio objetivo de sustitución; `testing-strategy.md` define budgets medibles de CWV/Lighthouse/HTML/CSS/JS/transferencia/imágenes. Revisión PowerShell: dependencia M0.1 PASS, única tarea `IN_PROGRESS` durante ejecución PASS, enlaces internos PASS, decisiones requeridas PASS, budgets PASS, owners/exit gate PASS y 0 contradicciones obsoletas. Fuentes oficiales: Astro, Node, GitHub, Cloudflare, W3C y web.dev. No se creó ADR porque no cambió la dirección aceptada.  

## M0.3 — Contrato de entradas y readiness V1

**Estado:** PENDING  
**Objetivo:** acordar qué contenido/configuración se necesita, quién lo aporta y qué puede ser provisional.  
**Alcance:** checklist de marca, catálogo, fotos/derechos/alt, precios, WhatsApp, identidad legal, prueba social, analytics, DNS y Search Console; plantilla editorial y reglas de aprobación.  
**Fuera de alcance:** producir copy/fotos, cargar catálogo o aprobar información no facilitada.  
**Dependencias:** M0.2.  
**Archivos/áreas previstas:** `docs/product/content-readiness.md`, ajustes mínimos a `scope.md` y contrato de catálogo.  
**Contratos afectados:** producto, catálogo, legal, conversión, release.  
**Criterios de aceptación:** cada entrada tiene estado/propietario/deadline o `TBD`; se distingue fixture de contenido publicable; G0 evaluado y M1 no tiene blocker desconocido.  
**Verificación:** walkthrough de checklist y enlaces a evidencia; revisión de consistencia con M9.1.  
**Modelo recomendado:** SOL → LUNA.  
**Razón del modelo:** Sol fija el contrato; Luna puede materializar plantillas/checklists.  
**Evidencia:** —

---

# M1 — Project Bootstrap + CI/CD

**Estado:** PENDING  
**Gate:** G1.

## M1.1 — Scaffold Astro reproducible

**Estado:** PENDING  
**Objetivo:** crear el mínimo proyecto Astro estático con TypeScript estricto.  
**Alcance:** package/lockfile npm, Astro estable fijado, config SSG, `tsconfig` strict, scripts base, `.gitignore` para dependencias/output/caches/tooling local/`.env*`, página mínima no diseñada y README operativo.  
**Fuera de alcance:** catálogo, design system, analytics, SEO completo o deploy.  
**Dependencias:** M0.3.  
**Archivos/áreas previstas:** `package.json`, lockfile, `astro.config.*`, `tsconfig.json`, `src/pages/index.astro`, `README.md`.  
**Contratos afectados:** build, TypeScript, dependencias.  
**Criterios de aceptación:** clone limpio instala reproduciblemente; no framework UI; salida `static`; página mínima compila; secretos y `.env` quedan ignorados, y cualquier `.env.example` contiene sólo valores ficticios.  
**Verificación:** `npm ci`, `npm run typecheck`, `npm run build`, pruebas de reglas `.gitignore` con nombres seguros.  
**Modelo recomendado:** LUNA.  
**Razón del modelo:** scaffold mecánico guiado por decisiones ya cerradas.  
**Evidencia:** —

## M1.2 — Harness de lint, formato y tests

**Estado:** PENDING  
**Objetivo:** establecer los checks locales contractuales antes de añadir dominio.  
**Alcance:** lint, formato comprobable, Vitest/equivalente, un test de infraestructura significativo y scripts `lint/typecheck/test/build`.  
**Fuera de alcance:** suite de catálogo o browser tests.  
**Dependencias:** M1.1.  
**Archivos/áreas previstas:** configs de lint/format/test, `tests/`, `package.json`.  
**Contratos afectados:** calidad, CI, dependencias.  
**Criterios de aceptación:** comandos son no interactivos, fallan correctamente y no duplican herramientas sin valor.  
**Verificación:** ejecutar los cuatro scripts y una prueba controlada de fallo/reversión del harness.  
**Modelo recomendado:** LUNA.  
**Razón del modelo:** integración local bien acotada.  
**Evidencia:** —

## M1.3 — Configuración global y layout técnico

**Estado:** PENDING  
**Objetivo:** centralizar identidad técnica y metadatos mínimos sin diseñar la UI.  
**Alcance:** config validada de site/locale/canonical/placeholders `TBD` no publicables, layout HTML semántico, idioma, viewport y manejo de config ausente.  
**Fuera de alcance:** teléfono definitivo, JSON-LD, estilos de marca o analytics.  
**Dependencias:** M1.2.  
**Archivos/áreas previstas:** `src/config/site.ts`, `src/layouts/BaseLayout.astro`, tests de config.  
**Contratos afectados:** configuración, HTML, SEO base, seguridad.  
**Criterios de aceptación:** no hay URLs/branding duplicados; configuración inválida falla; HTML mínimo válido y sin secretos.  
**Verificación:** tests de config, typecheck, build e inspección de HTML generado.  
**Modelo recomendado:** LUNA → SOL REVIEW.  
**Razón del modelo:** implementación pequeña con efecto transversal que merece revisión.  
**Evidencia:** —

## M1.4 — CI de pull request

**Estado:** PENDING  
**Objetivo:** convertir los checks contractuales en gate automatizado.  
**Alcance:** workflow apto para repositorio público con permisos mínimos, Node/npm fijados, cache seguro, concurrencia y `lint/typecheck/test/build`; secretos sólo por Actions Secrets cuando sean imprescindibles y artefacto diagnóstico cuando aporte valor.  
**Fuera de alcance:** deployment de producción y servicios externos.  
**Dependencias:** M1.3.  
**Archivos/áreas previstas:** `.github/workflows/ci.yml`.  
**Contratos afectados:** CI, seguridad, calidad.  
**Criterios de aceptación:** workflow válido, reproducible con `npm ci`, sin secretos hardcodeados ni exposición en logs/artifacts y sin acciones flotantes inseguras; fallo de un check bloquea.  
**Verificación:** validación local de YAML, ejecución de scripts y run real en GitHub cuando haya rama/PR.  
**Modelo recomendado:** LUNA.  
**Razón del modelo:** workflow estándar con contratos ya definidos.  
**Evidencia:** —

## M1.5 — Pipeline base de GitHub Pages

**Estado:** PENDING  
**Objetivo:** demostrar que un artefacto estático verificable puede desplegarse sin cortar el dominio.  
**Alcance:** workflow Pages oficial, permisos/concurrencia, configuración `site`, artifact y smoke de URL técnica; documentar preview/rollback real.  
**Fuera de alcance:** cambio DNS, producción, contenido final o redirects históricos.  
**Dependencias:** M1.4.  
**Archivos/áreas previstas:** `.github/workflows/deploy.yml`, Astro config, `docs/architecture/deployment.md`.  
**Contratos afectados:** build, deployment, URLs.  
**Criterios de aceptación:** artefacto único procede de commit público verificado; deploy no usa secretos innecesarios ni incorpora valores protegidos; URL técnica responde o bloqueo de permisos queda explícito.  
**Verificación:** run Actions, inspección de logs/artifact por datos sensibles, HTTP smoke y procedimiento de rollback ensayado/documentado.  
**Modelo recomendado:** LUNA → SOL REVIEW.  
**Razón del modelo:** implementación estándar con revisión por riesgo operacional.  
**Evidencia:** —

---

# M2 — Catalog Domain + Validation

**Estado:** PENDING  
**Gate:** G2.

## M2.1 — Schemas de taxonomías

**Estado:** PENDING  
**Objetivo:** validar Category, Occasion y Recipient desde YAML.  
**Alcance:** colecciones/schema, campos editoriales mínimos, slug/status/order/SEO opcional y fixtures válidos/inválidos.  
**Fuera de alcance:** Product, relaciones agregadas, rutas o UI.  
**Dependencias:** M1.5.  
**Archivos/áreas previstas:** `src/content.config.ts`, `src/content/{categories,occasions,recipients}`, tests/fixtures.  
**Contratos afectados:** catálogo source, taxonomías.  
**Criterios de aceptación:** schemas tipados rechazan estados/slugs/campos inválidos con ubicación accionable; fixtures no son publicables.  
**Verificación:** tests positivos/negativos, typecheck y build.  
**Modelo recomendado:** SOL → LUNA.  
**Razón del modelo:** Sol concreta semántica; Luna implementa schemas explícitos.  
**Evidencia:** —

## M2.2 — Schema de producto, precio y medios

**Estado:** PENDING  
**Objetivo:** expresar el contrato editorial completo de Product sin lógica agregada.  
**Alcance:** unión de precio, status, relaciones por ID, personalización, featured/order, media/alt y overrides SEO; límites iniciales de assets.  
**Fuera de alcance:** comprobar IDs referenciados, UI, optimización final o WhatsApp.  
**Dependencias:** M2.1.  
**Archivos/áreas previstas:** content config/model DTO, `src/content/products`, tests/fixtures.  
**Contratos afectados:** Product, Price, Media, publicación.  
**Criterios de aceptación:** combinaciones discriminadas correctas; publicados sin mínimos fallan; drafts pueden estar incompletos sólo según regla explícita; importes no usan float ambiguo.  
**Verificación:** matriz de tests por price/status/media, typecheck y build.  
**Modelo recomendado:** SOL → LUNA.  
**Razón del modelo:** modelado con casos límite seguido de implementación mecánica.  
**Evidencia:** —

## M2.3 — Adaptador source y modelo de dominio

**Estado:** PENDING  
**Objetivo:** separar Content Collections/YAML del catálogo consumido por la web.  
**Alcance:** DTOs, mapping explícito, tipos de dominio, carga única y errores con contexto; dependencias en dirección correcta.  
**Fuera de alcance:** reglas de relaciones, queries de UI o abstracción multi-source genérica.  
**Dependencias:** M2.2.  
**Archivos/áreas previstas:** `src/lib/catalog/source/`, `src/lib/catalog/domain/`, tests.  
**Contratos afectados:** source → domain, errores, mantenibilidad.  
**Criterios de aceptación:** dominio no importa presentation; componentes futuros no leen colecciones; mapping está cubierto y no hay interfaces especulativas.  
**Verificación:** tests de mapping/errores, inspección de imports, typecheck.  
**Modelo recomendado:** SOL.  
**Razón del modelo:** límite arquitectónico crítico para evolución futura.  
**Evidencia:** —

## M2.4 — Validación agregada y relaciones

**Estado:** PENDING  
**Objetivo:** impedir builds con identidad, relación o publicación incoherentes.  
**Alcance:** unicidad, referencias existentes/publicables, portada, moneda, archivos de imagen, slugs/IDs y errores agregados accionables.  
**Fuera de alcance:** routing, componentes o contenido real completo.  
**Dependencias:** M2.3.  
**Archivos/áreas previstas:** domain validation, source asset resolver, tests/fixtures.  
**Contratos afectados:** catálogo, media, build fail-fast.  
**Criterios de aceptación:** cada invariante de `catalog-contract.md` tiene caso; múltiples fallos útiles se reportan; build aborta antes de publicar.  
**Verificación:** tests negativos parametrizados, ejecución de build con fixture inválido controlado y restauración.  
**Modelo recomendado:** LUNA → SOL REVIEW.  
**Razón del modelo:** muchos tests mecánicos con auditoría de completitud semántica.  
**Evidencia:** —

## M2.5 — Queries y contrato de rutas

**Estado:** PENDING  
**Objetivo:** ofrecer lecturas deterministas para home, listados, taxonomías y producto.  
**Alcance:** publicados, featured/orden, lookup por slug/ID, agrupación por taxonomía, relacionados básicos y funciones puras de URL.  
**Fuera de alcance:** páginas, SEO metadata, ranking inteligente o analytics.  
**Dependencias:** M2.4.  
**Archivos/áreas previstas:** `src/lib/catalog/domain/queries.ts`, `routes.ts`, tests.  
**Contratos afectados:** catálogo, URLs, presentation API.  
**Criterios de aceptación:** orden estable con desempate; drafts nunca salen; rutas coinciden con `seo-strategy.md`; ausencia produce resultado explícito.  
**Verificación:** tests de rutas, filtrado, orden y relaciones múltiples; typecheck.  
**Modelo recomendado:** LUNA.  
**Razón del modelo:** funciones puras pequeñas sobre contratos definidos.  
**Evidencia:** —

## M2.6 — Suite integral y catálogo representativo no productivo

**Estado:** PENDING  
**Objetivo:** demostrar el pipeline completo con todas las variantes sin inventar catálogo publicado.  
**Alcance:** fixtures o contenido marcado no publicable para fixed/from/on_request, relaciones múltiples, drafts y medios; suite end-to-end de carga.  
**Fuera de alcance:** datos comerciales finales o páginas visuales.  
**Dependencias:** M2.5.  
**Archivos/áreas previstas:** tests/fixtures, catálogo de desarrollo aislado, documentación editorial breve.  
**Contratos afectados:** catálogo completo, testing.  
**Criterios de aceptación:** variantes cubiertas; fixtures no aparecen en build productivo; un catálogo válido se carga inmutable y determinista.  
**Verificación:** suite completa, build limpio y búsqueda en `dist` que confirme ausencia de fixtures/drafts.  
**Modelo recomendado:** LUNA → SOL REVIEW.  
**Razón del modelo:** elaboración de fixtures/tests con revisión final del gate G2.  
**Evidencia:** —

---

# M3 — Design System

**Estado:** PENDING  
**Gate:** G3.

## M3.1 — Dirección visual y contrato de marca

**Estado:** PENDING  
**Objetivo:** convertir activos/referencias aprobados en una dirección visual implementable.  
**Alcance:** inventario de logo/fuentes/licencias, mood/dirección, principios aplicados, paleta/tipo propuestas y decisiones mobile/accessibility; placeholders claramente temporales si faltan activos.  
**Fuera de alcance:** implementar home o fabricar identidad definitiva sin aprobación.  
**Dependencias:** M2.6 y entradas de marca de M0.3.  
**Archivos/áreas previstas:** `docs/design/visual-direction.md`, assets aprobados.  
**Contratos afectados:** marca, design system, accesibilidad.  
**Criterios de aceptación:** dirección coherente con Luna; licencias/propiedad registradas; decisiones aprobadas o blockers explícitos.  
**Verificación:** revisión visual en móvil/escritorio y checklist de contraste/licencias.  
**Modelo recomendado:** SOL.  
**Razón del modelo:** síntesis de marca y tradeoffs visuales requieren criterio senior.  
**Evidencia:** —

## M3.2 — Tokens y foundations CSS

**Estado:** PENDING  
**Objetivo:** codificar escalas semánticas sin valores mágicos repetidos.  
**Alcance:** colores, tipografía, spacing, radii, sombras, containers, breakpoints, z-index y motion/reduced-motion.  
**Fuera de alcance:** componentes de sección o páginas finales.  
**Dependencias:** M3.1.  
**Archivos/áreas previstas:** `src/styles/tokens.css`, foundations y documentación corta de uso.  
**Contratos afectados:** UI, responsive, accessibility, performance.  
**Criterios de aceptación:** tokens semánticos cubren estados; no dependen de JS; contraste previsto; fuentes tienen estrategia de carga.  
**Verificación:** lint/build, inspección en viewport y checker de contraste.  
**Modelo recomendado:** LUNA.  
**Razón del modelo:** traducción directa de especificación visual a CSS.  
**Evidencia:** —

## M3.3 — Base tipográfica, layout y estados globales

**Estado:** PENDING  
**Objetivo:** lograr una página legible y estable con HTML nativo.  
**Alcance:** reset contenido, body/headings/prose, container/section, enlaces, foco, selección, skip link y estilos de medios.  
**Fuera de alcance:** cards, header o home.  
**Dependencias:** M3.2.  
**Archivos/áreas previstas:** `src/styles/global.css`, BaseLayout, prueba/showcase interna.  
**Contratos afectados:** UI base, a11y, Core Web Vitals.  
**Criterios de aceptación:** zoom/teclado funcional, foco visible, sin overflow a 320 px, layout estable con fuentes/medios.  
**Verificación:** build, inspección 320/768/1440, teclado y reduced motion.  
**Modelo recomendado:** LUNA.  
**Razón del modelo:** CSS base local y verificable.  
**Evidencia:** —

## M3.4 — Primitives interactivos

**Estado:** PENDING  
**Objetivo:** crear botones/enlaces/iconos/badges accesibles y composables.  
**Alcance:** variantes necesarias, targets táctiles, iconos decorativos/semánticos y estados hover/focus/active/disabled aplicables.  
**Fuera de alcance:** formularios no requeridos, framework UI o handlers de analytics.  
**Dependencias:** M3.3.  
**Archivos/áreas previstas:** `src/components/ui/`, styles y tests/render checks.  
**Contratos afectados:** UI, accessibility.  
**Criterios de aceptación:** semántica nativa correcta; API pequeña; CTA se puede renderizar como enlace real; sin hidratación.  
**Verificación:** typecheck/build, teclado, contraste y markup generado.  
**Modelo recomendado:** LUNA.  
**Razón del modelo:** componentes acotados con criterios claros.  
**Evidencia:** —

## M3.5 — Patrones de catálogo y navegación contextual

**Estado:** PENDING  
**Objetivo:** disponer de cards, media, breadcrumb y grupos de contenido reutilizables.  
**Alcance:** ProductCard, TaxonomyCard, responsive media wrapper, Breadcrumb visual y patrones de sección/lista; estados de ausencia honestos.  
**Fuera de alcance:** generar páginas, JSON-LD, galería completa o datos hardcodeados.  
**Dependencias:** M3.4.  
**Archivos/áreas previstas:** `src/components/catalog/`, `navigation/`, showcase/tests.  
**Contratos afectados:** UI, catálogo presentation, accessibility.  
**Criterios de aceptación:** props reciben proyecciones tipadas; imágenes dimensionadas; headings/listas correctos; cards no anidan enlaces interactivos inválidos.  
**Verificación:** build, inspección de HTML, visual responsive y teclado.  
**Modelo recomendado:** LUNA → SOL REVIEW.  
**Razón del modelo:** implementación mecánica con revisión de coherencia del gate G3.  
**Evidencia:** —

---

# M4 — Home + Discovery

**Estado:** PENDING  
**Gate:** G4.

## M4.1 — Shell público: header, navegación y footer

**Estado:** PENDING  
**Objetivo:** establecer navegación global simple y reconocible en móvil/escritorio.  
**Alcance:** header/logo, nav de destinos principales, menú móvil con HTML/JS mínimo justificado, skip target y footer con datos confirmados/placeholders no publicables.  
**Fuera de alcance:** hero, catálogo en home o datos legales inventados.  
**Dependencias:** M3.5.  
**Archivos/áreas previstas:** layout y `src/components/site/`.  
**Contratos afectados:** UI, navegación, a11y, performance.  
**Criterios de aceptación:** funciona por teclado/sin JS en lo esencial; foco y estado actual claros; no bloquea scroll/resize; datos centralizados.  
**Verificación:** build, navegación 320/768/1440, teclado y JS deshabilitado.  
**Modelo recomendado:** LUNA → SOL REVIEW.  
**Razón del modelo:** componente habitual con riesgo accesible/responsive que merece review.  
**Evidencia:** —

## M4.2 — Hero emocional

**Estado:** PENDING  
**Objetivo:** comunicar propuesta y primer camino de descubrimiento sin perjudicar LCP.  
**Alcance:** H1/copy aprobado, CTA principal/secundario, composición visual y media optimizada/responsive.  
**Fuera de alcance:** sliders, vídeo pesado, analytics o copy no aprobado.  
**Dependencias:** M4.1 y contenido/activo hero disponible.  
**Archivos/áreas previstas:** home y `src/components/home/Hero.astro`, asset aprobado.  
**Contratos afectados:** marca, UI, SEO on-page, performance.  
**Criterios de aceptación:** propuesta comprensible; un H1; CTA real; imagen con dimensiones/prioridad correcta; 320 px sin recorte dañino.  
**Verificación:** build, inspección visual, HTML y medición LCP inicial.  
**Modelo recomendado:** LUNA.  
**Razón del modelo:** sección visual acotada sobre sistema existente.  
**Evidencia:** —

## M4.3 — Navegación de categorías, ocasiones y destinatarios

**Estado:** PENDING  
**Objetivo:** ofrecer varias formas claras de encontrar un regalo.  
**Alcance:** secciones home basadas en queries del catálogo, cards/enlaces y orden editorial con fallback.  
**Fuera de alcance:** páginas destino, filtros dinámicos o facetas combinatorias.  
**Dependencias:** M4.2.  
**Archivos/áreas previstas:** componentes home, queries/proyecciones si son estrictamente necesarias.  
**Contratos afectados:** discovery, catálogo, internal linking.  
**Criterios de aceptación:** cero taxonomías hardcodeadas; sólo publicables; orden determinista; enlaces usan route builder.  
**Verificación:** tests de proyección, build e inspección de enlaces.  
**Modelo recomendado:** LUNA.  
**Razón del modelo:** composición directa de contratos existentes.  
**Evidencia:** —

## M4.4 — Ideas/productos destacados

**Estado:** PENDING  
**Objetivo:** presentar productos prioritarios con contexto suficiente para seleccionarlos.  
**Alcance:** bloque destacados, ProductCards, precio semántico y estado sin destacados.  
**Fuera de alcance:** ficha, CTA WhatsApp directo o algoritmo de recomendación.  
**Dependencias:** M4.3.  
**Archivos/áreas previstas:** home/components y tests de render/proyección.  
**Contratos afectados:** catálogo, UI, conversión `select_item` futuro.  
**Criterios de aceptación:** orden/featured vienen del dominio; precio `from/on_request` no se tergiversa; imágenes responsivas.  
**Verificación:** build, variantes de precio y visual móvil/escritorio.  
**Modelo recomendado:** LUNA.  
**Razón del modelo:** sección repetible con lógica ya cubierta.  
**Evidencia:** —

## M4.5 — Confianza y muestra de trabajos

**Estado:** PENDING  
**Objetivo:** reducir incertidumbre mediante señales y fotografías reales verificables.  
**Alcance:** bloque de proceso/confianza y galería editorial de trabajos aprobados; atribución si aplica.  
**Fuera de alcance:** inventar reseñas/cifras, consumir feeds sociales o carrusel complejo.  
**Dependencias:** M4.4 y contenido aprobado.  
**Archivos/áreas previstas:** componentes home, assets/content de sitio.  
**Contratos afectados:** confianza, media, marca, accessibility.  
**Criterios de aceptación:** toda afirmación tiene fuente/aprobación; galería accesible y optimizada; ausencia se resuelve sin hueco falso.  
**Verificación:** revisión de contenido, derechos/alt, build y visual.  
**Modelo recomendado:** LUNA.  
**Razón del modelo:** implementación local condicionada a contenido validado.  
**Evidencia:** —

## M4.6 — CTA “Cuéntanos tu idea” en Home

**Estado:** PENDING  
**Objetivo:** ofrecer conversión a visitantes sin producto exacto.  
**Alcance:** sección emocional, CTA accesible y builder puro limitado al mensaje personalizado desde configuración central (instrumentación posterior).  
**Fuera de alcance:** formulario, CRM, analytics o builder completo de producto.  
**Dependencias:** M4.5 y configuración WhatsApp aprobada.  
**Archivos/áreas previstas:** componente home, config y `src/lib/whatsapp/` limitado al caso personalizado.  
**Contratos afectados:** conversión, WhatsApp, UI.  
**Criterios de aceptación:** mensaje no vacío/contextual; teléfono no duplicado; funciona sin JS; copy aprobado.  
**Verificación:** test de URL/mensaje básico, enlace real y prueba móvil.  
**Modelo recomendado:** LUNA.  
**Razón del modelo:** CTA acotado con configuración ya definida.  
**Evidencia:** —

## M4.7 — Índice `/productos/`

**Estado:** PENDING  
**Objetivo:** publicar una vista completa y rastreable del catálogo vigente.  
**Alcance:** ruta estática, introducción, lista ordenada, estado vacío no publicable y enlaces a fichas.  
**Fuera de alcance:** filtros cliente, paginación sin necesidad o ficha.  
**Dependencias:** M4.6.  
**Archivos/áreas previstas:** `src/pages/productos/index.astro`, componentes/listing tests.  
**Contratos afectados:** URLs, discovery, catálogo, SEO básico.  
**Criterios de aceptación:** sólo publicados; H1/estructura correctos; todas las fichas esperadas enlazadas; cero JS requerido.  
**Verificación:** build, conteo catálogo↔HTML y link check.  
**Modelo recomendado:** LUNA.  
**Razón del modelo:** ruta estática mecánica.  
**Evidencia:** —

## M4.8 — Índice y landings de categorías

**Estado:** PENDING  
**Objetivo:** publicar navegación útil por tipo de producto.  
**Alcance:** `/categorias/` y `/categorias/[slug]/`, introducción editorial, productos relacionados y comportamiento de categoría vacía/ausente.  
**Fuera de alcance:** ocasiones, destinatarios, facetas combinadas o metadata avanzada de M6.  
**Dependencias:** M4.7.  
**Archivos/áreas previstas:** `src/pages/categorias/`, componentes compartidos mínimos y route tests.  
**Contratos afectados:** rutas, Category, SEO, internal linking.  
**Criterios de aceptación:** paths deterministas; ninguna landing vacía indexable salvo decisión explícita; contenido y enlaces visibles útiles.  
**Verificación:** test de rutas/conteos, build y link check de categorías.  
**Modelo recomendado:** LUNA.  
**Razón del modelo:** primera aplicación acotada del patrón de landing.  
**Evidencia:** —

## M4.9 — Índice y landings de ocasiones

**Estado:** PENDING  
**Objetivo:** publicar navegación útil por momento o celebración.  
**Alcance:** `/ocasiones/` y `/ocasiones/[slug]/` reutilizando el patrón aprobado, con contenido, productos y estado vacío/ausente.  
**Fuera de alcance:** categorías, destinatarios, facetas combinadas o metadata avanzada de M6.  
**Dependencias:** M4.8.  
**Archivos/áreas previstas:** `src/pages/ocasiones/`, componentes compartidos y route tests.  
**Contratos afectados:** rutas, Occasion, SEO, internal linking.  
**Criterios de aceptación:** sólo ocasiones publicables con contenido útil; orden/links deterministas; sin duplicación accidental del patrón.  
**Verificación:** test de rutas/conteos, build y link check de ocasiones.  
**Modelo recomendado:** LUNA.  
**Razón del modelo:** extensión mecánica de un patrón ya validado.  
**Evidencia:** —

## M4.10 — Índice y landings de destinatarios

**Estado:** PENDING  
**Objetivo:** publicar la intención `/regalos/` por persona destinataria.  
**Alcance:** `/regalos/` y `/regalos/[slug]/`, copy de intención, productos y estado vacío/ausente reutilizando el patrón.  
**Fuera de alcance:** categorías, ocasiones, combinación de facetas o metadata avanzada de M6.  
**Dependencias:** M4.9.  
**Archivos/áreas previstas:** `src/pages/regalos/`, componentes compartidos y route tests.  
**Contratos afectados:** rutas, Recipient, SEO, internal linking.  
**Criterios de aceptación:** sólo destinatarios publicables; lenguaje visible evita jerga interna; orden/links deterministas y contenido útil.  
**Verificación:** test de rutas/conteos, build y link check de regalos.  
**Modelo recomendado:** LUNA → SOL REVIEW.  
**Razón del modelo:** implementación mecánica con review SEO del mapping Recipient→regalos.  
**Evidencia:** —

## M4.11 — Integración y QA de descubrimiento

**Estado:** PENDING  
**Objetivo:** cerrar home/listados como recorrido coherente antes de fichas.  
**Alcance:** ajustar composición, jerarquía, responsive, estados y enlaces; eliminar duplicación/dead code directo.  
**Fuera de alcance:** ficha, analytics, SEO avanzado o rediseño del sistema.  
**Dependencias:** M4.10.  
**Archivos/áreas previstas:** home, listados y componentes M4.  
**Contratos afectados:** G4, UI, navigation, performance inicial.  
**Criterios de aceptación:** recorrido home→intención→selección funciona a 320/768/1440, por teclado y sin errores; contenido/links consistentes.  
**Verificación:** suite, build, smoke manual sin JS y capturas de viewports representativos.  
**Modelo recomendado:** LUNA → SOL REVIEW.  
**Razón del modelo:** corrección local seguida de auditoría del recorrido completo.  
**Evidencia:** —

---

# M5 — Product Detail + WhatsApp Conversion

**Estado:** PENDING  
**Gate:** G5.

## M5.1 — Extensión del builder WhatsApp para producto

**Estado:** PENDING  
**Objetivo:** completar el builder compartido con enlaces de producto correctos, centralizados y testables.  
**Alcance:** extender el caso personalizado de M4.6 con plantilla de producto, canonical de origen y matriz completa de normalización/URL/message encoding/errores.  
**Fuera de alcance:** analytics, UI de ficha, API Business o envío automático.  
**Dependencias:** M4.11.  
**Archivos/áreas previstas:** `src/lib/whatsapp/`, config y tests.  
**Contratos afectados:** WhatsApp, config, URLs, privacidad.  
**Criterios de aceptación:** mensaje nunca vacío; Unicode/acentos/URLs funcionan; no hay doble encoding; funciones puras cubren ambos flujos.  
**Verificación:** tests de matriz y apertura manual en móvil/desktop sin completar envío.  
**Modelo recomendado:** LUNA.  
**Razón del modelo:** utilidad pura con casos definidos.  
**Evidencia:** —

## M5.2 — Ruta y contenido principal de producto

**Estado:** PENDING  
**Objetivo:** generar una ficha estática comprensible para cada producto publicado.  
**Alcance:** `[slug]`, breadcrumb visual, nombre, resumen/descripción, precio semántico, contenido del pack y taxonomías; comportamiento ante slug ausente.  
**Fuera de alcance:** galería completa, CTA final, relacionados y JSON-LD.  
**Dependencias:** M5.1.  
**Archivos/áreas previstas:** `src/pages/productos/[slug].astro`, componentes product.  
**Contratos afectados:** catálogo, rutas, UI, conversión.  
**Criterios de aceptación:** una ruta por publicado, ninguna por draft; información coincide con dominio; price variants honestas; estructura semántica correcta.  
**Verificación:** route tests, build, inspección de variantes y 404.  
**Modelo recomendado:** LUNA → SOL REVIEW.  
**Razón del modelo:** implementación de ruta con revisión de la principal página de negocio.  
**Evidencia:** —

## M5.3 — Galería responsive de producto

**Estado:** PENDING  
**Objetivo:** mostrar portada y detalle visual con estabilidad y accesibilidad.  
**Alcance:** imagen principal, thumbnails/alternativas cuando existan, responsive images, alt/captions y progresión sin JS o JS mínimo justificado.  
**Fuera de alcance:** zoom complejo, lightbox dependiente de librería o edición de fotos.  
**Dependencias:** M5.2.  
**Archivos/áreas previstas:** componentes gallery/media y styles/tests.  
**Contratos afectados:** Media, UI, a11y, performance.  
**Criterios de aceptación:** dimensiones conocidas, navegación teclado si interactiva, fallback de una imagen, sin CLS perceptible ni descarga innecesaria.  
**Verificación:** viewports, teclado/sin JS, build y auditoría de requests/imágenes.  
**Modelo recomendado:** LUNA → SOL REVIEW.  
**Razón del modelo:** UI localizada con riesgos de accesibilidad y rendimiento.  
**Evidencia:** —

## M5.4 — Panel de conversión y CTA de producto

**Estado:** PENDING  
**Objetivo:** hacer evidente el siguiente paso con contexto suficiente.  
**Alcance:** precio/resumen, CTA “Pedir por WhatsApp”, mensaje con nombre+canonical, posición mobile/desktop, microcopy aprobado y fallback seguro.  
**Fuera de alcance:** sticky intrusivo, analytics, formulario o checkout.  
**Dependencias:** M5.3.  
**Archivos/áreas previstas:** componentes product/conversion, WhatsApp builder tests.  
**Contratos afectados:** UI, WhatsApp, conversion.  
**Criterios de aceptación:** CTA visible y accesible; href correcto sin JS; no oculta contenido/foco; producto/origen inequívocos.  
**Verificación:** tests de href, prueba móvil/desktop/teclado y mensaje previsualizado.  
**Modelo recomendado:** LUNA.  
**Razón del modelo:** integración directa de builder y patrón visual.  
**Evidencia:** —

## M5.5 — Personalización y confianza en ficha

**Estado:** PENDING  
**Objetivo:** responder dudas clave sin promesas no verificadas.  
**Alcance:** capacidades de personalización, contenido incluido, proceso/confianza y avisos aprobados condicionados al modelo.  
**Fuera de alcance:** configurador, cálculo dinámico, FAQ global o claims inventados.  
**Dependencias:** M5.4 y contenido aprobado.  
**Archivos/áreas previstas:** componentes product y proyecciones mínimas.  
**Contratos afectados:** catálogo customization, copy, conversión.  
**Criterios de aceptación:** secciones sólo aparecen con datos; headings/lectura correctos; no duplican información contradictoria.  
**Verificación:** casos con/sin personalización, revisión de copy y visual.  
**Modelo recomendado:** LUNA.  
**Razón del modelo:** render condicional sencillo sobre datos válidos.  
**Evidencia:** —

## M5.6 — Productos relacionados y continuidad

**Estado:** PENDING  
**Objetivo:** evitar callejones sin salida y facilitar alternativas pertinentes.  
**Alcance:** relacionados deterministas por taxonomía/orden, navegación a categoría/ocasión/destinatario y fallback.  
**Fuera de alcance:** personalización algorítmica, tracking o motor de recomendaciones.  
**Dependencias:** M5.5.  
**Archivos/áreas previstas:** query related, componente/list tests.  
**Contratos afectados:** catálogo, internal linking, discovery.  
**Criterios de aceptación:** producto actual excluido, drafts ausentes, sin duplicados y orden estable; enlaces válidos.  
**Verificación:** tests de query/casos límite, build y link check.  
**Modelo recomendado:** LUNA.  
**Razón del modelo:** regla determinista y UI reutilizada.  
**Evidencia:** —

## M5.7 — QA del recorrido de conversión

**Estado:** PENDING  
**Objetivo:** cerrar el camino listado→ficha→WhatsApp y la alternativa personalizada.  
**Alcance:** smoke de variantes, responsive/teclado/sin JS, mensajes, estados y correcciones directamente relacionadas.  
**Fuera de alcance:** instrumentación analytics o auditoría SEO completa.  
**Dependencias:** M5.6.  
**Archivos/áreas previstas:** páginas M4/M5, browser smoke inicial y evidencia.  
**Contratos afectados:** G5, conversion, UI, WhatsApp.  
**Criterios de aceptación:** ambos flujos llegan a URL WhatsApp correcta; ningún enlace vacío; no hay blocker visual/a11y crítico en rutas representativas.  
**Verificación:** suite, build, matriz manual móvil/desktop y smoke sin JS.  
**Modelo recomendado:** LUNA → SOL REVIEW.  
**Razón del modelo:** Luna corrige; Sol audita el principal contrato comercial.  
**Evidencia:** —

---

# M6 — SEO + Structured Data + Agent Discoverability

**Estado:** PENDING  
**Gate:** G6.

## M6.1 — Metadata, canonical y OpenGraph

**Estado:** PENDING  
**Objetivo:** generar metadata única y coherente desde config/dominio.  
**Alcance:** title templates, description fallback controlado, canonical absoluto, robots meta y OpenGraph/Twitter esenciales por tipo de página.  
**Fuera de alcance:** JSON-LD, sitemap o copy SEO masivo.  
**Dependencias:** M5.7.  
**Archivos/áreas previstas:** `src/lib/seo/metadata.ts`, layout/head y tests.  
**Contratos afectados:** SEO, config, Media, URLs.  
**Criterios de aceptación:** metadata única en muestra completa; canonical coincide con route builder; drafts/técnicas no se indexan; imagen social válida.  
**Verificación:** tests contractuales y script sobre HTML de `dist`.  
**Modelo recomendado:** SOL → LUNA.  
**Razón del modelo:** Sol define fallbacks/semántica; Luna implementa generación repetible.  
**Evidencia:** —

## M6.2 — Sitemap, robots y política de crawl

**Estado:** PENDING  
**Objetivo:** exponer únicamente URLs canónicas publicables.  
**Alcance:** sitemap estático/integración Astro justificada, robots con sitemap, 404 y exclusión de drafts/técnicas.  
**Fuera de alcance:** redirects históricos o Search Console.  
**Dependencias:** M6.1.  
**Archivos/áreas previstas:** Astro config/integration, `public/robots.txt` o endpoint estático, checks `dist`.  
**Contratos afectados:** crawl, URLs, deployment.  
**Criterios de aceptación:** set sitemap = rutas indexables esperadas; URLs absolutas HTTPS/apex/trailing slash; no fixtures/drafts.  
**Verificación:** comparación automatizada catálogo/rutas/sitemap, build y parse XML.  
**Modelo recomendado:** LUNA → SOL REVIEW.  
**Razón del modelo:** implementación estándar con review SEO del conjunto publicado.  
**Evidencia:** —

## M6.3 — Breadcrumbs semánticos e internal linking

**Estado:** PENDING  
**Objetivo:** alinear navegación visible, jerarquía y enlaces rastreables.  
**Alcance:** modelo único de breadcrumb, enlaces contextuales y auditoría de huérfanas/dead links; preparar proyección para JSON-LD.  
**Fuera de alcance:** schema BreadcrumbList final o rediseño de navegación.  
**Dependencias:** M6.2.  
**Archivos/áreas previstas:** seo/navigation builders, componente Breadcrumb y link checker/tests.  
**Contratos afectados:** SEO, UX, URLs.  
**Criterios de aceptación:** breadcrumb visible coincide con canonical; ninguna ficha/taxonomía publicable queda huérfana; enlaces no dependen de JS.  
**Verificación:** graph/link check de `dist`, tests de rutas y teclado.  
**Modelo recomendado:** LUNA.  
**Razón del modelo:** consolidación explícita sobre rutas existentes.  
**Evidencia:** —

## M6.4 — Product, Offer y BreadcrumbList JSON-LD

**Estado:** PENDING  
**Objetivo:** describir fichas con datos estructurados veraces y consistentes con HTML.  
**Alcance:** builders puros, Product/BreadcrumbList y Offer sólo para price cases correctos; URLs/imágenes absolutas.  
**Fuera de alcance:** ratings, availability, shipping o políticas no confirmadas.  
**Dependencias:** M6.3.  
**Archivos/áreas previstas:** `src/lib/seo/structured-data/`, product page y tests.  
**Contratos afectados:** catálogo, SEO structured data.  
**Criterios de aceptación:** schema varía correctamente con fixed/from/on_request; no inventa campos; JSON seguro y coincide con visible.  
**Verificación:** tests snapshot semánticos, validator/schema tool y rich-results manual en muestra.  
**Modelo recomendado:** SOL.  
**Razón del modelo:** datos estructurados incorrectos generan riesgo SEO directo.  
**Evidencia:** —

## M6.5 — Organization y WebSite JSON-LD

**Estado:** PENDING  
**Objetivo:** publicar identidad global sólo con datos empresariales verificados.  
**Alcance:** builders desde config, logo/URL/contactPoint/social sólo si confirmados y una inclusión no duplicada.  
**Fuera de alcance:** LocalBusiness sin requisitos, SearchAction sin búsqueda o perfiles no verificados.  
**Dependencias:** M6.4 y datos de identidad aprobados.  
**Archivos/áreas previstas:** structured-data builders, BaseLayout/home y tests.  
**Contratos afectados:** configuración, identidad, SEO.  
**Criterios de aceptación:** schema mínimo válido; campos opcionales se omiten correctamente; una fuente de configuración.  
**Verificación:** tests, validación externa y comparación con contenido/footer.  
**Modelo recomendado:** LUNA → SOL REVIEW.  
**Razón del modelo:** builder simple con revisión semántica crítica.  
**Evidencia:** —

## M6.6 — `/catalog.json` público

**Estado:** PENDING  
**Objetivo:** ofrecer una proyección machine-readable estable del catálogo publicado.  
**Alcance:** endpoint/archivo estático, versión de schema, generatedAt reproducible o política explícita, entidades/relaciones/URLs/precios/media públicos y cache headers posibles en Pages.  
**Fuera de alcance:** API runtime, búsqueda, drafts, rutas internas o protocolo agentic.  
**Dependencias:** M6.5.  
**Archivos/áreas previstas:** `src/pages/catalog.json.ts` o generador, projection/tests y documentación de schema.  
**Contratos afectados:** catálogo público, agents, SEO, privacidad.  
**Criterios de aceptación:** JSON válido/determinista; sólo publicados; URLs absolutas; schema documentado; no filtra filesystem/config interna.  
**Verificación:** schema test, diff reproducible entre builds y comparación con catálogo/HTML.  
**Modelo recomendado:** LUNA → SOL REVIEW.  
**Razón del modelo:** proyección mecánica con revisión de superficie pública.  
**Evidencia:** —

## M6.7 — Auditoría SEO técnica pre-analytics

**Estado:** PENDING  
**Objetivo:** cerrar G6 con evidencia sobre todo el artefacto.  
**Alcance:** titles/descriptions/canonical/headings/OG, crawl, 404, links, JSON-LD, catalog JSON, render sin JS y riesgos de contenido fino.  
**Fuera de alcance:** redirects de release, DNS o mejoras de contenido no aprobado.  
**Dependencias:** M6.6.  
**Archivos/áreas previstas:** checks/scripts, reporte en `docs/seo/technical-audit.md`, correcciones directas.  
**Contratos afectados:** G6 completo.  
**Criterios de aceptación:** cero issue crítico/alto abierto; medios/bajos documentados con propietario; muestras externas válidas.  
**Verificación:** suite/build, crawler local y validadores estructurados con evidencia fechada.  
**Modelo recomendado:** SOL.  
**Razón del modelo:** auditoría transversal y priorización de riesgo SEO.  
**Evidencia:** —

---

# M7 — Analytics + Observability

**Estado:** PENDING  
**Gate:** G7.

## M7.1 — Decisión de analytics y privacidad

**Estado:** PENDING  
**Objetivo:** seleccionar medición proporcional y legalmente operable antes de cargar scripts.  
**Alcance:** requisitos, proveedor/alternativas, cookies/consentimiento, retención, ownership, exclusión interna, performance y diccionario final de eventos.  
**Fuera de alcance:** implementar tags o asesoramiento legal definitivo.  
**Dependencias:** M6.7 y decisión/inputs de privacidad.  
**Archivos/áreas previstas:** `docs/conversion/analytics-decision.md`, actualización de strategy/config contract.  
**Contratos afectados:** analytics, privacy, performance.  
**Criterios de aceptación:** Context/Decision/Alternatives/Consequences; PII prohibida; consentimiento y responsable definidos; no queda blocker para código.  
**Verificación:** revisión contra eventos/legales/performance y aprobación del owner.  
**Modelo recomendado:** SOL.  
**Razón del modelo:** tradeoff transversal entre negocio, privacidad y rendimiento.  
**Evidencia:** —

## M7.2 — Facade y adaptador de analytics

**Estado:** PENDING  
**Objetivo:** desacoplar intents de UI del proveedor y degradar con seguridad.  
**Alcance:** tipos/event validation, atributos/API mínima, carga condicional por config/consentimiento y adapter único.  
**Fuera de alcance:** instrumentar todas las páginas o crear un data layer genérico hipotético.  
**Dependencias:** M7.1.  
**Archivos/áreas previstas:** `src/lib/analytics/`, layout/script y tests.  
**Contratos afectados:** analytics, UI boundary, privacy.  
**Criterios de aceptación:** payload tipado/sanitizado; sin proveedor/consent no falla ni envía; script mínimo y diferido.  
**Verificación:** tests unitarios, network check en modos on/off y build size diff.  
**Modelo recomendado:** SOL → LUNA.  
**Razón del modelo:** Sol fija boundary; Luna implementa adapter acotado.  
**Evidencia:** —

## M7.3 — Instrumentación de vistas y selección

**Estado:** PENDING  
**Objetivo:** medir `view_item` y `select_item` sin duplicados ni lógica de proveedor en cards/fichas.  
**Alcance:** fichas, destacados/listados/taxonomías, list_id/position/source y price optional.  
**Fuera de alcance:** clic WhatsApp o funnels server-side.  
**Dependencias:** M7.2.  
**Archivos/áreas previstas:** product/list components/pages y integration tests.  
**Contratos afectados:** event schema, catálogo, analytics.  
**Criterios de aceptación:** una view por carga pertinente; selección contiene contexto; no envía PII/campos falsos; navegación funciona sin tracker.  
**Verificación:** tests/event capture y debug del proveedor en rutas representativas.  
**Modelo recomendado:** LUNA.  
**Razón del modelo:** instrumentación repetitiva según contrato fuerte.  
**Evidencia:** —

## M7.4 — Instrumentación de WhatsApp

**Estado:** PENDING  
**Objetivo:** medir `whatsapp_click` y `custom_whatsapp_click` sin perjudicar conversión.  
**Alcance:** CTAs de ficha/home/globales, location/source/product payload y navegación resiliente.  
**Fuera de alcance:** contenido de conversaciones, entrega/venta o delayed navigation largo.  
**Dependencias:** M7.3.  
**Archivos/áreas previstas:** conversion components, analytics adapter/tests.  
**Contratos afectados:** analytics, WhatsApp, privacy, UX.  
**Criterios de aceptación:** evento correcto por activación teclado/puntero; href siempre navega aunque tracker falle; mensaje/teléfono nunca entran en payload.  
**Verificación:** tests con adapter fallido, debug/network y prueba real de enlace sin envío.  
**Modelo recomendado:** LUNA → SOL REVIEW.  
**Razón del modelo:** código pequeño con revisión del evento comercial principal.  
**Evidencia:** —

## M7.5 — QA de medición y runbook

**Estado:** PENDING  
**Objetivo:** demostrar recepción y documentar operación sin datos personales.  
**Alcance:** matriz evento/ruta/payload, consent modes, debug, tráfico interno, alertas básicas disponibles y guía de verificación postrelease.  
**Fuera de alcance:** dashboards avanzados, atribución perfecta o integración CRM.  
**Dependencias:** M7.4.  
**Archivos/áreas previstas:** `docs/conversion/analytics-runbook.md`, tests/evidencia.  
**Contratos afectados:** G7, observability, privacy.  
**Criterios de aceptación:** todos los eventos pasan matriz; duplicados/PII ausentes; owner sabe verificar; degradación sin consent/proveedor comprobada.  
**Verificación:** sesión de debug fechada, network capture redactada y suite.  
**Modelo recomendado:** LUNA → SOL REVIEW.  
**Razón del modelo:** ejecución sistemática con revisión final de privacidad y cobertura.  
**Evidencia:** —

---

# M8 — Quality + Performance + Accessibility

**Estado:** PENDING  
**Gate:** G8.

## M8.1 — Auditoría y corrección de accesibilidad

**Estado:** PENDING  
**Objetivo:** eliminar barreras WCAG 2.2 AA relevantes en recorridos V1.  
**Alcance:** semántica, teclado, foco, contraste, nombres, alt, headings, landmarks, zoom, reduced motion y axe/manual; fixes directos.  
**Fuera de alcance:** certificación legal o rediseño no relacionado.  
**Dependencias:** M7.5.  
**Archivos/áreas previstas:** UI/pages/styles, browser tests, `docs/quality/accessibility-audit.md`.  
**Contratos afectados:** accessibility, UI, conversion.  
**Criterios de aceptación:** cero blocker/critical automatizado; recorrido completo teclado; hallazgos manuales high resueltos; excepciones justificadas.  
**Verificación:** axe, keyboard/zoom/reader spot check y suite/build.  
**Modelo recomendado:** LUNA → SOL REVIEW.  
**Razón del modelo:** correcciones concretas seguidas de auditoría experta.  
**Evidencia:** —

## M8.2 — Pipeline de imágenes y presupuestos de rendimiento

**Estado:** PENDING  
**Objetivo:** asegurar fotos protagonistas sin degradar CWV ni salud de Git.  
**Alcance:** AVIF/WebP/fallback, srcset/sizes, lazy/eager correcto, dimensiones, límites de ingestión/repo, fonts y budgets de JS/CSS/imágenes/LCP/CLS.  
**Fuera de alcance:** retocar creativamente originales o CDN runtime sin necesidad.  
**Dependencias:** M8.1 y muestras finales de medios.  
**Archivos/áreas previstas:** media components/config, asset checks, docs y CI.  
**Contratos afectados:** Media, performance, repository health.  
**Criterios de aceptación:** todas las imágenes de rutas muestra cumplen política; LCP priorizado; no originales gigantes; budgets automatizados estables.  
**Verificación:** build stats, request/format audit, Lighthouse repetido y asset checker.  
**Modelo recomendado:** SOL → LUNA.  
**Razón del modelo:** Sol calibra budgets; Luna implementa optimización/checks.  
**Evidencia:** —

## M8.3 — Responsive y compatibilidad de navegadores

**Estado:** PENDING  
**Objetivo:** validar experiencia real en matriz soportada.  
**Alcance:** 320/375/768/1024/1440+, orientación, touch/pointer, navegadores acordados, no-JS y correcciones directas.  
**Fuera de alcance:** navegadores fuera de política o nuevas features.  
**Dependencias:** M8.2.  
**Archivos/áreas previstas:** styles/components/pages y visual/browser tests.  
**Contratos afectados:** responsive, compatibility, conversion.  
**Criterios de aceptación:** sin overflow/solapamiento; CTAs alcanzables; media/copy legibles; recorrido completo en matriz prioritaria.  
**Verificación:** matriz documentada con capturas/smoke y suite.  
**Modelo recomendado:** LUNA.  
**Razón del modelo:** comprobación y corrección localizada.  
**Evidencia:** —

## M8.4 — Hardening de tests y artefacto

**Estado:** PENDING  
**Objetivo:** cubrir regresiones de mayor riesgo sin tests triviales.  
**Alcance:** gaps de catálogo/rutas/WhatsApp/SEO/structured data/events, browser smoke crítico, link/HTML checks y determinismo de build.  
**Fuera de alcance:** perseguir porcentaje de coverage arbitrario o snapshots frágiles de toda UI.  
**Dependencias:** M8.3.  
**Archivos/áreas previstas:** tests, scripts, CI.  
**Contratos afectados:** calidad completa, CI.  
**Criterios de aceptación:** matriz de riesgo cubierta; tests fallan ante mutaciones representativas; CI razonable/reproducible; cero flaky conocido.  
**Verificación:** suite repetida, build limpio y revisión de casos por contrato.  
**Modelo recomendado:** LUNA → SOL REVIEW.  
**Razón del modelo:** implementación amplia de tests con revisión de valor real.  
**Evidencia:** —

## M8.5 — Seguridad, dependencias y superficie pública

**Estado:** PENDING  
**Objetivo:** minimizar riesgos antes del release.  
**Alcance:** secretos en archivos/historial/logs, reglas `.gitignore`, Actions Secrets/permissions, dependencias/licencias, npm audit evaluado, headers posibles, enlaces externos, JSON injection y datos expuestos en dist/catalog/source maps.  
**Fuera de alcance:** pentest de backend inexistente o upgrades no relacionados sin análisis.  
**Dependencias:** M8.4.  
**Archivos/áreas previstas:** repo/config/workflows/dist, `docs/quality/security-review.md`.  
**Contratos afectados:** security, privacy, deployment, supply chain.  
**Criterios de aceptación:** cero secreto; cero vulnerabilidad critical/high explotable sin mitigación; permisos mínimos; superficie pública aprobada.  
**Verificación:** secret/dependency scans sobre worktree e historial, revisión Actions/logs y búsqueda de datos prohibidos en artefacto/source maps.  
**Modelo recomendado:** SOL.  
**Razón del modelo:** revisión de seguridad transversal y basada en riesgo.  
**Evidencia:** —

## M8.6 — Gate de release candidate

**Estado:** PENDING  
**Objetivo:** producir un candidato inmutable y decidir go/no-go técnico.  
**Alcance:** ejecutar todos los gates, Lighthouse, a11y, SEO, smoke, sizes, contenido provisional y lista de blockers/known issues.  
**Fuera de alcance:** producción, DNS o aceptar silenciosamente fallos.  
**Dependencias:** M8.5.  
**Archivos/áreas previstas:** `docs/quality/release-candidate.md`, tag/artifact policy y fixes directos.  
**Contratos afectados:** G8 y todos los contratos V1.  
**Criterios de aceptación:** checks críticos PASS; no fixture/TBD publicable; artifact identificable; known issues aceptados con owner; rollback posible.  
**Verificación:** `npm ci`, lint, typecheck, test, build, audits y checksum/commit del artefacto.  
**Modelo recomendado:** SOL.  
**Razón del modelo:** decisión de release requiere auditoría integral.  
**Evidencia:** —

---

# M9 — Migration + Production Release

**Estado:** PENDING  
**Gate:** G9.

## M9.1 — Catálogo, copy y assets finales

**Estado:** PENDING  
**Objetivo:** sustituir material provisional por contenido aprobado y trazable.  
**Alcance:** YAML final, fotos optimizables, alt, marca/favicon/OG, textos y datos legales/config; revisión de derechos y completitud.  
**Fuera de alcance:** inventar contenido, cambiar schemas sin necesidad o migrar originales gigantes.  
**Dependencias:** M8.6 y entradas M0.3 disponibles.  
**Archivos/áreas previstas:** content/assets/config y checklist readiness.  
**Contratos afectados:** catálogo, marca, SEO, legal, media.  
**Criterios de aceptación:** todo publicado está aprobado; cero fixture/TBD; derechos/fuentes registrados; catálogo/build y visual QA pasan.  
**Verificación:** validation suite, asset/license checklist, build, revisión editorial completa.  
**Modelo recomendado:** LUNA → SOL REVIEW.  
**Razón del modelo:** carga sistemática con revisión de coherencia global.  
**Evidencia:** —

## M9.2 — Mapa y ejecución de redirects

**Estado:** PENDING  
**Objetivo:** preservar cualquier señal histórica conocida.  
**Alcance:** deduplicar inventario old→new, decidir 301/410/conservar, implementar en capa viable (Cloudflare/hosting) y detectar cadenas/loops.  
**Fuera de alcance:** redirects especulativos masivos o cambiar slugs nuevos sin motivo.  
**Dependencias:** M9.1 y M0.1; si se documentó ausencia total, producir acta de no redirects.  
**Archivos/áreas previstas:** `docs/seo/redirect-map.csv`, config edge/hosting cuando aplique.  
**Contratos afectados:** migration SEO, hosting, URLs.  
**Criterios de aceptación:** cada URL histórica conocida tiene destino/estado; 301 reales, sin chains/loops; query policy explícita.  
**Verificación:** HTTP checker sobre entorno previo/provisional y muestreo manual.  
**Modelo recomendado:** SOL.  
**Razón del modelo:** migración SEO y limitaciones de Pages requieren juicio experto.  
**Evidencia:** —

## M9.3 — DNS, dominio, HTTPS y deploy productivo

**Estado:** PENDING  
**Objetivo:** servir el release candidate en el canonical con rollback controlado.  
**Alcance:** backup DNS, TTL, Pages custom domain/CNAME, apex/www, Cloudflare proxy si procede, HTTPS, deploy, smoke y rollback window.  
**Fuera de alcance:** cambios DNS no documentados o release con G8 fallido.  
**Dependencias:** M9.2 y accesos confirmados.  
**Archivos/áreas previstas:** deployment runbook/config Pages/DNS evidence.  
**Contratos afectados:** production, canonical, security, availability.  
**Criterios de aceptación:** apex responde HTTPS al commit aprobado; www redirige/canonicaliza; certificado válido; rollback probado o listo; cero mixed content.  
**Verificación:** DNS lookup multi-resolver, HTTP/TLS checks, smoke y comparación de commit/artifact.  
**Modelo recomendado:** SOL.  
**Razón del modelo:** operación de alto impacto y recuperación temporal.  
**Evidencia:** —

## M9.4 — Analytics y Search Console en producción

**Estado:** PENDING  
**Objetivo:** confirmar observabilidad e indexación real tras el corte.  
**Alcance:** ownership, sitemap submission, URL inspection de muestra, eventos reales sin PII y exclusión interna/consentimiento.  
**Fuera de alcance:** prometer indexación inmediata o optimización de campañas.  
**Dependencias:** M9.3.  
**Archivos/áreas previstas:** runbooks/evidencia privada referenciada sin secretos.  
**Contratos afectados:** SEO operations, analytics, privacy.  
**Criterios de aceptación:** propiedad accesible; sitemap aceptado o diagnóstico; eventos llegan una vez; no secretos en repo.  
**Verificación:** Search Console + realtime/debug provider + network check consent modes.  
**Modelo recomendado:** LUNA → SOL REVIEW.  
**Razón del modelo:** pasos operativos concretos con revisión de interpretación.  
**Evidencia:** —

## M9.5 — Monitorización de lanzamiento y estabilización

**Estado:** PENDING  
**Objetivo:** detectar y corregir regresiones críticas del corte.  
**Alcance:** ventana acordada para uptime, 4xx/redirects, CWV/labs, eventos, indexability y WhatsApp; fixes sólo de release.  
**Fuera de alcance:** nuevas features o rediseños.  
**Dependencias:** M9.4.  
**Archivos/áreas previstas:** `docs/operations/launch-log.md`, fixes y issues.  
**Contratos afectados:** production, conversion, SEO, performance.  
**Criterios de aceptación:** cero incidente crítico abierto; alerts/checks con owner; métricas baseline capturadas; rollback decision cerrada.  
**Verificación:** HTTP/crawler/event smoke repetido y registro fechado.  
**Modelo recomendado:** LUNA → SOL REVIEW.  
**Razón del modelo:** seguimiento mecánico con escalado/review para anomalías complejas.  
**Evidencia:** —

## M9.6 — Handover y cierre V1

**Estado:** PENDING  
**Objetivo:** dejar operación, edición y recuperación comprensibles para el siguiente responsable/agente.  
**Alcance:** guía editorial YAML/imágenes, deploy/rollback, analytics/SEO checks, ownership/access matrix sin secretos, deuda aceptada y cierre de gates.  
**Fuera de alcance:** construir Catalog Manager o planificar features no priorizadas.  
**Dependencias:** M9.5.  
**Archivos/áreas previstas:** README y `docs/operations/`, ROADMAP evidence/status.  
**Contratos afectados:** mantenimiento, operación, G9.  
**Criterios de aceptación:** un mantenedor puede editar-validar-desplegar-revertir con docs; todos los gates V1 cerrados; deuda tiene owner/prioridad.  
**Verificación:** dry run documentado de cambio editorial y rollback; revisión final de enlaces/docs/estados.  
**Modelo recomendado:** SOL.  
**Razón del modelo:** cierre integral y transferencia de responsabilidad.  
**Evidencia:** —

---

# M10 — Catalog Manager y fuentes futuras — FUTURE / NOT V1

**Estado:** PENDING (FUTURE / NOT V1)  
**Gate:** no bloquea producción V1.

## M10.1 — Discovery del Catalog Manager

**Estado:** PENDING  
**Objetivo:** validar usuarios, workflow, permisos y retorno antes de construir una aplicación.  
**Alcance:** entrevistas/flujo, edición de YAML/media, preview, approvals, errores y alternativas GitHub UI/CMS.  
**Fuera de alcance:** código, OAuth o cambios al catálogo V1.  
**Dependencias:** M9.6 y prioridad explícita post-V1.  
**Archivos/áreas previstas:** documento futuro separado enlazado desde aquí.  
**Contratos afectados:** authoring, security, catalog source.  
**Criterios de aceptación:** problema/usuarios/frecuencia/éxito y alternativa más simple validados; go/no-go.  
**Verificación:** evidencia de discovery y revisión arquitectónica.  
**Modelo recomendado:** SOL.  
**Razón del modelo:** primero hay que validar producto y riesgo de permisos.  
**Evidencia:** —

## M10.2 — Adaptador de escritura GitHub seguro

**Estado:** PENDING  
**Objetivo:** si hay go, diseñar commits/PRs de catálogo con permisos mínimos y concurrencia segura.  
**Alcance:** auth/autorización fuera del cliente público, branch/PR, validación previa, media, conflictos, audit log y rollback; evaluar GitHub App/OAuth/backend mínimo sólo con threat model.  
**Fuera de alcance:** UI completa, PAT/credencial privilegiada embebida en navegador o escritura directa a producción sin review.  
**Dependencias:** M10.1.  
**Archivos/áreas previstas:** arquitectura/aplicación futura, tests contractuales contra repo sandbox.  
**Contratos afectados:** source adapter, GitHub API, security.  
**Criterios de aceptación:** threat model; tokens no expuestos; commits atómicos; mismos schemas; recuperación de conflictos.  
**Verificación:** tests sandbox/PR, security review y rollback.  
**Modelo recomendado:** SOL → LUNA.  
**Razón del modelo:** arquitectura/auth crítica con implementación posterior guiada.  
**Evidencia:** —

## M10.3 — UI editorial o fuente alternativa

**Estado:** PENDING  
**Objetivo:** implementar sólo la experiencia aprobada o un adaptador CMS/API equivalente.  
**Alcance:** se definirá tras M10.1/M10.2 preservando `source -> domain -> presentation`.  
**Fuera de alcance:** cambios silenciosos al contrato público o dependencia runtime para servir catálogo sin decisión nueva.  
**Dependencias:** M10.2.  
**Archivos/áreas previstas:** TBD post-V1.  
**Contratos afectados:** authoring/source; dominio y presentation deben permanecer estables.  
**Criterios de aceptación:** se especificarán con casos de usuario; builds siguen validando igual; migración/rollback documentados.  
**Verificación:** suite contractual compartida y pruebas de usuario.  
**Modelo recomendado:** SOL → LUNA.  
**Razón del modelo:** nueva superficie requiere diseño previo y ejecución separada.  
**Evidencia:** —

---

## Protocolo obligatorio de cierre de una ejecución `Mx.y`

### Si se completó

```text
## Resultado

RESULTADO: COMPLETADO

Milestone: Mx.y — <nombre>

Verificación:
- <check>: PASS
- <check>: PASS
- <check>: PASS

Siguiente:
Mx.z — <nombre>

Modelo recomendado:
<LUNA | SOL | SOL → LUNA | LUNA → SOL REVIEW>

Motivo:
<explicación breve>
```

### Si no pudo completarse

```text
## Resultado

RESULTADO: NO COMPLETADO

Milestone: Mx.y — <nombre>

Estado:
BLOCKED

Completado:
- ...

Pendiente:
- ...

Bloqueo:
<causa concreta>

No avanzar a la siguiente milestone.
```

## Registro de planificación

- 2026-08-15 — Planificación inicial completada. Repositorio canónico seleccionado por remoto: `C:\lab\repos\luna_tartas`. No se ejecutó ninguna submilestone ni se implementó la web. Siguiente tarea fijada: M0.1.
- 2026-08-15 — Requisito confirmado: repositorio GitHub nuevo, vacío y público. Se reforzaron frontera de seguridad, `.gitignore`, Actions/Pages, scans y prohibición de credenciales cliente del futuro Catalog Manager. Prioridad y estados no cambian.
- 2026-08-15 — M0.1 completada: inventario trazable de producción/SEO/activos, 8 URLs conocidas clasificadas y riesgos actualizados. Código ratificado greenfield; migración SEO/contenido permanece posible hasta resolver los `TBD` con sus propietarios.
- 2026-08-15 — M0.2 completada: baseline técnico cerrado con Astro 6 estático, Node/npm fijados, Pages condicionado a redirects verificables, budgets medibles y blockers externos asignados. Siguiente tarea: M0.3.
