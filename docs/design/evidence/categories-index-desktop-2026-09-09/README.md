# Categorías — Desktop

Visual status: `AWAITING_VISUAL_APPROVAL`.

Referencia: imagen adjunta por el usuario el 2026-09-09. Se aplica al contenido de
`/categorias/`, con las correcciones solicitadas en los comentarios del navegador.
El menú y el footer conservan su diseño compartido con la home.

## Implementación

- Hero de ancho completo con la fotografía original de mariposa rosa y bloques
  ABC, restaurada por petición expresa del usuario. Tipografía en
  dos líneas, nota manuscrita, nubes, transición ondulada y CTA a productos.
- Fondo desde el borde superior, bajo el menú, usando el modo superpuesto del
  header. Transparencia limitada a categorías; se conserva espacio para que el
  breadcrumb y los textos queden debajo del menú.
- Cuatro columnas con imágenes a sangre, superficies pastel, corazones y flechas.
- Beneficios y cierre personalizado ajustados a la composición de referencia.
- Se conservan las cuatro categorías publicadas, sus textos y fotos de catálogo
  y sus URLs. No se crean categorías ni productos a partir del ejemplo visual.
- Estilos de composición limitados a escritorio (desde 768 px). Móvil conserva
  su composición y fotografía; recibe únicamente los textos editoriales y
  beneficios compartidos. No se ha iniciado una tarea de rediseño móvil.
- El header activa su modo superpuesto también en el índice de categorías.
  Sin cambios en su navegación, footer, home, adaptador, dominio o contratos SEO.

## Verificación

- Build: PASS, 35 páginas.
- Typecheck, lint y formato: PASS.
- Vitest inicial: PASS, 304 pruebas en 48 archivos. Tras las correcciones del
  hero: PASS, 18 pruebas relevantes de shell, responsive y hero.
- Verificaciones de accesibilidad, responsive, enlaces y SEO: PASS.
- Navegador Chromium a 2242, 1440, 991, 807, 768, 390 y 320 px: sin desbordamiento
  horizontal, imágenes rotas ni errores de JavaScript.
- Hero en `y=0` y header superpuesto en todos los anchos de escritorio revisados;
  header en flujo normal en móvil. La imagen original se carga en todos ellos.
- Axe WCAG A/AA sobre el contenido principal a 1440 px: 0 infracciones.
- Categorías y CTA a productos disponibles sin JavaScript.
- Auditoría de assets: aviso preexistente de 83.3 MB frente al umbral de 78.6 MB;
  esta tarea reutiliza assets existentes y no añade imágenes al directorio fuente.

Capturas: `categories-2242.png`, `categories-1440.png`, `categories-991.png` y
`categories-807.png`.
Resultados de navegador: `browser-audit.json`.

La aprobación visual corresponde al usuario. Las comprobaciones automáticas no
establecen fidelidad visual ni permiten marcar la tarea como DONE.

STOP
