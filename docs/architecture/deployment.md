# Build y despliegue

## Frontera pública

El repositorio GitHub es nuevo, vacío y **público**. El pipeline contractual es:

```text
Public GitHub Repository -> GitHub Actions -> Astro Build -> GitHub Pages -> lunatartas.es
```

Todo archivo, commit, rama, log versionado y artefacto publicado debe considerarse accesible públicamente. Código, catálogo, precios, URLs, SEO, teléfono comercial e identificadores públicos de analytics pueden versionarse. Tokens, API keys, contraseñas, credenciales, claves privadas y `.env` con secretos no pueden entrar en Git ni en `dist`.

Cuando una integración requiera secretos, se usarán GitHub Actions Secrets con permisos mínimos, evitando su impresión en logs y su interpolación en HTML, JavaScript, source maps o assets. El build del catálogo público no debe depender de un secreto.

## Flujo objetivo

1. Pull request ejecuta instalación reproducible, lint, typecheck, tests y build.
2. Merge a `main` produce un artefacto estático único.
3. GitHub Actions despliega ese artefacto mediante el flujo oficial de GitHub Pages.
4. Pages sirve `lunatartas.es` con HTTPS; DNS y redirects externos se validan antes del corte.

No se hace deploy desde el worktree ni se versiona `dist/`.

GitHub Pages sigue siendo la plataforma V1: M0.1 no encontró rutas históricas de contenido que hoy exijan cambiarla. El workflow de M1.5 usa el flujo oficial `configure-pages -> upload-pages-artifact -> deploy-pages`, con build y deploy separados por `needs`, environment `github-pages` y protección para que sólo `main` despliegue. Las actions están fijadas a SHA, el checkout comprueba que `HEAD` coincide con `GITHUB_SHA` y sólo el artefacto `github-pages` generado por ese job puede llegar al deploy.

## Configuración

- Node `24.19.0` LTS y npm `11.17.0` fijados; npm es el único package manager y CI instala con `npm ci`.
- Astro estable `6.x` exacto, dependencias exactas y `package-lock.json` versionados en M1.1.
- `.gitignore` mantenido desde bootstrap para dependencias, outputs, caches, tooling local y archivos `.env`; sólo se permite un ejemplo sin valores sensibles cuando aporte valor.
- `site` canónico `https://lunatartas.es`, `output: static`, `build.format: directory` y `trailingSlash: always`.
- Mientras no haya custom domain, el build de Actions pasa a Astro el `base_path` calculado por `configure-pages`; así la URL técnica `https://xenxi.github.io/luna_tartas/` funciona sin cambiar `site` ni anticipar el corte DNS. Cuando Pages exponga base vacía para el dominio configurado, el mismo workflow construirá sin override.
- Con custom GitHub Actions, el dominio se configura en Settings/API de Pages; un archivo `CNAME` no es la fuente de verdad y no es requerido por ese flujo.
- Tokens sólo mediante permisos mínimos de GitHub Actions Secrets; el build público no necesita secretos para leer catálogo.
- Concurrencia de deploy evita carreras y conserva el último artefacto correcto.

## Preview y smoke técnico

V1 no necesita un backend de staging. Los pull requests sólo ejecutan CI y no publican una preview: `deploy.yml` despliega exclusivamente `refs/heads/main`, también cuando se lanza manualmente. Esto evita exponer builds no aprobados y mantiene un solo artefacto desplegable por run.

Antes del cambio DNS, la preview operativa es la URL técnica `https://xenxi.github.io/luna_tartas/`. El job de deploy toma la URL real de `deploy-pages`, exige HTTP `200` y comprueba que la respuesta contiene el `<main>` de la aplicación, con reintentos acotados para la propagación de Pages. Este smoke no consulta `lunatartas.es`, por lo que no corta ni altera el servicio actual.

Para habilitarlo por primera vez, el propietario `xenxi` debe seleccionar **GitHub Actions** como fuente en `Settings -> Pages`. El environment `github-pages` puede protegerse para permitir sólo `main`; el workflow ya aplica esa restricción y no necesita secrets ni un PAT. La evidencia del primer run debe conservar URL del run, SHA desplegado, artifact `github-pages`, URL emitida y resultado del smoke. Logs y artifact se revisan sin copiar posibles coincidencias sensibles a la salida.

