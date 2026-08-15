# Luna Tartas

Sitio estático Astro para Luna Estudio. El proyecto usa TypeScript estricto y genera HTML estático para GitHub Pages.

## Requisitos

- Node `24.19.0`.
- npm `11.17.0`.

La versión de Node está indicada en `.nvmrc`. npm es el único gestor soportado y el repositorio público no contiene secretos ni archivos `.env`.

## Desarrollo

```text
npm ci
npm run dev
```

## Checks actuales

```text
npm run lint
npm run format
npm run typecheck
npm test
npm run build
```

El contenido editorial todavía no forma parte de este scaffold; su contrato está en `docs/product/content-readiness.md`.

## Configuración de build

- Salida: `static`.
- Formato: directorios con barra final.
- URL canónica: `https://lunatartas.es`.
- Sin framework UI ni JavaScript cliente en esta etapa.
