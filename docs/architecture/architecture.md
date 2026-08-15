# Arquitectura objetivo

## Estado inicial observado (2026-08-15)

- `C:\lab\repos\luna_tartas` es un repositorio Git nuevo, vacío y público en `main`, con remoto `https://github.com/xenxi/luna_tartas.git`; el carácter público ha sido confirmado por el propietario.
- El remoto no anuncia ramas; no existe código ni historial recuperable desde ese origen.
- Existe otro repositorio local vacío sin remoto en `C:\Users\Usuario\Documents\ChatGPT\Luna tartas`; no es el repositorio canónico.
- `lunatartas.es` resuelve actualmente a direcciones de Cloudflare, pero HTTP/HTTPS no respondió durante el reconocimiento.
- `www.lunatartas.es` no resolvió y Wayback CDX no devolvió capturas.

Conclusión: implementación de código **greenfield** con posible migración de contenido/SEO. La falta de huella accesible no demuestra que nunca existieran URLs o datos; el release conserva un gate de inventario y redirects.

## Vista de contenedores

```text
src/content YAML + src/assets
          |
          v
Astro content source adapter (schema y carga)
          |
          v
Catalog/domain (modelo, relaciones, queries, errores)
          |
          +--> páginas Astro / HTML / JSON-LD
          +--> /catalog.json
          +--> builders de WhatsApp y analytics
          |
          v
Public GitHub Repository -> GitHub Actions -> Astro static build -> GitHub Pages -> lunatartas.es
```

## Capas

### Source

Lee y valida la forma editorial de YAML/medios. Astro Content Collections es la opción inicial por soporte nativo de contenido e imágenes, pero queda encapsulado en un adaptador. Los errores incluyen archivo, campo y causa.

### Catalog/domain

Tipos TypeScript planos y funciones puras: normalización, reglas agregadas, resolución de relaciones, queries, rutas y proyecciones públicas. No importa componentes Astro ni conoce cómo se editó el YAML.

### Presentation

Layouts, páginas y componentes Astro consumen modelos/proyecciones ya válidos. No leen YAML directamente, no reconstruyen relaciones y no duplican configuración global.

### Integraciones de build/cliente

- Build: generadores de rutas, sitemap, JSON-LD y `/catalog.json`.
- Cliente: sólo la mínima instrumentación para analytics/interacción; navegación y conversión funcionan sin hidratación.

## Estructura objetivo orientativa

```text
src/
  assets/catalog/
  content/{products,categories,occasions,recipients}/
  content.config.ts
  config/site.ts
  lib/
    catalog/{domain,source}/
    analytics/
    seo/
    whatsapp/
  components/
  layouts/
  pages/
public/
docs/
tests/
```

La estructura exacta se materializa en M1/M2; este mapa es un límite de responsabilidades, no una obligación de crear carpetas vacías.

## Decisiones importantes

### Astro + generación estática

- **Contexto:** catálogo público sin necesidad de datos dinámicos en runtime.
- **Decisión:** línea estable Astro 6, TypeScript estricto, `output: 'static'`, `build.format: 'directory'` y ningún adapter. Las APIs experimentales quedan desactivadas. M1.1 fijará la versión exacta estable `6.x` en `package.json` y lockfile después de comprobarla en el registro npm.
- **Alternativas:** SSR, SPA o framework hidratado.
- **Consecuencias:** HTML rápido y simple, sin servidor ni runtime de aplicación; toda publicación requiere build/deploy. Una necesidad futura de SSR exige una decisión nueva y no se resuelve añadiendo un adapter silenciosamente.

### Toolchain Node + npm

- **Contexto:** instalación local y CI deben producir el mismo grafo y Astro 6 requiere una versión par compatible de Node.
- **Decisión:** Node `24.19.0` LTS y npm `11.17.0`; npm es el único package manager. M1.1 materializa `.nvmrc`, `engines.node: ">=24.19.0 <25"`, `packageManager: "npm@11.17.0"`, dependencias exactas y `package-lock.json`; CI usa la versión exacta y `npm ci`.
- **Alternativas:** Node 22 LTS, Node 26 Current, pnpm o Yarn.
- **Consecuencias:** plataforma soportada y reproducible. Los cambios de Node/npm o de major Astro se hacen en PR explícita con suite completa; no se aceptan runtimes Current/EOL ni lockfiles múltiples.