## DNS y redirects

Actualmente el apex resuelve a Cloudflare y `www` es NXDOMAIN. Propiedad, proxy, reglas y acceso son `TBD` del propietario del negocio. Antes del release se documentan registros actuales, TTL, rollback y destino canónico.

La responsabilidad se separa así:

- GitHub Pages publica el artefacto y puede canonicalizar apex/`www` cuando ambos DNS y el custom domain estén correctamente configurados.
- Cloudflare Redirect Rules/Bulk Redirects ejecuta 301/308 por path, sólo después de convertir el inventario M0.1 en mapa aprobado en M9.2. Un 410 requiere respuesta real del edge/origin y no se atribuye a Redirect Rules.
- Astro puede construir rutas y enlaces canónicos, pero sus redirects estáticos por meta refresh no sustituyen una respuesta HTTP 301 para SEO.

**Criterio de salida:** si no hay acceso operativo a Cloudflare, sus reglas no cubren el mapa real o se necesitan 410 que la capa disponible no puede emitir, M9.2 debe sustituir Pages o añadir una capa edge explícita con respuestas HTTP verificables antes de cambiar DNS. No se publican páginas puente como solución silenciosa.

## Rollback

El rollback de aplicación es un **revert hacia delante** en `main`: identificar el último run verde y su SHA, revertir únicamente los commits posteriores mediante PR, ejecutar CI y fusionar. El push resultante crea un commit público nuevo y `deploy.yml` vuelve a construir, escanear, desplegar y ejecutar el smoke; no se reescribe historia ni se reutiliza un artifact sin trazabilidad. Si el commit bueno todavía es compatible y su artifact no ha expirado, volver a ejecutar su run sirve sólo como recuperación inmediata; el revert sigue siendo el registro permanente.

Ensayo previo a producción:

1. Registrar el SHA y la URL del último run verde de `Deploy to GitHub Pages`.
2. Crear una rama desde `main`, ejecutar `git revert <sha-malo>` y abrir PR.
3. Exigir CI verde y revisar que el diff restaura exactamente el estado conocido.
4. Fusionar y comprobar que el nuevo run publica el SHA de revert, no el worktree local.
5. Verificar el smoke de la URL técnica y, si falla, pausar cambios y volver a evaluar el último SHA verde.

En M1.5 el ensayo local valida la reconstrucción desde un commit conocido y la forma del artifact. El ensayo remoto completo requiere un primer run de Pages y permisos administrativos; si faltan, la milestone queda `BLOCKED` con `xenxi` como owner y no se simula un PASS. El corte DNS conserva export de zona, valores anteriores, TTL y ventana/owner de reversión. Las reglas Cloudflare se exportan antes de modificarse. Ningún release elimina la versión recuperable anterior sin confirmación.

## Gates

- CI verde con `lint`, `typecheck`, `test`, `build`.
- Catálogo publicado válido y sin fixtures.
- URLs/canonical/sitemap/robots/JSON-LD auditados.
- Presupuestos de rendimiento y accesibilidad aprobados.
- Presupuestos de transferencia, JS/CSS y assets de `testing-strategy.md` en PASS o excepción explícita con owner.
- Dominio, HTTPS, redirects, Analytics y Search Console verificados o explícitamente aceptados como pendientes no bloqueantes por negocio.
- Scan del repositorio, historial, logs y artefacto sin secretos ni credenciales.

## Permisos y responsables pendientes

| Necesidad | Owner | Fecha límite/gate | Estado |
| --- | --- | --- | --- |
| Administrar Actions, environment y Pages del remoto | Propietario GitHub `xenxi` | M1.5 | `BLOCKED`: remoto sin refs y credencial local de GitHub inválida; falta publicar `main`, seleccionar GitHub Actions como source y obtener el primer run/smoke |
| Verificar custom domain en GitHub | Propietario GitHub `xenxi` + propietario del negocio | antes de M9.3 | `TBD` |
| Exportar/administrar DNS y redirects Cloudflare | Propietario del negocio | antes de M9.2/M9.3 | `TBD` |
| Exportar configuración anterior para rollback | Propietario del negocio | antes de M9.3 | `TBD` |
