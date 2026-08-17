# Sistema decorativo Luna — M8.9.2

## Alcance y autoridad

Este documento registra la implementación del lenguaje gráfico decorativo de
la referencia desktop aprobada. Evoluciona el primitive `Ornament` existente;
no crea una segunda librería, no sustituye contenido o fotografía y no autoriza
identidad nueva.

## Inventario implementado

| Primitive | Técnica | Uso |
| --- | --- | --- |
| `thread`, `underline`, `dotted-curve` | SVG de trazo | continuidad y líneas orgánicas |
| `dots` | SVG local | ritmo puntual histórico |
| `heart`, `heart-trail`, `mini-hearts` | SVG local | acentos afectivos contenidos |
| `sparkle` | SVG local de cuatro puntas | destello secundario |
| `cloud` | SVG local en capas translúcidas | nube azul ambiental |
| `watercolor` | SVG local en tres veladuras irregulares | wash rosa o azul |
| `DecorativeBackdrop` | CSS gradients + primitives SVG | fondo continuo global |

Todos los SVG son inline, decorativos, `aria-hidden="true"`,
`focusable="false"`, sin eventos de puntero, dependencias, red ni JavaScript.
El backdrop es fijo, tiene dimensiones desde el primer paint y usa
`contain: strict`, por lo que no reserva espacio ni provoca CLS. En móvil baja
su opacidad y elimina los acentos pequeños para conservar el fallback funcional.

Los colores se seleccionan mediante tonos semánticos `--color-decoration-*`.
Los componentes no consumen hexadecimales ni tokens fuente `--luna-*`.

## Assets y budget

- Assets raster decorativos añadidos: **0**.
- Assets SVG externos añadidos: **0**; el vocabulario vive en el primitive y se
  deduplica en el CSS compartido.
- Requests, fuentes o JavaScript decorativo añadidos: **0**.
- La acuarela es una aproximación vectorial de veladuras. Si el propietario
  exige textura pictórica raster, deberá entregar o aprobar un master con
  fuente, derechos, dimensiones y budget antes de sustituirla.

## Blockers explícitos

- **Mascota aislada:** `BLOCKED`. Sólo existe dentro del PNG oficial junto al
  lockup. No se recorta, redibuja ni deriva sin master/variante aprobada.
- **Assets oficiales aislados de corazón, sparkle, nube o acuarela:** no existen.
  Las primitivas SVG provisionales están permitidas por el contrato visual y
  son sustituibles mediante la API/tokens existentes.
- **Tipografía de marca:** continúa `BLOCKED` por falta de archivos, proveedor y
  licencia; no afecta a este sistema vectorial.

La aprobación visual final no pertenece a M8.9.2: se registra exclusivamente en
M8.9.11.
