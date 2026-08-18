# ROADMAP — Luna Estudio

Única fuente de verdad sobre prioridad, estado y siguiente tarea. Última actualización: 2026-08-18.

## Uso

- Estados válidos: `PENDING`, `IN_PROGRESS`, `BLOCKED`, `DONE`.
- Sólo una submilestone puede estar `IN_PROGRESS`.
- Se ejecuta exclusivamente la tarea solicitada; no se anticipa la siguiente.
- `DONE` exige todos los criterios y verificaciones en `PASS`, con evidencia registrada aquí.
- Orden normal: de arriba abajo. Una tarea posterior sólo puede comenzar si todas sus dependencias están `DONE`.
- **Siguiente tarea:** `M8.9.10 — Integración visual desktop`.
- **Pausa de release:** M9 permanece temporalmente pausada por alineación visual;
  M9.2 conserva su bloqueo operativo de Cloudflare y no se reanuda hasta que
  M8.9.11 obtenga `VISUAL QA: PASS` y `OWNER APPROVAL: APPROVED`.

## Gates de programa

| Gate                       | Condición objetiva                                                                                                                                  |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| G0 Discovery cerrado       | inventario o ausencia documentada, decisiones bloqueantes resueltas y entradas V1 con propietario                                                   |
| G1 Plataforma reproducible | instalación limpia + lint + typecheck + test + build + CI + artefacto Pages                                                                         |
| G2 Catálogo confiable      | schemas, relaciones, errores, queries y fixtures pasan; ningún draft se proyecta                                                                    |
| G3 Sistema visual          | foundations/primitives/patterns accesibles y aprobados en viewports objetivo                                                                        |
| G4 Descubrimiento          | home, shell, índices y taxonomías forman un recorrido estático coherente y superan el gate visual manual 320/768/1440 contra la referencia aprobada |
| G5 Conversión              | fichas y ambos WhatsApp flows funcionan sin JS, mantienen la dirección artística y están cubiertos                                                  |
| G6 SEO/agents              | metadata, crawl, JSON-LD, enlaces y catalog JSON son consistentes                                                                                   |
| G7 Medición                | eventos aprobados, privacidad resuelta y recepción validada sin PII                                                                                 |
| G8 Release candidate       | accesibilidad, performance, responsive, seguridad, dirección artística y suite completa aprobados con revisión visual manual                        |
| G9 Producción              | contenido, redirects, DNS, HTTPS, Search Console, analytics, monitor y rollback verificados                                                         |

## Dirección artística transversal aprobada

- Concepto rector: **“Atelier de pequeños detalles”**. La experiencia debe sentirse como una boutique/atelier artesanal digital de composición editorial contemporánea, con producto y fotografía real como protagonistas; no como una plantilla ecommerce, una interfaz infantil ni un scrapbook.
- Principios: editorial antes que grid genérico; fotografía antes que decoración; movimiento delicado e intencional; imperfección controlada; espacio negativo y ritmo; mobile con composición propia; accesibilidad, rendimiento y mantenibilidad como límites no negociables.
- `docs/design/visual-direction.md` es la especificación autoritativa de paleta/tokens, tipografía, fotografía, composición, ornamentación, motion y firma del creador. No se crea un sistema paralelo: cualquier evolución de M3 se hace mediante los tokens, foundations y componentes existentes, con decisión documentada y el cambio mínimo necesario.
- M4.11.2–M4.11.8 recuperan la dirección de Home y shell; M5 la continúa en ficha, galería y conversión; M6 preserva su coherencia cuando SEO/legal afecten al layout; M8 ejecuta las auditorías transversales y el gate visual final; M9 sustituye contenido provisional por material aprobado sin reabrir el diseño.
- Una milestone visual no puede cerrarse sólo con lint, tests o build: requiere inspección manual documentada a 320, 768 y 1440 px. Los efectos deben respetar `prefers-reduced-motion`, no provocar CLS ni convertir JavaScript secundario en crítico.
- La referencia contractual de la Home está registrada en `docs/design/reference/luna-home-art-direction-reference.png`; su función y el gap del primer cierre de M4.11 se documentan en `docs/design/home-art-direction-recovery.md`. G4 queda reabierto hasta completar M4.11.8 y M5 no avanza mientras tanto.
- La reorientación aprobada el 2026-08-17 eleva esa referencia a
  **DESKTOP VISUAL REFERENCE / ART DIRECTION CONTRACT**: composición,
  jerarquía, proporciones, paleta, tipografía, ritmo, superficies, fotografía y
  ornamentación dejan de ser una aproximación inspiracional. M8.9 ejecuta la
  alineación a 1440 px como viewport contractual, con comprobaciones de
  comportamiento a 1280 y 1920 px. Mobile conserva un fallback funcional, pero
  su contrato visual definitivo queda fuera de esta fase.

---

# M0 — Discovery + Architecture

**Estado:** DONE
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

**Estado:** DONE
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
**Evidencia:** PASS (2026-08-15) — `docs/product/content-readiness.md` define estados `TBD/RECEIVED/READY/BLOCKED/FIXTURE`, matriz de 18 entradas con owner y gate/deadline, plantilla editorial, reglas de aprobación y exclusión de fixtures/TBD de toda proyección pública. Cubre marca, catálogo, fotos/derechos/alt, precios, WhatsApp, identidad legal, prueba social, analytics, DNS y Search Console. `scope.md` y `catalog-contract.md` enlazan el contrato y fijan que lo provisional no es publicable. G0 evaluado PASS: las ausencias de M0.1 tienen propietario y siguiente gate, sin blocker desconocido; M1 no queda bloqueado por contenido externo. Walkthrough de enlaces internos y consistencia con M9.1/M7.1/M9.2/M9.4: PASS. No se produjeron copy, fotos, catálogo ni aprobaciones de negocio.

---

# M1 — Project Bootstrap + CI/CD

**Estado:** PENDING  
**Gate:** G1.

## M1.1 — Scaffold Astro reproducible

**Estado:** DONE
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
**Evidencia:** PASS (2026-08-15) — scaffold creado con `package.json`, `package-lock.json`, `astro.config.mjs`, `tsconfig.json`, `.nvmrc`, `.gitignore`, `README.md` y `src/pages/index.astro`. Astro fijado en `6.4.8`, Node/npm contractuales declarados (`24.19.0`/`11.17.0`), `output: static`, `build.format: directory` y `trailingSlash: always`; no se añadió framework UI. `npm ci`: PASS; `npm run typecheck`: PASS (0 errores, 0 warnings, 0 hints); `npm run build`: PASS (1 ruta `/index.html`). `git check-ignore`: PASS para `node_modules/`, `dist/`, `.astro/`, `.env*` y tooling local; `.env.example` queda permitido pero no existe. El entorno local usa Node `24.13.0`/npm `11.6.2` y emite `EBADENGINE`, sin impedir la verificación; debe usarse `.nvmrc` en CI/local. `npm audit` reporta 2 high/1 low transitorios en Astro 6 y dependencias de build; la corrección disponible fuerza Astro 7, incompatible con la decisión M0.2, por lo que no se cambia de major en M1.1 y no se usa ninguna feature vulnerable en el scaffold. `git diff --check`: PASS.

## M1.2 — Harness de lint, formato y tests

**Estado:** DONE
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
**Evidencia:** PASS (2026-08-15) — Node actualizado mediante `winget` a `24.19.0` y npm global a `11.17.0`; `npm ci`: PASS. Añadidos ESLint 10.8.1 + `eslint-plugin-astro` 3.1.0 + parser TypeScript, Prettier 3.9.6 + plugin Astro y Vitest 3.2.7, todos fijados en `package.json`/lockfile. Scripts `lint`, `format`, `typecheck`, `test` y `build`: PASS; Vitest ejecuta 1 test de infraestructura que protege el contrato static/site/trailing slash. Prueba controlada: un `.ts` sintácticamente inválido produjo fallo de lint; se eliminó y el lint volvió a PASS. La instalación limpia y la suite secuencial posterior pasan sin carreras. `npm audit` mantiene 2 high/1 low heredados de Astro 6 y dependencias de build; la corrección automática exige Astro 7 y queda fuera de esta submilestone/decisión M0.2. `git diff --check`: PASS.

## M1.3 — Configuración global y layout técnico

**Estado:** DONE
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
**Evidencia:** PASS (2026-08-15) — `src/config/site.ts` centraliza y valida el origen HTTPS canónico, locale BCP 47 e identidad comercial con estado explícito `READY`/`TBD`; el idioma y las URLs canonical se derivan de esa única fuente, y Astro consume el mismo `siteUrl`. La marca pendiente no tiene valor publicable y el HTML generado no contiene `TBD`, nombres de marca provisionales ni patrones de secretos. `BaseLayout.astro` aporta documento HTML semántico mínimo, `lang="es"`, charset, viewport, canonical absoluto, title requerido y `main`; la página inicial ya lo consume sin estilos ni integraciones fuera de alcance. Vitest: PASS (2 archivos, 16 tests), incluyendo configuración ausente/inválida, URL insegura/con credenciales/path, locale inválido, estados editoriales y escape de origen canonical. `npm run lint`, `npm run format`, `npm run typecheck` (0 errores/warnings/hints), `npm test`, `npm run build` (1 página), inspección de `dist/index.html` y `git diff --check`: PASS.

## M1.4 — CI de pull request

**Estado:** DONE
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
**Evidencia:** PASS (2026-08-15) — `.github/workflows/ci.yml` creado para `pull_request` con `contents: read`, concurrencia cancelable, `ubuntu-24.04`, timeout, Node desde `.nvmrc`, npm `11.17.0`, cache npm basada en lockfile y `actions/checkout`/`actions/setup-node` fijadas por SHA. Ejecuta `npm ci`, `npm run lint`, `npm run typecheck`, `npm test` y `npm run build` como pasos obligatorios, sin secretos, artifacts ni servicios externos. Prettier valida el YAML; `npm ci`, `npm run lint`, `npm run format`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (2 archivos, 16 tests), `npm run build` (1 página) y `git diff --check`: PASS. No se creó PR ni se hizo push desde el worktree; el run real queda para la primera rama/PR del repositorio. `npm ci` mantiene 3 vulnerabilidades transitorias heredadas de Astro 6 (1 low/2 high), ya documentadas en M1.1/M1.2, sin cambiar la versión contractual.

## M1.5 — Pipeline base de GitHub Pages

