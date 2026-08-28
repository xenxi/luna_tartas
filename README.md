# Luna Tartas

Sitio estático Astro para Luna Estudio. El proyecto usa TypeScript estricto y genera HTML estático para GitHub Pages.

## Requisitos

- Node `24.19.0`, indicado en `.nvmrc`.
- npm `11.17.0`.
- Git.

npm es el único gestor soportado. El repositorio es público: no guardes tokens, credenciales ni archivos `.env` con secretos.

## Instalación

Clona el repositorio y entra en su directorio:

```bash
git clone <url-del-repositorio>
cd luna_tartas
```

Instala exactamente las dependencias del lockfile:

```bash
npm ci
```

Si utilizas un gestor de versiones de Node, selecciona la versión de `.nvmrc` antes de instalar:

```bash
nvm use
```

## Desarrollo local

Inicia el servidor de desarrollo:

```bash
npm run dev
```

Astro mostrará la URL local, normalmente `http://localhost:4321`. El servidor recarga los cambios automáticamente.

Para detenerlo, usa `Ctrl+C`.

## Comprobar el proyecto

Ejecuta la suite contractual completa antes de abrir una pull request:

```bash
npm run lint
npm run format
npm run typecheck
npm test
npm run build
```

También puede ejecutarse como una única secuencia en PowerShell:

```powershell
npm run lint; if ($?) { npm run format }; if ($?) { npm run typecheck }; if ($?) { npm test }; if ($?) { npm run build }
```

Qué comprueba cada comando:

- `npm run lint`: reglas de ESLint para `src`, `tests` y la configuración de Astro.
- `npm run format`: verifica el formato con Prettier; no modifica archivos.
- `npm run typecheck`: comprueba Astro y TypeScript.
- `npm test`: ejecuta los tests de Vitest una vez, sin modo interactivo.
- `npm run build`: valida el catálogo y genera el sitio estático en `dist/`.

## Build y preview

Genera una build de producción:

```bash
npm run build
```

Sirve localmente la build generada:

```bash
npm run preview
```

La preview permite comprobar el resultado final después de `npm run build`. La carpeta `dist/` es un artefacto local y no se versiona.

Astro genera un único artefacto responsive para escritorio y móvil. La guía
reproducible, incluidos el origen de la configuración, las variables auxiliares
y el build con base path de GitHub Pages, está en
[`docs/operations/local-build.md`](docs/operations/local-build.md).

## Estructura principal

- `src/content/`: contenido editorial y catálogo publicado.
- `src/lib/catalog/`: adaptador source, dominio, validación, queries y rutas.
- `src/components/`: componentes Astro de interfaz y catálogo.
- `src/config/`: configuración global validada.
- `src/pages/`: rutas públicas.
- `tests/`: tests unitarios, de integración y fixtures no publicables.
- `docs/`: contratos autoritativos de producto, arquitectura, calidad y despliegue.
- `.github/workflows/`: CI de pull requests y despliegue a GitHub Pages.

El flujo de datos es `YAML -> source adapter -> catalog/domain -> presentation -> HTML`. Los componentes no deben contener catálogo hardcodeado.

## Despliegue

- Cada pull request ejecuta `npm ci`, lint, typecheck, tests y build mediante CI.
- Sólo `main` despliega mediante el workflow oficial de GitHub Pages.
- No se hace deploy manual desde el worktree ni se versiona `dist/`.
- La URL técnica y el procedimiento de rollback están documentados en [`docs/architecture/deployment.md`](docs/architecture/deployment.md).

## Operación y handover

- [`docs/operations/local-build.md`](docs/operations/local-build.md): build
  local reproducible para escritorio y móvil, configuración y variables.
- [`docs/operations/handover.md`](docs/operations/handover.md): flujo de cambio,
  deploy, rollback, checks productivos y matriz de accesos/owners sin secretos.
- [`docs/operations/editorial-guide.md`](docs/operations/editorial-guide.md):
  edición de YAML, precios, relaciones, imágenes, aprobación y validación.
- [`docs/operations/accepted-debt.md`](docs/operations/accepted-debt.md): deuda
  V1 aceptada, prioridad, owner y condición de salida.
- [`docs/operations/launch-log.md`](docs/operations/launch-log.md): baseline e
  incidencias de la ventana de estabilización.

## Configuración actual

- Salida: `static`.
- Formato: directorios con barra final.
- URL canónica: `https://lunatartas.es`.
- Sin framework UI ni JavaScript cliente innecesario.
- El catálogo V1 aprobado está cargado; su readiness y evidencia están en
  [`docs/product/content-readiness.md`](docs/product/content-readiness.md) y
  [`docs/product/m9-1-content-release.md`](docs/product/m9-1-content-release.md).
