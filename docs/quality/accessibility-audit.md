# Auditoría de accesibilidad M8.1

Fecha: 2026-08-17
Alcance: artefacto estático V1, WCAG 2.2 AA; no constituye certificación legal.

## Hallazgo corregido

`main:focus` anulaba el indicador de foco al activar el skip link. Se sustituyó por `main:focus-visible` con el token de foco y offset visible. El destino conserva `tabindex="-1"`, por lo que el recorrido puede saltar al contenido sin alterar el orden normal de teclado.

## Auditoría automatizada

`npm run verify:accessibility` inspecciona los 25 HTML de `dist` y falla ante:

- ausencia o multiplicidad de `h1`;
- ausencia de `header`, `main` o `footer`;
- imágenes sin `alt` no vacío;
- enlaces sin `href` o nombre accesible;
- botones sin nombre accesible;
- IDs duplicados.

Resultado: PASS, 25 HTML, 0 hallazgos blocker/critical en las reglas implementadas.

## Revisión manual reproducible

- Teclado: skip link, `details/summary`, navegación, breadcrumbs, cards, CTAs WhatsApp, consentimiento y enlaces del footer son controles HTML nativos; los estilos globales conservan foco visible y los targets interactivos mínimos de 44 px.
- Zoom/reflow: `viewport` permite zoom; el layout usa medidas fluidas, `min-width: 0`, `overflow-wrap` en contacto y media limitada al contenedor. No se introducen tamaños fijos ni scroll horizontal forzado.
- Lectores: una sola región `main`, landmarks globales `header`/`footer`, navegación con nombres diferenciados, jerarquía de encabezados por página y alternativas de imagen editoriales; ornamentos SVG llevan `aria-hidden`.
- Motion: `prefers-reduced-motion: reduce` elimina transiciones y animaciones secundarias; el fallback de ornamentos permanece estático.

Estas comprobaciones se apoyan en el HTML generado y en los contratos de componentes. La validación con lector de pantalla y matriz de navegadores se mantiene como parte de M8.3, sin inventar una ejecución no disponible en este entorno.
