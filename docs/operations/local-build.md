# Construcción local para escritorio y móvil

## Un único artefacto responsive

Luna Tartas no genera una aplicación de escritorio y otra móvil. Astro produce
un único sitio estático responsive en `dist/`; el navegador aplica la
presentación de escritorio o móvil según el viewport. Por tanto, no hay que
ejecutar dos builds ni mantener configuraciones distintas por dispositivo.

Los comandos de esta guía se ejecutan desde la raíz del repositorio. No hace
falta crear un `.env` ni definir secretos para construir el sitio.

## Preparación reproducible

En PowerShell:

```powershell
cd C:\lab\repos\luna_tartas
nvm use 24.19.0
npm install --global npm@11.17.0
npm ci
node --version
npm --version
```

Las dos últimas órdenes deben mostrar `v24.19.0` y `11.17.0`. `npm ci` instala
exactamente el contenido de `package-lock.json`; no debe sustituirse por otro
gestor de paquetes.

## Construir escritorio y móvil

Este único comando construye ambas presentaciones:

```powershell
dir```

El resultado queda en `dist/`. Para servir exactamente ese artefacto en local:

```powershell
npm run preview
```

Astro muestra la URL local, normalmente `http://localhost:4321/`. Esa misma
URL sirve la presentación de escritorio y la móvil. Para revisar cada una,
abre la URL en el navegador y cambia el viewport con sus herramientas de
desarrollo; los anchos representativos del contrato actual son 320, 375, 768,
1024 y 1440 px. Detén la preview con `Ctrl+C`.

Tras el build, ejecuta el gate responsive del artefacto:

```powershell
npm run verify:responsive
```

Este gate comprueba requisitos técnicos comunes a móvil y escritorio, pero no
sustituye la revisión visual manual en los viewports anteriores.

## Configuración que consume el build

El build resuelve la configuración mediante estas fuentes:

- `src/config/site.ts`: URL canónica, locale, marca, perfiles públicos y
  analítica. Son valores públicos, versionados y validados al construir.
- `src/content/`: fuente editorial YAML del catálogo. No se pasa el catálogo
  mediante variables de entorno.
- `astro.config.mjs`: salida estática, formato de directorios, barra final y
  URL canónica.
- `import.meta.env.BASE_URL`: valor integrado por Astro a partir de su opción
  `base`; los componentes lo usan para que enlaces y assets funcionen bajo un
  subdirectorio.

El build productivo de `https://lunatartas.es/` usa la raíz `/`, por lo que el
comando ordinario `npm run build` ya recoge toda la configuración necesaria.
No hay variables `PUBLIC_*`, tokens ni credenciales requeridos.

## Reproducir el build con base path de GitHub Pages

El workflow obtiene el base path de `actions/configure-pages`. Para reproducir
localmente el caso de la URL técnica
`https://xenxi.github.io/luna_tartas/`, ejecuta en una sesión de PowerShell:

```powershell
cd C:\lab\repos\luna_tartas
$env:PAGES_BASE_PATH = '/luna_tartas'
npm run build -- --base $env:PAGES_BASE_PATH
npm run verify:links
npm run verify:performance
Remove-Item Env:PAGES_BASE_PATH
```

`PAGES_BASE_PATH` informa a los verificadores y el argumento `--base` informa
a Astro. Ambos deben tener el mismo valor. Este comando sigue generando un
solo artefacto responsive para escritorio y móvil.

Para volver al build productivo del dominio propio después de esta prueba:

```powershell
npm run build
```

## Variables auxiliares

Estas variables existen para herramientas concretas, pero no son configuración
obligatoria del build ordinario:

| Variable                   | Uso                                                                                                  |
| -------------------------- | ---------------------------------------------------------------------------------------------------- |
| `PAGES_BASE_PATH`          | Base de despliegue que consumen los verificadores de enlaces, rendimiento y artefacto.               |
| `ASTRO_BASE_PATH`          | Alternativa de `verify:performance` para indicar la base; el workflow oficial usa `PAGES_BASE_PATH`. |
| `DIST_DIR`                 | Permite que verificadores y el manifiesto inspeccionen otro directorio en vez de `dist/`.            |
| `ASTRO_TELEMETRY_DISABLED` | Desactiva telemetría durante comprobaciones reproducibles; no cambia el contenido funcional.         |

No guardes secretos en estas variables ni en archivos `.env`: el repositorio y
el artefacto son públicos, y el build del catálogo no necesita secretos.

## Comprobación del build antes de entregar

Con las dependencias ya instaladas, ejecuta esta secuencia en PowerShell. Cada
paso se inicia solamente si el anterior ha terminado correctamente:

```powershell
npm run lint; if ($?) { npm run format }; if ($?) { npm run typecheck }; if ($?) { npm test }; if ($?) { npm run build }; if ($?) { npm run verify:artifact }; if ($?) { npm run verify:responsive }
```