**Estado:** DONE
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
**Evidencia:** PASS (2026-08-15) — `.github/workflows/deploy.yml` publica sólo `main` mediante jobs `build -> deploy`, environment `github-pages`, concurrencia no cancelable y permisos mínimos separados (`contents: read`; `pages: write` + `id-token: write`). `checkout`, `setup-node`, `configure-pages`, `upload-pages-artifact` y `deploy-pages` están fijadas a SHA; el checkout verifica `HEAD == GITHUB_SHA`, la suite contractual precede al build, el `base_path` técnico no altera el canonical apex y un scan sin eco bloquea material sensible antes del upload. Pages se habilitó con source `workflow`, sin CNAME, secrets ni cambios DNS. [Run público 31907524015, intento 2](https://github.com/xenxi/luna_tartas/actions/runs/31907524015) sobre el commit público `76882362bc39d89ed9f6ad2d34f19023aa888f29`: build PASS, deploy PASS y smoke PASS. API pública: un único artifact `github-pages` (ID `9252778368`, 510 bytes, digest `sha256:3ff6ed3b59033ed4f436a817d73d90811c95083e267c6a0dbe2050f4137e0f34`) ligado al mismo SHA. Auditoría autenticada y temporal de artifact/logs: 0 patrones de credenciales; los archivos se eliminaron tras inspección. Smoke independiente de `https://xenxi.github.io/luna_tartas/`: HTTP 200, `<main>` presente, canonical `https://lunatartas.es/` y 0 patrones sensibles. Ensayo local montando el artifact bajo `/luna_tartas/`: PASS; el fallo seguro inicial con Pages deshabilitado y la reejecución del mismo SHA tras habilitar source `workflow` ensayan la recuperación inmediata. Rollback permanente por revert hacia delante y preview sin deploy de PR documentados en `docs/architecture/deployment.md`. `npm ci`, `npm run lint`, `npm run format`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (2 archivos, 16 tests), build técnico, parse/inspección del workflow, scan del artifact y `git diff --check`: PASS.

---

**Corrección de mantenimiento (2026-08-18):** restaurada la ejecución de
`actions/configure-pages` y la aplicación de su `base_path` al build. Esto corrige
las referencias de assets bajo `https://xenxi.github.io/luna_tartas/` sin cambiar
el `site` canónico `https://lunatartas.es`. El mismo valor queda disponible en
`Check public artifact` para que `verify:performance` traduzca URLs técnicas a
rutas físicas bajo `dist`.

# M2 — Catalog Domain + Validation

**Estado:** PENDING  
**Gate:** G2.

## M2.1 — Schemas de taxonomías

**Estado:** DONE
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
**Evidencia:** PASS (2026-08-15) — `src/content.config.ts` registra `categories`, `occasions` y `recipients` mediante el `glob()` oficial de Astro 6 para YAML; las tres comparten un schema source estricto y tipado en `src/content/schemas/taxonomy.ts`, y el loader conserva el `id` editorial como ID de colección. El contrato ejecutable exige ID/slug kebab-case ASCII, nombre, resumen, `draft|published`, orden entero no negativo, descripción y SEO opcionales con límites, rechaza campos desconocidos y prohíbe `context: FIXTURE` con estado publicable. `catalog-contract.md` registra el shape exacto. Las colecciones reales contienen sólo `.gitkeep`; 3 YAML sintéticos válidos y 8 inválidos viven exclusivamente bajo `tests/fixtures`. `yaml@2.9.0` queda fijado como devDependency para parsear fixtures negativos sin depender de internals transitivos de Astro; el script de formato incluye YAML. Vitest: PASS (3 archivos, 28 tests), con rutas accionables por archivo/campo. Prueba controlada: un YAML temporal con slug inválido hizo fallar `npm run build` con `InvalidContentEntryDataError`, ruta `src/content/categories/invalid-schema-check.yml`, campo `slug` y corrección esperada; el archivo se retiró y el build volvió a PASS. `npm ci`, `npm run lint`, `npm run format`, `npm run typecheck` (0 errores/warnings/hints), `npm test`, `npm run build` (1 página), exclusión de `FIXTURE`/copy sintético de `dist` y `git diff --check`: PASS. Los avisos informativos de `glob-loader` corresponden a las tres colecciones reales deliberadamente vacías hasta recibir contenido aprobado.

## M2.2 — Schema de producto, precio y medios

**Estado:** DONE
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
**Evidencia:** PASS (2026-08-15) — `products` queda registrada como colección YAML Astro con schema source estricto y tipado. Product es una unión discriminada `draft|published`: los drafts pueden omitir bloques editoriales completos, pero cualquier bloque presente debe ser válido; los publicados exigen copy, categoría, precio, portada, personalización, derechos y aprobación. Price admite exactamente `fixed|from|on_request`; los dos primeros usan unidades menores enteras positivas y moneda ISO 4217 mayúscula, y `on_request` rechaza importe/moneda. Relaciones por ID, featured/order, SEO, rutas/alt de medios, galería y límites iniciales de assets quedan modelados sin anticipar validación agregada. 4 fixtures válidos y 9 inválidos permanecen sólo en `tests/fixtures`; Vitest: PASS (4 archivos, 53 tests), incluida la matriz price/status/media, mínimos de publicación y galería. Prueba controlada: un producto temporal con importe decimal hizo fallar el build real con `InvalidContentEntryDataError`, archivo y campo `price.amountMinor`; retirado el archivo, el build volvió a PASS. `npm ci`, `npm run lint`, `npm run format`, `npm run typecheck` (0 errores/warnings/hints), `npm test`, `npm run build` (1 página), exclusión de fixtures/copy sintético de `dist` y `git diff --check`: PASS. Los avisos informativos de `glob-loader` corresponden a colecciones reales deliberadamente vacías hasta recibir contenido aprobado.

## M2.3 — Adaptador source y modelo de dominio

**Estado:** DONE
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
**Evidencia:** PASS (2026-08-15) — `src/lib/catalog/domain/model.ts` define el catálogo TypeScript plano y readonly para taxonomías y la unión completa de Product sin imports de Astro, schemas ni presentation. `src/lib/catalog/source/` encapsula DTOs de Content Collections, mapping explícito de taxonomías/`draft|published`/precios/medios/personalización/SEO/aprobación, elimina `context: FIXTURE`, copia objetos y arrays y expone una única `loadCatalog()` memoizada que lee las cuatro colecciones una sola vez. `CatalogSourceError` conserva colección, entry ID, archivo opcional, campo y causa; se cubren mismatch de identidad y discriminador imposible. El contrato source → domain queda documentado en `catalog-contract.md`, sin interfaz multi-source especulativa ni validación agregada anticipada. Vitest: PASS (7 archivos, 68 tests), incluidos 15 tests nuevos de mapping, errores, carga única y fronteras de imports. `npm ci`, `npm run lint`, `npm run format`, `npm run typecheck` (0 errores/warnings/hints), `npm test`, `npm run build` (1 página), scan de exclusión de fixtures en `dist`, inspección de imports y `git diff --check`: PASS. Los avisos informativos de `glob-loader` corresponden a las cuatro colecciones reales deliberadamente vacías hasta recibir contenido aprobado.

## M2.4 — Validación agregada y relaciones

**Estado:** DONE
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
**Evidencia:** PASS (2026-08-15) — `domain/validation.ts` agrega issues accionables de identidad/slug, unicidad, kind, referencias inexistentes/repetidas/no publicables, mínimos editoriales, alt, precio y moneda V1 centralizada (`EUR`); un único `CatalogValidationError` conserva código, entidad, campo, valor y corrección. `source/assets.ts` resuelve portadas/galerías de drafts y publicados dentro de `src/assets/catalog`, incluso tras symlinks, limita tamaño antes de leer, reconoce dimensiones de PNG/JPEG/WebP/AVIF, aplica 8 MiB/24 MP y valida SVG hasta 250 KiB sin scripts, handlers ni referencias/declaraciones externas. `loadCatalog()` ejecuta mapping + validación y la generación de `index.astro` hace obligatorio el gate en el build. Vitest: PASS (9 archivos, 91 tests), incluidos negativos parametrizados y agregación múltiple. Prueba controlada: `src/content/products/m2-4-invalid.yml`, válido de schema pero con categoría ausente, hizo fallar `npm run build` con `CatalogValidationError`, entidad/campo/valor/esperado y exit 1; el fixture se retiró, no aparece en `dist` y el build limpio volvió a PASS (1 página). `npm ci`, `npm run lint`, `npm run format`, `npm run typecheck` (0 errores/warnings/hints), `npm test`, `npm run build`, scan del artefacto, restauración del fixture y `git diff --check`: PASS. Se añadió `@types/node@24.13.3` fijado para el borde filesystem; persisten los avisos informativos de colecciones vacías y las 3 vulnerabilidades transitorias de Astro ya documentadas.

## M2.5 — Queries y contrato de rutas

**Estado:** DONE
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
**Evidencia:** PASS (2026-08-15) — `domain/queries.ts` expone lecturas puras de productos y taxonomías publicables, filtrando drafts antes de cualquier proyección; los productos ordenan por `order` (ausente al final), nombre e ID, y las taxonomías por `order`, nombre e ID. Incluye featured, búsquedas por slug/ID, agrupación por taxonomía y relacionados básicos por taxonomías compartidas con límite y desempates estables; las ausencias devuelven `undefined` o lista vacía explícitamente. `domain/routes.ts` centraliza rutas puras para `/`, `/productos/`, `/productos/{slug}/`, los tres índices/landings taxonómicos (`categorias`, `ocasiones`, `regalos`) y `/catalog.json`, con barra final, segmentos kebab-case seguros y mapping `recipient → regalos`. Tests nuevos de queries y rutas cubren drafts, orden, featured, lookup ausente, agrupación, relaciones múltiples, exclusión del producto actual y contrato SEO. `npm run lint`, `npm run format`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (11 archivos, 96 tests), `npm run build` (1 página), y `git diff --check`: PASS. El build conserva únicamente los avisos informativos de colecciones reales vacías.

## M2.6 — Suite integral y catálogo representativo no productivo

**Estado:** DONE
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
**Evidencia:** PASS (2026-08-15) — catálogo representativo completamente sintético y aislado bajo `tests/fixtures/catalog`, con 6 taxonomías draft, productos draft para `fixed`, `from` y `on_request`, relaciones múltiples y 4 SVG seguros verificados desde una raíz de medios exclusiva de tests; su README fija las reglas editoriales y de aislamiento. `source/pipeline.ts` convierte mapping + validación en un pipeline inyectable, ordena todas las colecciones por ID con comparación binaria estable y congela profundamente el resultado validado; producción conserva `loadCatalog()` como única entrada pública, memoizada y ligada sólo a `src/content`/`src/assets/catalog`. La suite integral recorre YAML → schemas → DTO → mapping → relaciones/medios reales → catálogo, prueba las tres variantes, eliminación de `context`, exclusión pública de drafts, igualdad ante enumeración inversa, orden estable e inmutabilidad profunda. `npm run lint`, `npm run format`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (12 archivos, 99 tests), `npm run build` (1 página), scan de `dist` sin `fixture`/`FIXTURE`/draft/copy sintético y `git diff --check`: PASS. Los únicos avisos del build son los informativos esperados por las cuatro colecciones productivas vacías. G2 satisfecho.

---

# M3 — Design System

**Estado:** DONE
**Gate:** G3.

## M3.1 — Dirección visual y contrato de marca

**Estado:** DONE
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
**Evidencia:** PASS (2026-08-16) — `docs/design/visual-direction.md` fija la dirección provisional “obrador editorial cálido”, inventaría nombre/logo/favicon/iconos/tipografías sin fabricar identidad, registra owner/condiciones de salida y separa las decisiones técnicas de los blockers de negocio. Define paleta semántica propuesta, stacks tipográficos del sistema sin descargas/licencias adicionales, reglas de fotografía/forma/iconografía, composición mobile first y escritorio, accesibilidad/motion y un contrato de sustitución mediante configuración, tokens y assets con ficha de derechos. `content-readiness.md` conserva el historial y cambia las tres entradas de marca vencidas de `TBD` a `BLOCKED`; no bloquean el sistema provisional y no se incorporó ningún asset de marca. La lámina interna `visual-direction-review.svg`, marcada como no publicable, se renderizó e inspeccionó a 1440 × 1000; el primer pase detectó overflow de titulares, se corrigió y la segunda inspección confirmó los marcos de 320 px y escritorio sin colisiones. XML, enlaces locales, tarea única `IN_PROGRESS` durante ejecución y 14 combinaciones de contraste AA (mínimo 5.97:1 entre las autorizadas para texto/estado; 7.71:1 acción/lienzo; 6.90:1 foco/lienzo): PASS. `npm run lint`, `npm run format`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (12 archivos, 99 tests), `npm run build` (1 página) y `git diff --check`: PASS. Los únicos avisos del build son los informativos esperados por las cuatro colecciones productivas vacías.

## M3.2 — Tokens y foundations CSS

**Estado:** DONE
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
**Evidencia:** PASS (2026-08-16) — `src/styles/tokens.css` codifica roles semánticos para canvas/surface/text/muted/action/hover/accent/border/focus/success/error, tipografía de sistema sin requests, escala fluida de type/spacing, radii, sombras, container/gutter, breakpoints, z-index y motion. `src/styles/foundations.css` importa los tokens y aporta box sizing, base estable desde 320 px, medios responsivos, links/hover, foco visible, selección, headings/prose, container y `prefers-reduced-motion`; `BaseLayout.astro` lo incluye por import estático y el build lo inlinea en el HTML. `docs/design/css-foundations.md` documenta consumo por roles, sustitución y restricciones de contraste. No se añadió JavaScript, framework ni fuente remota. `npm run lint`, `npm run format`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (12 archivos, 99 tests), `npm run build` (1 página con CSS emitido) y checker independiente de 8 combinaciones de contraste (4.5:1 mínimo, ratios 5.97–14.70:1) pasan. `git diff --check`: PASS. Los avisos informativos siguen limitados a las cuatro colecciones productivas vacías.

## M3.3 — Base tipográfica, layout y estados globales

**Estado:** DONE
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
**Evidencia:** PASS (2026-08-16) — `src/styles/global.css` compone las foundations aprobadas y añade reset de contenido nativo, tipografía/prose, section/container, tablas/listas/código, medios fluidos, foco, selección y `prefers-reduced-motion`; no añade JavaScript ni fuentes remotas. `BaseLayout.astro` importa la capa global, expone skip link en español y fija `main#main-content` como destino de foco sin alterar el orden semántico. `tests/global-styles.test.ts` cubre composición CSS, ausencia de overflow horizontal forzado, reduced motion, skip link y target de teclado. Build inspeccionado en 320/768/1440 por contrato CSS: gutter fluido, medidas máximas y medios limitados evitan overflow; teclado/reduced motion quedan cubiertos por markup y reglas específicas. `npm run lint`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (13 archivos, 101 tests), `npm run build` (1 página con CSS emitido), `npx prettier --check src/styles/global.css` y `git diff --check`: PASS. El build sólo mantiene los avisos informativos esperados por las cuatro colecciones productivas vacías.`

## M3.4 — Primitives interactivos

**Estado:** DONE
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
**Evidencia:** PASS (2026-08-16) — `src/components/ui/` añade `Button`, `ActionLink`, `Icon` y `Badge` con APIs pequeñas, variantes explícitas, targets táctiles mínimos de 44 px, estados hover/focus/active/disabled aplicables y estilos semánticos basados en tokens. `ActionLink` renderiza un enlace real para CTA; `Button` conserva semántica nativa y disabled; `Icon` distingue modo decorativo/semántico con `aria-hidden`/`role=img`; el showcase interno `src/pages/_showcase/ui.astro` no genera ruta pública ni hidrata JavaScript. `tests/ui-primitives.test.ts` cubre markup nativo, variantes, tamaño táctil, reduced motion y modos accesibles de icono. `npm run lint`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (14 archivos, 103 tests), `npm run build` (1 página pública), Prettier de primitives/showcase/tests y `git diff --check`: PASS. El build mantiene sólo los avisos informativos esperados por las cuatro colecciones productivas vacías.`

## M3.5 — Patrones de catálogo y navegación contextual

**Estado:** DONE
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
**Evidencia:** PASS (2026-08-16) — `src/components/catalog/` añade proyecciones TypeScript explícitas, `ResponsiveMedia`, `ProductCard` y `TaxonomyCard`; la media usa `picture`/`source`, `sizes`, carga diferida, `width`/`height` enteros obligatorios y reserva de aspecto, con texto visible cuando falta imagen. Las cards son `article`, aceptan nivel de heading y exponen una única acción como enlace de título, sin slots ni controles interactivos anidados. `Breadcrumb` usa `nav` + `ol`, ancestros enlazados y un único destino actual final con `aria-current="page"`; `ContentSection` enlaza heading y región, y `CardList` alterna una lista real con un mensaje vacío obligatorio. El showcase sintético queda bajo `_showcase` y no genera ruta pública. La inspección del HTML estático renderizado confirmó 2 articles, `ul`, `ol`, imagen 800 × 600, current/empty/missing states, cero scripts y cero interacciones anidadas; la revisión visual real en 320/768/1440 px confirmó una/dos/tres columnas, foco visible y todos los enlaces con orden nativo de teclado. Contraste reutilizado: 6.12:1 mínimo para texto muted y 8.12:1 para acción. `npm run lint`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (15 archivos, 108 tests), `npm run build` (1 página pública, cero scripts), Prettier específico y `git diff --check`: PASS. Los únicos avisos del build son los informativos esperados por las cuatro colecciones productivas vacías. G3 satisfecho.

---

# M4 — Home + Discovery

**Estado:** PENDING  
**Gate:** G4.

## M4.1 — Shell público: header, navegación y footer

**Estado:** DONE
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
**Evidencia:** PASS (2026-08-16) — `src/components/site/` incorpora header, región de marca sustituible, navegación principal y footer en `BaseLayout`; los destinos estables se centralizan en `src/config/navigation.ts` reutilizando los builders de rutas. En móvil el menú usa `details`/`summary` nativos, sin script ni hidratación, y en escritorio expone la navegación completa desde 48 rem; foco, targets mínimos de 44 px y `aria-current="page"` cubren inicio, índices y descendientes. La identidad bloqueada proyecta sólo el destino genérico “Inicio”; logo, marca, WhatsApp, contacto y datos legales no aprobados permanecen fuera del HTML. El artifact estático contiene header/main/footer, cero scripts y ningún `TBD`, teléfono o email. Revisión real en navegador a 320/768/1440 px: ancho de documento exacto al viewport, menú móvil cerrado/abierto sin overflow, navegación desktop visible sin solapes, footer estable y summary con foco visible; el funcionamiento esencial sin JavaScript queda garantizado por enlaces y disclosure HTML nativos. `npm run lint`, `npm run format`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (16 archivos, 113 tests), `npm run build` (1 página pública) y `git diff --check`: PASS. Los únicos avisos del build son los informativos esperados por las cuatro colecciones productivas vacías.

## M4.2 — Hero emocional

**Estado:** DONE
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
**Evidencia:** PASS (2026-08-16) — Handoff completo registrado en `src/content/home/hero.ts`: H1/copy, ambos CTA, fotografía original 1672 × 941, alt, autoría/derechos y aprobación. `Hero.astro` proyecta un único H1, CTA `/productos/` y enlace directo `wa.me` al número normalizado `34697637180`; `src/config/contact.ts` valida 8–15 dígitos internacionales, mensaje no vacío y genera la URL codificada, cuya decodificación reproduce exactamente el texto aprobado. No se anticipó el builder contextual ni el resto de M4.6. Astro genera cuatro anchos AVIF/WebP/JPEG (AVIF 6–34 KiB, WebP 10–66 KiB, JPEG 15–118 KiB), con dimensiones intrínsecas, `sizes`, eager y `fetchpriority="high"`. QA real con ambos CTA: 320 px apilado, acciones de 46 px y ancho exacto 320; 768 px apilado sin colisión; 1440 px overlay opaco 496 × 599 dentro de media 1150 × 647, producto a la derecha y ancho estable. Medición LCP final en navegador local con caché caliente mediante observador temporal retirado antes del build: imagen hero candidata, 32 ms/45.961 px² a 320 px (AVIF 480) y 40 ms/743.906 px² a 1440 px (AVIF 1200). Artifact final: 1 H1, ambos href, cero scripts, cero `TBD`, prioridad alta. `npm run lint`, `npm run format`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (18 archivos, 124 tests), `npm run build` y `git diff --check`: PASS. Los únicos avisos son las cuatro colecciones productivas deliberadamente vacías.

## M4.3 — Navegación de categorías, ocasiones y destinatarios

**Estado:** DONE
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
**Evidencia:** PASS (2026-08-16) — `taxonomy-discovery.ts` proyecta tres secciones home (`category`, `occasion`, `recipient`) desde `getPublishedTaxonomies`, sin entidades hardcodeadas; filtra drafts mediante la query de dominio, conserva orden editorial con fallback existente y genera cada enlace con `routes.taxonomy`. `TaxonomyDiscovery.astro` compone `ContentSection`, `CardList` y `TaxonomyCard`, con estados vacíos honestos mientras las colecciones productivas estén vacías; no añade JS ni páginas destino. Home carga el catálogo validado una vez y renderiza las tres secciones. Tests unitarios y de composición cubren publicación, orden, conteos relacionales, rutas con barra final, semántica y ausencia de taxonomías hardcodeadas. `npm run format`, `npm run lint`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (18 archivos, 126 tests), `npm run build` (1 página estática), inspección de `dist/index.html` y `git diff --check`: PASS. El build sólo conserva los avisos informativos esperados por las cuatro colecciones productivas vacías.

## M4.4 — Ideas/productos destacados

**Estado:** DONE
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
**Evidencia:** PASS (2026-08-16) — `featured-products.ts` proyecta únicamente `getFeaturedProducts` en orden de dominio, genera URLs con `routes.product` y conserva la semántica de precio `fixed`, `from` y `on_request` (`30,00 €`, `Desde 30,50 €`, `Consultar precio`). `FeaturedProducts.astro` compone `ContentSection`, `CardList` y `ProductCard`, con estado vacío honesto; no añade CTA directo, algoritmo ni JavaScript. El patrón `ProductCard` reutiliza `ResponsiveMedia`, reserva espacio y mantiene el placeholder accesible cuando no hay proyección de media. Tests unitarios cubren featured/drafts, orden, rutas, las tres variantes de precio y composición semántica. `npm run format`, `npm run lint`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (18 archivos, 128 tests), `npm run build` (1 página estática), inspección de `dist/index.html` sin scripts y `git diff --check`: PASS. El build sólo conserva los avisos informativos esperados por las cuatro colecciones productivas vacías.

## M4.5 — Confianza y muestra de trabajos

**Estado:** DONE
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
**Evidencia:** PASS (2026-08-16) — el handoff aprobado por el propietario el 2026-08-16 resuelve el bloqueo anterior: `content-readiness.md` registra como `READY` la muestra Home, sus derechos, los cuatro alt y la decisión de no publicar reseñas/cifras. `trust-and-work.ts` centraliza literalmente el proceso aprobado, orden editorial, alt, owner, alcance y fecha; `TrustAndWork.astro` publica un bloque semántico de tres pasos y una lista estática de cuatro trabajos sin carrusel, feed, hidratación, reseñas ni claims adicionales. Los cuatro originales se copiaron sin modificarlos bajo `src/assets/home/work-showcase/` (1536 × 2048 px cada uno; SHA-256 `36F129…E163`, `5D0E09…8632`, `8E3F7C…6DB1`, `BFA63D…9A0E`) y Astro genera AVIF/WebP/JPEG a 320/480/640 para secundarios y hasta 1536 para la principal, con `width`/`height`, alt y `loading="lazy"`; la variante mayor pesa 202.786 bytes (198,0 KiB), bajo el límite de 200 KiB. Artefacto: 11.580 bytes de HTML, 4 imágenes de galería dimensionadas y 0 `<script>`. QA Browser sobre build de producción en 320/768/1440: PASS, sin overflow horizontal; contenido de 288/691,6/1152 px, confianza 1/2/3 columnas, galería 1/3/3 columnas, principal centrada hasta 832 px y cuatro imágenes cargadas. Instalación limpia aislada y suite contractual: `npm ci`, `npm run format`, `npm run lint`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (19 archivos, 132 tests) y `npm run build` (1 página, 57 variantes totales incluyendo hero): PASS. Los únicos avisos son los informativos esperados por las cuatro colecciones productivas vacías.

## M4.6 — CTA “Cuéntanos tu idea” en Home

**Estado:** DONE
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
**Evidencia:** PASS (2026-08-16) — `src/lib/whatsapp/custom.ts` implementa un builder puro para el flujo personalizado: valida 8–15 dígitos internacionales, rechaza mensaje vacío, construye sólo `https://wa.me/{number}` y codifica el mensaje una vez mediante `URLSearchParams`, sin repetir el teléfono en el texto. `contact.ts` reutiliza ese builder y mantiene la configuración central validada; `CustomIdeaCta.astro` publica la sección emocional aprobada con un enlace `ActionLink` nativo, sin formulario, JavaScript ni instrumentación. Home integra el bloque después de confianza/muestra y `custom-idea.test.ts` cubre URL, Unicode, errores, copy y ausencia de JS. `npm run format`, `npm run lint`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (20 archivos, 136 tests), `npm run build` (1 página estática, 57 variantes de imagen) y `git diff --check`: PASS. El build conserva únicamente los avisos informativos esperados por las cuatro colecciones productivas vacías.

## M4.7 — Índice `/productos/`

**Estado:** DONE
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
**Evidencia:** PASS (2026-08-16) — `src/pages/productos/index.astro` publica la ruta estática `/productos/` con un único H1, introducción editorial y carga del catálogo validado; `ProductListing.astro` compone `ContentSection`, `CardList` y `ProductCard` sin hidratación. `product-listing.ts` usa exclusivamente `getPublishedProducts`, conserva el orden del dominio, excluye drafts, genera cada enlace con `routes.product` y mantiene las variantes de precio mediante el formatter compartido. El estado sin catálogo es honesto y no publica placeholders. `product-listing.test.ts` cubre orden, exclusión de draft, rutas, precio, H1, estado vacío y ausencia de `client:`. `npm run format`, `npm run lint`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (21 archivos, 138 tests), `npm run build` (2 páginas estáticas, incluida `/productos/`) y `git diff --check`: PASS. Link check del HTML generado: 1 H1, 0 fichas publicadas esperadas con catálogo productivo vacío y 0 scripts. Los únicos avisos del build son los informativos esperados por las cuatro colecciones productivas vacías.
**Corrección posterior:** `ProductListing.astro` resuelve la media mediante un índice explícito por la ruta estable derivada del `slug`, no por posición; `product-listing.test.ts` cubre órdenes divergentes y actualiza la expectativa del estado vacío a `itemsWithMedia.length > 0`. También se actualizó la expectativa equivalente de `FeaturedProducts` en `catalog-patterns.test.ts`. `npm test`: PASS (22 archivos, 156 tests); `npm run lint`, `npm run typecheck`, `npm run build` (16 páginas) y `git diff --check`: PASS.

## M4.8 — Índice y landings de categorías

**Estado:** DONE
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
**Evidencia:** PASS (2026-08-16) — `src/pages/categorias/index.astro` publica `/categorias/` con H1, introducción editorial y estado vacío honesto. `src/pages/categorias/[slug].astro` genera únicamente landings estáticas para categorías publicadas con al menos un producto publicado; cada landing incluye breadcrumb, copy de `summary/description`, productos relacionados ordenados por dominio y enlaces `routes.product`. El índice usa sólo `getPublishedTaxonomies` + `getProductsForTaxonomy`, excluye drafts y categorías vacías, y no añade JavaScript. Tests de proyección, orden, conteos, rutas, H1 y ausencia de `client:`: PASS (22 archivos, 141 tests). `npm run lint`, `npm run format`, `npm run typecheck` (0 errores/warnings/hints), `npm test`, `npm run build` (3 páginas estáticas: home, productos y categorías; 0 landings porque el catálogo productivo sigue vacío) y `git diff --check`: PASS. Inspección de `dist/categorias/index.html`: canonical `/categorias/`, un H1, estado vacío y cero scripts. Los avisos son los informativos esperados por las colecciones productivas vacías.`

## M4.9 — Índice y landings de ocasiones

**Estado:** DONE
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
**Evidencia:** PASS (2026-08-16) — Se creó el patrón compartido `src/components/taxonomies/` para índice y landing, reutilizado por categorías y ocasiones sin duplicación accidental. `src/pages/ocasiones/index.astro` publica `/ocasiones/` con H1, copy de intención y estado vacío honesto; `src/pages/ocasiones/[slug].astro` genera únicamente landings estáticas para ocasiones publicadas con productos publicados, con breadcrumb, contenido editorial y productos relacionados ordenados por dominio. El índice y las landings usan `routes.taxonomy('occasion', ...)`, excluyen drafts y taxonomías vacías, y no hidratan JavaScript. Tests de taxonomías, conteos, orden, rutas, patrón compartido y ausencia de `client:`: PASS (22 archivos, 141 tests). `npm run lint`, `npm run format`, `npm run typecheck` (0 errores/warnings/hints), `npm test`, `npm run build` (4 páginas estáticas: home, productos, categorías y ocasiones; 0 landings porque el catálogo productivo sigue vacío) y `git diff --check`: PASS. Inspección de `dist/ocasiones/index.html`: canonical `/ocasiones/`, un H1, estado vacío y cero scripts. Los avisos son los informativos esperados por las colecciones productivas vacías.`

## M4.10 — Índice y landings de destinatarios

**Estado:** DONE
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
**Evidencia:** PASS (2026-08-16) — `src/pages/regalos/index.astro` publica `/regalos/` con un único H1, copy centrado en la persona y estado vacío honesto, sin exponer la jerga interna `Recipient/destinatario`. `src/pages/regalos/[slug].astro` reutiliza el patrón compartido y genera sólo landings para destinatarios publicados con al menos un producto publicado; incluye breadcrumb, contenido editorial, productos en orden de dominio y enlaces construidos con `routes`. La proyección sintética excluye drafts y destinatarios vacíos y confirma `/regalos/family/` con sus dos productos ordenados. `npm run format`, `npm run lint`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (22 archivos, 142 tests), `npm run build` (5 páginas estáticas; 0 landings de regalo porque el catálogo productivo está vacío) y `git diff --check`: PASS. Inspección de `dist/regalos/index.html`: canonical `/regalos/`, un H1, cero scripts, 6 enlaces internos y 0 rotos. Los únicos avisos son los informativos esperados por las cuatro colecciones productivas vacías.

## M4.11 — Integración, dirección artística y QA de descubrimiento

**Estado:** DONE
**Objetivo:** cerrar Home, shell y listados como un recorrido coherente antes de fichas, aplicando “Atelier de pequeños detalles” a la página completa y no como suma de módulos.

**Alcance:** auditoría visual de extremo a extremo; ajustar composición, jerarquía, ritmo vertical, espaciado, superficies, tipografía, fotografía, recortes/object-position, proporciones, variaciones de cards, transiciones entre secciones, ornamentación moderada y motion; dar composición propia a 320/768/1440; integrar editorialmente categorías, ocasiones, destinatarios, destacados, trabajos, proceso existente y CTA final; corregir estados, enlaces, duplicación/dead code directo; permitir cambios mínimos y trazables en tokens/foundations/componentes existentes cuando la especificación autoritativa lo exija; incorporar en la zona inferior del Footer la firma del creador definida a continuación.

**Requisito explícito del Footer — firma del creador:** copy único `Hecho con mimo para Luna · Creado por Antonio MDM · © {YEAR}`; `Antonio MDM` es un `<a href="https://antoniomdm.dev/">` real, utilizable sin JavaScript, sin `target="_blank"` salvo convención de proyecto previa y, si se justificase, con `rel` seguro; `{YEAR}` se resuelve una sola vez durante el build de Astro (preferentemente mediante una constante de frontmatter), sin año repetido, dependencia, hidratación ni JavaScript cliente. Se sitúa bajo navegación/contacto/legal con separación suficiente, jerarquía tipográfica secundaria, legibilidad y contraste WCAG AA; el enlace conserva teclado y foco claramente visible y puede usar sólo un subrayado/transición/desplazamiento sutil coherente con el motion system. No sustituir el copy por corazones, emojis, iconos u ornamentación, no convertirlo en CTA/publicidad y no añadir animación si no aporta valor.

**Fuera de alcance:** ficha, analytics, SEO avanzado, reescritura caótica del design system, librerías pesadas, cambio de copy/CTA/derechos ya aprobados, nueva sesión fotográfica o nueva sección de proceso sin contenido aprobado. M4.1 permanece `DONE`; esta evolución posterior del Footer no reabre su alcance histórico.

**Dependencias:** M4.10.  
**Archivos/áreas previstas:** home, shell/Footer, listados, componentes M4, estilos/tokens existentes sólo si es necesario y evidencia visual de G4.

**Contratos afectados:** G4, dirección artística, UI, navigation, accessibility, responsive, motion y performance inicial.

**Criterios de aceptación:** recorrido home→intención→selección coherente por teclado y sin JS; jerarquía y ritmo claros; fotografía protagonista; composición no reducible a grid→grid; tokens consistentes; ornamentación escasa e intencional; hover y foco equivalentes; movimiento limitado al vocabulario aprobado y anulado/reducido correctamente; 320/768/1440 sin overflow, solapes ni recortes dañinos; ninguna fuente/animación introduce CLS ni rompe budgets. La firma aparece completa en la zona inferior del Footer, legible y secundaria, con enlace nativo/foco visible, año de build centralizado y sin competir con navegación, contacto, legales ni CTA.

**Verificación:** suite, build y smoke manual sin JS; teclado, contraste y `prefers-reduced-motion`; comprobación de HTML generado (firma/enlace/año y ausencia de hidratación); capturas y revisión visual manual obligatoria a 1440, 768 y 320 px. La revisión debe confirmar coherencia extremo a extremo, ausencia de aspecto de plantilla genérica, fotografía/ritmo/transiciones, moderación ornamental, foco/hover, ausencia de overflow/CLS y cumplimiento de budgets; tests/lint/build son necesarios, no suficientes.

**Modelo recomendado:** LUNA → SOL REVIEW.  
**Razón del modelo:** implementación visual iterativa y acotada seguida de auditoría senior del recorrido, contratos y gate G4.

**Evidencia:** PASS (2026-08-16) — Home, shell y listados aplican “Atelier de pequeños detalles” mediante tokens semánticos recalibrados, hero editorial, capítulos de intención diferenciados, proceso numerado, galería asimétrica, superficies/ritmo propios y CTA final integrado; se corrigieron los tokens inexistentes de descubrimiento y la navegación de escritorio oculta por el `<details>` cerrado. El Footer incorpora una única firma `Hecho con mimo para Luna · Creado por Antonio MDM · © 2026`, con año UTC resuelto en build, enlace nativo sin nueva pestaña, foco visible y cero hidratación. QA manual del artefacto a 320/768/1440: composición, recortes, lazy media, navegación, menú nativo, foco, estados vacíos, Footer y listados PASS; 0 px de overflow y 0 scripts cliente. `prefers-reduced-motion` está presente en 5 reglas compiladas y anula transiciones/desplazamientos no esenciales. Contraste mínimo de texto auxiliar sobre las nuevas superficies: 5.03:1; foco sobre canvas: 6.80:1; acción: 8.12:1. Budgets Home: HTML 3.00 KiB gzip, CSS total 5.43 KiB gzip, JS 0 KiB y mayor variante hero 120,053 bytes. `npm run format`, `npm run lint`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (22 archivos, 144 tests), `npm run build` (5 páginas), smoke sin JS y link check (71 enlaces internos, 0 fallos): PASS. G4 satisfecho.

**Corrección posterior:** el PASS anterior conserva su evidencia técnica e histórica, pero la comparación con la referencia visual aportada posteriormente demuestra que fue insuficiente en escala, protagonismo fotográfico, densidad, ritmo, descubrimiento, materialidad, CTA y Footer. No se borra ni se reescribe ese cierre: M4.11.1–M4.11.8 forman una recuperación explícita y G4 vuelve a quedar abierto.

## M4.11.1 — Auditoría y contrato visual

**Estado:** DONE
**Objetivo:** registrar la referencia aprobada y convertir la diferencia entre la Home actual y “Atelier de pequeños detalles” en un contrato reproducible.
**Alcance:** lectura completa de roadmap/M3/M4; inspección de tokens, foundations, layout, Header, Hero, cards, descubrimiento, destacados, proceso, trabajos, CTA, Footer, responsive, motion, contenido y assets; build y revisión renderizada 320/768/1440; registro estable de referencia y capturas previas.
**Fuera de alcance:** modificar la UI, inventar contenido/assets, cerrar G4 o ejecutar M4.11.2.
**Dependencias:** M4.11 histórico.
**Archivos/áreas:** `docs/design/reference/`, `docs/design/home-art-direction-recovery.md`, `docs/design/visual-direction.md`, readiness y roadmap.
**Contratos afectados:** dirección artística, G4, documentación, contenido y assets.
**Criterios de aceptación:** referencia estable y enlazada; función no pixel-perfect explícita; gap clasificado; reutilizables/faltantes identificados; subtareas y bloqueos trazables; siguiente tarea única.
**Verificación:** SHA-256 del asset; build actual; DOM/capturas y medidas 320/768/1440; enlaces Markdown; revisión de estados y dependencias.
**Modelo recomendado:** SOL.
**Evidencia:** PASS (2026-08-16) — referencia registrada en `docs/design/reference/luna-home-art-direction-reference.png` (2.180.828 bytes, SHA-256 `747E4453AF9C043CE1D24CF792B56F8D12B8C299B606861FAADEE41F7D45B283`); auditoría y evidencias “before” documentadas en `docs/design/home-art-direction-recovery.md`. Build PASS. QA 1440/768/320 confirma 0 px de overflow, pero H1/foto miden respectivamente 516×519/663×378, 299×301/372×212 y 267×269/275×155 px; placeholders públicos, scroll excesivo, ritmo discontinuo y CTA/Footer desconectados justifican reabrir G4. No se modificó la UI ni se ejecutó M4.11.2.

## M4.11.2 — Design system, tipografía y ritmo

**Estado:** DONE
**Objetivo:** evolucionar el sistema M3 para sostener la referencia sin valores oportunistas ni un sistema paralelo.
**Alcance:** diferenciar medidas `visual/content/copy`; recalibrar escala tipográfica, espacios de capítulo, superficies, radios/sombras y continuidad cromática; fijar vocabulario de 2–4 motivos locales; documentar migración de consumidores.
**Fuera de alcance:** rediseñar secciones completas, añadir webfonts sin archivos/licencia, imágenes sintéticas o librerías.
**Dependencias:** M4.11.1.
**Assets necesarios:** ninguno para la base; fuentes de marca WOFF2/licencia sólo como mejora futura, no blocker.
**Criterios de aceptación:** roles semánticos reutilizables; lectura 45–70 caracteres; contraste AA; ritmo no uniforme; motivos ignorados por AT; sin regresión de CSS/CLS.
**Verificación:** lint, typecheck, tests, build, contraste, showcase y revisión 320/768/1440.
**Modelo recomendado:** SOL → LUNA.
**Evidencia:** PASS (2026-08-16) — el sistema M3 evoluciona sin aliases ni sistema paralelo: medidas semánticas `visual/content/reading/copy/compact`, ritmos `compact/standard/spacious/chapter`, escala tipográfica y tracking recalibrados, y superficies `warm/calm` migradas en todos los consumidores. `Ornament.astro` limita el vocabulario local a `thread`, `underline` y `dots`, queda oculto a tecnologías de asistencia y no hidrata JavaScript; el showcase y tests cubren sus variantes. La documentación fija roles, decisiones y mapa de migración. Contraste WCAG: mínimo 6.03:1 en las combinaciones de texto verificadas. QA real a 1440/768/320 px: 0 overflow horizontal, 0 errores/warnings de consola y escala H1 progresiva 78.88/53.76/44 px; capturas en `docs/design/evidence/m4-11-2-foundations/`. `npm run lint`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (22 archivos, 145 tests), `npm run build` (5 páginas, 23,601 bytes CSS y 0 JS), Prettier específico y `git diff --check`: PASS. Los únicos avisos del build son los esperados por las cuatro colecciones productivas vacías. No se rediseñó ninguna sección ni se ejecutó M4.11.3.

## M4.11.3 — Header y Hero editorial

**Estado:** DONE
**Objetivo:** corregir la prioridad máxima con aproximadamente 45 % contenido y 55 % fotografía en desktop, y una composición propia en móvil.
**Alcance:** header más respirado manteniendo sólo navegación real; H1 aprobado con ruptura editorial adaptable; fotografía hero real grande y bien encuadrada; ambos CTA/destinos existentes; transición orgánica a la siguiente sección.
**Fuera de alcance:** logo inventado, iconos de ecommerce, copy nuevo, otra fotografía, script caligráfico no licenciado o posicionamiento hardcodeado a 1440.
**Dependencias:** M4.11.2.
**Assets necesarios:** `src/assets/home/tarta-hero.png` (READY); logo/nombre formal siguen bloqueados y el diseño debe degradar honestamente.
**Criterios de aceptación:** producto inequívocamente protagonista; H1 no domina; LCP y dimensiones estables; CTA táctiles; sin recorte dañino ni overflow a 320/768/1440.
**Verificación:** suite/build, HTML, teclado, contraste, requests/LCP inicial y capturas comparadas.
**Modelo recomendado:** LUNA → SOL REVIEW.
**Evidencia:** PASS (2026-08-16) — el Header usa la medida `visual`, gana respiración (81 px móvil/89 px desktop) y mantiene exclusivamente los cuatro destinos reales más el fallback honesto “Inicio”, sin logo ni iconos inventados. El Hero conserva H1, copy, fotografía y ambos destinos aprobados; en desktop sus tracks útiles miden 529.19/646.81 px, reparto 45/55 sin contar el gap, y la fotografía alcanza 646.81×608 px frente a 529.19×303.25 px del título. En 768/320 adopta composición propia título→producto→copy/CTA; el producto mide 691.55×388.98 y 289×216.75 px, con punto focal al 100 % para no añadir recorte al borde derecho ya presente en el original. QA real 1440/768/320: 0 overflow horizontal, targets CTA de 48 px, menú móvil 94.38×44 px, foco visible, 0 errores/warnings de consola y contraste mínimo 6.03:1. HTML estático: imagen AVIF/WebP/JPG responsive, `width="1672" height="941"`, `loading="eager"`, `fetchpriority="high"`, un `currentSrc` AVIF responsive y 0 scripts; el ornamento `thread` ignorado por AT enlaza visualmente el siguiente capítulo. Capturas en `docs/design/evidence/m4-11-3-header-hero/`. `npm run lint`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (22 archivos, 146 tests), `npm run build` (5 páginas), Prettier específico y `git diff --check`: PASS. Los avisos del build siguen siendo los esperados por las cuatro colecciones productivas vacías. No se ejecutó M4.11.4.

## M4.11.4 — Storytelling artesanal y trabajos realizados

**Estado:** DONE
**Objetivo:** transformar proceso y galería en una historia compacta de cuidado, evidencia y producto real.
**Alcance:** mantener el significado aprobado de los tres pasos; conectar visualmente la secuencia; evolucionar el collage con superficie editorial, proporciones, asimetría y profundidad controladas; permitir futuras fotos de proceso sin exigirlas ahora.
**Fuera de alcance:** claims, reseñas, cifras, fotografías nuevas, carrusel, feed social o parallax sin coste demostrado.
**Dependencias:** M4.11.3.
**Assets necesarios:** cuatro fotografías READY en `src/assets/home/work-showcase/`; deseable no bloqueante: foto horizontal de manos preparando packaging.
**Criterios de aceptación:** narrativa legible, collage no reducible a grid, orden DOM correcto, alt/dimensiones preservados, lazy loading y reduced motion.
**Verificación:** contenido/derechos, suite/build, teclado, requests y capturas 320/768/1440.
**Modelo recomendado:** LUNA → SOL REVIEW.
**Evidencia:** PASS (2026-08-16) — el proceso mantiene literalmente los tres pasos aprobados y los convierte en una secuencia conectada: `ol`/`li` en el mismo orden DOM, numeración nativa reforzada visualmente y motivo `thread` ignorado por AT; en 1440 sus tres capítulos miden 362.66×192.36 px y en 768 miden 209.19×262.03 px, mientras que a 320 pasan a un recorrido vertical de 736.31 px sin perder orden ni lectura. “Trabajos realizados por Luna” conserva las cuatro fotografías, alt, derechos y orden aprobados dentro de una superficie editorial; el título lateral y las escalas 450.56×597.12, 330.89×250.03, 160.49×213.12 y 193.26×146.25 px en 1440 forman un collage asimétrico con profundidad controlada, no una cuadrícula uniforme. A 320 la composición propia mantiene escalas 229×286.25, 185.97×232.45, 200.31×200.31 y 162.08×121.55 px, sin carrusel ni overflow. HTML estático: las cuatro imágenes preservan `width="1536" height="2048"`, AVIF/WebP/JPG, `loading="lazy"` y orden semántico; inventario inicial confirma 0 requests de trabajos y 0 scripts. Reduced motion anula el único zoom de hover; la sección no añade controles, tab stops ni trampas de teclado. QA 1440/768/320: 0 overflow horizontal y 0 errores/warnings de consola; capturas de proceso y collage en `docs/design/evidence/m4-11-4-storytelling-work/`. Contenido/derechos READY verificados contra readiness y tests. `npm run lint`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (22 archivos, 147 tests), `npm run build` (5 páginas), Prettier específico y `git diff --check`: PASS. Los avisos del build siguen siendo los esperados por las cuatro colecciones productivas vacías. La foto horizontal de packaging continúa como mejora deseable no bloqueante y no se ejecutó M4.11.5.

## M4.11.5 — CTA emocional y Footer diseñado

**Estado:** DONE
**Objetivo:** cerrar la historia con una conversión integrada y un Footer con marca, contacto y crédito secundarios.
**Alcance:** rediseñar CTA conservando copy/WhatsApp existentes; integrar WhatsApp Business, email e Instagram aprobados; mantener navegación real; separar `© {YEAR}` de la firma cuando mejore jerarquía; conservar enlace Antonio MDM y año de build único.
**Fuera de alcance:** otras redes, horarios/políticas, identidad legal inventada, formulario, CRM o plantilla de producto M5.1.
**Dependencias:** M4.11.4.
**Assets necesarios:** contactos READY en `content-readiness.md`; foto horizontal de packaging es deseable pero no bloqueante.
**Criterios de aceptación:** CTA pertenece al mismo sistema, contacto accesible, enlaces reales, foco AA, Footer ordenado a 320/768/1440, cero JS añadido sólo por el año.
**Verificación:** suite/build, HTML/hrefs, teclado, contraste y capturas.
**Modelo recomendado:** LUNA → SOL REVIEW.

**Evidencia:** PASS (2026-08-16) — el CTA conserva literalmente copy, destino WhatsApp y acción de 48 px, y cierra la Home como una superficie editorial cálida enlazada visualmente con el Footer mediante ornamentos `thread`/`dots` ignorados por AT. El Footer mantiene identidad y navegación reales e integra exclusivamente los contactos READY: WhatsApp Business `+34 697 63 71 80` con el mensaje aprobado, `mailto:encargosmgr@gmail.com` e Instagram `@lunatartas`; los tres son enlaces nativos dentro de `address`, sin `target="_blank"` ni datos inventados. Copyright `© 2026` y firma secundaria “Hecho con mimo para Luna · Creado por Antonio MDM” quedan separados, con un único año de build y el enlace del creador preservado. QA real 1440/768/320: orden CTA→identidad→navegación→contacto→copyright→firma, 0 overflow horizontal, CTA de 48 px, navegación/contactos de al menos 44 px, foco visible de 6 px, contraste mínimo 5.03:1, 0 scripts y 0 errores/warnings de consola. Capturas en `docs/design/evidence/m4-11-5-cta-footer/`. HTML estático y `href` exactos comprobados en `dist/index.html`; `npm run format`, `npm run lint`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (22 archivos, 153 tests), `npm run build` (5 páginas) y `git diff --check`: PASS. Los avisos del build siguen siendo los esperados por las cuatro colecciones productivas vacías. No se ejecutó M4.11.6.

## M4.11.6 — Motion y ornamentación progresiva

**Estado:** DONE
**Objetivo:** añadir únicamente movimiento y materialidad que ordenen la lectura o conecten capítulos.
**Alcance:** línea/hilo, subrayado orgánico y puntos o marcas de papel; hover/focus equivalentes; reveal/draw sólo si mejora la lectura; API nativa y JS mínimo si se demuestra necesario.
**Fuera de alcance:** emojis, librería de animación, canvas/WebGL, autoplay, gran parallax, ornamentos de identidad no aprobados o animaciones de layout.
**Dependencias:** M4.11.5.
**Criterios de aceptación:** nada se mueve sin propósito; contenido completo sin JS; reduced motion deja estado estable; sin CLS/INP ni coste fuera de budget.
**Verificación:** teclado, `prefers-reduced-motion`, JS deshabilitado, performance y capturas.
**Modelo recomendado:** LUNA → SOL REVIEW.
**Evidencia:** PASS (2026-08-16) — `Ornament.astro` conserva exclusivamente `thread`/`underline`/`dots` y añade la opción acotada `motion="none" | "draw"`: el estado base es el trazo completo y sólo cuatro hilos/subrayados que conectan Hero, transición, proceso y CTA usan dibujo progresivo. En escritorio compatible se vincula a `animation-timeline: view()` mediante `@supports`; móvil, navegadores sin soporte y `prefers-reduced-motion: reduce` reciben el trazo final estático (`animation-name: none`, `stroke-dashoffset: 0` a 320), sin polyfill, autoplay temporal, parallax, librería ni JavaScript. El subrayado orgánico refuerza el énfasis del H1 sin invadir texto y se retiró el zoom sin función de la galería no interactiva; navegación, cards y CTA emparejan hover con `focus-visible`/`focus-within`, manteniendo anillo de foco de 6 px y desplazamientos máximos de 2–3 px sólo en controles. QA real a 1440/768/320: 0 px de overflow, 0 scripts, 0 errores/warnings de consola, 5/5 imágenes cargadas, CTA móviles de 48 px y capturas de Hero/proceso/cierre/foco en `docs/design/evidence/m4-11-6-motion/`. La carga lazy no alteró altura ni posiciones de proceso, galería, CTA o Footer (delta medido: 0 px), y todas las imágenes mantienen dimensiones intrínsecas. Budgets Home: HTML 3.56 KiB gzip, CSS total 6.90 KiB gzip, JS 0 KiB, transferencia inicial móvil aproximada 22.14 KiB y variante LCP AVIF de 11,959 bytes. `npm run format`, `npm run lint`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (22 archivos, 153 tests), `npm run build` (5 páginas) y `git diff --check`: PASS. Los avisos de build siguen siendo los esperados por las cuatro colecciones productivas vacías. No se ejecutó M4.11.7, que conserva su bloqueo editorial.

## M4.11.7 — Descubrimiento editorial e ideas para regalar

**Estado:** DONE
**Objetivo:** convertir tipo/ocasión/persona e ideas destacadas en entradas visuales, útiles y honestas.
**Alcance:** eliminar todos los “Pronto podrás…” públicos; ocultar módulos vacíos sin hueco; cuando exista contenido, crear cards visuales clicables con datos, rutas y fotografías reales aprobadas, sin grid ecommerce genérico.
**Fuera de alcance:** inventar productos, categorías, precios, textos, destinos o reutilizar fotos de la referencia.
**Dependencias:** M4.11.3 y catálogo/taxonomías aprobados.
**Assets necesarios:** catálogo productivo, taxonomías/copy y relaciones aprobadas; portadas/alt/derechos; fotos 4:3 u horizontales asociables a cada intención.
**Criterios de aceptación:** cero placeholders; sólo publicados; cards semánticas y accionables sin hover; composición visual con ritmo y estados vacíos no publicables.
**Verificación:** queries/build/link check, contenido/derechos, teclado y capturas 320/768/1440.
**Modelo recomendado:** SOL → LUNA.
**Evidencia:** PASS (2026-08-16) — validados y auditados 4 productos reales publicados (`tarta-de-panales-personalizada`, `lamina-personalizada-a5`, `lamina-natalicia-a5`, `invitacion-marcapaginas-personalizada`) con portadas reales válidas en `src/assets/catalog/`, textos alternativos descriptivos, derechos de autoría y propiedad propios (Luna / MGR Creaciones) y aprobaciones formales registradas. Estos 4 productos proyectan 9 intenciones taxonómicas reales (3 categorías: `tartas-de-panales`, `papeleria-personalizada`, `laminas-personalizadas`; 3 ocasiones: `nacimiento`, `baby-shower`, `cumpleanos`; 3 destinatarios: `bebe`, `ninos`, `alguien-especial`) y 3 creaciones destacadas (`featured: true`). No existen placeholders públicos, módulos vacíos ni enlaces a páginas sin contenido; las taxonomías sin producto publicado (`packs-personalizados`, `comunion`) se omiten limpiamente. El build estático genera 14 rutas completas. Verificaciones: `npm run format`, `npm run lint`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (22 archivos, 155 tests), `npm run build` (14 páginas) y `git diff --check`: PASS.
**Corrección posterior:** `TaxonomyCard` reutiliza la portada del primer producto publicado relacionado mediante `catalogImageMap`; Home e índices de taxonomías ya emiten media disponible con dimensiones y alt, en lugar del placeholder.

## M4.11.8 — Responsive, visual QA y performance

**Estado:** DONE
**Objetivo:** cerrar de nuevo G4 únicamente con evidencia técnica y visual contra la referencia aprobada.
**Alcance:** ajustes directos; matriz 320/768/1440 e intermedios; teclado, zoom, no-JS, reduced motion, contraste, overflow, recortes, CLS/INP/LCP, tamaños y comparación explícita de similitud.
**Fuera de alcance:** aceptar fallos por tener build verde, avanzar M5, crear contenido o reabrir arquitectura no relacionada.
**Dependencias:** M4.11.2–M4.11.7 en DONE; contenido bloqueante resuelto.
**Criterios de aceptación:** tests/lint/typecheck/build/performance/a11y PASS; capturas finales; escala, jerarquía, fotografía, calidez, ritmo, materialidad, sofisticación, CTA y Footer claramente alineados; cero placeholder/overflow/rotura responsive.
**Verificación:** suite contractual, budgets, smoke, capturas completas y checklist manual de `docs/design/home-art-direction-recovery.md`.
**Modelo recomendado:** SOL.
**Gate:** sólo esta subtarea puede volver a declarar G4 satisfecho.
**Evidencia:** PASS (2026-08-16) — `npm run typecheck` (0 errores), `npm run lint` (0 errores/warnings), `npm test` (22 archivos, 155 tests), `npm run build` (14 páginas) PASS. La revisión visual y técnica contra la referencia confirma alineación en escala, jerarquía, fotografía, calidez, ritmo, materialidad, sofisticación, CTA y Footer. Cero placeholders públicos, sin overflow, fallos responsivos ni regresiones en budgets (LCP/CLS/INP). G4 queda satisfecho de nuevo y cerrado.

---

# M5 — Product Detail + WhatsApp Conversion

**Estado:** PENDING  
**Gate:** G5.

## M5.1 — Extensión del builder WhatsApp para producto

**Estado:** DONE
**Objetivo:** completar el builder compartido con enlaces de producto correctos, centralizados y testables.  
**Alcance:** extender el caso personalizado de M4.6 con plantilla de producto, canonical de origen y matriz completa de normalización/URL/message encoding/errores.  
**Fuera de alcance:** analytics, UI de ficha, API Business o envío automático.  
**Dependencias:** M4.11.8 y plantilla de producto aprobada.
**Archivos/áreas previstas:** `src/lib/whatsapp/`, config y tests.  
**Contratos afectados:** WhatsApp, config, URLs, privacidad.  
**Criterios de aceptación:** mensaje nunca vacío; Unicode/acentos/URLs funcionan; no hay doble encoding; funciones puras cubren ambos flujos.  
**Verificación:** tests de matriz y apertura manual en móvil/desktop sin completar envío.  
**Modelo recomendado:** LUNA.  
**Razón del modelo:** utilidad pura con casos definidos.  
**Evidencia:** PASS (2026-08-17) — Se registra la aprobación editorial de Luna en `docs/conversion/conversion-strategy.md` y `docs/product/content-readiness.md`: saludo “Hola, me interesa {productName} 😊”, consulta de disponibilidad/precio/personalización sin inventar datos, nombre de producto publicado, URL canónica absoluta y apertura en contexto nuevo con `target="_blank"` + `rel="noopener noreferrer"`. `src/lib/whatsapp/product.ts` añade builders puros de mensaje/URL, valida número internacional, nombre no vacío, origen HTTPS canónico `https://lunatartas.es`, ruta `/productos/`, barra final y ausencia de query/hash/credenciales; aplica `encodeURIComponent` una sola vez. `tests/product-whatsapp.test.ts` cubre plantilla, URL, Unicode/acentos/ñ/símbolos/emoji, encoding, canonicalidad y errores. `npm run lint`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (23 archivos, 164 tests), `npm run build` (16 páginas), Prettier específico y `git diff --check`: PASS. No se implementó UI de ficha ni analytics; siguiente tarea M5.2.

## M5.2 — Ruta y contenido principal de producto

**Estado:** DONE
**Objetivo:** generar una ficha estática comprensible para cada producto publicado.  
**Alcance:** `[slug]`, breadcrumb visual, nombre, resumen/descripción, precio semántico, contenido del pack y taxonomías; comportamiento ante slug ausente; composición editorial coherente con M4.11 sin copiar mecánicamente la Home.

**Fuera de alcance:** galería completa, CTA final, relacionados y JSON-LD.  
**Dependencias:** M5.1.  
**Archivos/áreas previstas:** `src/pages/productos/[slug].astro`, componentes product.  
**Contratos afectados:** catálogo, rutas, UI, conversión.  
**Criterios de aceptación:** una ruta por publicado, ninguna por draft; información coincide con dominio; price variants honestas; estructura semántica correcta; jerarquía, espacio y superficies continúan “Atelier de pequeños detalles”.

**Verificación:** route tests, build, inspección de variantes/404 y revisión visual 320/768/1440.

**Modelo recomendado:** LUNA → SOL REVIEW.  
**Razón del modelo:** implementación de ruta con revisión de la principal página de negocio.  
**Evidencia:** PASS (2026-08-17) — `src/pages/productos/[slug].astro` genera una ruta estática por cada producto publicado mediante `getPublishedProducts`; los drafts no generan paths y los slugs ausentes quedan fuera del artefacto estático. `ProductDetail.astro` presenta breadcrumb, nombre, resumen, descripción, precio semántico y taxonomías enlazadas con los route builders, sin galería, CTA, relacionados, JSON-LD ni JavaScript adelantado. Se corrigió el sizing móvil del contenedor para preservar gutter y wrapping real a 320 px, sin alterar la composición de lectura a 768/1440 px. Capturas headless de la ruta `tarta-de-panales-personalizada` a 320/768/1440 revisadas: jerarquía, espacio, superficies cálidas, serif/sans, taxonomías responsive y ausencia de overflow visual PASS. `tests/product-detail.test.ts` cubre publicación frente a draft, rutas, `fixed/from/on_request`, semántica y ausencia de hidratación. `npm run lint`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (24 archivos, 169 tests), `npm run build` (24 páginas, 8 fichas de producto) y `git diff --check`: PASS. `npm run format` mantiene dos avisos preexistentes en `src/components/catalog/media-projection.ts` y `src/components/home/FeaturedProducts.astro`, ajenos a M5.2.

## M5.3 — Galería responsive de producto

**Estado:** PENDING  
**Objetivo:** mostrar portada y detalle visual con estabilidad y accesibilidad.  
**Alcance:** imagen principal, thumbnails/alternativas cuando existan, responsive images, alt/captions, ratios/recortes/object-position y progresión editorial sin JS o JS mínimo justificado.

**Fuera de alcance:** zoom complejo, lightbox dependiente de librería o edición de fotos.  
**Dependencias:** M5.2.  
**Archivos/áreas previstas:** componentes gallery/media y styles/tests.  
**Contratos afectados:** Media, UI, a11y, performance.  
**Criterios de aceptación:** producto protagonista y color fiel; dimensiones conocidas; navegación teclado si interactiva; fallback de una imagen; composición propia en móvil/escritorio; sin CLS perceptible ni descarga innecesaria.

**Verificación:** revisión 320/768/1440, teclado/sin JS, build y auditoría de requests/imágenes.

**Modelo recomendado:** LUNA → SOL REVIEW.  
**Razón del modelo:** UI localizada con riesgos de accesibilidad y rendimiento.  
**Evidencia:** PASS (2026-08-17) — `ProductGallery.astro` proyecta siempre la portada aprobada y, cuando existen, las alternativas de `media.gallery` desde el dominio sin catálogo hardcodeado ni controles que requieran JavaScript. La portada usa AVIF/WebP responsive, dimensiones intrínsecas, `loading="eager"` y `fetchpriority="high"`; las alternativas conservan su alt/caption aprobados, `width`/`height`, `sizes` ajustados a su columna y carga `lazy`. La composición pasa de portada seguida de alternativas en una cuadrícula móvil a portada dominante con columna de vistas adicionales desde 768 px; el texto mantiene medida de lectura y la galería aprovecha el container de contenido en escritorio. El fallback natural de un único asset se conserva al omitir la columna de alternativas. Revisión local de `tarta-de-panales-personalizada` a 320/768/1440: 0 overflow horizontal, 0 scripts, portada con prioridad alta y 3 alternativas lazy; HTML generado: 4 `picture`/`img` con dimensiones conocidas. `tests/product-detail.test.ts` cubre la composición portada+galería, prioridad, fallback, dimensiones y ausencia de hidratación. `npm run lint`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (24 archivos, 169 tests), `npm run build` (24 páginas) y `git diff --check`: PASS.

## M5.4 — Panel de conversión y CTA de producto

**Estado:** DONE
**Objetivo:** hacer evidente el siguiente paso con contexto suficiente.  
**Alcance:** precio/resumen, CTA “Pedir por WhatsApp”, mensaje con nombre+canonical, posición mobile/desktop, microcopy aprobado, transición visual desde la galería y fallback seguro.

**Fuera de alcance:** sticky intrusivo, analytics, formulario o checkout.  
**Dependencias:** M5.3.  
**Archivos/áreas previstas:** componentes product/conversion, WhatsApp builder tests.  
**Contratos afectados:** UI, WhatsApp, conversion.  
**Criterios de aceptación:** CTA visible, accesible e integrado como siguiente paso natural; href correcto sin JS; no oculta contenido/foco ni compite con el producto; producto/origen inequívocos.

**Verificación:** tests de href, prueba móvil/desktop/teclado y mensaje previsualizado.  
**Modelo recomendado:** LUNA.  
**Razón del modelo:** integración directa de builder y patrón visual.  
**Evidencia:** PASS (2026-08-17) — `ProductConversionPanel.astro` conecta la galería con el siguiente paso mediante resumen del producto, precio honesto y CTA estático “Pedir por WhatsApp”. Reutiliza el builder puro con el nombre público y `getCanonicalUrl(routes.product(product.slug))`; el enlace generado abre en contexto nuevo con `target="_blank"` y `rel="noopener noreferrer"`, sin JavaScript. El panel ocupa una columna íntegra en móvil y organiza resumen/acción en dos columnas desde 768 px, sin sticky ni ocultar contenido. `tests/product-detail.test.ts` cubre la integración, builder, canonical, precio, atributos seguros, breakpoint y ausencia de hidratación; `tests/product-whatsapp.test.ts` previsualiza y valida el mensaje aprobado. QA local de `tarta-de-panales-personalizada` a 320/768/1440: CTA accesible por teclado, sin overflow horizontal; HTML generado contiene `wa.me`, nombre de producto, canonical absoluto y mensaje URL-codificado una sola vez. `npm run lint`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (24 archivos, 169 tests), `npm run build` (24 páginas) y `git diff --check`: PASS. `npm run format` queda bloqueado únicamente por formato preexistente en `src/components/catalog/media-projection.ts` y `src/components/home/FeaturedProducts.astro`, fuera del alcance de M5.4.

## M5.5 — Personalización y confianza en ficha

**Estado:** DONE
**Objetivo:** responder dudas clave sin promesas no verificadas.  
**Alcance:** capacidades de personalización, contenido incluido, proceso/confianza y avisos aprobados condicionados al modelo.  
**Fuera de alcance:** configurador, cálculo dinámico, FAQ global o claims inventados.  
**Dependencias:** M5.4 y contenido aprobado.  
**Archivos/áreas previstas:** componentes product y proyecciones mínimas.  
**Contratos afectados:** catálogo customization, copy, conversión.  
**Criterios de aceptación:** secciones sólo aparecen con datos; headings/lectura correctos; no duplican información contradictoria; proceso/confianza se perciben como narrativa artesanal y no como cards genéricas repetidas.

**Verificación:** casos con/sin personalización, revisión de copy y visual.  
**Modelo recomendado:** LUNA.  
**Razón del modelo:** render condicional sencillo sobre datos válidos.  
**Evidencia:** PASS (2026-08-17) — `ProductPersonalization.astro` proyecta `customization.options` y su descripción sólo cuando el discriminador es `available`; para `none` no emite sección ni hueco editorial. La descripción del producto continúa siendo la única fuente del contenido incluido, sin duplicar precio ni prometer capacidades nuevas. El bloque de proceso/confianza reutiliza los tres pasos aprobados de `trust-and-work.ts` en una secuencia narrativa semántica `ol`, no en cards genéricas, y conserva el orden editorial. `ProductDetail.astro` lo integra después del CTA como continuidad natural hacia la información y el contexto. Tests cubren la condición, opciones, fuente de confianza, headings, lista ordenada y ausencia de `client:`/FAQ/configurador. En el build real, las fichas publicadas con personalización muestran ambas secciones, con copy y opciones provenientes de YAML; no se generó JavaScript. `npm run lint`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (24 archivos, 169 tests), `npm run build` (24 páginas), Prettier específico, inspección HTML de fichas y `git diff --check` (sin errores de contenido; sólo advertencias de conversión CRLF de Git): PASS.`

## M5.6 — Productos relacionados y continuidad

**Estado:** DONE
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
**Evidencia:** PASS (2026-08-17) — `getRelatedProducts` devuelve sólo publicados, excluye el producto actual y puntúa taxonomías compartidas con desempate estable por `order`, nombre e ID; valida límites no negativos y no duplica candidatos. `projectRelatedProducts` transforma el resultado en proyecciones de `ProductCard`, con máximo 3 elementos, rutas internas y precio semántico. `ProductRelated.astro` resuelve portadas desde el catálogo, usa `CardList`/`ProductCard` sin JavaScript y omite completamente la sección cuando no hay alternativas. La ficha recibe el catálogo validado desde `getStaticPaths` y mantiene los enlaces de contexto a categoría, ocasión y destinatario. Tests cubren exclusión de draft/actual, puntuación, límites, orden y composición; el build real emite relacionados con media y enlaces internos válidos en las fichas publicadas. `npm run lint`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (24 archivos, 170 tests), `npm run build` (24 páginas), Prettier específico, inspección HTML sin scripts y `git diff --check`: PASS. Siguiente tarea: M5.7 (modelo LUNA → SOL REVIEW).`

## M5.7 — QA del recorrido de conversión

**Estado:** DONE
**Objetivo:** cerrar el camino listado→ficha→WhatsApp y la alternativa personalizada.  
**Alcance:** smoke de variantes, continuidad artística M4→M5, responsive/teclado/sin JS, mensajes, estados y correcciones directamente relacionadas.

**Fuera de alcance:** instrumentación analytics o auditoría SEO completa.  
**Dependencias:** M5.6.  
**Archivos/áreas previstas:** páginas M4/M5, browser smoke inicial y evidencia.  
**Contratos afectados:** G5, conversion, UI, WhatsApp.  
**Criterios de aceptación:** ambos flujos llegan a URL WhatsApp correcta; ningún enlace vacío; fotografía, jerarquía, ritmo, tokens y motion son coherentes; no hay blocker visual/a11y crítico en rutas representativas.

**Verificación:** suite, build, matriz visual manual 320/768/1440, teclado/reduced-motion y smoke sin JS.

**Modelo recomendado:** LUNA → SOL REVIEW.  
**Razón del modelo:** Luna corrige; Sol audita el principal contrato comercial.  
**Evidencia:** PASS (2026-08-17) — Smoke de `/productos/` → `tarta-de-panales-personalizada` confirma ficha accesible y CTA nativo hacia `wa.me` con nombre público, URL canónica absoluta y copy aprobado codificado una única vez; el CTA de idea personalizada reutiliza la URL WhatsApp configurada sin enlace vacío. La inspección de las 24 páginas generadas detecta 0 `href` vacíos, 0 scripts con `src` y 33 enlaces WhatsApp; teclado conserva skip link y CTA nativos, y las reglas `prefers-reduced-motion` siguen presentes. Matriz visual manual de ficha a 320/768/1440 confirma fotografía real, jerarquía, ritmo y tokens coherentes desde M4; no hay overflow global ni blocker crítico visual/a11y. `npm run lint`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (24 archivos, 170 tests), `npm run build` (24 páginas) y `git diff --check`: PASS. `npm run format` sigue señalando exclusivamente dos formatos preexistentes y fuera de alcance: `src/components/catalog/media-projection.ts` y `src/components/home/FeaturedProducts.astro`. Siguiente tarea: M6.1 (modelo SOL → LUNA).

---

# M6 — SEO + Structured Data + Agent Discoverability

**Estado:** PENDING  
**Gate:** G6.

## M6.1 — Metadata, canonical y OpenGraph

**Estado:** DONE
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
**Evidencia:** PASS (2026-08-17) — `src/lib/seo/metadata.ts` centraliza el template de title, fallback de descripción, canonical absoluto desde `getCanonicalUrl`, robots, locale OpenGraph e imagen social HTTPS validada. `BaseLayout.astro` emite un único title/description/canonical/robots y los metadatos esenciales OpenGraph/Twitter; las rutas públicas pasan su ruta desde `routes`, las fichas usan su portada aprobada y los showcases técnicos se marcan `noindex,nofollow`. `tests/seo-metadata.test.ts` cubre plantilla, fallback editorial, canonical, robots, locale e imágenes inválidas; `scripts/verify-seo.mjs` revisa los 24 HTML generados, unicidad de canonical y existencia física de la imagen social. `npm run lint`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (25 archivos, 177 tests), `npm run build` (24 páginas), `npm run verify:seo` y `git diff --check`: PASS. `npm run format` mantiene exclusivamente dos avisos preexistentes fuera de alcance: `src/components/catalog/media-projection.ts` y `src/components/home/FeaturedProducts.astro`. Siguiente tarea: M6.2 (modelo LUNA → SOL REVIEW).

## M6.2 — Sitemap, robots y política de crawl

**Estado:** DONE
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
**Evidencia:** PASS (2026-08-17) — `src/lib/seo/crawl.ts` proyecta el conjunto indexable desde catálogo y `routes`: home, índice de productos, índices taxonómicos, productos publicados y sólo taxonomías publicadas con productos publicados. Los endpoints estáticos `sitemap.xml.ts` y `robots.txt.ts` generan URLs únicas, HTTPS/apex/con barra final y la referencia canónica al sitemap, sin añadir dependencias. La 404 estática se marca `noindex,nofollow`; drafts, showcases y rutas técnicas no entran al sitemap. `tests/seo-crawl.test.ts` cubre la exclusión de drafts/taxonomías vacías, canonicalidad, XML y robots; `scripts/verify-crawl.mjs` inspecciona el HTML/XML/TXT de `dist`, compara canonical/robots por URL y comprueba la 404. `npm run lint`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (26 archivos, 179 tests), `npm run build` (25 artefactos), `npm run verify:seo`, `npm run verify:crawl` y `git diff --check`: PASS. `npm run format` conserva únicamente dos avisos preexistentes fuera de alcance: `src/components/catalog/media-projection.ts` y `src/components/home/FeaturedProducts.astro`. Siguiente tarea: M6.3 (modelo LUNA).

## M6.3 — Breadcrumbs semánticos e internal linking

**Estado:** DONE
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
**Evidencia:** PASS (2026-08-17) — `src/lib/seo/navigation.ts` centraliza las proyecciones de breadcrumb para índices, landings taxonómicas y fichas usando `routes`; `Breadcrumb.astro` conserva `nav` + `ol`, enlaces internos de ancestros y un único último `aria-current="page"`. Se incorporan breadcrumbs visibles en los tres índices taxonómicos y el índice de productos, y se eliminan rutas/etiquetas duplicadas de las landings. `scripts/verify-links.mjs` audita el grafo del artefacto, destinos internos existentes, URLs del sitemap sin huérfanas y un breadcrumb semántico por URL indexable; no usa JavaScript cliente ni dependencias. Tests cubren las cuatro proyecciones y la integración existente: 27 archivos, 181 tests. `npm run lint`, `npm run typecheck` (0 errores/warnings/hints), `npm test`, `npm run build` (25 páginas), `npm run verify:seo`, `npm run verify:crawl`, `npm run verify:links` (25 HTML, 24 indexables, 0 rotos, 0 huérfanas, 0 problemas de breadcrumb), Prettier específico y `git diff --check`: PASS. Siguiente tarea: M6.4 (modelo SOL).`

## M6.4 — Product, Offer y BreadcrumbList JSON-LD

**Estado:** DONE
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
**Evidencia:** PASS (2026-08-17) — `src/lib/seo/structured-data/` incorpora builders puros de `Product`, `Offer`/`AggregateOffer` y `BreadcrumbList`, además de serialización JSON segura para contenido editorial. Las fichas comparten exactamente la proyección de breadcrumb visible, URL canónica e imágenes optimizadas absolutas. `fixed` publica un `Offer` con precio decimal exacto; `from` publica sólo `AggregateOffer.lowPrice`, sin inventar máximo ni número de ofertas; `on_request` no publica oferta. No se emiten ratings, disponibilidad, envío ni políticas no confirmadas. `tests/seo-structured-data.test.ts` cubre snapshots semánticos de los tres precios, URLs, breadcrumb y escape; `scripts/verify-structured-data.mjs` valida 8 fichas de `dist` (JSON, schema shape, canonical, assets y ausencia de claims falsos). Schema.org Validator validó la muestra `Product` y `BreadcrumbList` con 0 errores/advertencias; Google Rich Results detectó ambos elementos como válidos. Sus únicos cuatro avisos son opcionales (`review`, `aggregateRating`, `offerCount`, `highPrice`) y se omiten deliberadamente por no contar con datos aprobados. `npm run lint`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (28 archivos, 188 tests), `npm run build` (25 páginas), `npm run verify:seo`, `npm run verify:crawl`, `npm run verify:links`, `npm run verify:structured-data`, Prettier específico y `git diff --check`: PASS. `npm run format` mantiene únicamente dos avisos preexistentes fuera de alcance: `src/components/catalog/media-projection.ts` y `src/components/home/FeaturedProducts.astro`. Siguiente tarea: M6.5 (modelo LUNA → SOL REVIEW).

## M6.5 — Organization y WebSite JSON-LD

**Estado:** DONE
**Objetivo:** publicar identidad global sólo con datos empresariales verificados.  
**Alcance:** builders desde config, logo/URL/contactPoint/social sólo si confirmados y una inclusión no duplicada; mantener consistencia con la identidad empresarial visible en Footer sin convertir la firma del creador de M4.11 en identidad de `Organization`.

**Fuera de alcance:** LocalBusiness sin requisitos, SearchAction sin búsqueda o perfiles no verificados.  
**Dependencias:** M6.4 y datos de identidad aprobados.  
**Archivos/áreas previstas:** structured-data builders, BaseLayout/home y tests.  
**Contratos afectados:** configuración, identidad, SEO.  
**Criterios de aceptación:** schema mínimo válido; campos opcionales se omiten correctamente; una fuente de configuración; autoría web y entidad comercial no se confunden.

**Verificación:** tests, validación externa y comparación con contenido/footer.  
**Modelo recomendado:** LUNA → SOL REVIEW.  
**Razón del modelo:** builder simple con revisión semántica crítica.  
**Evidencia:** PASS (2026-08-17) — La aprobación directa de Luna queda registrada en `docs/product/content-readiness.md` y `docs/design/visual-direction.md`: «Luna Tartas», alternativa «Luna Estudio», URL oficial, Instagram único y logo recibido con autorización explícita de publicación y JSON-LD. `src/config/site.ts` centraliza y valida la identidad, incluidos perfiles HTTPS únicos; `src/lib/seo/structured-data/organization.ts` crea los builders puros mínimos. La portada emite una sola vez `Organization` (`https://lunatartas.es/#organization`) y `WebSite` (`https://lunatartas.es/#website`), con `publisher.@id` hacia la organización, URL canónica absoluta, `sameAs` limitado al Instagram aprobado y logo publicado como asset absoluto. No se emiten `legalName`, `contactPoint`, identidad fiscal, otras redes ni Antonio MDM. `tests/seo-organization.test.ts`, `tests/site-config.test.ts` y el auditor de `dist` cubren tipos, nombre, URL, IDs, relación, asset y ausencia de `TBD`. Schema.org Validator reconoce el marcado con 0 errores y 0 advertencias. `npm run lint`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (29 archivos, 198 tests), `npm run build` (25 páginas), `npm run verify:seo`, `npm run verify:crawl`, `npm run verify:links`, `npm run verify:structured-data` y `git diff --check`: PASS. `npm run format` mantiene exclusivamente dos avisos preexistentes fuera de alcance: `src/components/catalog/media-projection.ts` y `src/components/home/FeaturedProducts.astro`. Siguiente tarea: M6.6 (modelo LUNA → SOL REVIEW).

## M6.6 — `/catalog.json` público

**Estado:** DONE
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
**Evidencia:** PASS (2026-08-17) — `src/pages/catalog.json.ts` genera la proyección estática `1.0` desde el dominio validado: 8 productos y taxonomías publicados, URLs HTTPS canónicas absolutas, relaciones públicas, precios decimales exactos, capacidades de personalización y una portada WebP optimizada por Astro. No incluye `generatedAt`, por política explícita de reproducibilidad byte a byte; tampoco expone drafts, rutas de origen, aprobaciones, derechos, evidencias, galerías ni configuración interna. `docs/seo/catalog-json-schema.md` fija schema, compatibilidad y política de caché; `tests/public-catalog.test.ts` cubre determinismo, exclusión, relaciones, precios y validación de media. `scripts/verify-catalog.mjs` contrasta el artefacto con assets, relaciones y canonical HTML. `npm run lint`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (30 archivos, 201 tests), dos builds con hash idéntico de `dist/catalog.json`, `npm run verify:seo`, `npm run verify:crawl`, `npm run verify:links`, `npm run verify:structured-data`, `npm run verify:catalog` (8 productos/8 HTML) y `git diff --check`: PASS. `npm run format` conserva exclusivamente dos avisos preexistentes fuera de alcance: `src/components/catalog/media-projection.ts` y `src/components/home/FeaturedProducts.astro`. Siguiente tarea: M6.7 (modelo SOL).

## M6.7 — Auditoría SEO técnica pre-analytics

**Estado:** DONE
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
**Evidencia:** PASS (2026-08-17) — auditoría completa del artefacto (25 HTML: 24 indexables + 404) registrada en `docs/seo/technical-audit.md`: titles y descriptions 25/25 únicos, canonical único/apex/barra final consistente con sitemap y catalog JSON, H1 único en todas las páginas, OG/Twitter completos con imagen social existente, imágenes con alt descriptivo y dimensiones enteras, robots.txt/sitemap/404-noindex conformes, 0 enlaces rotos, 0 huérfanos, breadcrumbs con un único `aria-current`, 0 scripts ejecutables (render completo sin JS) y catalog.json determinista sin campos internos. Muestras externas: los 6 JSON-LD representativos (Organization, WebSite, Product+Offer, Product+AggregateOffer y 2 BreadcrumbList) extraídos del build obtuvieron 0 errores en el validador oficial `validator.schema.org`. Se detectó y corrigió un issue alto: las landings `/regalos/` duplicaban la preposición en title/H2 (`Regalos para Para bebés`, `Ideas para para bebés`); `src/pages/regalos/[slug].astro` normaliza el nombre editorial y `tests/taxonomy-listing.test.ts` añade guarda contractual. Abiertos sin bloqueo: AUD-1 medio (favicon ausente por marca `BLOCKED`; propietario: marca/Luna, salida M9.1), AUD-2 medio (landings taxonómicas de 50–133 palabras; propietario: contenido/Luna, salida M9.1 sin texto autogenerado) y AUD-3 bajo (2 titles de categoría de 71–72 caracteres; propietario: contenido/Luna). `npm run lint`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (30 archivos, 201 tests), `npm run build` (25 páginas), `npm run verify:seo` (24 HTML), `npm run verify:crawl` (24 URLs), `npm run verify:links` (0 rotos/0 huérfanos/0 breadcrumb issues), `npm run verify:structured-data` (8 productos + identidad home), `npm run verify:catalog` (8 productos/8 HTML), barrido independiente del artefacto y `git diff --check`: PASS. `npm run format` conserva exclusivamente los dos avisos preexistentes fuera de alcance: `src/components/catalog/media-projection.ts` y `src/components/home/FeaturedProducts.astro`. G6 satisfecho. Siguiente tarea: M7.1 (modelo SOL).

---

# M7 — Analytics + Observability

**Estado:** PENDING  
**Gate:** G7.

## M7.1 — Decisión de analytics y privacidad

**Estado:** DONE
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
**Evidencia:** PASS (2026-08-17) — `docs/conversion/analytics-decision.md` decide Matomo On-Premise en instancia dedicada dentro del EEE, desactivado por defecto y cargable sólo tras consentimiento analítico explícito; no se invoca una exención de cookies. Fija responsable (titular de Luna Tartas), rol de operación/encargo, minimización, IP anonimizada, prohibición de cookies persistentes/User ID/publicidad/recording, retención de 13 meses y agregados no reidentificables hasta 25 meses, exclusión interna fuera de Git y transferencia sólo EEE. Evalúa no medir, GA4/GTM y SaaS cookieless; confirma Matomo como alternativa proporcional. Define contrato `analytics` global, PII prohibida y diccionario final de los cuatro eventos V1, además de los checks para M7.2/M7.5. `conversion-strategy.md`, `catalog-contract.md`, `content-readiness.md` y el registro de riesgos quedan consistentes. Revisión contra conversión, despliegue, readiness y presupuesto de JS: PASS; `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` y `git diff --check`: PASS. No se añadió tracker, endpoint, ID, cookie ni dato personal. La habilitación de producción sigue requiriendo instancia EEE, acuerdo aplicable, identidad/política publicadas y aprobación explícita de la titular. Siguiente tarea: M7.2 (modelo SOL → LUNA).

## M7.2 — Facade y adaptador de analytics

**Estado:** DONE
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
**Evidencia:** PASS (2026-08-17) — `src/config/site.ts` incorpora una configuración global validada de Matomo, desactivada por defecto, que sólo admite `endpoint` HTTPS sin credenciales y `siteId` público cuando se habilite. `src/lib/analytics/` aporta el único adaptador, consentimiento denegado por defecto y sanitización estricta de los cuatro eventos: rechaza campos ajenos/PII, query/hash y payloads inválidos. Con consentimiento sólo se configura Matomo con cookies deshabilitadas, DNT, tracker diferido y un único script; sin proveedor/configuración/consentimiento es un no-op que no arroja errores ni encola/envía. `AnalyticsConsent.astro` ofrece aceptar, rechazar, reabrir y retirar consentimiento cuando el alta futura active analytics; el layout lo integra sin instrumentar vistas ni CTAs. Tests de configuración, consentimiento, payload y red simulada cubren modos off/sin consent/on (carga única diferida). `npm run lint`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (31 archivos, 212 tests) y `npm run build` (25 páginas): PASS. Inspección de HTML y servidor local de preview: 9 recursos, 0 scripts y 0 recursos/marcas de analytics con `enabled: false`; transferencia inicial añadida: 0 KiB. `npm run format` sólo mantiene cuatro avisos preexistentes fuera de alcance (`media-projection.ts`, `FeaturedProducts.astro`, `regalos/[slug].astro`, `taxonomy-listing.test.ts`). `git diff --check`: PASS. Siguiente tarea: M7.3 (modelo LUNA).

## M7.3 — Instrumentación de vistas y selección

**Estado:** DONE
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
**Evidencia:** PASS (2026-08-17) — `src/lib/analytics/product.ts` proyecta únicamente identidad pública, primera categoría, `source_page`, precio opcional en unidades mayores/moneda y contexto `list_id`/`position`; no incluye teléfono, mensaje, URL de WhatsApp ni datos de usuario. `ProductCard.astro` emite una única marca declarativa `select_item` en el enlace real, y `ProductDetail.astro` una única marca `view_item` por ficha. Las proyecciones de home destacados, índice de productos, landings taxonómicas y relacionados asignan list IDs estables (`home-featured`, `products-all`, `{kind}-{slug}`, `product-related`) y posiciones 1-based; drafts nunca llegan a estas proyecciones. `AnalyticsInstrumentation.astro` sólo se incluye con `analytics.enabled`; su listener compartido captura vistas una vez al cargar el documento y selecciones por activación `click`, delegando sanitización/carga al adapter único de M7.2. Sin consentimiento o si el tracker falla, no intercepta ni bloquea los enlaces. Tests nuevos cubren payload de precio/lista, marcas declarativas y ausencia de Matomo en componentes; suite: PASS (32 archivos, 214 tests). `npm run lint`, `npm run typecheck` (0 errores/warnings/hints), `npm test`, `npm run build` (25 páginas) y `git diff --check`: PASS. Inspección del artifact con `analytics.enabled: false`: 8 fichas contienen marca de vista, listados/landings contienen marcas de selección, no se incluye el módulo cliente de analytics ni recursos Matomo; los únicos `<script>` son JSON-LD existentes. `npm run format` deja únicamente avisos preexistentes fuera de alcance en `media-projection.ts`, `FeaturedProducts.astro`, `regalos/[slug].astro` y `taxonomy-listing.test.ts`. Siguiente tarea: M7.4 (modelo LUNA → SOL REVIEW).

## M7.4 — Instrumentación de WhatsApp

**Estado:** DONE
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
**Evidencia:** PASS (2026-08-17) — `ActionLink.astro` y `SiteFooter.astro` exponen marcas declarativas para `whatsapp_click` y `custom_whatsapp_click` sin incluir teléfono, mensaje, URL de WhatsApp ni datos de usuario. `ProductConversionPanel.astro` envía únicamente el payload público de producto de M7.3 más `cta_location: product-detail`; Hero, CTA de idea personalizada y Footer global envían sólo `cta_location` y `source_page` canónico. `src/lib/analytics/instrumentation.ts` captura activaciones `click` de puntero y teclado mediante delegación, usa el adapter único y no llama `preventDefault`, por lo que los enlaces nativos navegan aun sin consentimiento, proveedor o ante fallo del tracker; `trackSafely` absorbe excepciones del adapter. Tests cubren las marcas de los CTAs, payloads permitidos, ausencia de campos prohibidos y fallo del adapter: PASS (32 archivos, 215 tests). `npm run lint`, `npm run typecheck` (0 errores/warnings/hints), `npm test`, `npm run build` (25 páginas) y `git diff --check`: PASS. `npm run format` conserva cuatro avisos de formato preexistentes fuera de alcance (`media-projection.ts`, `FeaturedProducts.astro`, `regalos/[slug].astro`, `taxonomy-listing.test.ts`). Inspección del artifact confirma los CTAs WhatsApp declarados y ningún atributo `data-analytics` de teléfono/mensaje/URL; no se hizo envío real ni se guardó tráfico o conversación. Siguiente tarea: M7.5 (modelo LUNA → SOL REVIEW).

## M7.5 — QA de medición y runbook

**Estado:** DONE
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
**Evidencia:** PASS (2026-08-17) — `docs/conversion/analytics-runbook.md` registra owner, estado productivo desactivado, matriz de los cuatro eventos contra home/listados/taxonomías/fichas/relacionados/404, payload permitido, duplicación esperada, modos off/sin consentimiento/rechazo/aceptación/retirada, storage bloqueado, fallo del tracker, exclusión interna, alertas básicas y procedimiento postrelease. La sesión de debug controlada usa endpoint/site ID ficticios y captura de red completamente redactada: con analytics apagado o sin consentimiento no hay script, request ni cola; con consentimiento se valida una única carga diferida, privacidad Matomo y evento sanitizado; campos prohibidos, query/hash y PII son rechazados; el fallo del adapter no interrumpe el href nativo. La recepción productiva queda honestamente condicionada a instancia EEE, política/acuerdo y aprobación M9.4. `tests/analytics-runbook.test.ts` protege la matriz, rutas, modos de consentimiento, config `enabled: false` y ausencia de PII; `npm run lint`, `npm run format`, `npm run typecheck`, `npm test`, `npm run build` y `git diff --check`: PASS. No se contactó proveedor, no se registró tráfico real ni se versionaron endpoint, credenciales, site ID productivo, IPs o conversaciones. Siguiente tarea: M8.1 (modelo LUNA → SOL REVIEW).

---

# M8 — Quality + Performance + Accessibility

**Estado:** PENDING  
**Gate:** G8.

## M8.1 — Auditoría y corrección de accesibilidad

**Estado:** DONE
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
**Evidencia:** PASS (2026-08-17) — La auditoría detectó y corrigió en `src/styles/global.css` la pérdida de foco visible del destino del skip link: `main:focus` pasó a `main:focus-visible` con token y offset de foco. Se añadió `scripts/verify-accessibility.mjs` como auditor estático del artefacto y `npm run verify:accessibility`: 25 HTML inspeccionados, exactamente un `h1` por página, landmarks globales, enlaces/botones con nombre, imágenes con `alt` y cero IDs duplicados. `tests/accessibility.test.ts` protege el foco y el shell semántico. La revisión reproducible de teclado/zoom/reflow/lector/reduced-motion queda documentada en `docs/quality/accessibility-audit.md`; el lector de pantalla y la matriz de navegadores se reservan a M8.3 sin inventar ejecución. `npm run lint`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (34 archivos, 220 tests), `npm run build` (25 páginas), `npm run verify:accessibility`, Prettier específico y `git diff --check`: PASS. `npm run format` mantiene únicamente avisos preexistentes fuera de alcance en `src/components/catalog/media-projection.ts`, `src/components/home/FeaturedProducts.astro`, `src/pages/regalos/[slug].astro` y `tests/taxonomy-listing.test.ts`. Siguiente tarea: M8.2 (modelo SOL → LUNA).`

## M8.2 — Pipeline de imágenes y presupuestos de rendimiento

**Estado:** DONE
**Objetivo:** asegurar fotos protagonistas sin degradar CWV ni salud de Git.  
**Alcance:** AVIF/WebP/fallback, srcset/sizes, lazy/eager correcto, dimensiones, límites de ingestión/repo, fonts y budgets de JS/CSS/imágenes/LCP/CLS; medir cualquier reveal, micro-parallax u ornamento implementado.

**Fuera de alcance:** retocar creativamente originales o CDN runtime sin necesidad.  
**Dependencias:** M8.1 y muestras finales de medios.  
**Archivos/áreas previstas:** media components/config, asset checks, docs y CI.  
**Contratos afectados:** Media, performance, repository health.  
**Criterios de aceptación:** todas las imágenes de rutas muestra cumplen política; LCP priorizado; no originales gigantes; fuentes no causan CLS; motion secundario no entra en ruta crítica; budgets automatizados estables.

**Verificación:** build stats, request/format audit, Lighthouse repetido y asset checker.  
**Modelo recomendado:** SOL → LUNA.  
**Razón del modelo:** Sol calibra budgets; Luna implementa optimización/checks.  
**Evidencia:** PASS (2026-08-17) — Todas las rutas que muestran catálogo usan ahora `picture` con AVIF/WebP y `srcset` JPEG de fallback; conservan `sizes`, dimensiones intrínsecas y lazy loading, excepto el único candidato LCP eager/high-priority de Home o ficha. Se añadieron `npm run verify:assets` (31 fuentes, 30.359.026 bytes; hard limits de 8 MiB raster, 250 KiB SVG y 100 MiB de repositorio) y `npm run verify:performance`, que audita el artefacto: 25 HTML, 109 `picture` responsivos, formatos/fallback, dimensiones, prioridad, gzip HTML/CSS/JS, variantes a 375 px y transferencia inicial máxima de 84.022 bytes frente a 1,5 MiB. Ambos se ejecutan en CI y Pages; los contratos viven en `docs/quality/performance-audit.md` y `tests/performance-budget.test.ts`. La preview a 375 × 812 confirmó Home y ficha sin overflow, un LCP priorizado y fuentes modernas/dimensionadas. No hay fuente web ni JS de cliente habilitado; la ornamentación sigue secundaria en SVG/CSS. Lighthouse no está instalado en este entorno, por lo que no se inventa puntuación: el gate estático reproducible y la comprobación de preview pasan, y las tres corridas Lighthouse móvil quedan registradas para M8.3 junto a la matriz de navegadores. `npm run lint`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (35 archivos, 222 tests), `npm run build` (25 páginas), `npm run verify:assets`, `npm run verify:performance` y `git diff --check`: PASS. `npm run format` mantiene únicamente avisos preexistentes fuera de alcance en `src/pages/regalos/[slug].astro` y `tests/taxonomy-listing.test.ts`. Siguiente tarea: M8.3 (modelo LUNA).`

## M8.3 — Responsive y compatibilidad de navegadores

**Estado:** DONE
**Objetivo:** validar experiencia real en matriz soportada.  
**Alcance:** 320/375/768/1024/1440+, orientación, touch/pointer, navegadores acordados, no-JS, reduced-motion y correcciones directas; validar composición móvil propia, no sólo compresión del desktop.

**Fuera de alcance:** navegadores fuera de política o nuevas features.  
**Dependencias:** M8.2.  
**Archivos/áreas previstas:** styles/components/pages y visual/browser tests.  
**Contratos afectados:** responsive, compatibility, conversion.  
**Criterios de aceptación:** sin overflow/solapamiento; CTAs alcanzables; media/copy/firma de Footer legibles; ornamentación y parallax se reducen cuando procede; recorrido completo en matriz prioritaria.

**Verificación:** matriz documentada con capturas/smoke y suite.  
**Modelo recomendado:** LUNA.  
**Razón del modelo:** comprobación y corrección localizada.  
**Evidencia:** PASS (2026-08-17) — Se corrigio en `src/components/home/hero.css` el overflow movil detectado en la captura de Chrome: el enfasis del H1 reduce escala en movil, los tracks y copy aceptan `min-width: 0`/wrapping y los CTA permanecen apilados hasta 48 rem; desktop conserva la composicion editorial. `scripts/verify-responsive.mjs` y `npm run verify:responsive` auditan 25 HTML del artefacto, viewport/zoom, `main`, JSON-LD permitido sin JavaScript cliente, enlaces no vacios, dimensiones/alt de imagenes y CSS de reduced-motion, min-width, medios y targets tactiles. Capturas Home 320/768/1440 quedan en `docs/quality/evidence/m8-3-responsive/`; inspeccion manual del preview de produccion confirma sin overflow/solapamiento, CTAs legibles, fotografia/copy/Footer/firma estables, navegacion nativa sin JS y reduced-motion estatico. Chrome estable 139.0.7258.67 y Edge estable 140.0.3485.54: PASS en la matriz documentada; Firefox/Safari/iOS Safari/Chrome Android no estan disponibles y quedan explicitos como no ejecutados, sin inventar resultados. `npm run lint`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (36 archivos, 224 tests), `npm run build` (25 paginas), `npm run verify:responsive`, `npm run verify:accessibility`, `npm run verify:performance`, `npm run verify:assets`, Prettier especifico y `git diff --check`: PASS. `npm run format` conserva unicamente avisos preexistentes fuera de alcance en `src/pages/regalos/[slug].astro` y `tests/taxonomy-listing.test.ts`. Siguiente tarea: M8.4 (modelo LUNA -> SOL REVIEW).`

## M8.4 — Hardening de tests y artefacto

**Estado:** DONE
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
**Evidencia:** PASS (2026-08-17) — Se añadieron `verify:artifact`, `verify:determinism` y `verify:mutation`. El gate del artefacto inspecciona las 25 páginas HTML, exige doctype/main/único H1, rechaza placeholders, scripts externos, atributos vacíos y enlaces internos rotos, y ejecuta el smoke estático Home → `/productos/` → 8 fichas → CTA WhatsApp; también exige `sitemap.xml` y `robots.txt`. La mutación controlada de un CTA crítico a `href=""` fue rechazada por el gate y el directorio temporal se eliminó. Dos builds consecutivos fueron byte a byte idénticos en 486 archivos. CI y Pages ejecutan el gate del artefacto; CI añade determinismo y mutación, sin dependencias browser nuevas ni snapshots frágiles. `npm run lint`, `npm run typecheck` (0 errores/warnings/hints), `npm test` repetido (36 archivos, 224 tests PASS en ambas ejecuciones), `npm run build`, `npm run verify:seo`, `npm run verify:crawl`, `npm run verify:links`, `npm run verify:structured-data`, `npm run verify:catalog`, `npm run verify:accessibility`, `npm run verify:assets`, `npm run verify:performance`, `npm run verify:responsive`, `npm run verify:artifact`, `npm run verify:determinism`, `npm run verify:mutation` y `git diff --check`: PASS. `npm run format` conserva únicamente los avisos preexistentes fuera de alcance en `src/pages/regalos/[slug].astro` y `tests/taxonomy-listing.test.ts`. Siguiente tarea: M8.5 (modelo SOL).`

## M8.5 — Seguridad, dependencias y superficie pública

**Estado:** DONE
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
**Evidencia:** PASS (2026-08-17) — Se añadieron `verify:security` y `verify:dependencies`: el gate offline revisa 330 archivos versionados, 76 revisiones Git, 2 workflows y 486 archivos del artefacto sin imprimir valores; exige `.gitignore`, actions fijadas a SHA, permisos mínimos, checkout sin credenciales persistentes, ausencia de secretos/source maps/campos editoriales, orígenes externos HTTPS aprobados, `noopener` y JSON-LD válido. CI/deploy descargan historial completo e integran los gates; el layout limita referrer con `strict-origin-when-cross-origin`. El lock contiene 539 paquetes con versiones directas exactas y licencias evaluadas. `npm audit` reporta 0 critical y cinco causas conocidas agrupadas en 2 high/1 low: quedan documentadas como no explotables en la superficie estática (Sharp sólo procesa medios versionados durante build; sin SSR/uploads; sin View Transitions/islands; dev server no publicado), con fallo ante cualquier advisory nuevo o excepción obsoleta; no se forzó Astro 7 ni overrides fuera de rango. GitHub Pages no permite headers HTTP arbitrarios: CSP/HSTS/headers reales quedan para edge/M9.3, sin simular soporte. `npm ci` limpio, lint, typecheck (0 errores/warnings/hints), 37 archivos/228 tests, build de 25 páginas, gates SEO/crawl/links/structured-data/catalog/a11y/assets/performance/responsive/artifact/security/dependencies/determinism/mutation y `git diff --check`: PASS. `npm run format` conserva sólo los dos avisos preexistentes fuera de alcance en `src/pages/regalos/[slug].astro` y `tests/taxonomy-listing.test.ts`. Siguiente tarea: M8.6 (modelo SOL).

## M8.6 — Gate de release candidate

**Estado:** DONE
**Objetivo:** producir un candidato inmutable y decidir go/no-go técnico y visual.

**Alcance:** ejecutar todos los gates, Lighthouse, a11y, SEO, smoke, sizes, contenido provisional, gate visual final y lista de blockers/known issues.

**Fuera de alcance:** producción, DNS o aceptar silenciosamente fallos.  
**Dependencias:** M8.5.  
**Archivos/áreas previstas:** `docs/quality/release-candidate.md`, tag/artifact policy y fixes directos.  
**Contratos afectados:** G8 y todos los contratos V1.  
**Criterios de aceptación:** checks críticos PASS; no fixture/TBD publicable; artifact identificable; known issues aceptados con owner; rollback posible. El gate visual confirma coherencia extremo a extremo, carácter no genérico, jerarquía y ritmo, fotografía protagonista, tokens consistentes, ornamentación moderada, motion/reduced-motion, hover/foco, contraste, ausencia de overflow y de CLS por animaciones/fuentes, y budgets. La firma definida en M4.11 está presente, completa, legible, accesible y secundaria frente a las acciones principales del Footer.

**Verificación:** `npm ci`, lint, typecheck, test, build, audits y checksum/commit del artefacto; revisión visual manual obligatoria con capturas a 1440, 768 y 320 px y checklist de `docs/design/visual-direction.md`. El gate no puede aprobarse sólo con checks automatizados.

**Modelo recomendado:** SOL.  
**Razón del modelo:** decisión de release requiere auditoría integral.  
**Evidencia:** PASS (2026-08-17) — `m8.6-rc.1` obtiene GO técnico y visual; `docs/quality/release-candidate.md` registra decisión, rollback, owners, known issues y las capturas manuales de Home/producto/navegación/Footer a 1440/768/320 px contra la dirección visual. La inspección en navegador detectó y corrigió un blocker real: una miga larga provocaba overflow y truncado a 320 px; ahora envuelve y tiene regresión contractual. Tres corridas Lighthouse 13.4.1 coinciden en 100 performance, 100 accesibilidad, 96 best practices y 100 SEO, LCP 1,13 s, CLS 0 y TBT 0 ms; el único descuento es `/favicon.ico` pendiente del master aprobado, aceptado como RC-1 con owner marca/Luna y salida M9.1, pero bloqueante antes de producción. El artefacto determinista contiene 486 archivos/39.782.637 bytes y queda identificado por `m8.6-rc.1` + SHA-256 raíz `35123a975fcc24b669b33deff65d3d76ae19316e246ffb06b475421ed6c9bbaa`; `release:manifest` permite reproducirlo sin timestamps. `npm ci`, lint, typecheck (0 errores/warnings/hints), 38 archivos/230 tests, build de 25 páginas, gates SEO/crawl/links/structured-data/catalog/a11y/assets/performance/responsive/artifact/security/dependencies/determinism/mutation y `git diff --check`: PASS. No hay `TBD`/`FIXTURE`/`draft` publicable ni blocker crítico desconocido. G9 de candidato satisfecho; producción, DNS, edge y sustitución final de contenido permanecen en M9. Siguiente tarea: M9.1 (modelo LUNA → SOL REVIEW).

---

# M8.9 — Visual alignment & Luna brand system

**Estado:** PENDING
**Gate:** alineación visual desktop previa a reanudar M9.
**Objetivo:** alinear la Home con la referencia desktop aprobada y convertir su
lenguaje gráfico en un sistema Luna reutilizable, accesible y eficiente.
**Referencia contractual:**
`docs/design/reference/luna-home-art-direction-reference.png`.
**Viewport contractual:** 1440 px; comprobaciones complementarias a 1280 y
1920 px.
**Regla responsive de fase:** no definir todavía el diseño móvil definitivo;
preservar navegación, lectura, CTA y ausencia de overflow mediante un fallback
funcional.
**Condición de salida:** M9 sólo puede reanudarse cuando M8.9.11 registre
`VISUAL QA: PASS` y `OWNER APPROVAL: APPROVED`.

## M8.9.1 — Design system: colores, tipografías y tokens

**Estado:** DONE
**Objetivo:** auditar y normalizar los cimientos visuales que sostendrán la
alineación sin rediseñar todavía las secciones de la Home.
**Alcance:** inventario de estilos, fuentes, componentes y duplicación;
paleta Luna centralizada y roles semánticos; tres voces tipográficas; escalas
de espacio, radio, borde, sombra, anchura, ritmo de sección, botones, cards,
decoración, z-index y breakpoints; documentación de consumo y contraste.
**Fuera de alcance:** rediseñar Header, Hero, secciones, Footer o mobile;
introducir fuentes remotas o assets de decoración; cambiar contenido, catálogo,
routing, SEO, analytics o WhatsApp.
**Dependencias:** M8.6, referencia contractual disponible y baseline editorial
aprobado de M9.1.
**Archivos/áreas previstas:** `src/styles/tokens.css`, foundations/primitives,
`docs/design/` y tests de contratos visuales.
**Contratos afectados:** design system, UI, accesibilidad, responsive y
performance.
**Criterios de aceptación:** una única fuente de verdad; colores de componentes
sin hex oportunistas; roles tipográficos display/body/script; botones coherentes
y foco visible; contraste AA en texto/acciones; todas las dimensiones mínimas
solicitadas expresadas como tokens; sin regresión funcional ni de build.
**Verificación:** auditoría de hardcodes y fuentes, contraste, lint, typecheck,
tests, build, checks de artefacto/a11y/performance y diff check.
**Modelo recomendado:** SOL → LUNA.
**Evidencia:** PASS (2026-08-17) — Se repitió la auditoría tras la sustitución
de la referencia desktop: el contrato vigente queda identificado como PNG
1024 × 1536, 2.098.629 bytes y SHA-256 `989DE73…C1BE`; la referencia anterior
queda explícitamente obsoleta. La captura móvil nueva (853 × 1844, SHA-256
`BDACE245…516`) se versiona como input de M8.10 sin ejecutarla ni copiar sus
funciones ficticias. `docs/design/luna-brand-system.md` registra arquitectura,
inventario, fuentes, assets y la discrepancia entre el logo oficial existente y
el lockup de la maqueta. `tokens.css` centraliza 15 colores fuente Luna y los
mapea a roles semánticos; el coral de acción se ajusta a `#C4475F` para alcanzar
4.55:1 sobre crema, mientras tinta principal/secundaria alcanzan 13.50:1 y
8.17:1. Se definen display/body/script, escalas de espacio/radio/borde/sombra,
containers, secciones, botones de 48 px, cards, decoración, z-index y breakpoints.
Button/ActionLink consumen dimensiones y bordes comunes; se eliminan los dos
RGB de marca locales encontrados en taxonomías/productos. No se rediseñó ninguna
sección ni se cambió catálogo, SEO, rutas, WhatsApp, analytics o dominio.
`npm run lint`, `npm run typecheck` (0 errores/warnings/hints), `npm test`
(39 archivos, 237 tests), `npm run build` (25 páginas),
`npm run verify:links` (0 rotos/huérfanos), `verify:accessibility`,
`verify:performance` (85.912 bytes máximo inicial a 375 px),
`verify:security` y `git diff --check`: PASS. Smoke local a 1440 px: documento
1425/1425 px sin overflow, CTA 48 px, fondo/tinta correctos y 0 scripts cliente.
`npm run format` conserva sólo los dos avisos preexistentes fuera de alcance en
`src/pages/regalos/[slug].astro` y `tests/taxonomy-listing.test.ts`. La fidelidad
visual completa y aprobación siguen PENDING hasta M8.9.11.

## M8.9.2 — Fondo global, nubes, acuarelas y sistema decorativo

**Estado:** DONE
**Objetivo:** crear primitivas Luna reutilizables para fondo continuo, corazones,
destellos, líneas orgánicas, nubes y acuarelas sin duplicación ni contenido
semántico falso.
**Dependencias:** M8.9.1.
**Criterios de aceptación:** SVG/CSS accesibles, `aria-hidden`, sin pointer
events/CLS/JS decorativo; texturas raster sólo si aportan acuarela real y bajo
budget; inventario de assets y blockers explícito.
**Verificación:** suite/build, a11y, assets, performance y revisión 1280/1440/1920.
**Modelo recomendado:** LUNA → SOL REVIEW.
**Evidencia:** PASS (2026-08-17) — `Ornament.astro` evoluciona el primitive
existente con corazón, corazón-trazo, sparkle de cuatro puntas, corazones
pequeños, curva punteada, nube y acuarela vectorial, además de tonos semánticos;
preserva `thread`, `underline` y `dots` sin crear una segunda librería.
`DecorativeBackdrop` integra un lienzo global continuo con cinco SVG inline y
gradientes CSS, fijo y contenido desde el primer paint: `aria-hidden`,
`focusable=false`, `pointer-events:none`, sin CLS, requests, raster, dependencia
o JavaScript decorativo. `luna-decorative-system.md` registra inventario,
budget y blockers: la mascota aislada permanece `BLOCKED` porque sólo existe
dentro del logo oficial y no se recorta/redibuja sin master aprobado; las
tipografías de marca siguen bloqueadas. `npm run lint`, `npm run typecheck` (0
errores/warnings/hints), `npm test` (39 archivos, 238 tests), `npm run build`
(25 páginas), `verify:accessibility` (25 HTML), `verify:assets` (31 archivos,
30.359.026 bytes), `verify:performance` (91.419 bytes máximo inicial a 375 px),
`verify:responsive`, `verify:links`, `verify:security` y `git diff --check`:
PASS. Revisión local 1280/1440/1920: scrollWidth=clientWidth en los tres,
backdrop fijo/continuo, cinco ornamentos globales, sin solape de contenido o
acciones. `npm run format` conserva sólo los dos avisos preexistentes fuera de
alcance en `src/pages/regalos/[slug].astro` y
`tests/taxonomy-listing.test.ts`. La aprobación visual final permanece en
M8.9.11. Siguiente tarea: M8.9.3 (modelo LUNA → SOL REVIEW).

## M8.9.3 — Header y navegación

**Estado:** DONE
**Objetivo:** alinear logo, navegación y separador inferior de trazo-corazón con
la referencia, preservando únicamente destinos y funcionalidades reales.
**Dependencias:** M8.9.2.
**Criterios de aceptación:** logo oficial, active nav coral, proporción desktop,
SVG responsive orgánico, navegación/teclado/foco intactos y fallback móvil
funcional; cero icono o función ficticia.
**Verificación:** suite/build, teclado, enlaces y QA 1280/1440/1920.
**Modelo recomendado:** LUNA → SOL REVIEW.
**Evidencia:** PASS (2026-08-17) — El Header usa el PNG oficial mediante
`astro:assets`, dimensionado y optimizado sin recorte ni marca derivada; el
enlace conserva nombre accesible y las imágenes generadas pesan 8/21 KiB. La
navegación central incorpora únicamente cinco destinos existentes (Inicio,
Productos, Categorías, Ocasiones y Para regalar), marca la ruta actual en coral
y preserva descendientes. Un SVG fluido con trazo orgánico y el primitive de
corazón forman el separador, ambos `aria-hidden`/sin eventos; no se añadieron
iconos o funciones ficticias ni JavaScript de Header. El fallback móvil mantiene
`details`/`summary`, panel opaco sobre la decoración, objetivo de 44 px, foco
visible y los cinco enlaces nativos. `npm run lint`, `npm run typecheck` (0
errores/warnings/hints), `npm test` (39 archivos, 239 tests), `npm run build`
(25 páginas), `verify:links` (0 rotos/huérfanos), `verify:accessibility` (25
HTML), `verify:responsive`, `verify:assets` (31 archivos, 30.359.026 bytes),
`verify:performance` (93.235 bytes máximo inicial a 375 px),
`verify:security`, Prettier de archivos tocados y `git diff --check`: PASS. QA
local 1280/1440/1920: logo 179–184 × 119–122 px, navegación desktop visible,
Inicio activo y `scrollWidth=clientWidth`; a 320/375 el menú abre sobre el
contenido sin overflow, mantiene enlaces reales y foco visible. Navegación real
a `/categorias/`: PASS; 0 errores/warnings de navegador. Siguiente tarea:
M8.9.4 (modelo LUNA → SOL REVIEW).

## M8.9.4 — Hero

**Estado:** DONE
**Objetivo:** reproducir la composición unitaria de la referencia con el H1,
frase manuscrita, fotografía y destinos reales aprobados.
**Dependencias:** M8.9.3.
**Criterios de aceptación:** “Hecho para alguien.” y “No para cualquiera.”
preservados; CTAs y WhatsApp reales; fotografía autorizada protagonista;
ornamentación controlada; LCP/dimensiones/contraste estables.
**Verificación:** suite/build, HTML, performance, a11y y QA 1280/1440/1920.
**Modelo recomendado:** LUNA → SOL REVIEW.
**Evidencia:** PASS (2026-08-17) — El Hero recompone la referencia como una
escena unitaria: H1 editorial en dos líneas, “No para cualquiera.” en la voz
script aprobada y una sola línea desktop, fotografía autorizada a sangre en la
mitad derecha, copy y ambos CTA reales en la mitad izquierda. El CTA principal
mantiene `/productos/` y usa el icono de flecha existente; el secundario conserva
el `wa.me` aprobado, su mensaje codificado y la instrumentación sin PII. Tres
ornamentos reutilizables y el cierre ondulado con corazón son decorativos,
ignorados por AT, sin eventos ni JavaScript. El ajuste visual solicitado extiende
la fotografía por detrás de la transición y la recorta con un lienzo SVG que
reproduce exactamente la curva: no queda ningún borde rectangular bajo el lazo.
El segundo ajuste prolonga además la fotografía 28 px tras el separador superior:
la cabecera de home rellena sólo el área situada sobre su misma curva SVG y deja
ver la media por debajo, eliminando también el corte recto de arriba. Debajo a la
derecha aparece una nube azul original generada como acuarela transparente de
1774 × 887 px, con silueta de nube, capas blancas/azules y bordes pictóricos; usa
la referencia únicamente como dirección de estilo, no reproduce ni publica su
marca de agua. Astro la sirve lazy y dimensionada como WebP responsive de 24/68
KB, sin requests externos. La fotografía conserva alt, dimensiones intrínsecas
1672 × 941, AVIF/WebP/JPEG responsive, `sizes` ajustado a la mitad visual,
`loading="eager"` y `fetchpriority="high"`. QA real 1280/1440/1920: Hero
608/661,59/672 px, media 596/649,59/660 px al 50 %, ambas ondas visibles, nube de
537,59/576/576 px, `scrollWidth=clientWidth`, CTA de 48 px, foco visible y fotos
cargadas; el fallback 320 oculta recortes/nube, conserva orden propio, CTAs
apilados y cero overflow.
Artifact: 1 H1, 0 scripts ejecutables cliente, ambos href y consola sin errores.
`npm run lint`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (39
archivos, 239 tests), `npm run build` (25 páginas), `verify:accessibility` (25
HTML), `verify:performance` (98.760 bytes máximo inicial a 375 px),
`verify:responsive`, `verify:assets` (32 archivos, 31.740.577 bytes),
`verify:links`, Prettier de archivos tocados y `git diff --check`: PASS. La
aprobación visual final permanece en M8.9.11. Siguiente tarea: M8.9.5 (modelo
SOL → LUNA).

## M8.9.5 — Encuentra el regalo perfecto

**Estado:** DONE
**Objetivo:** sustituir el descubrimiento actual por exactamente tres cards
desktop: 01 Por tipo, 02 Por ocasión y 03 Para quién, con un producto real por
dimensión.
**Dependencias:** M8.9.4.
**Regla de selección:** sólo publicados de la dimensión; destacado primero;
si hay varios, el primero por orden editorial estable; sin destacado, primer
publicado por ese orden; nunca random, filesystem accidental, duplicación de
relleno ni contrato nuevo silencioso.
**Criterios de aceptación:** lógica pura y testeada para múltiples destacados,
fallback, exclusión de unpublished y orden estable; tres cards forman una sola
composición y mantienen rutas reales.
**Verificación:** tests de dominio/proyección, build, links, a11y, performance y
QA 1280/1440/1920.
**Modelo recomendado:** SOL → LUNA.
**Evidencia:** AJUSTE VISUAL Y VALIDACIÓN AUTOMATIZADA: PASS (2026-08-18) —
`taxonomy-discovery.ts` conserva la selección determinista de tres productos
publicados, destacados y distintos, y deriva las descripciones de las
taxonomías publicadas. `TaxonomyDiscovery.astro` recompone la cabecera editorial
centrada con subtítulo y corazón SVG Luna, y las tres cards 01/02/03 conservan
fotografías responsive y rutas de índice reales. En la segunda iteración, CSS
mantiene el ancho visual máximo de 90 rem, el grid desktop de tres columnas y
el ratio 3:2, pero deja de usar la fotografía como fondo completo: la desplaza
a una franja derecha del 58 %, conserva un plano pastel independiente para el
contenido y limita el degradado de unión al tramo central. La tarta usa `cover`
lateral y la lámina/libreta `contain` lateral para evitar recortes; el subtítulo
centrado tiene un máximo de 50 rem. El artefacto contiene el subtítulo, tres
descripciones y tres cards. En la tercera iteración, las tres cards comparten
variables de ancho del 50 % para texto y media, una única capa de degradado
sobre la media y `object-fit: cover`; sólo varían el tono y, cuando hace falta,
`object-position`, eliminando el corte de la card de destinatario. La cuarta
iteración adelanta de forma uniforme el final transparente del degradado para
dejar una mayor porción limpia de las tres fotografías. `npm run
lint`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (39 archivos,
241 tests), `npm run build`
(25 páginas), `verify:links`, `verify:accessibility` (25 HTML),
`verify:performance` (87.789 bytes máximo inicial a 375 px),
`verify:responsive`, `verify:assets` (32 archivos, 31.740.577 bytes) y
`git diff --check`: PASS. El fallback móvil anula el ratio en `320 px` para
mantener las cards dentro del viewport. QA real con Chrome sobre preview HTTP:
`1280/1440/1920` mantiene tres columnas sin overflow; `320` mantiene una
columna, tres cards dentro del viewport y sin overflow. Se verificaron H1 único,
tres href reales, dimensiones de cards y consola sin errores; captura de
inspección a `1440 px` revisada. Siguiente tarea: M8.9.6 (modelo LUNA → SOL
REVIEW).

## M8.9.6 — Cada detalle cuenta

**Estado:** DONE
**Objetivo:** alinear la secuencia ligera y conectada de los tres pasos aprobados
sin convertirla en cards convencionales.
**Dependencias:** M8.9.5.
**Criterios de aceptación:** exactamente los tres pasos y orden existentes;
iconos circulares, numeración editorial, línea orgánica/punteada y ornamentos
consistentes; DOM y lectura accesibles.
**Verificación:** contenido, suite/build, a11y y QA 1280/1440/1920.
**Modelo recomendado:** LUNA → SOL REVIEW.
**Evidencia:** PASS (2026-08-18) — La secuencia conserva exactamente los tres
pasos aprobados y su `ol` semántico; usa `01-chat.png`, `02-manos.png` y
`03-corazon.png` sin recorte, numeración editorial `01`–`03` con subrayado,
curva SVG punteada con gradiente rosa/azul/salmón y sólo tres ornamentos Luna,
todos ocultos a tecnologías asistivas. Desktop usa una retícula máxima de 80rem
con texto editorial alineado al número; mobile apila cada ilustración y bloque
sin línea horizontal. `tests/trust-and-work.test.ts` protege contenido, orden,
semántica, assets, línea y ausencia de hidratación. `npm run lint`,
`npm run typecheck` (0 errores/warnings/hints), `npm test` (39 archivos, 243
tests), `npm run build` (25 páginas), `verify:accessibility`,
`verify:performance` (108.911 bytes máximo inicial a 375 px),
`verify:responsive`, `verify:assets` (41 archivos, 46.581.759 bytes), Prettier
específico y `git diff --check`: PASS. Las comprobaciones estáticas de 1280,
1440 y 1920 conservan contenedor, tres columnas desktop y ausencia de overflow;
no se encontró Chrome local para captura visual automatizada. Siguiente tarea:
M8.9.7 (modelo LUNA → SOL REVIEW).

## M8.9.7 — Trabajos realizados por Luna

**Estado:** DONE
**Objetivo:** convertir la muestra aprobada en un portfolio/mosaico editorial
equivalente a la referencia.
**Dependencias:** M8.9.6.
**Criterios de aceptación:** sólo fotografías autorizadas; prioridad published +
featured y orden editorial estable; pieza principal y secundarios con ratios
variados; sin carousel, grid ecommerce ni nombre/precio añadido.
**Verificación:** derechos/alt, suite/build, assets, performance y QA
1280/1440/1920.
**Modelo recomendado:** LUNA → SOL REVIEW.
**Evidencia:** PASS (2026-08-18) — la muestra de
“Ideas para regalar” sustituye las cards por una pieza editorial estática: copy
aprobado, CTA a `/productos/`, fondo blush orgánico, luna de marca reutilizada,
ornamentos decorativos ocultos a AT y galería `1 + 2×2`. La luna se sustituye
por el asset aportado `src/assets/home/luna-nube.png`, sin máscara ni opacidad,
y se acompaña de cuatro destellos rosa, melocotón y azul. La selección pura
elige cinco productos publicados, prioriza los cuatro destacados, cubre las
cuatro categorías destacadas y rellena el quinto hueco con un producto
publicado real cuando el catálogo no dispone de cinco destacados; el RNG
inyectable permite pruebas deterministas sin hydration ni cambios de layout.
Cada fotografía conserva el alt de catálogo y enlaza con semántica nativa a su
ficha. Tests cubren copy, CTA, cinco enlaces, publicados, prioridad featured y
variedad de categorías. `npm run lint`, `npm run typecheck` (0 errores,
warnings/hints), `npm test` (39 archivos, 241 tests), `npm run build` (25
páginas), `verify:links`, `verify:accessibility`, `verify:performance`
(100.033 bytes máximo inicial a 375 px), `verify:responsive`, `verify:assets`
(33 archivos, 32.853.114 bytes),
`verify:determinism`, Prettier específico y `git diff --check`: PASS. El QA
visual se completó con Chrome headless estable 139.0.7258.67 sobre `astro
preview`: capturas reproducibles de Home y del portfolio a 1280/1440/1920
confirmaron pieza principal dominante, secundarios con ratios variados,
composición editorial sin carousel/grid ecommerce, sin solapes ni overflow
visible. Los cuatro assets conservan derechos/alt y dimensiones fuente; el
portfolio no añade nombre/precio. `VISUAL QA: PASS` para esta submilestone.
La aprobación visual global del propietario sigue reservada a M8.9.11.
Siguiente tarea: M8.9.9 (modelo LUNA → SOL REVIEW).

## M8.9.8 — ¿Tienes algo en mente?

**Estado:** DONE
**Objetivo:** alinear la banda editorial de cierre con fondo blush/acuarela,
fotografía autorizada, decoración Luna y WhatsApp real.
**Dependencias:** M8.9.7.
**Criterios de aceptación:** titular/copy/CTA aprobados; composición texto +
fotografía equivalente a referencia; no card genérica; href y tracking intactos.
**Verificación:** suite/build, WhatsApp, analytics, a11y, performance y QA
1280/1440/1920.
**Modelo recomendado:** LUNA → SOL REVIEW.
**Evidencia:** Implementación técnica completada el 2026-08-18: la sección
deja de usar `ContentSection`/card genérica y pasa a ser una banda editorial
con el fondo blush aportado, las nubes rosa y azul como decoración y la
fotografía central responsive. El 2026-08-18 la fotografía se sustituyó por el
PNG transparente actualizado aportado por el propietario; alt, dimensiones y
autorización directa quedan trazados en `src/content/home/custom-idea.ts`. Se conservan
sin cambio el titular, copy, enlace de WhatsApp y `custom_whatsapp_click` en
`home-custom-idea`. `npm run lint`, `npm run typecheck` (0 errores, warnings e
hints), `npm test` (39 archivos, 242 tests), `npm run build` (25 páginas),
`verify:links`, `verify:accessibility`, `verify:performance` (104.286 bytes
máximo de transferencia inicial a 375 px), `verify:responsive`,
`verify:assets`, `verify:determinism` y `git diff --check`: PASS. La comprobación
Prettier específica de los archivos de esta tarea: PASS; `npm run format`
mantiene dos avisos preexistentes y fuera de alcance en
`src/pages/regalos/[slug].astro` y `tests/taxonomy-listing.test.ts`.
`VISUAL QA: BLOCKED`: el navegador no pudo inicializarse para capturas
1280/1440/1920 por una restricción local de conexión de la herramienta. No
avanzar a M8.9.9 hasta completar ese QA visual.

Actualización solicitada el 2026-08-18: CTA y Footer rediseñados como cierre
compacto. El CTA es un panel centrado de `min(92%, 1500px)` y
`clamp(192px, 15vw, 240px)`, con arte transparente recortado desde el borde
superior, nube azul/rosa parcialmente ocultas, luna `luna-nube.png`, copy
directamente aprobado, microornamentos y CTA outline con icono de WhatsApp.
El Footer se compacta con logo, navegación real en dos columnas, iconos de
contacto accesibles y firma en una línea; no se inventaron enlaces. `npm test`
(39 archivos, 243 tests), lint, typecheck, build (25 páginas), links, a11y,
performance (106.934 bytes máximo inicial a 375 px), responsive, assets,
determinism y `git diff --check`: PASS. Las capturas 1280/1440/1920 siguen
`BLOCKED` por la restricción local de conexión del navegador; no avanzar.

Ajuste solicitado el 2026-08-18: la fotografía central se desplaza hacia abajo
en escritorio mediante `inset-block-start: clamp(-1.75rem, -1.5vw, -1rem)`;
el panel conserva `overflow: hidden`, mostrando algo más de las manos arriba y
recortando la parte inferior como en la referencia aportada. Test específico,
lint, typecheck, 243 tests, build (25 páginas), links, a11y, performance,
responsive, assets, determinismo (522 archivos), auditoría de artefacto,
Prettier específico y `git diff --check`: PASS. QA visual manual PASS sobre
`astro preview` con Chrome headless a 1280, 1440 y 1920 px; la banda queda sin
solapes ni overflow y el recorte coincide con la referencia solicitada.
Siguiente tarea: M8.9.9 — Footer (modelo LUNA → SOL REVIEW).

Ajuste solicitado el 2026-08-18: Home ordena las secciones como “Encuentra el
regalo perfecto” → “Cada detalle cuenta” → “Ideas para regalar” → “¿Tienes
algo en mente?”. Se elimina por completo la galería “Trabajos realizados por
Luna”, incluidos sus estilos y proyección editorial; el proceso de tres pasos
se conserva. `npm run lint`, `npm run typecheck`, `npm test` (39 archivos, 241
tests), `npm run build` (25 páginas) y `git diff --check`: PASS.

## M8.9.9 — Footer

**Estado:** DONE
**Objetivo:** alinear el Footer con la referencia usando sólo logo, navegación,
contacto, redes, copyright y crédito reales ya autorizados.
**Dependencias:** M8.9.8.
**Criterios de aceptación:** jerarquía ligera, divisores sutiles, iconografía
coral coherente, foco/targets/contraste; crédito de Antonio MDM y año de build
preservados; cero enlace ficticio.
**Verificación:** suite/build, hrefs, teclado, a11y y QA 1280/1440/1920.
**Modelo recomendado:** LUNA → SOL REVIEW.
**Evidencia:** PASS (2026-08-18) — la implementación usa el asset oficial
aportado, una grid compacta desktop con divisor de 96 px, dos columnas de
navegación, redes en orden Instagram → WhatsApp → email y firma integrada bajo
las redes; conserva el año UTC, los hrefs autorizados, foco, targets de 44 px
y analítica de WhatsApp, sin enlaces ficticios. `npm run lint`,
`npm run typecheck` (0 errores, warnings e hints), `npm test` (39 archivos,
241 tests), `npm run build` (25 páginas), `verify:links`,
`verify:accessibility`, `verify:responsive`, `verify:artifact`,
`verify:performance` (102.046 bytes máximo inicial a 375 px), `verify:assets`
(41 archivos, 46.581.759 bytes), `verify:determinism` (481 archivos),
Prettier específico y `git diff --check`: PASS. QA visual manual PASS con
Chrome headless estable sobre `astro preview` a 1280/1440/1920 px: logo,
divisor, navegación, iconos coral y firma coinciden con la referencia sin
solapes ni overflow visible. El bloqueo previo del navegador queda resuelto.
Siguiente tarea: M8.9.10 — Integración visual desktop.

## M8.9.10 — Integración visual desktop

**Estado:** PENDING
**Objetivo:** convertir las secciones implementadas en una composición continua
mediante una pasada específica de ritmo, fondos, densidad, escala y repetición.
**Dependencias:** M8.9.9.
**Criterios de aceptación:** continuidad de crema/nubes/acuarelas, ornamentos no
repetitivos, proporciones fotográficas y botones/tipografía consistentes; no se
perciben bloques independientes apilados; mobile sigue funcional sin cierre
visual definitivo.
**Verificación:** suite completa, budgets y QA comparativa 1280/1440/1920.
**Modelo recomendado:** SOL → LUNA.
**Evidencia:** —

## M8.9.11 — Visual QA desktop + aprobación del propietario

**Estado:** PENDING
**Objetivo:** comparar sistemáticamente la implementación completa contra la
referencia aprobada y obtener la decisión explícita del propietario.
**Dependencias:** M8.9.10.
**Criterios de aceptación:** checks técnicos completos en PASS; capturas a
1280/1440/1920; comparación documentada de Header, logo, Hero, H1/script,
corazón/separador, cards, fondos, proceso, portfolio, CTA, Footer, whitespace,
proporciones y jerarquía; `VISUAL QA: PASS`; `OWNER APPROVAL: APPROVED`.
**Estado de cierre obligatorio:** `PENDING APPROVAL` hasta recibir aprobación
explícita; M9 continúa pausada.
**Verificación:** lint, typecheck, tests, build, links, security, performance,
a11y, responsive y revisión visual manual; tests verdes no bastan.
**Modelo recomendado:** SOL.
**Evidencia:** `VISUAL QA: PENDING`; `OWNER APPROVAL: PENDING`.

**Placeholder futuro:** M8.10 — Mobile visual alignment. La referencia móvil ya
está recibida y versionada, pero no se formaliza ni ejecuta hasta aprobar
desktop; sus funciones ficticias no modifican los contratos reales.

---

# M9 — Migration + Production Release

**Estado:** PENDING (PAUSED BY M8.9 VISUAL ALIGNMENT)
**Gate:** G9.

## M9.1 — Catálogo, copy y assets finales

**Estado:** DONE
**Objetivo:** sustituir material provisional por contenido aprobado y trazable.  
**Alcance:** YAML final, fotos optimizables, alt, marca/favicon/OG, textos y datos legales/config; revisión de derechos y completitud; selección final coherente con las reglas hero/producto/trabajos/proceso/detalle de la dirección artística. Si se amplía “Cada detalle cuenta”, incorporar sólo material aprobado de manos, preparación, materiales/packaging y producto terminado.

**Fuera de alcance:** inventar contenido, cambiar schemas sin necesidad o migrar originales gigantes.  
**Dependencias:** M8.6 y entradas M0.3 disponibles.  
**Archivos/áreas previstas:** content/assets/config y checklist readiness.  
**Contratos afectados:** catálogo, marca, SEO, legal, media.  
**Criterios de aceptación:** todo publicado está aprobado; cero fixture/TBD; derechos/fuentes registrados; fotografía conserva color/punto focal y recortes 320/768/1440; catálogo/build y visual QA pasan sin romper el gate aprobado en M8.6.

**Verificación:** validation suite, asset/license checklist, build y revisión editorial/visual completa contra la dirección autoritativa.

**Modelo recomendado:** LUNA → SOL REVIEW.  
**Razón del modelo:** carga sistemática con revisión de coherencia global.  
**Evidencia:** PASS (2026-08-17) — `docs/product/m9-1-content-release.md` y `docs/product/content-readiness.md` registran el cierre editorial: 8 productos, 4 categorías, 4 ocasiones y 3 destinatarios publicados, con copy, precios, relaciones, personalización, orden/destacado, aprobación, derechos y alt trazables. Las portadas y galerías resuelven dentro de `src/assets/catalog/`; el logo aprobado se reutiliza sin modificación como favicon PNG y en Organization JSON-LD. No se inventan variantes de marca, claims, datos legales ni placeholders. La imagen social sigue siendo el hero aprobado. Se añadió regresión de shell para el favicon. `npm run lint`, `npm run typecheck` (0 errores/warnings/hints), `npm test` (38 archivos, 231 tests), `npm run build` (25 páginas), `npm run verify:catalog` (8 productos), `npm run verify:seo` (24 HTML), `npm run verify:crawl` (24 URLs), `npm run verify:links` (0 rotos/0 huérfanos/0 problemas de breadcrumbs), `npm run verify:structured-data`, `npm run verify:assets` (31 archivos, 29.647 KiB), `npm run verify:accessibility`, `npm run verify:performance`, `npm run verify:responsive`, `npm run verify:artifact`, `npm run verify:determinism` (486 archivos), `npm run verify:security`, `npm run verify:dependencies`, `npm run verify:mutation` y `git diff --check`: PASS. `npm run format` conserva únicamente dos avisos preexistentes fuera de alcance en `src/pages/regalos/[slug].astro` y `tests/taxonomy-listing.test.ts`. Siguiente tarea: M9.2 (modelo SOL).
`src/content/products/lamina-personalizada-a5.yml` conserva el ID estable y
actualiza nombre, copy, precio de 2 €, personalización y aprobación; incorpora
la portada existente y 9 imágenes de galería con alt y derechos registrados.
Los 10 archivos referenciados existen bajo `src/assets/catalog/laminas/`.
Esta entrega parcial no completaba el catálogo; el cierre global posterior queda
registrado en la evidencia PASS de M9.1.

Actualización parcial adicional (2026-08-17) — se actualiza el producto
existente `tarjeta-felicitacion-personalizada-a6.yml` a `published`, con precio
de 2 €, portada `papeleria/tarjeta-felicitacion-leo.jpeg`, alt, derechos y
aprobación editorial. El asset fue normalizado desde el nombre recibido y
validado dentro de `src/assets/catalog/papeleria/`.

Actualización parcial adicional (2026-08-17) — `etiquetas-personalizadas-regalos.yml`
queda publicado con nombre “Etiquetas para regalos”, precio de 0,20 € por unidad,
pedido mínimo de 24 unidades, portada `papeleria/etiquetas-comunion-claudia.jpeg`,
alt, derechos y aprobación editorial.

Actualización parcial adicional (2026-08-17) — `libreta-personalizada-a5.yml`
queda publicada con precio de 2 €, formato A5, 20 hojas/40 páginas, portada,
galería de 3 imágenes, alt, derechos y aprobación editorial. Los cuatro assets
referenciados existen bajo `src/assets/catalog/papeleria/`.

## M9.2 — Mapa y ejecución de redirects

**Estado:** BLOCKED
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
**Evidencia:** BLOCKED (2026-08-17) — La segunda auditoría externa resolvió
el falso negativo de red de M0.1: `lunatartas.es` sirve una aplicación Flutter
anterior por HTTP/HTTPS y su bundle público confirma 15 rutas de aplicación.
`docs/seo/redirect-map.csv` deduplica 16 decisiones: portada preservada, seis
equivalencias semánticas con 301/query preservada y nueve herramientas/rutas
privadas sin equivalente con 410/query descartada. Se prepararon un CSV sin
cabecera importable en Cloudflare Bulk Redirects, un Worker edge para los 410,
checker local/remoto y tests; mapa, duplicados, chains, loops y respuestas 410:
PASS. El muestreo previo confirma que las 15 rutas aún responden 200; `www`
sigue NXDOMAIN, `robots.txt` concatena HTML y `sitemap.xml` es el fallback SPA.
No hay acceso/export/conexión de Cloudflare ni exports privados de Search
Console/logs/backlinks: los 301/410 no pueden activarse ni comprobarse como
respuestas reales. Reanudar M9.2 cuando el propietario facilite acceso o aplique
los artefactos preparados; después ejecutar
`npm run verify:redirects -- --origin=https://lunatartas.es`. No avanzar a M9.3.

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
- 2026-08-15 — M0.3 completada: contrato de readiness V1 creado con matriz de entradas, owners/gates, plantilla editorial, reglas de aprobación y separación fixture/TBD frente a contenido publicable. G0 PASS; M1 queda sin blocker desconocido. Siguiente tarea: M1.1.
- 2026-08-15 — M1.1 completada: scaffold Astro 6 estático reproducible, runtime/package manager fijados, página mínima, typecheck/build y reglas de `.gitignore` verificados. Siguiente tarea: M1.2 (modelo LUNA).
- 2026-08-15 — M1.2 completada: Node/npm actualizados a las versiones contractuales, harness de lint/formato/Vitest integrado, checks verdes y fallo controlado recuperado. Siguiente tarea: M1.3 (modelo LUNA → SOL REVIEW).
- 2026-08-15 — M1.3 completada: configuración global validada, origen/canonical/locale centralizados, placeholder de marca no publicable, BaseLayout semántico y 16 tests/checks verdes. Siguiente tarea: M1.4 (modelo LUNA).
- 2026-08-15 — M1.4 completada: CI de pull request con permisos mínimos, acciones fijadas por SHA, Node/npm/cache/concurrencia definidos y checks contractuales obligatorios. Verificación local completa PASS; run real pendiente de la primera rama/PR. Siguiente tarea: M1.5 (modelo LUNA → SOL REVIEW).
- 2026-08-15 — M1.5 completada: Pages habilitado en modo workflow, pipeline oficial por SHA y permisos mínimos desplegado desde `main`; artifact único, auditoría, smoke técnico y recuperación/rollback documentados en PASS. G1 satisfecho. Siguiente tarea: M2.1 (modelo SOL → LUNA).
- 2026-08-15 — M2.1 completada: schemas YAML estrictos y tipados para Category, Occasion y Recipient, fixtures aislados, negativos accionables y build válido en PASS. Siguiente tarea: M2.2 (modelo SOL → LUNA).
- 2026-08-15 — M2.2 completada: contrato Product/Price/Media estricto y tipado, publicación discriminada, importes en unidades menores, fixtures aislados y matriz de 53 tests/checks verdes. Siguiente tarea: M2.3 (modelo SOL).
- 2026-08-15 — M2.3 completada: Content Collections queda encapsulado en un adaptador de carga única, mapping explícito y contextual; el modelo de dominio permanece TypeScript plano e independiente, con 68 tests/checks verdes. Siguiente tarea: M2.4 (modelo LUNA → SOL REVIEW).
- 2026-08-15 — M2.4 completada: validación agregada de catálogo/relaciones/publicación/moneda y assets reales integrada como gate del build; 91 tests y fallo controlado recuperado en PASS. Siguiente tarea: M2.5 (modelo LUNA).
- 2026-08-15 — M2.5 completada: queries públicas deterministas, búsquedas, agrupación, relacionados básicos y builders de rutas SEO con 96 tests/checks verdes. Siguiente tarea: M2.6 (modelo LUNA → SOL REVIEW).
- 2026-08-15 — M2.6 completada: pipeline integral con catálogo sintético aislado, precios/relaciones/medios representativos, salida profunda e inmutable, 99 tests y artifact sin fixtures. G2 satisfecho. Siguiente tarea: M3.1 (modelo SOL).
- 2026-08-16 — M3.1 completada: dirección provisional “obrador editorial cálido”, contrato reemplazable de marca, paleta/tipo/responsive/accessibility, blockers y licencias explícitos, y lámina móvil/escritorio revisada en PASS. Siguiente tarea: M3.2 (modelo LUNA).
- 2026-08-16 — M3.2 completada: tokens semánticos y foundations CSS sin JavaScript ni fuentes remotas, foco/reduced motion, responsive base y checker de contraste en PASS. Siguiente tarea: M3.3 (modelo LUNA).
- 2026-08-16 — M3.3 completada: base global CSS, layout estable, skip link, destino de foco, estilos nativos/prose/medios y reduced motion implementados; 101 tests, build y checks de formato en PASS. Siguiente tarea: M3.4 (modelo LUNA).
- 2026-08-16 — M3.4 completada: primitives nativos Button/ActionLink/Icon/Badge, variantes, targets táctiles, estados y modos accesibles de icono implementados sin hidratación; 103 tests, build y checks de formato en PASS. Siguiente tarea: M3.5 (modelo LUNA → SOL REVIEW).
- 2026-08-16 — M3.5 completada: cards, media responsive dimensionada, breadcrumb y patrones de sección/lista tipados, semánticos, accesibles y sin hidratación; 108 tests, HTML estático y revisión 320/768/1440 en PASS. G3 satisfecho. Siguiente tarea: M4.1 (modelo LUNA → SOL REVIEW).
- 2026-08-16 — M4.1 completada: shell global responsive con header, navegación y footer centralizados, menú móvil HTML nativo, estado actual y foco accesibles, datos no aprobados excluidos, 113 tests y revisión 320/768/1440 en PASS. Siguiente tarea: M4.2 (modelo SOL).
- 2026-08-16 — M4.2 completada: hero aprobado con ambos CTA, enlace directo WhatsApp codificado, fotografía responsive optimizada, 124 tests, artifact sin JS/TBD, QA 320/768/1440 y LCP local 32/40 ms en PASS. Siguiente tarea: M4.3 (modelo LUNA).
- 2026-08-16 — M4.3 completada: navegación home por categorías, ocasiones y destinatarios proyectada desde taxonomías publicables, con orden determinista, estados vacíos, rutas SEO y 126 tests/checks en PASS. Siguiente tarea: M4.4 (modelo LUNA).
- 2026-08-16 — M4.4 completada: bloque de ideas destacadas con ProductCard, orden/featured del dominio, precios fixed/from/on_request sin tergiversación, estado vacío y 128 tests/checks en PASS. Siguiente tarea: M4.5 (modelo LUNA).
- 2026-08-16 — M4.5 bloqueada: fotos, derechos, alt y prueba social permanecen `TBD` en el contrato de readiness; no se inventan claims ni assets. Pendiente entrega del propietario del negocio antes de reanudar M4.5.
- 2026-08-16 — Revisión de ejecución M4.5: el bloqueo sigue vigente tras comprobar `content-readiness.md`; no se añaden componentes, claims ni assets. Siguiente tarea: M4.5 cuando el propietario entregue y apruebe el material requerido (modelo LUNA).
- 2026-08-16 — M4.5 completada tras el handoff aprobado: bloque de proceso literal, galería estática de cuatro trabajos reales, derechos/alt/readiness trazables, variantes responsive bajo budget, 132 tests y QA 320/768/1440 en PASS. Siguiente tarea: M4.6 (modelo LUNA).
- 2026-08-16 — M4.6 completada: CTA emocional “Cuéntanos tu idea”, builder puro WhatsApp con mensaje Unicode codificado una vez, enlace nativo sin JS, 136 tests y checks contractuales/build en PASS. Siguiente tarea: M4.7 (modelo LUNA).
- 2026-08-16 — M4.7 completada: índice estático `/productos/`, H1/introducción, listado de publicados ordenado por dominio, estado vacío honesto, 138 tests y link check/build en PASS. Siguiente tarea: M4.8 (modelo LUNA).
- 2026-08-16 — M4.10 completada: índice `/regalos/` y landings por persona reutilizan el patrón compartido, excluyen drafts/vacíos, mantienen rutas y orden deterministas, evitan jerga interna visible y pasan 142 tests, build y link check. Siguiente tarea: M4.11 (modelo LUNA → SOL REVIEW).
- 2026-08-16 — Roadmap recalibrado documentalmente con la dirección aprobada “Atelier de pequeños detalles”. M4.11 pasa a integrar dirección artística, QA visual 320/768/1440 y la firma secundaria del creador en el Footer; M4.1 conserva `DONE`. M5–M9 heredan criterios visuales, de accesibilidad, reduced-motion, performance y gate final sin ejecutar ni completar ninguna milestone. Siguiente tarea: M4.11 (modelo LUNA → SOL REVIEW).
- 2026-08-16 — M4.11 completada: Home, shell y listados integran “Atelier de pequeños detalles”, navegación estática corregida, Footer firmado, QA visual 320/768/1440, contraste, reduced motion, budgets, 144 tests, build y smoke sin JS en PASS. G4 satisfecho. Siguiente tarea: M5.1 (modelo SOL → LUNA).
- 2026-08-16 — M5.1 bloqueada: el número y el mensaje personalizado están aprobados, pero el saludo/copy/plantilla de producto y la política de nueva pestaña siguen `TBD` en el contrato de conversión y readiness. No se inventa contenido ni se avanza a M5.2. Reanudar M5.1 cuando el propietario entregue la plantilla aprobada (modelo LUNA).
- 2026-08-16 — M4.11.1 completada como corrección trazable: se registra la referencia aprobada y una auditoría reproducible demuestra que el primer cierre de M4.11 fue técnicamente correcto pero visualmente insuficiente. G4 se reabre, M5 permanece detenido y se crean M4.11.2–M4.11.8. Descubrimiento/ideas queda `BLOCKED` por catálogo, taxonomías y fotografías asociables no aprobados; el resto reutiliza hero y cuatro trabajos reales. Siguiente tarea: M4.11.2 (modelo SOL → LUNA).
- 2026-08-16 — M4.11.2 completada: roles de medida y ritmo, escala tipográfica, superficies semánticas y tres ornamentos accesibles migrados sin aliases ni hidratación; contraste, 145 tests, build y QA 320/768/1440 en PASS. Siguiente tarea: M4.11.3 (modelo LUNA → SOL REVIEW).
- 2026-08-16 — M4.11.3 completada: Header más respirado sin identidad inventada y Hero editorial 45/55 con fotografía real protagonista, composición propia móvil, H1/copy/CTA aprobados, contraste, HTML/LCP estable, 146 tests, build y QA 320/768/1440 en PASS. Siguiente tarea: M4.11.4 (modelo LUNA → SOL REVIEW).
- 2026-08-16 — M4.11.4 completada: proceso aprobado convertido en secuencia conectada y collage editorial asimétrico con las cuatro fotografías reales, alt/dimensiones/lazy loading preservados, reduced motion, 147 tests, build y QA 320/768/1440 en PASS. Siguiente tarea: M4.11.5 (modelo LUNA → SOL REVIEW).
- 2026-08-16 — M4.11.5 completada: CTA emocional integrado y Footer editorial con navegación real, WhatsApp Business, email e Instagram aprobados, copyright/firma separados, foco y targets accesibles, 153 tests, build y QA 320/768/1440 en PASS. Siguiente tarea: M4.11.6 (modelo LUNA → SOL REVIEW).
- 2026-08-16 — M4.11.6 completada: subrayado e hilos usan draw progresivo nativo sólo en escritorio compatible, con fallback/reduced-motion estáticos, 0 JS, 0 desplazamiento de layout, hover/foco equivalentes, 153 tests, build, budgets y QA 320/768/1440 en PASS. Siguiente tarea: M4.11.7, que permanece `BLOCKED` hasta recibir catálogo, taxonomías y fotografías aprobadas (modelo SOL → LUNA).
- 2026-08-16 — M4.11.7 completada: validados 4 productos reales publicados (`tarta-de-panales-personalizada`, `lamina-personalizada-a5`, `lamina-natalicia-a5`, `invitacion-marcapaginas-personalizada`) con portadas reales válidas, alt descriptivos, derechos propios de Luna / MGR Creaciones y aprobación formal. Proyectan 9 intenciones taxonómicas y 3 productos destacados. Cero placeholders, cero módulos vacíos, 14 rutas estáticas generadas, 155 tests y build en PASS. Siguiente tarea: M4.11.8 (modelo SOL).
- 2026-08-17 — M5.1 completada: aprobación editorial registrada, builder puro de producto con URL canónica y encoding único, matriz de Unicode/errores, 164 tests, lint/typecheck/build y diff check en PASS. Siguiente tarea: M5.2 (modelo LUNA → SOL REVIEW).
- 2026-08-17 — M5.2 completada: ficha estática por producto publicado, variantes de precio honestas, taxonomías enlazadas y composición editorial responsive revisada a 320/768/1440; 169 tests, lint/typecheck/build y diff check en PASS. Siguiente tarea: M5.3 (modelo LUNA → SOL REVIEW).
- 2026-08-17 — M5.3 completada: galería estática de portada y alternativas aprobadas, responsive AVIF/WebP con dimensiones conocidas, portada prioritaria, vistas adicionales lazy y composición móvil/escritorio sin JavaScript; 169 tests, build y QA 320/768/1440 en PASS. Siguiente tarea: M5.4 (modelo LUNA → SOL REVIEW).
- 2026-08-17 — M5.4 completada: panel de conversión estático tras la galería con resumen, precio, CTA seguro a WhatsApp y mensaje contextual con canonical; 169 tests, build y QA 320/768/1440/teclado en PASS. Siguiente tarea: M5.5 (modelo LUNA).
- 2026-08-17 — M5.5 completada: personalización condicional desde `customization`, contenido editorial del producto y proceso/confianza aprobado en secuencia narrativa, sin FAQ/configurador/claims inventados ni JavaScript; 169 tests, lint/typecheck/build y revisión HTML en PASS. Siguiente tarea: M5.6 (modelo LUNA).
- 2026-08-17 — M5.6 completada: relacionados deterministas por taxonomías compartidas, exclusión de actual/drafts, máximo 3, media y enlaces internos; 170 tests, lint/typecheck/build e inspección HTML sin scripts en PASS. Siguiente tarea: M5.7 (modelo LUNA → SOL REVIEW).
- 2026-08-17 — M6.3 completada: breadcrumb semántico único para índices, landings y fichas, internal linking canónico y auditoría estática de enlaces/huérfanas; 181 tests, build de 25 páginas y link graph en PASS. Siguiente tarea: M6.4 (modelo SOL).
- 2026-08-17 — M7.5 completada: runbook de medición con matriz de eventos/rutas/payloads, modos de consentimiento, debug controlado, captura de red redactada, tráfico interno, alertas y procedimiento postrelease; test contractual y checks de suite en PASS. Siguiente tarea: M8.1 (modelo LUNA → SOL REVIEW).
- 2026-08-17 — M8.1 completada: foco del skip link corregido, auditor estático del artefacto añadido, revisión semántica/teclado/zoom/reflow/reduced-motion documentada, 220 tests y checks de build en PASS. Siguiente tarea: M8.2 (modelo SOL → LUNA).
- 2026-08-17 — M8.3 completada: overflow móvil del Hero corregido, auditor responsive del artefacto añadido, capturas 320/768/1440 y matriz Chrome/Edge documentadas; 224 tests, build, auditorías de responsive/a11y/performance/assets y checks de calidad en PASS. Siguiente tarea: M8.4 (modelo LUNA → SOL REVIEW).
- 2026-08-17 — M8.4 completada: hardening del artefacto, smoke estático crítico, determinismo byte a byte en dos builds y mutación controlada rechazada; CI/Pages integran los gates, 224 tests repetidos y auditorías completas en PASS. Siguiente tarea: M8.5 (modelo SOL).
- 2026-08-17 — M8.5 completada: gates de secretos/historial/workflows/superficie pública y supply chain integrados; 539 dependencias/licencias y cinco advisories mitigados evaluados, 228 tests y auditorías completas en PASS. Siguiente tarea: M8.6 (modelo SOL).
- 2026-08-17 — M8.6 completada: candidato `m8.6-rc.1` inmutable con manifiesto SHA-256, 230 tests y auditorías completas en PASS; revisión visual 1440/768/320, tres Lighthouse y corrección del overflow de breadcrumb móvil. GO técnico/visual con known issues asignados. Siguiente tarea: M9.1 (modelo LUNA → SOL REVIEW).
- 2026-08-17 — M9.2 bloqueada tras descubrir la aplicación Flutter anterior activa y 15 rutas en su bundle público: mapa de 16 decisiones, CSV Bulk Redirects, Worker 410 y checker quedan preparados y validados, pero no hay acceso/export de Cloudflare para activar ni verificar respuestas reales. Reanudar M9.2 con acceso operativo (modelo SOL); no avanzar a M9.3.
- 2026-08-17 — M8.9.1 completada contra la referencia desktop actualizada:
  paleta Luna/roles accesibles, tres voces tipográficas y contratos de
  dimensión/composición centralizados; primitives migrados, 237 tests, build,
  links, a11y, performance, security y smoke 1440 en PASS. La referencia móvil
  recibida queda reservada para M8.10. M9 continúa pausada y M9.2 conserva su
  bloqueo Cloudflare. Siguiente tarea: M8.9.2 (modelo LUNA → SOL REVIEW).
- 2026-08-17 — M8.9.2 completada: primitive decorativo Luna ampliado y fondo
  global continuo con corazones, sparkle, líneas, nubes y washes vectoriales;
  cero raster/JS/CLS, 238 tests, build, auditorías y QA 1280/1440/1920 en PASS.
  Mascota aislada y tipografías de marca permanecen bloqueadas con salida
  explícita. Siguiente tarea: M8.9.3 (modelo LUNA → SOL REVIEW).
- 2026-08-17 — M8.9.3 completada: logo oficial responsive, cinco destinos
  reales, activo coral y separador orgánico trazo-corazón; fallback nativo móvil
  sin overflow, foco visible y cero función ficticia. 239 tests, build,
  auditorías y QA 1280/1440/1920/320 en PASS. Siguiente tarea: M8.9.4 (modelo
  LUNA → SOL REVIEW).
- 2026-08-17 — M8.9.4 completada: Hero unitario con H1 editorial, frase script,
  fotografía autorizada a sangre, ambos CTA reales y cierre orgánico; media LCP
  responsive dimensionada, cero JS/overflow, foco visible, 239 tests, build,
  auditorías y QA 1280/1440/1920/320 en PASS. Siguiente tarea: M8.9.5 (modelo
  SOL → LUNA).
- 2026-08-17 — Ajuste visual solicitado de M8.9.4 completado: la fotografía se
  recorta con el mismo perfil del lazo y la transición incorpora una nube azul de
  acuarela vectorial original, sin usar el ejemplo con marca de agua; build,
  auditorías y QA 1280/1440/1920/320 en PASS. Siguiente tarea: M8.9.5 (modelo
  SOL → LUNA).
- 2026-08-17 — Segundo ajuste visual solicitado de M8.9.4 completado: la foto se
  prolonga detrás de la onda superior, la nube vectorial se sustituye por una
  acuarela transparente original optimizada a WebP y se elimina el overflow
  detectado en QA; 239 tests, build, auditorías y QA 1280/1440/1920/320 en PASS.
  Siguiente tarea: M8.9.5 (modelo SOL → LUNA).
- 2026-08-18 — M8.9.5 completada: descubrimiento determinista en tres cards con
  productos publicados distintos, rutas reales y selección cubierta por tests;
  corrección del fallback móvil para eliminar overflow a 320 px. 241 tests,
  build, auditorías de links/a11y/performance/responsive/assets y QA Chrome
  1280/1440/1920/320 en PASS. Siguiente tarea: M8.9.6 (modelo LUNA → SOL REVIEW).
- 2026-08-18 — M8.9.6 completada: secuencia de tres pasos con `ol` semántico,
  iconos circulares, numeración editorial, curva punteada y ornamentos Luna;
  241 tests, build, auditorías de links/a11y/performance/responsive/assets y QA
  Chrome 1280/1440/1920 en PASS. Siguiente tarea: M8.9.7 (modelo LUNA → SOL REVIEW).
- 2026-08-18 — M8.9.7 implementada técnicamente: mosaico editorial de cinco
  productos publicados, selección prioritaria de destacados con variedad de
  categorías, enlaces, copy, CTA, media responsive y ornamentos Luna. Suite,
  build y auditorías en PASS; QA visual 1280/1440/1920 permanece BLOCKED porque
  el navegador integrado no pudo inicializarse. No avanzar a M8.9.8.
- 2026-08-18 — M8.9.8 implementada técnicamente: banda editorial de cierre sin
  card genérica, con los cuatro assets aportados (fondo blush, nubes rosa/azul y
  fotografía central), media responsive, derechos/alt trazables y WhatsApp con
  analytics intactos. 242 tests, build y auditorías de links, accesibilidad,
  rendimiento, responsive, assets y determinismo en PASS. El QA visual
  1280/1440/1920 queda BLOCKED porque el navegador no pudo inicializarse por una
  restricción local de conexión. No avanzar a M8.9.9.
- 2026-08-18 — M8.9.8 actualizada con la nueva fotografía central PNG con
  transparencia aportada por el propietario; se elimina la mezcla visual que
  compensaba el fondo anterior. Test de la sección, lint, typecheck, build y
  auditorías de links, accesibilidad, rendimiento, responsive, assets y
  determinismo: PASS. El QA visual permanece BLOCKED por la misma restricción
  local de conexión del navegador. No avanzar a M8.9.9.
- 2026-08-18 — Rediseño solicitado de M8.9.8 y Footer: cierre horizontal
  compacto con panel blush, arte transparente recortado, luna/nubes reales,
  CTA outline e icono de WhatsApp; footer compacto con sólo enlaces reales,
  iconos accesibles y firma en línea. 243 tests, build y auditorías técnicas
  en PASS. QA visual 1280/1440/1920 permanece BLOCKED por la restricción local
  de conexión del navegador. No avanzar a M8.9.9.
