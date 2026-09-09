# Categorías individuales — Desktop

Implementation: COMPLETE

Regression checks: PASS

Visual status: AWAITING_VISUAL_APPROVAL

Referencia: trasladar el estilo actual de `/productos/` a las cuatro categorías individuales, conservando el producto de cada fotografía del hero.

## Implementación

- Tartas de pañales, papelería personalizada, láminas personalizadas y packs personalizados comparten la presentación de tarjetas de Productos: cuatro columnas, proporción de imagen, tipografía, superficies, botones y favoritos.
- Hero de escritorio integrado con la cabecera existente, fondo rosa, tipografía de Productos, ola inferior y nubes de acuarela sobre el listado. Las migas de pan siguen disponibles y visibles.
- Los cuatro heroes conservan los mismos archivos de imagen y su selección desde el catálogo. El encuadre usa `object-fit: contain` y un degradado lateral CSS; no se regeneraron ni editaron fotografías.
- `CatalogWave`, `CatalogClouds` y los estilos de tarjetas se comparten con Productos para mantener una única implementación de esos elementos.
- Contenido, precios, enlaces, SEO y consultas del catálogo se conservan. Sin JavaScript nuevo. La composición nueva se limita a escritorio desde 48rem; no se inicia un rediseño Mobile.
- La prueba existente de la cabecera normaliza espacios para que el formato multilínea no provoque falsos fallos.

## Verificación

- `npm test`: 48 archivos, 304 tests PASS.
- `npm run typecheck`: 0 errores, 0 avisos, 0 hints.
- `npm run lint`, `npm run format`: PASS.
- `npm run build`: 35 páginas.
- `npm run verify:artifact`, `npm run verify:responsive`, `npm run verify:accessibility`, `npm run verify:seo`: PASS.
- `git diff --check`: PASS.
- Navegador sobre la previsualización del build: cuatro categorías a 1440, 900, 768 y 390 px solicitados. Sin desbordamiento horizontal ni imágenes rotas; 1, 6, 2 y 1 productos respectivamente. Ola y nubes visibles en escritorio y ocultas en compacto. El navegador informa 1441 y 391 px efectivos en los tamaños solicitados de 1440 y 390; valores registrados en `browser-audit.json`.
- Productos: nueve tarjetas, nubes y ola conservadas en escritorio; controles decorativos de escritorio ocultos en compacto y sin desbordamiento.
- Ocasión Nacimiento: conserva la variante anterior y la cabecera sin superposición; hero y listado de 1280 px a tamaño de escritorio, sin desbordamiento.
- Sin errores de consola en la previsualización revisada.

Capturas de cabecera y comienzo de listado:

- [Tartas](tartas-de-panales-1440.png)
- [Papelería](papeleria-personalizada-1440.png)
- [Láminas](laminas-1440.png)
- [Packs](packs-1440.png)
- [Papelería a 768 px](papeleria-768.png)
- [Regresión compacta de packs](packs-390-regression.png)
- [Regresión de Productos](products-1440-regression.png)

Manual review: comparar las cuatro categorías con la página de Productos. Solo la aprobación visual explícita del usuario permite dar por finalizada esta tarea.

STOP
