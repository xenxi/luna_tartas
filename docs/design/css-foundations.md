# CSS foundations

M3.2 creó la única capa de tokens semánticos en [`../../src/styles/tokens.css`](../../src/styles/tokens.css) y la base de [`../../src/styles/foundations.css`](../../src/styles/foundations.css). M4.11.2 evoluciona esa misma capa para separar medida, ritmo y lenguaje gráfico sin crear otro sistema. `BaseLayout` importa la foundation, que a su vez importa los tokens; no hay JavaScript ni fuentes remotas.

## Medidas de composición

| Rol       | Token/clase                                | Uso                                                                         |
| --------- | ------------------------------------------ | --------------------------------------------------------------------------- |
| Visual    | `--container-visual` / `.visual-container` | Fotografía, collages y composiciones editoriales; máximo 77.5 rem (1240 px) |
| Contenido | `--container-content` / `.container`       | Shell, navegación y bloques generales; máximo 72 rem                        |
| Lectura   | `--measure-reading` / `.prose`             | Texto largo; máximo 68 caracteres aproximados                               |
| Copy      | `--measure-copy`                           | Entradillas y copy de sección; máximo 58 caracteres aproximados             |
| Compacta  | `--measure-compact` / `.prose--compact`    | CTA y texto editorial corto; máximo 42 caracteres aproximados               |

Un componente elige el rol por la función de su contenido. No debe recuperar
`--container-max`, usar el container visual para párrafos ni duplicar un ancho
local equivalente.

## Ritmo

- `--space-section-compact`: agrupaciones relacionadas o transiciones densas.
- `--space-section-standard`: ritmo por defecto de `.section` y `ContentSection`.
- `--space-section-spacious`: apertura/cierre con descanso editorial.
- `--space-chapter`: separación interna entre capítulos de una misma narrativa.

Las variantes `.section--compact` y `.section--spacious` son explícitas. El token
genérico anterior `--space-section` se elimina para impedir que todas las zonas
repitan el mismo padding.

## Tipografía

- Se conservan las dos familias de sistema: serif editorial y sans de lectura/UI.
- `--font-size-display` queda limitado a 5.25 rem y usa
  `--letter-spacing-display`; evita que un titular sustituya a la fotografía.
- `--font-size-2xl` queda limitado a 4 rem y los subtítulos a 2.75 rem.
- Los headings usan `--line-height-display: 1.08` y
  `--letter-spacing-heading`; no requieren saltos manuales para funcionar.
- No se añade una tercera familia ni una webfont sin archivos, licencia y
  comparación de LCP/CLS.

## Superficies y lenguaje gráfico

`--color-surface-warm` y `--color-surface-calm` sustituyen nombres ligados a un
color concreto. Siguen siendo superficies, no estados, y todo texto mantiene
los roles `--color-text` o `--color-text-muted`.

[`Ornament.astro`](../../src/components/ui/Ornament.astro) limita el vocabulario
a tres motivos locales: `thread`, `underline` y `dots`. Siempre renderiza SVG
inline con `aria-hidden="true"`, `focusable="false"`, sin texto, interacción,
request ni JavaScript. Es decorativo: nunca reemplaza información, marca, foco o
separación necesaria. Los consumidores pueden ajustar color por `currentColor`,
pero conservan `--ornament-stroke` y `--ornament-opacity`.

## Reglas de uso

- Componentes consumen roles como `--color-action`, `--color-surface` y `--color-text-muted`, nunca hex ni nombres de marca.
- Los breakpoints son decisiones de contenido: `48rem` para la expansión principal y `90rem` como referencia amplia. Las media queries repiten el valor porque CSS no permite usar custom properties en sus condiciones.
- Las transiciones usan `--duration-*` y `--ease-standard`; `prefers-reduced-motion: reduce` elimina el movimiento no esencial.

## Contraste y sustitución

La paleta provisional sigue los ratios registrados en `visual-direction.md`: texto principal/secundario, acción, foco, éxito y error tienen combinaciones AA previstas sobre canvas/surface. `--color-accent` y `--color-border` son decorativos y no deben comunicar texto, foco ni límites interactivos por sí solos.

La futura identidad sustituye valores en los roles de `:root`. Después de cambiar color o tipografía hay que repetir el checker de contraste, comprobar métricas a 320/768/1440 px y revisar el peso/licencia de cualquier fuente nueva.

## Motion progresivo de M4.11.6

- `Ornament.astro` acepta únicamente `motion="none"` (estado estático por
  defecto) o `motion="draw"` para hilos/subrayados que conectan capítulos. La
  variante no crea contenido, interacción ni una API de animación genérica.
- El estado base es el trazo completo. En escritorio, sólo con preferencia de
  movimiento y soporte nativo de `animation-timeline: view()`, el trazo puede
  dibujarse según entra en el viewport. Un navegador sin soporte recibe el
  mismo ornamento terminado; no hay polyfill, temporizador ni JavaScript.
- `prefers-reduced-motion: reduce` fuerza explícitamente el trazo completo sin
  animación. Móvil conserva el estado estático para reducir ruido y coste.
- Los estados interactivos mantienen pares `:hover`/`:focus-visible` o
  `:focus-within`; el foco sigue usando el anillo de alto contraste. Se retiró
  el zoom de la galería no interactiva porque no ayudaba a navegar ni tenía un
  equivalente de teclado.
- Sólo se animan `stroke-dashoffset`, color o pequeños `transform`; nunca
  propiedades de layout. La página conserva HTML completo sin JS y no reserva
  espacio condicional, por lo que el sistema no introduce CLS ni trabajo de
  interacción.

## Migración M4.11.2

- `--container-max` → `--container-content`; las composiciones que necesiten más
  escala migrarán explícitamente a `--container-visual` en su submilestone.
- `--container-copy` → `--measure-reading`.
- `--space-section` → uno de los tres roles de sección.
- `--color-surface-rose` → `--color-surface-warm`.
- `--color-surface-sage` → `--color-surface-calm`.

La migración cubre todos los consumidores existentes; no quedan alias obsoletos
que permitan mantener dos APIs en paralelo.
