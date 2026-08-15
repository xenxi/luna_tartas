# Principios de diseño

## Dirección

Una estética artesanal cuidada: calidez, ritmo editorial, detalles orgánicos contenidos y fotografía protagonista. La identidad no se resolverá con adornos aleatorios ni con patrones de ecommerce genérico.

Los activos de marca definitivos permanecen bloqueados. La dirección provisional, sus límites y el contrato de sustitución están en [`visual-direction.md`](visual-direction.md).

## Principios

1. **Claridad antes que decoración.** Cada pantalla deja visible el siguiente paso.
2. **Emoción apoyada en producto real.** Fotografía y copy construyen deseo sin promesas inventadas.
3. **Mobile first real.** Jerarquía, targets táctiles, galerías y CTA se diseñan primero para móvil.
4. **Sistema pequeño y coherente.** Tokens semánticos controlan color, tipo, espacio, radio, sombra, container, breakpoints y motion.
5. **Accesible por defecto.** Contraste, foco, orden de lectura, reduced motion y controles nativos son parte del diseño.
6. **Rendimiento visible.** Layout estable, fuentes eficientes y medios responsivos; la animación nunca bloquea contenido ni conversión.

## Capas del sistema

- **Foundations:** paleta semántica, escalas tipográfica/espacial, grid/container, elevación y motion.
- **Primitives:** enlace, botón, icono, media, badge y separador.
- **Patterns:** card de producto/taxonomía, breadcrumb, CTA, grupo de confianza, galería.
- **Sections:** hero, descubrimiento, destacados, prueba social, trabajos e idea personalizada.

Los nombres expresan intención (`--color-action`, `--space-section`) y evitan colores/medidas repetidos. Los componentes aceptan variaciones explícitas; no se crea una API genérica para casos hipotéticos.

## Estados obligatorios

Hover cuando exista puntero, foco visible, active, disabled cuando semánticamente proceda, carga/placeholder sólo si existe espera real y fallback sin imagen. El contenido esencial no depende de animación ni JavaScript.

## Evidencia de calidad

M3 fija muestras responsive de los patrones; M4/M5 las validan con contenido real representativo. M8 audita teclado, contraste, zoom, reduced motion, 320 px y pantallas amplias. Las decisiones visuales que requieran marca o fotografía real quedan como gate, no se rellenan con material falso en producción.
