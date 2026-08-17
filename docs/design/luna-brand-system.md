# Luna brand system — M8.9.1

## Autoridad y alcance

Este documento registra los cimientos de la fase M8.9. La referencia
[`reference/luna-home-art-direction-reference.png`](reference/luna-home-art-direction-reference.png)
es el contrato de dirección artística desktop: no es una simple inspiración ni
autoriza su contenido comercial. El viewport contractual es 1440 px, con
comprobaciones de comportamiento a 1280 y 1920 px.

La referencia desktop vigente fue sustituida por el propietario el 2026-08-17:
1024 × 1536 px, 2.098.629 bytes, SHA-256
`989DE73BE8EBE56F4A149385C7769CB54B80984288A1289370CD32D32B25C1BE`.
La versión anterior con lockup serif queda obsoleta y no se usa para decisiones
de M8.9.

También se recibió
[`reference/luna-home-art-direction-reference-mobile.png`](reference/luna-home-art-direction-reference-mobile.png)
(853 × 1844 px, 1.686.607 bytes, SHA-256
`BDACE24508B4DE1FF9CEF1BC7C03DF537B95141EE16B505D51FE4138311DA516`).
Se conserva como input de la futura M8.10; M8.9 sigue siendo desktop y no copia
carrito, favoritos, cuenta o cualquier otra función inexistente mostrada en la
captura móvil.

M8.9.1 normaliza foundations y primitives. No recompone Header, Hero, Home o
Footer, y no cierra el diseño móvil. Mobile conserva por ahora el fallback
responsive funcional existente.

## Auditoría del baseline

- Existe una única capa global de tokens en `src/styles/tokens.css`, importada
  por `foundations.css`; se conserva en vez de crear un sistema paralelo.
- Los componentes ya consumen mayoritariamente roles semánticos. Se encontraron
  dos bordes con RGB de marca repetido en taxonomías y productos; pasan a
  `--color-border-subtle`.
- Los primitives nativos `Button` y `ActionLink` ya ofrecen variantes primary,
  secondary y quiet, foco visible, reduced motion y cero hidratación. Se
  mantienen sus APIs y se centralizan dimensiones, borde y radio.
- El sistema anterior sólo declaraba display serif y body sans. No hay
  `@font-face`, WOFF/WOFF2, TTF/OTF, proveedor, nombre ni licencia aprobada de una
  tipografía de marca. Se incorpora un rol script con stack local; añadir una
  webfont requerirá archivo, licencia, fallback métrico y nueva aprobación.
- El logo oficial y las fotografías autorizadas ya existen. No hay assets
  oficiales aislados de corazón, sparkle, nube o acuarela; no bloquean
  foundations y se resolverán o declararán bloqueantes en M8.9.2, no en esta
  milestone.
- El PNG oficial existente (`logo-luna-tartas.png`, 1536 × 1024, SHA-256
  `61747047CFC39667ED9F6891AA1992149D3F7B257ACDF53275C009A29DB19CAD`)
  contiene la mascota y el texto “Luna Tartas de pañales”. No equivale al lockup
  horizontal “Luna · Detalles hechos para emocionar” de la nueva referencia y
  no se recorta ni redibuja silenciosamente. M8.9.3 deberá usar el asset oficial
  que autorice el propietario o quedar bloqueada con una especificación exacta.
- El catálogo ya modela `featured?: boolean` y `order?: number`; las queries
  publican y ordenan antes de proyectar. M8.9.1 no altera ese contrato.

## Color

La paleta fuente vive exclusivamente como `--luna-*`. Los componentes no deben
consumir esos nombres directamente: usan `--color-*`, lo que preserva semántica
y permite recalibrar la marca sin reescribir secciones.

| Fuente              | Valor     | Función prevista                                  |
| ------------------- | --------- | ------------------------------------------------- |
| `--luna-cream`      | `#FFF9F3` | lienzo cálido                                     |
| `--luna-cream-2`    | `#FFF5EC` | transición cálida                                 |
| `--luna-paper`      | `#FFFCF8` | superficie clara                                  |
| `--luna-coral`      | `#EA6175` | decoración y acento vivo de la referencia vigente |
| `--luna-coral-dark` | `#C4475F` | acción/texto accesible                            |
| `--luna-coral-deep` | `#AD384F` | hover/active                                      |
| `--luna-coral-soft` | `#F48B9B` | acento suave                                      |
| `--luna-blush`      | `#F8D9DC` | superficie rosa                                   |
| `--luna-blush-soft` | `#FCEBEC` | wash rosa claro                                   |
| `--luna-blue`       | `#BCD5E9` | acuarela azul                                     |
| `--luna-blue-soft`  | `#E5F0F7` | wash azul claro                                   |
| `--luna-peach`      | `#F4C4A8` | acento melocotón                                  |
| `--luna-sage`       | `#DDE3D8` | pastel secundario                                 |
| `--luna-brown`      | `#392723` | tinta principal                                   |
| `--luna-brown-soft` | `#5C4842` | texto secundario                                  |

