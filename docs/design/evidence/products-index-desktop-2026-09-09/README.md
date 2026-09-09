# Productos — Desktop

Implementation: COMPLETE

Regression checks: PASS

Visual status: AWAITING_VISUAL_APPROVAL

Referencia: imagen de catálogo adjunta por el usuario el 8 de septiembre de 2026.
Alcance: contenido de `/productos/`, sin modificar el menú superior ni el footer.

## Implementación

- Cabecera fotográfica rosa con composición de conejo, tarta y marcos; tipografía, beneficios y transición de nubes adaptados a la referencia.
- Cuadrícula de cuatro columnas con los nueve productos publicados, sus fotografías, textos, precios y orden editorial reales. No se incorporan productos ni precios ficticios de la referencia.
- Búsqueda local que ignora tildes, filtros derivados de las ocasiones publicadas con productos, ordenación por precio o nombre y estado vacío accesible.
- Los productos y sus enlaces se generan en HTML. Los filtros conservan enlaces a las páginas de ocasión como alternativa sin JavaScript. El selector de orden aparece al inicializarse la mejora cliente.
- Bloque de personalización junto al último producto y franja inferior de beneficios. Las tarjetas conservan el acceso a favoritos.
- Paleta centralizada en tokens y limitada a `.products-page`; slots opcionales del hero sin efecto en otros consumidores. Sin cambios en los archivos de navegación, footer o layouts.
- La composición nueva se limita a escritorio (desde 48rem); comprobación de regresión a 390px, manteniendo imagen y estructura compactas anteriores. No se inicia un rediseño Mobile.

## Verificación

- `npm test`: 48 archivos, 304 tests PASS.
- `npm run typecheck`: 0 errores, 0 avisos, 0 hints.
- `npm run lint`, `npm run format`: PASS.
- `npm run build`: 35 páginas generadas.
- `npm run verify:artifact`, `npm run verify:responsive`, `npm run verify:accessibility`: PASS, 35 HTML.
- `npm run verify:seo`: PASS, 34 páginas con metadatos.
- `git diff --check`: PASS.
- Navegador: revisión a 1440px y 892px; sin desbordamiento horizontal. Regresión compacta a 390px sin desbordamiento, nueve productos presentes y herramientas de escritorio ocultas.
- Búsqueda `lamina`: 3 productos; con Nacimiento: 1. Texto sin coincidencias: estado vacío y anuncio de 0 productos. Borrado por teclado y Todos: 9 productos.
- Precio ascendente: 20, 200, 200, 200, 200, 250, 250, 500, 2000 céntimos; descendente inverso; restauración del orden editorial verificada.
- Previsualización del build: sin errores de consola.

Capturas de la previsualización de producción: [cabecera](hero-1440.png) y [cierre](closing-1440.png).

## Fondo de cabecera

Herramienta: `image_gen`, modo integrado. Archivo: [products-hero-reference.png](../../../../src/assets/products/products-hero-reference.png).

El asset es una ilustración fotográfica de ambientación; las fotografías comerciales de las tarjetas se conservan intactas. El original anterior sigue disponible y se utiliza en la composición compacta.

Prompt final:

> Use case: precise-object-edit. Input image is the edit target: a complete web page screenshot. Extract and reconstruct ONLY its top photographic hero background as a high resolution landscape banner, aspect ratio 2.7:1. Preserve the scene of the small cream plush bunny atop a three-tier white diaper cake with pink bows and flowers, the two floral cream frames, tiny teddy bear, baby-breath flowers and pink knit blanket, all grouped on the RIGHT HALF exactly like the reference. LEFT 47% must be soft pale blush pink photographic negative space for real HTML text. Retain soft bright pink daylight and delicate authentic textile textures. Remove ALL website UI: logo, navigation, headings, body text, icons, drawn hearts, buttons, badges, and white scalloped edge; no catalog section. Only wording already physically printed inside the two frames may remain. Full rectangular bleed, no border, no extra products. This is a background asset for the implemented website, not a mockup of the website.

Revisión manual pendiente: comparar con la referencia y obtener aprobación explícita del usuario. Los checks técnicos no certifican fidelidad visual.

STOP
