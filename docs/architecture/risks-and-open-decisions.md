# Riesgos y decisiones abiertas

## Riesgos operativos al cierre V1

| Riesgo | Impacto | Mitigación/gate | Estado |
| --- | --- | --- | --- |
| Huella histórica privada potencialmente incompleta | pérdida de señales SEO en URLs no conocidas | mapa productivo de 16 decisiones, Search Console y monitor de 404; no crear redirects especulativos | ACCEPTED — P1; owner: SEO / propietario del negocio |
| Configuración externa DNS/edge | regresión de canonicalización, HTTPS o redirects | apex/`www`, 301/410 y Pages verificados; export privado y rollback bajo owner | CONTROLLED — owner: propietario del negocio |
| Catálogo, fotos, copy y derechos | página incorrecta o material no aprobado | M9.1 publicó sólo entradas aprobadas; schemas, assets y artifact bloquean fixtures/TBD | CONTROLLED — owner: Luna / contenido |
| Tipografía de marca sin masters/licencia web | diferencia respecto a identidad futura | stacks de sistema aprobados para V1; no incorporar fuente sin licencia y QA | ACCEPTED — P2; owner: Luna / marca |
| Alta GA4 y consentimiento sin aprobacion productiva | medicion o privacidad incorrecta | GA4 directo aprobado y configurado con opt-in; M9.4 validó Network, hit real, Realtime, PII y revocación el 2026-08-21 | CONTROLLED — owner: titular de Luna Tartas |
| Pages tiene redirects HTTP por path limitados | migración SEO incompleta si se retira la capa edge | Cloudflare sirve 301 y Worker 410 verificados; checker remoto tras cambios | CONTROLLED — owner: propietario del negocio |
| Fotos originales pesadas en Git | repositorio lento a largo plazo | hard limits M0.2 (8 MiB/24 MP por raster; 100 MiB binarios) y archivo externo; checks en M2/M8 | CONTROLLED — owner: equipo técnico |
| Exposición accidental de secretos en repositorio público, historial, logs o `dist` | compromiso de cuentas/servicios | `.gitignore`, permisos mínimos y gates de repo/historial/workflows/artefacto en M8.5; logs remotos se reinspeccionan en M8.6/M9.3 | CONTROLLED — owner: equipo técnico |

## Decisiones post-V1 no bloqueantes

- Tipografía web: sólo tras recibir masters, licencia y aprobación; V1 usa
  stacks del sistema.
- Preview por pull request: no existe en V1; sólo se reconsidera si el valor
  demostrado compensa una nueva superficie pública.

Prioridad, owner y condición de salida de toda deuda aceptada están en
[`../operations/accepted-debt.md`](../operations/accepted-debt.md).

Los umbrales de M0.2 son gates iniciales, no `TBD`: M8.2 puede endurecerlos y sólo puede relajarlos con evidencia, owner y aceptación explícita.

## Decisiones cerradas en M0.2

| Decisión | Resultado | Consecuencia verificable | Estado |
| --- | --- | --- | --- |
| Framework/render | Astro estable 6.x, TypeScript estricto, SSG `output: static`, sin adapter/framework UI | build produce sólo artefacto estático | CLOSED |
| Runtime/package manager | Node `24.19.0` LTS + npm `11.17.0`, versiones/lockfile exactos y `npm ci` | local y CI comparten runtime y grafo | CLOSED |
| Hosting | GitHub Pages + workflow oficial; productivo desde M9.3 | Pages sirve apex HTTPS con smoke por deploy | CLOSED |
| URLs | apex HTTPS, `www -> apex`, minúsculas, HTML con barra final y `build.format: directory` | route builder/canonical/sitemap deben coincidir | CLOSED |
| Redirects | Cloudflare Bulk Redirects para 301 y Worker para 410; meta refresh no aceptado | 16 decisiones y respuestas productivas verificadas | CLOSED |
| Frontera pública | todo Git/log/artifact es público; Secrets sólo en Actions y nunca en `dist` | permisos mínimos, actions por SHA y scans | CLOSED |
| Assets/repositorio | raster <= 8 MiB/24 MP, SVG <= 250 KiB, binarios <= 100 MiB, sin LFS V1 | checks automáticos en M2/M8 | CLOSED |
| Compatibilidad | Baseline Widely Available con downstream, matriz de navegadores vigente, sin IE, core sin JS | smoke registrado en M8.3 | CLOSED |
| Accesibilidad/performance | WCAG 2.2 AA, CWV “good”, Lighthouse y budgets de transferencia/JS/CSS | gates medibles en `testing-strategy.md` | CLOSED |
| Dependencias | plataforma primero, necesidad actual, mantenimiento/licencia/seguridad/coste y pin exacto | toda dependencia nueva justifica y pasa suite | CLOSED |

## Bloqueos V1 y propietarios

No queda ningún bloqueo abierto para operar V1. Las mejoras y riesgos residuales
son deuda aceptada, con owner y prioridad explícitos; no se confunden con
credenciales ni detalles de recuperación, que permanecen fuera del repositorio.

El carácter público del repositorio está **CLOSED/CONFIRMED** como decisión: no habilita versionar credenciales. La implementación de sus controles permanece distribuida en M1.1, M1.4, M1.5 y M8.5.

## Evidencia de M0.1

El inventario inicial y sus límites viven en
[`../discovery/current-state.md`](../discovery/current-state.md); el estado
productivo posterior de URLs y edge está en
[`../seo/redirect-audit.md`](../seo/redirect-audit.md). La evidencia histórica
de M0.1 se conserva como fotografía inicial y no prevalece sobre el cierre de
M9.2–M9.6.

## Evidencia de M0.2

Las decisiones, alternativas, consecuencias y fuentes oficiales están en [`architecture.md`](architecture.md); el flujo Pages/DNS/rollback y owners están en [`deployment.md`](deployment.md); los presupuestos ejecutables están en [`../quality/testing-strategy.md`](../quality/testing-strategy.md). No se creó ADR porque M0.2 ratifica la dirección ya planificada y precisa sus gates; no revierte una decisión aceptada.
