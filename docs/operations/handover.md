# Handover operativo V1

## Estado y fuentes de verdad

Luna Tartas V1 está publicada en `https://lunatartas.es/` como sitio Astro
estático. Este documento es la entrada operativa. El estado y la evidencia de
V1 se conservan en `docs/archive/v1-roadmap.md`. Los contratos detallados siguen en:

- build local para escritorio y móvil: [`local-build.md`](local-build.md);
- edición de catálogo: [`editorial-guide.md`](editorial-guide.md);
- build, deploy y rollback: [`../architecture/deployment.md`](../architecture/deployment.md);
- analytics y privacidad: [`../conversion/analytics-runbook.md`](../conversion/analytics-runbook.md);
- SEO y redirects: [`../seo/technical-audit.md`](../seo/technical-audit.md) y
  [`../seo/redirect-audit.md`](../seo/redirect-audit.md);
- incidentes y baseline: [`launch-log.md`](launch-log.md);
- dry run de edición/restauración: [`handover-dry-run.md`](handover-dry-run.md);
- deuda aceptada: [`accepted-debt.md`](accepted-debt.md).

El repositorio, las ramas, los commits, los logs de Actions y el artefacto son
públicos. No se copian aquí contraseñas, códigos de recuperación, tokens, IDs
de sesión, IP, payloads de visitantes ni enlaces privados.

## Flujo normal de un cambio

1. Partir de `main` actualizado y crear una rama. No editar `dist/`.
2. Aplicar el cambio en su fuente (`src/content/`, `src/assets/`, configuración
   o código) y revisar el diff para evitar contenido o datos no aprobados.
3. Ejecutar la suite local indicada en README. Un cambio editorial debe pasar,
   como mínimo, build, catálogo, assets, enlaces, SEO y superficie pública.
4. Abrir pull request. CI debe quedar verde antes de fusionar.
5. Fusionar en `main`. `Deploy to GitHub Pages` construye un artefacto nuevo,
   lo publica y ejecuta su smoke; no hay deploy manual desde el equipo local.
6. Confirmar el SHA del run, `https://lunatartas.es/` con HTTP 200 y las rutas
   afectadas. Si cambia una URL, comprobar además el redirect real.

Comandos editoriales reproducibles después de `npm ci`:

```bash
npm run lint
npm run format
npm run typecheck
npm test
npm run build
npm run verify:catalog
npm run verify:assets
npm run verify:links
npm run verify:seo
npm run verify:artifact
npm run verify:security
```

No se fusiona con un check en FAIL. Los checks remotos contra producción se
ejecutan sólo después del deploy y no sustituyen la suite local.

## Deploy y recuperación

Un push fusionado a `main` es el único disparador ordinario. El workflow usa el
environment `github-pages`, permisos mínimos y actions fijadas a SHA. Se debe
conservar en el registro del cambio: PR, SHA fusionado, URL del run y resultado
del smoke, sin copiar datos sensibles de los logs.

Ante una regresión de aplicación:

1. pausar nuevos merges y registrar el síntoma, ruta y primer SHA afectado;
2. identificar el último SHA con CI, deploy y smoke verdes;
3. crear una rama desde `main` y revertir hacia delante sólo el commit o los
   commits causantes mediante `git revert`;
4. abrir PR, exigir CI verde y comprobar que el diff restaura el estado bueno;
5. fusionar y verificar el nuevo run y el smoke productivo.

No se reescribe el historial de `main`, no se fuerza push y no se publica una
carpeta `dist/` local. Reejecutar un artefacto previo sirve únicamente como
recuperación inmediata si aún está disponible; el revert en un commit nuevo es
el registro permanente.

Si el incidente está en DNS o redirects, no se cambia el código para ocultarlo:
el owner de Cloudflare restaura el export privado anterior o desactiva la regla
o ruta Worker afectada, y después repite el smoke HTTP y
`npm run verify:redirects -- --origin=https://lunatartas.es`.

## Checks de producción

Después de cada deploy:

- home, `/productos/`, una ficha afectada, `/sitemap.xml` y `/robots.txt`
  responden 200 por HTTPS;
- `http://lunatartas.es/` y `https://www.lunatartas.es/` llegan al apex HTTPS
  sin cadena adicional;
- `npm run verify:redirects -- --origin=https://lunatartas.es` pasa si se
  tocó routing, DNS o edge;
- el CTA WhatsApp abre un `wa.me` con producto y canonical correctos, sin
  completar ni registrar conversaciones;
- en una sesión limpia, GA4 no carga sin consentimiento ni tras rechazo; tras
  opt-in se comprueban una sola vez `page_view`, `view_item` y, al usar el CTA,
  `contact_whatsapp`, sin PII propia; la retirada detiene eventos posteriores;
- Search Console mantiene accesible la propiedad, procesa
  `https://lunatartas.es/sitemap.xml` y la inspección en vivo de una ruta
  cambiada indica que es accesible/indexable. Solicitar indexación no garantiza
  indexación inmediata.

La guía de analytics define el payload permitido y qué evidencia puede
registrarse. Ante PII o duplicación, bloquear el release y revertir o volver a
deshabilitar analytics mediante un cambio revisado.

## Matriz de ownership y acceso

Los nombres indican responsabilidad, no credenciales. El inventario privado de
usuarios, MFA y recuperación debe permanecer en el gestor seguro del owner.

| Superficie | Owner operativo | Acceso mínimo para mantener | Recuperación / escalado | Regla pública |
| --- | --- | --- | --- | --- |
| Repositorio, PR y Actions | Propietario GitHub `xenxi` | escritura para cambios; admin sólo para settings | otro admin verificado y recuperación de cuenta GitHub | no versionar PAT, token ni códigos MFA |
| GitHub Pages y environment `github-pages` | Propietario GitHub `xenxi` | admin de Pages/environment | último SHA verde + workflow oficial | no descargar/publicar artifacts fuera del flujo |
| Dominio, DNS, Bulk Redirects y Worker | Propietario del negocio / Cloudflare | rol mínimo sobre la zona y reglas | export privado previo, segundo administrador y acceso al registrador | versionar sólo mapas/config sin tokens ni IDs privados |
| Google Search Console | Titular de Luna Tartas | propietario o usuario con lectura/inspección | segundo propietario verificado | registrar sólo estados y conteos agregados |
| Google Analytics 4 | Titular de Luna Tartas | analista para revisar; editor/admin sólo para configurar | segundo admin y recuperación de cuenta Google | Measurement ID público permitido; nunca client IDs, IP ni payloads de usuario |
| Contenido, precios, derechos y marca | Luna / propietario del negocio | aprobación editorial trazable | retirar publicación o revertir el cambio | publicar sólo contenido aprobado y derechos evidenciados |
| Operación técnica y dependencias | Mantenedor técnico | rama/PR y lectura de runs | escalar al owner de la superficie afectada | ningún secreto es necesario para build local |

Revisar trimestralmente que haya al menos dos vías de recuperación para las
cuentas críticas, sin escribir su detalle en Git.

## Triage

Un HTTP 5xx sostenido, certificado inválido, canonical/sitemap ausente,
redirect en loop, CTA roto, exposición de secreto o evento con PII es crítico:
pausar deploys, asignar owner y ejecutar rollback. Un fallo editorial sin riesgo
de conversión o seguridad se corrige por PR normal. La deuda no bloqueante no
se convierte automáticamente en una feature; su prioridad está registrada en
`accepted-debt.md` y cualquier trabajo post-V1 exige una tarea y prioridad
explícitas.
