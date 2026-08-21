# Build y despliegue

## Frontera pública

El repositorio GitHub es **público** y sirve la V1 productiva. El pipeline
contractual es:

```text
Public GitHub Repository -> GitHub Actions -> Astro Build -> GitHub Pages -> lunatartas.es
```

Todo archivo, commit, rama, log versionado y artefacto publicado debe considerarse accesible públicamente. Código, catálogo, precios, URLs, SEO, teléfono comercial e identificadores públicos de analytics pueden versionarse. Tokens, API keys, contraseñas, credenciales, claves privadas y `.env` con secretos no pueden entrar en Git ni en `dist`.

Cuando una integración requiera secretos, se usarán GitHub Actions Secrets con permisos mínimos, evitando su impresión en logs y su interpolación en HTML, JavaScript, source maps o assets. El build del catálogo público no debe depender de un secreto.

## Flujo objetivo

1. Pull request ejecuta instalación reproducible, lint, typecheck, tests y build.
2. Merge a `main` produce un artefacto estático único.
3. GitHub Actions despliega ese artefacto mediante el flujo oficial de GitHub Pages.
4. Pages sirve `lunatartas.es` con HTTPS; DNS y redirects externos se validan
   después de cada cambio que afecte esa superficie.

No se hace deploy desde el worktree ni se versiona `dist/`.

GitHub Pages sigue siendo la plataforma V1: M0.1 no encontró rutas históricas de contenido que hoy exijan cambiarla. El workflow de M1.5 usa el flujo oficial `configure-pages -> upload-pages-artifact -> deploy-pages`, con build y deploy separados por `needs`, environment `github-pages` y protección para que sólo `main` despliegue. Las actions están fijadas a SHA, el checkout comprueba que `HEAD` coincide con `GITHUB_SHA` y sólo el artefacto `github-pages` generado por ese job puede llegar al deploy.

## Configuración

- Node `24.19.0` LTS y npm `11.17.0` fijados; npm es el único package manager y CI instala con `npm ci`.
- Astro estable `6.x` exacto, dependencias exactas y `package-lock.json` versionados en M1.1.
- `.gitignore` mantenido desde bootstrap para dependencias, outputs, caches, tooling local y archivos `.env`; sólo se permite un ejemplo sin valores sensibles cuando aporte valor.
- `site` canónico `https://lunatartas.es`, `output: static`, `build.format: directory` y `trailingSlash: always`.
- `configure-pages` aporta el `base_path`: con el custom domain productivo es
  vacío; si se retira temporalmente, la misma build conserva soporte para la
  URL técnica `https://xenxi.github.io/luna_tartas/` sin cambiar el canonical.
- Con custom GitHub Actions, el dominio se configura en Settings/API de Pages; un archivo `CNAME` no es la fuente de verdad y no es requerido por ese flujo.
- Tokens sólo mediante permisos mínimos de GitHub Actions Secrets; el build público no necesita secretos para leer catálogo.
- Concurrencia de deploy evita carreras y conserva el último artefacto correcto.

## Preview y smoke técnico

V1 no necesita un backend de staging. Los pull requests sólo ejecutan CI y no publican una preview: `deploy.yml` despliega exclusivamente `refs/heads/main`, también cuando se lanza manualmente. Esto evita exponer builds no aprobados y mantiene un solo artefacto desplegable por run.

La URL primaria es `https://lunatartas.es/`; la URL técnica de Pages queda como
referencia de recuperación. El job de deploy toma la URL real de
`deploy-pages`, exige HTTP `200` y comprueba que la respuesta contiene el
`<main>` de la aplicación, con reintentos acotados para la propagación.

Pages está habilitado con **GitHub Actions** como fuente y el custom domain
`lunatartas.es`. El environment `github-pages` y el workflow restringen el
deploy a `main` y no necesitan secrets ni PAT. Cada evidencia de run conserva
URL, SHA desplegado, artifact, URL emitida y smoke; logs y artifact se revisan
sin copiar posibles coincidencias sensibles.

## DNS y redirects

El apex y `www` resuelven mediante Cloudflare. HTTP redirige a HTTPS, el apex
HTTPS sirve Pages y `www` responde `301` directo al apex HTTPS. El certificado
Pages y `https_enforced` quedaron aprobados en M9.3. Cloudflare aplica los seis
redirects `301` conocidos y el Worker responde `410` a las nueve rutas sin
equivalente; el mapa y la verificación están en
[`../seo/redirect-audit.md`](../seo/redirect-audit.md).

