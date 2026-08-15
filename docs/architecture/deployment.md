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

GitHub Pages sigue siendo la plataforma V1: M0.1 no encontró rutas históricas de contenido que hoy exijan cambiarla. M1.5 debe usar el flujo oficial `configure-pages -> upload-pages-artifact -> deploy-pages`, con build y deploy separados por `needs`, environment `github-pages` y protección para que sólo `main` despliegue. Las actions se fijan a SHA en la implementación aunque aquí se nombren por producto.

## Configuración

- Node `24.19.0` LTS y npm `11.17.0` fijados; npm es el único package manager y CI instala con `npm ci`.
- Astro estable `6.x` exacto, dependencias exactas y `package-lock.json` versionados en M1.1.
- `.gitignore` mantenido desde bootstrap para dependencias, outputs, caches, tooling local y archivos `.env`; sólo se permite un ejemplo sin valores sensibles cuando aporte valor.
- `site` canónico `https://lunatartas.es`, `output: static`, `build.format: directory` y `trailingSlash: always`.
- Con custom GitHub Actions, el dominio se configura en Settings/API de Pages; un archivo `CNAME` no es la fuente de verdad y no es requerido por ese flujo.
- Tokens sólo mediante permisos mínimos de GitHub Actions Secrets; el build público no necesita secretos para leer catálogo.
- Concurrencia de deploy evita carreras y conserva el último artefacto correcto.

## Entornos

V1 no necesita un backend de staging. PR checks verifican el artefacto; un mecanismo de preview sólo se añadirá si aporta valor y no complica Pages. La validación final puede usar la URL técnica de Pages antes del cambio de dominio, según capacidades reales confirmadas en M1.4/M9.

## DNS y redirects

Actualmente el apex resuelve a Cloudflare y `www` es NXDOMAIN. Propiedad, proxy, reglas y acceso son `TBD` del propietario del negocio. Antes del release se documentan registros actuales, TTL, rollback y destino canónico.

La responsabilidad se separa así:

- GitHub Pages publica el artefacto y puede canonicalizar apex/`www` cuando ambos DNS y el custom domain estén correctamente configurados.
- Cloudflare Redirect Rules/Bulk Redirects ejecuta 301/308 por path, sólo después de convertir el inventario M0.1 en mapa aprobado en M9.2. Un 410 requiere respuesta real del edge/origin y no se atribuye a Redirect Rules.
- Astro puede construir rutas y enlaces canónicos, pero sus redirects estáticos por meta refresh no sustituyen una respuesta HTTP 301 para SEO.

**Criterio de salida:** si no hay acceso operativo a Cloudflare, sus reglas no cubren el mapa real o se necesitan 410 que la capa disponible no puede emitir, M9.2 debe sustituir Pages o añadir una capa edge explícita con respuestas HTTP verificables antes de cambiar DNS. No se publican páginas puente como solución silenciosa.

## Rollback

El rollback de aplicación es redesplegar el último commit/artefacto verificado. El corte DNS conserva export de zona, valores anteriores, TTL y ventana/owner de reversión. Las reglas Cloudflare se exportan antes de modificarse. Ningún release elimina la versión recuperable anterior sin confirmación.

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
| Administrar Actions, environment y Pages del remoto | Propietario GitHub `xenxi` | antes de M1.4/M1.5 | `TBD`; no bloquea M1.1 |
| Verificar custom domain en GitHub | Propietario GitHub `xenxi` + propietario del negocio | antes de M9.3 | `TBD` |
| Exportar/administrar DNS y redirects Cloudflare | Propietario del negocio | antes de M9.2/M9.3 | `TBD` |
| Exportar configuración anterior para rollback | Propietario del negocio | antes de M9.3 | `TBD` |
