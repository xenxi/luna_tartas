# Principios de diseño

## Dirección

**Atelier de pequeños detalles**: una estética artesanal/editorial cuidada, con calidez, ritmo, espacio negativo, detalles orgánicos contenidos y fotografía real protagonista. La identidad no se resolverá con adornos aleatorios, infantilización ni patrones de ecommerce genérico.

Los activos de marca definitivos permanecen bloqueados. La dirección provisional, sus límites y el contrato de sustitución están en [`visual-direction.md`](visual-direction.md); la referencia aprobada y el gap de la Home se trazan en [`home-art-direction-recovery.md`](home-art-direction-recovery.md).

## Principios

1. **Claridad antes que decoración.** Cada pantalla deja visible el siguiente paso.
2. **Emoción apoyada en producto real.** Fotografía y copy construyen deseo sin promesas inventadas.
3. **Mobile first real.** Jerarquía, targets táctiles, galerías y CTA se diseñan primero para móvil.
4. **Sistema pequeño y coherente.** Tokens semánticos controlan color, tipo, espacio, radio, sombra, container, breakpoints y motion.
5. **Accesible por defecto.** Contraste, foco, orden de lectura, reduced motion y controles nativos son parte del diseño.
6. **Rendimiento visible.** Layout estable, fuentes eficientes y medios responsivos; la animación nunca bloquea contenido ni conversión.
7. **Movimiento con intención.** Reveal, micro-parallax, hover/focus y draw de ornamentos forman un vocabulario pequeño; reduced motion conserva siempre el contenido y la función.
8. **Imperfección controlada.** Asimetría, rotación y superposición sólo cuando aportan carácter sin perder legibilidad, consistencia ni profesionalidad.

## Capas del sistema

- **Foundations:** paleta semántica, escalas tipográfica/espacial, grid/container, elevación y motion.
- **Primitives:** enlace, botón, icono, media, badge y separador.
- **Patterns:** card de producto/taxonomía, breadcrumb, CTA, grupo de confianza, galería y firma secundaria de Footer.
- **Sections:** hero, descubrimiento, destacados, prueba social, trabajos e idea personalizada.

Los nombres expresan intención (`--color-action`, `--space-section-standard`, `--container-visual`) y evitan colores/medidas repetidos. Los componentes aceptan variaciones explícitas; no se crea una API genérica para casos hipotéticos.

## Estados obligatorios

Hover cuando exista puntero, foco visible, active, disabled cuando semánticamente proceda, carga/placeholder sólo si existe espera real y fallback sin imagen. El contenido esencial no depende de animación ni JavaScript.

## Evidencia de calidad

M3 conserva la base histórica; M4.11.2–M4.11.8 recuperan la dirección aprobada en Home/shell y M5 la extiende a producto. M8 audita teclado, contraste, zoom, reduced motion, rendimiento y composición manual a 320/768/1440. Las decisiones visuales que requieran marca o fotografía real quedan como gate, no se rellenan con material falso en producción. Tests/lint/build son condición necesaria, no evidencia visual suficiente.