La responsabilidad se separa así:

- GitHub Pages publica el artefacto y puede canonicalizar apex/`www` cuando ambos DNS y el custom domain estén correctamente configurados.
- Cloudflare Redirect Rules/Bulk Redirects ejecuta 301/308 por path, sólo después de convertir el inventario M0.1 en mapa aprobado en M9.2. Un 410 requiere respuesta real del edge/origin y no se atribuye a Redirect Rules.
- Astro puede construir rutas y enlaces canónicos, pero sus redirects estáticos por meta refresh no sustituyen una respuesta HTTP 301 para SEO.

La configuración y el export previo se conservan fuera de Git bajo control del
propietario del negocio. Ante un cambio de routing se repite
`npm run verify:redirects -- --origin=https://lunatartas.es`; no se publican
páginas puente ni meta refresh como sustituto de respuestas HTTP.

## Rollback

El rollback de aplicación es un **revert hacia delante** en `main`: identificar el último run verde y su SHA, revertir únicamente los commits posteriores mediante PR, ejecutar CI y fusionar. El push resultante crea un commit público nuevo y `deploy.yml` vuelve a construir, escanear, desplegar y ejecutar el smoke; no se reescribe historia ni se reutiliza un artifact sin trazabilidad. Si el commit bueno todavía es compatible y su artifact no ha expirado, volver a ejecutar su run sirve sólo como recuperación inmediata; el revert sigue siendo el registro permanente.

Ensayo previo a producción:

1. Registrar el SHA y la URL del último run verde de `Deploy to GitHub Pages`.
2. Crear una rama desde `main`, ejecutar `git revert <sha-malo>` y abrir PR.
3. Exigir CI verde y revisar que el diff restaura exactamente el estado conocido.
4. Fusionar y comprobar que el nuevo run publica el SHA de revert, no el worktree local.
5. Verificar el smoke de la URL técnica y, si falla, pausar cambios y volver a evaluar el último SHA verde.

En M1.5 se reconstruyó y sirvió localmente un commit conocido bajo
`/luna_tartas/`, con smoke `200`, `<main>` y canonical apex. M9.3 dejó el último
SHA verde y su run listos para revert hacia delante; M9.6 repitió un cambio
editorial y su restauración local, documentados en
[`../operations/handover-dry-run.md`](../operations/handover-dry-run.md). El
export DNS/edge anterior se conserva fuera de Git. Ningún release elimina la
versión recuperable anterior sin confirmación.

## Gates

- CI verde con `lint`, `typecheck`, `test`, `build`.
- Catálogo publicado válido y sin fixtures.
- URLs/canonical/sitemap/robots/JSON-LD auditados.
- Presupuestos de rendimiento y accesibilidad aprobados.
- Presupuestos de transferencia, JS/CSS y assets de `testing-strategy.md` en PASS o excepción explícita con owner.
- Dominio, HTTPS, redirects, Analytics y Search Console verificados o explícitamente aceptados como pendientes no bloqueantes por negocio.
- Scan del repositorio, historial, logs y artefacto sin secretos ni credenciales.

## Permisos y responsables operativos

| Necesidad | Owner | Fecha límite/gate | Estado |
| --- | --- | --- | --- |
| Administrar Actions, environment y Pages del remoto | Propietario GitHub `xenxi` | M1.5 | `READY`: repositorio público con `main`, Pages habilitado con source `workflow` y primer deploy/smoke en PASS; environment `github-pages` creado por el flujo oficial |
| Mantener custom domain y HTTPS en GitHub | Propietario GitHub `xenxi` + propietario del negocio | operación | `READY`: custom domain y HTTPS verificados en M9.3 |
| Administrar DNS, redirects y Worker Cloudflare | Propietario del negocio | operación | `READY`: 301/410 y `www` verificados en M9.2/M9.3 |
| Custodiar export privado y recuperación | Propietario del negocio | antes de cada cambio edge/DNS | `READY`: rollback definido; no se versionan accesos ni export sensible |

La matriz completa de accesos mínimos y escalado está en
[`../operations/handover.md`](../operations/handover.md).