### YAML como fuente editorial, dominio independiente

- **Contexto:** edición sencilla hoy y posible gestor/CMS mañana.
- **Decisión:** YAML versionado entra por un adaptador y se convierte a modelos de dominio.
- **Alternativas:** leer YAML desde componentes o usar una API/DB.
- **Consecuencias:** validación adicional, pero sustitución futura del source sin reescribir presentación.

### GitHub Pages como hosting inicial

- **Contexto:** sólo hay artefactos estáticos, el remoto público ya existe y M0.1 no descubrió rutas históricas de contenido que obliguen hoy a redirects HTTP por path.
- **Decisión:** se mantiene GitHub Pages mediante el workflow oficial de Pages y dominio apex. M1.5 debe demostrar URL técnica, permisos y rollback antes de tocar DNS.
- **Alternativas:** Cloudflare Pages, Netlify o Vercel.
- **Consecuencias:** coste y operación bajos. Pages resuelve la publicación estática y la canonicalización apex/`www` cuando ambos DNS estén configurados; no se considera capa suficiente para 301 históricos por path.

### URLs y capa de redirects

- **Contexto:** el contrato SEO exige minúsculas, slugs estables, barra final y redirects HTTP reales para cualquier señal histórica.
- **Decisión:** `site: 'https://lunatartas.es'`, `trailingSlash: 'always'` y salida por directorios para HTML. Los endpoints con extensión, como `/catalog.json`, conservan su forma. La canonicalización de host será `www -> apex`. Los redirects históricos 301/308 se implementarán en Cloudflare Redirect Rules/Bulk Redirects si M0.1/M9.2 confirman necesidad y acceso; un 410 requiere una respuesta edge/origin real y se verifica aparte. Los redirects estáticos de Astro basados en `<meta http-equiv="refresh">` no son válidos para migración SEO.
- **Alternativas:** redirects de Pages/Astro, páginas HTML sustitutas o cambiar de hosting.
- **Consecuencias:** rutas coherentes en filesystem, canonical y sitemap. Si Cloudflare no está disponible o no cubre el mapa requerido, Pages deja de cumplir el gate y se elige en M9.2 una plataforma con redirects HTTP antes de M9.3.

### Configuración y side effects en bordes

- **Contexto:** WhatsApp, analytics, URL base y SEO afectan muchas páginas.
- **Decisión:** configuración validada única y builders/adapters puros; componentes sólo emiten intentos declarativos.
- **Alternativas:** URLs/scripts hardcodeados en cada componente.
- **Consecuencias:** cambios de proveedor o teléfono localizados y testables.

### Repositorio público como frontera de seguridad

- **Contexto:** código, catálogo y despliegue viven en un repositorio GitHub público.
- **Decisión:** todo contenido versionado o generado para Pages se considera público; secretos sólo entran en integraciones mediante GitHub Actions Secrets y nunca en el artefacto.
- **Alternativas:** repositorio privado o credenciales dentro del cliente.
- **Consecuencias:** configuración pública explícita, `.gitignore` desde bootstrap, permisos `contents: read` por defecto y elevación sólo del job de deploy a `pages: write`/`id-token: write`, acciones fijadas a SHA, y scans de repositorio/historial/logs/artefacto. El futuro Catalog Manager necesitará un diseño de autenticación separado y no podrá contener credenciales privilegiadas en cliente.

### Política de imágenes y salud del repositorio

