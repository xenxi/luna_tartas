# Riesgos y decisiones abiertas

## Riesgos activos

| Riesgo | Impacto | Mitigación/gate | Estado |
| --- | --- | --- | --- |
| Huella pública incompleta y accesos históricos no aportados | pérdida de URLs y señales SEO | M0.1 inventarió las URLs conocidas; obtener Search Console, hosting, backlinks o confirmación explícita de ausencia antes de M9.2 | OPEN |
| Apex proxied por Cloudflare, `www` NXDOMAIN y configuración/acceso desconocidos | corte, canonicalización o HTTPS incorrectos | exportar zona/reglas/TTL y preparar rollback en M9.3; no cambiar DNS durante discovery | OPEN |
| Catálogo, fotos, copy y exports no entregados | páginas finales no publicables | M0.1 registra cada ausencia con owner; contrato de entradas en M0.3 y gate final en M9.1 | OPEN |
| Marca/licencias no confirmadas | retrabajo y riesgo legal | M3.1 no consolida assets sin aprobación | OPEN |
| Analytics/consentimiento sin decidir | medición o privacidad incorrecta | M7.1 selecciona Matomo On-Premise EEE, opt-in y estado desactivado; M7.2/M9.4 verifican instancia, política y habilitación | CONTROLLED — owner: titular de Luna Tartas |
| Pages tiene redirects HTTP por path limitados | migración SEO incompleta | Cloudflare cubre 301/308; si faltan acceso/capacidad o se requieren 410 reales, M9.2 sustituye Pages o añade edge explícito | OPEN — owner: propietario del negocio |
| Fotos originales pesadas en Git | repositorio lento a largo plazo | hard limits M0.2 (8 MiB/24 MP por raster; 100 MiB binarios) y archivo externo; checks en M2/M8 | CONTROLLED — owner: equipo técnico |
| Exposición accidental de secretos en repositorio público, historial, logs o `dist` | compromiso de cuentas/servicios | `.gitignore`, permisos mínimos y gates de repo/historial/workflows/artefacto en M8.5; logs remotos se reinspeccionan en M8.6/M9.3 | CONTROLLED — owner: equipo técnico |

## Decisiones abiertas no bloqueantes para arquitectura

- Proveedor y fuente de tipografía: resolver con identidad/licencias en M3.1.
- Preview por pull request: M1.4 sólo si su valor supera complejidad.

Los umbrales de M0.2 son gates iniciales, no `TBD`: M8.2 puede endurecerlos y sólo puede relajarlos con evidencia, owner y aceptación explícita.

## Decisiones cerradas en M0.2

| Decisión | Resultado | Consecuencia verificable | Estado |
| --- | --- | --- | --- |
| Framework/render | Astro estable 6.x, TypeScript estricto, SSG `output: static`, sin adapter/framework UI | build produce sólo artefacto estático | CLOSED |
| Runtime/package manager | Node `24.19.0` LTS + npm `11.17.0`, versiones/lockfile exactos y `npm ci` | local y CI comparten runtime y grafo | CLOSED |
| Hosting | GitHub Pages + workflow oficial; prueba técnica en M1.5 | Pages sigue salvo fallo del gate de redirects/acceso | CLOSED/CONDITIONAL |
| URLs | apex HTTPS, `www -> apex`, minúsculas, HTML con barra final y `build.format: directory` | route builder/canonical/sitemap deben coincidir | CLOSED |
| Redirects | Cloudflare Redirect Rules para HTTP 301/308; 410 sólo con edge/origin real; meta refresh no aceptado | cambio de hosting/capa obligatorio si la infraestructura no sirve el mapa | CLOSED/CONDITIONAL |
| Frontera pública | todo Git/log/artifact es público; Secrets sólo en Actions y nunca en `dist` | permisos mínimos, actions por SHA y scans | CLOSED |
| Assets/repositorio | raster <= 8 MiB/24 MP, SVG <= 250 KiB, binarios <= 100 MiB, sin LFS V1 | checks automáticos en M2/M8 | CLOSED |
| Compatibilidad | Baseline Widely Available con downstream, matriz de navegadores vigente, sin IE, core sin JS | smoke registrado en M8.3 | CLOSED |
| Accesibilidad/performance | WCAG 2.2 AA, CWV “good”, Lighthouse y budgets de transferencia/JS/CSS | gates medibles en `testing-strategy.md` | CLOSED |
| Dependencias | plataforma primero, necesidad actual, mantenimiento/licencia/seguridad/coste y pin exacto | toda dependencia nueva justifica y pasa suite | CLOSED |

## Bloqueos conocidos y propietarios

| Pendiente | Owner | Bloquea | Siguiente acción |
| --- | --- | --- | --- |
| Entradas de marca, catálogo, WhatsApp, identidad y derechos | Propietario del negocio | M0.3 y los gates de contenido indicados | completar contrato/readiness en M0.3 |
| Permisos de Actions/Pages y custom domain | Propietario GitHub `xenxi` | M1.4/M1.5 y M9.3; no M1.1 | confirmar rol admin y habilitación antes de esos gates |
| Acceso/export DNS y Redirect Rules de Cloudflare | Propietario del negocio | M9.2/M9.3; no scaffold M1 | identificar usuario con acceso y aportar export sanitizado |
| Histórico de URLs o confirmación explícita de ausencia | Propietario del negocio | M9.2 | aportar Search Console/hosting/backlinks o acta de ausencia |
| Política de privacidad y analytics | Propietario del negocio | M7.1/M9.4 | definir responsable y requisitos legales/consentimiento |

**Resultado para M1:** no queda un `TBD` técnico que impida diseñar el scaffold. M1.1 sólo espera la dependencia de roadmap M0.3; los permisos externos están asignados a owner y gate posterior.

El carácter público del repositorio está **CLOSED/CONFIRMED** como decisión: no habilita versionar credenciales. La implementación de sus controles permanece distribuida en M1.1, M1.4, M1.5 y M8.5.

## Evidencia de M0.1

El inventario fechado y sus límites viven en [`../discovery/current-state.md`](../discovery/current-state.md); el estado de cada URL conocida está en [`../seo/url-inventory.csv`](../seo/url-inventory.csv). La clasificación queda ratificada como **implementación greenfield con migración de contenido/SEO posible**. La ausencia de resultados públicos no cierra los riesgos: los `TBD` conservan propietario y siguiente acción hasta recibir fuentes privadas o confirmación explícita.

## Evidencia de M0.2

Las decisiones, alternativas, consecuencias y fuentes oficiales están en [`architecture.md`](architecture.md); el flujo Pages/DNS/rollback y owners están en [`deployment.md`](deployment.md); los presupuestos ejecutables están en [`../quality/testing-strategy.md`](../quality/testing-strategy.md). No se creó ADR porque M0.2 ratifica la dirección ya planificada y precisa sus gates; no revierte una decisión aceptada.