El coral oscuro propuesto inicialmente (`#D94F67`) se ajusta a `#C4475F`
porque blanco/crema sobre el original sólo alcanza 3.82:1. La variante adoptada
alcanza 4.55:1 sobre `#FFF9F3`; marrón principal y secundario alcanzan 13.50:1
y 8.17:1 respectivamente. Coral vivo, blush, azul, peach y sage son
decorativos/superficies y nunca sustituyen tinta, borde de control o foco.

## Tipografía

- **Display/editorial — `--font-display`:** Iowan Old Style, Palatino, Book
  Antiqua o Georgia. Se elimina Times New Roman del stack. Uso: H1, H2,
  titulares breves y numeración editorial.
- **Body/UI — `--font-body`:** Aptos, Segoe UI y fallbacks de sistema. Uso:
  navegación, párrafos, botones, metadata y enlaces.
- **Handwritten — `--font-script`:** Segoe Print, Bradley Hand, Brush Script MT
  y fallback cursive. Uso exclusivo para frases breves/accent como “No para
  cualquiera.”; nunca párrafos. El trazo/corazón asociado pertenece al sistema
  vectorial de M8.9.2, no a un carácter Unicode.

Los roles de tamaño/altura son `--font-size-*`, `--font-size-script`,
`--line-height-body`, `--line-height-display` y `--line-height-script`. No hay
requests remotos, preload, JavaScript ni riesgo de CLS añadido en esta fase.

## Dimensiones y composición

| Área        | Contrato de tokens                                                                       |
| ----------- | ---------------------------------------------------------------------------------------- |
| Espacio     | escala `--space-1`…`--space-32`; ritmos compact/standard/spacious/chapter                |
| Radio       | `--radius-sm/md/lg/xl`, `--radius-action`, `--radius-card`; pill sólo para tags reales   |
| Bordes      | hairline, action y colores semánticos; nunca hex/RGB local de marca                      |
| Sombras     | `soft` y `editorial`, marrón cálido y opacidad contenida                                 |
| Anchuras    | content 72 rem; visual 80 rem; lectura 68/58/42 ch                                       |
| Botón       | mínimo 48 px, padding 12 × 24 px, gap 8 px, radio 10 px                                  |
| Card        | radio 16 px, gap fluido y alturas mínimas base/featured como guía compositiva            |
| Decoración  | escalas xs/sm/md/lg y tamaños fluidos separados para cloud/watercolor                    |
| Z-index     | base/decoration/raised/content/header/overlay/modal; decoración no compite con contenido |
| Breakpoints | 40/48/64/90 rem documentados; las media queries repiten literales por limitación CSS     |

Las dimensiones de card no obligan a todas las secciones a usar una cuadrícula.
M8.9.5 y M8.9.7 deciden su composición con estos roles, no creando cards
ecommerce genéricas.

## Primitives de acción

Primary usa coral accesible, texto papel, borde coral, radio 10 px y hover coral
deep. Secondary comparte alto/padding/radio, usa lienzo cálido, texto y borde
coral. Quiet queda reservado a acciones de menor jerarquía. El foco global
conserva un anillo azul de alto contraste independiente de hover y no se elimina
el outline sin sustitución.

## Reglas de consumo y salida

1. Componentes consumen roles semánticos, nunca `--luna-*` ni valores de marca
   locales.
2. Decoración futura es `aria-hidden`, `focusable=false`, sin pointer events ni
   espacio condicional; no usa emoji. La nueva referencia exige un vocabulario
   más rico de corazón, sparkle, luna/mascota y acuarela, que pertenece a
   M8.9.2.
3. Fotografías y contenido siguen sus contratos de aprobación y catálogo.
4. Ninguna riqueza visual permite superar budgets o introducir JS decorativo.
5. M8.9.1 no equivale a aprobación visual. La comparación completa y la
   aprobación del propietario sólo ocurren en M8.9.11.
