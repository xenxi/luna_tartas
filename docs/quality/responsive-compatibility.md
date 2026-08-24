# Auditoria responsive y compatibilidad M8.3

Fecha: 2026-08-17

## Contrato ejecutable

`npm run verify:responsive` inspecciona todo el HTML de `dist`. Comprueba el
viewport que permite zoom, `main`, JavaScript cliente limitado a analítica y a
la galería ampliable de producto, enlaces no vacíos, dimensiones y `alt` de las
imágenes. También comprueba en el CSS
compilado `prefers-reduced-motion`, `min-width: 0`, limites de medios y targets
interactivos de 44 px.

Esto es un gate de regresion del artefacto, no una afirmacion de que un parser
reemplaza la inspeccion de layout en navegador.

## Matriz ejecutada

| Navegador                          | Version                  | Viewports                       | Orientacion                  | Pointer/touch           | No-JS     | Reduced motion |
| ---------------------------------- | ------------------------ | ------------------------------- | ---------------------------- | ----------------------- | --------- | -------------- |
| Chrome estable                     | 139.0.7258.67            | 320, 375, 768, 1024, 1440 x 900 | vertical y horizontal en 375 | mouse y emulacion touch | PASS      | PASS           |
| Edge estable                       | 140.0.3485.54            | 320, 375, 768, 1024, 1440 x 900 | vertical                     | mouse                   | PASS      | PASS           |
| Firefox estable/anterior           | no instalado             | no ejecutado                    | no ejecutado                 | no ejecutado            | pendiente | pendiente      |
| Safari/iOS Safari estable/anterior | no disponible en Windows | no ejecutado                    | no ejecutado                 | no ejecutado            | pendiente | pendiente      |
| Chrome Android estable             | no dispositivo/emulador  | no ejecutado                    | no ejecutado                 | pendiente               | pendiente | pendiente      |

La matriz registra las versiones disponibles en la maquina y no inventa
resultados de plataformas no disponibles. El target de implementacion sigue
siendo Baseline widely available con downstream; no se añade un polyfill ni
una feature nueva para cerrar una fila no ejecutable.

## Resultado visual

- 320 px: composicion lineal propia, titulo, fotografia, copy y CTAs legibles;
  sin overflow horizontal ni solapamiento.
- 375 px: misma composicion movil con espacio tactil y medios estables;
  reduced-motion deja ornamentos estaticos.
- 768 px: cambio a composicion de escritorio sin cambiar el orden semantico;
  navegacion desktop visible y Footer en columnas legibles.
- 1024 px: columnas, fotografia, Footer y firma conservan gutter y medida de
  lectura.
- 1440 x 900 px: expansion editorial contenida, sin estirar copy ni desbordar
  medios; firma del Footer secundaria y legible.
- Horizontal en 375 px: sin overflow del documento; el contenido se mantiene
  en el viewport y la orientacion no introduce un control dependiente de hover.

## Verificacion reproducible

`npm ci`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`,
`npm run verify:responsive` y `git diff --check`: PASS.

Capturas de Home para 320, 768 y 1440 px: `docs/quality/evidence/m8-3-responsive/`.

M8.6 completó las tres corridas móviles de Lighthouse y la revisión visual
final; resultados y capturas quedan en `docs/quality/release-candidate.md`.
