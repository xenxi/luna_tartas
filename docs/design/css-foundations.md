# CSS foundations

M3.2 expone una única capa de tokens semánticos en [`../../src/styles/tokens.css`](../../src/styles/tokens.css) y una base mínima en [`../../src/styles/foundations.css`](../../src/styles/foundations.css). `BaseLayout` importa la foundation, que a su vez importa los tokens; no hay JavaScript ni fuentes remotas.

## Uso

- Componentes consumen roles como `--color-action`, `--color-surface` y `--color-text-muted`, nunca hex ni nombres de marca.
- El ritmo usa `--space-*`; para separación de secciones se usa `--space-section`.
- El ancho normal usa `.container`; el texto largo usa `.prose`.
- Los breakpoints son decisiones de contenido: `48rem` para la expansión principal y `90rem` como referencia amplia. Las media queries repiten el valor porque CSS no permite usar custom properties en sus condiciones.
- Las transiciones usan `--duration-*` y `--ease-standard`; `prefers-reduced-motion: reduce` elimina el movimiento no esencial.

## Contraste y sustitución

La paleta provisional sigue los ratios registrados en `visual-direction.md`: texto principal/secundario, acción, foco, éxito y error tienen combinaciones AA previstas sobre canvas/surface. `--color-accent` y `--color-border` son decorativos y no deben comunicar texto, foco ni límites interactivos por sí solos.

La futura identidad sustituye valores en los roles de `:root`. Después de cambiar color o tipografía hay que repetir el checker de contraste, comprobar métricas a 320/768/1440 px y revisar el peso/licencia de cualquier fuente nueva.