- **Contexto:** las fotos son el contenido visual principal, pero los originales de archivo no deben degradar Git ni llegar sin control al artefacto.
- **Decisión:** fotos web aprobadas en `src/assets/catalog`; marca en `src/assets/brand`; `public/` sólo para archivos que deban copiarse sin transformación. No Git LFS en V1. Un raster fuente falla si supera **8 MiB** o **24 megapíxeles**; SVG falla si supera **250 KiB**, contiene scripts o referencias externas. El conjunto de binarios versionados tiene aviso a **75 MiB** y límite duro de **100 MiB**. Masters/originales de archivo viven fuera del repo con propietario y referencia.
- **Alternativas:** guardar originales completos, Git LFS o CDN/DAM externo desde el inicio.
- **Consecuencias:** ingestión predecible y repo clonable; M2.2/M2.4 automatizan forma/dimensiones y M8.2 calibra formatos/salidas con muestras reales. Un caso que exceda límites requiere optimización o decisión documentada, no una excepción silenciosa.

### Soporte de navegadores y progressive enhancement

- **Contexto:** no existe aún analytics de audiencia que justifique navegadores heredados concretos.
- **Decisión:** objetivo de plataforma `baseline widely available with downstream`; sin soporte para Internet Explorer. QA cubre versión estable actual y anterior de Chrome, Edge, Firefox y Safari/iOS Safari, más Chrome Android estable. Contenido, navegación y ambos enlaces WhatsApp deben funcionar sin JavaScript; mejoras fuera de Baseline sólo pueden ser aditivas y tener fallback.
- **Alternativas:** lista de versiones mínima fija o soportar cualquier navegador heredado.
- **Consecuencias:** compatibilidad transversal verificable sin polyfills preventivos. M8.3 registra las versiones reales probadas y ajusta la matriz sólo con datos de audiencia.

### Criterios para nuevas dependencias

Una dependencia sólo entra si todas estas condiciones quedan demostradas en la tarea que la incorpora:

1. Astro, Node o la plataforma web no cubren el caso de forma mantenible.
2. Resuelve una necesidad actual del roadmap, con alternativa descartada y owner de mantenimiento.
3. Es compatible con Astro 6/Node 24, mantenida, ESM cuando aplique, con licencia compatible y sin vulnerabilidades high/critical explotables sin mitigación.
4. No introduce acceso runtime de red, telemetría, secretos, framework UI ni JavaScript cliente fuera de la necesidad aprobada.
5. Se fija a versión exacta, queda en el lockfile y pasa `npm ci`, lint, typecheck, tests y build.
6. Si llega al navegador, se registra su coste gzip y el route budget sigue en PASS; si sólo es de build/dev, se registra coste de mantenimiento y tiempo de CI cuando sea material.

Las actualizaciones automáticas pueden proponer cambios, pero ningún major se fusiona sin revisión de contrato y changelog.

## Objetivos iniciales de calidad

Los presupuestos ejecutables y su método de medida viven en [`../quality/testing-strategy.md`](../quality/testing-strategy.md). El contrato arquitectónico es WCAG 2.2 AA, Core Web Vitals en rango “good”, JS cliente mínimo y assets dimensionados. M8 puede endurecer los umbrales con medición estable; relajarlos exige evidencia, owner y aceptación explícita.

## Fuentes autoritativas consultadas en M0.2

- [Astro 6 estable](https://astro.build/blog/astro-6/) y [requisitos Node de Astro](https://docs.astro.build/en/tutorial/1-setup/1/).
- [Node 24.19.0 LTS y npm 11.17.0](https://nodejs.org/en/download/archive/v24.19.0) y [política de releases Node](https://nodejs.org/en/about/previous-releases).
- [Workflows oficiales de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) y [dominios personalizados](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages).
- [Códigos admitidos por Cloudflare Bulk Redirects](https://developers.cloudflare.com/rules/url-forwarding/bulk-redirects/reference/parameters/) y [respuesta 410 en Cloudflare](https://developers.cloudflare.com/support/troubleshooting/http-status-codes/4xx-client-error/error-410/).
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/), [Core Web Vitals](https://web.dev/articles/defining-core-web-vitals-thresholds) y [Baseline](https://web.dev/baseline/overview).

## Restricciones de dependencia

`presentation -> domain <- source`; domain no depende de Astro UI ni del proveedor analytics. Se permiten dependencias pequeñas y justificadas para schema/testing/build. Ninguna dependencia de runtime remota es necesaria para renderizar catálogo.
