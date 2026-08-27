# Revisión de seguridad M8.5

**Fecha:** 2026-08-17
**Superficie:** repositorio e historial Git, workflows/logs previsibles, lockfile, dependencias/licencias y artefacto estático de GitHub Pages.

## Resultado

No se encontraron credenciales en los archivos versionados, los 76 commits anteriores ni `dist`. El artefacto no contiene source maps, rutas editoriales, evidencia de derechos, aprobaciones internas ni campos de publicación. `catalog.json` conserva únicamente la proyección pública documentada. Los JSON-LD son JSON válido y su serializador escapa caracteres capaces de cerrar el elemento `script`.

`npm run verify:security` reproduce el scan offline, sólo informa ubicaciones ante una coincidencia (nunca el valor), exige las reglas sensibles de `.gitignore`, actions fijadas a SHA, permisos mínimos, checkout sin credenciales persistentes, destinos externos HTTPS aprobados y `noopener` al abrir un contexto nuevo. CI y deploy descargan el historial completo para que el gate no confunda un checkout superficial con una auditoría del historial.

## Dependencias, advisories y licencias

El lockfile contiene 539 paquetes, todas las dependencias directas están fijadas a versión exacta y cada entrada declara una licencia evaluada. Predominan MIT, Apache-2.0, ISC y BSD. Las entradas LGPL proceden de la cadena de binarios de imagen y sólo participan en build; no se distribuye una aplicación enlazada ni se añade una restricción incompatible al contenido del sitio. `npm run verify:dependencies` falla ante una licencia nueva/no evaluada, una versión directa no exacta, un advisory nuevo o una excepción ya desaparecida.

La consulta de `npm audit` del 2026-08-17 devuelve 0 critical y agrupa 2 high/1 low. Se evaluaron las cinco causas, sin declararlas inexistentes:

| Advisory | Severidad | Aplicabilidad y mitigación |
| --- | --- | --- |
| `GHSA-f88m-g3jw-g9cj` (`sharp`/libvips) | high | `sharp` sólo procesa durante el build imágenes versionadas y revisadas; no existe subida ni entrada de imagen de usuario/runtime. Astro 6 fija `sharp ^0.34`; la corrección disponible requiere Astro 7. |
| `GHSA-f48w-9m4c-m7f5` (Astro spread attributes) | moderate | El build no recibe nombres de atributo no confiables ni renderiza plantillas en runtime. El gate inspecciona el HTML estático resultante. |
| `GHSA-7pw4-f3q4-r2p2` y `GHSA-4g3v-8h47-v7g6` (View Transitions) | low/moderate | No se usan View Transitions, islands hidratadas ni router cliente. |
| `GHSA-g7r4-m6w7-qqqr` (`esbuild` dev server Windows) | low | Sólo desarrollo local confiable; CI ejecuta build, no publica el servidor de desarrollo. |

Por tanto hay **cero vulnerabilidades critical/high explotables sin mitigación** en la superficie desplegada. Forzar `astro@7.2.2`, `sharp@0.35` o `esbuild@0.28` fuera de los rangos de Astro 6 sería una migración major/override no demostrada y queda fuera de M8.5. Las excepciones se identifican por advisory, el gate falla ante cualquier advisory nuevo y M8.6 debe volver a ejecutar el audit; una entrada de medios no confiable o habilitar SSR invalida inmediatamente la mitigación de `sharp`.

## Workflows, logs y secretos

- Permiso por defecto: sólo `contents: read`.
- Elevación: exclusivamente el job `deploy`, con `pages: write` e `id-token: write`.
- No hay referencias a Actions Secrets ni secretos necesarios para construir; `persist-credentials: false` evita conservar el token de checkout en deploy.
- Todas las actions están fijadas a commit SHA. Los comandos no imprimen variables sensibles y el scanner sólo emite ruta/revisión y tipo de coincidencia.

## Headers y enlaces externos

GitHub Pages no permite configurar headers HTTP arbitrarios por repositorio. No se simulan `X-Frame-Options`, CSP o HSTS mediante archivos que Pages ignoraría. HTTPS/HSTS y cualquier política edge se verificarán sobre la respuesta real en M9.3; si se requiere una CSP HTTP estricta, deberá configurarse en la capa Cloudflare o cambiarse el hosting. El documento sí declara `Referrer-Policy` equivalente mediante `meta name="referrer"` con `strict-origin-when-cross-origin`, que los navegadores aplican a la navegación saliente.

Orígenes aprobados en el artefacto: canonical y assets de `lunatartas.es`, `wa.me`, perfil público de Instagram y firma `antoniomdm.dev`; además del email comercial explícito. Las páginas legales enlazan únicamente referencias oficiales en `www.aepd.es`, `www.boe.es` y `business.safety.google`. No hay HTTP, iframes, formularios, scripts externos ni source maps. El único `target="_blank"` es el CTA aprobado de WhatsApp y conserva `rel="noopener noreferrer"`.

## Superficie pública aprobada

Se consideran públicos y deliberados: catálogo publicado, precios, medios optimizados, nombre de marca, teléfono/email/Instagram comerciales, URLs canónicas y schema.org. Se excluyen y bloquean: drafts/fixtures, rutas locales, owners/evidencias de derechos, estados/aprobaciones editoriales, credenciales, datos de visitantes, query/hash de analytics y mapas de fuentes.

Limitación honesta: el gate local puede revisar el historial Git accesible y el artefacto generado, pero no puede leer logs remotos históricos desde este workspace. La ausencia de secretos en comandos/variables del workflow y el comportamiento redactado del scanner reducen la superficie; M8.6/M9.3 deben inspeccionar el run remoto y sus headers reales antes de release.
