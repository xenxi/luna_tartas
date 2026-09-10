# Ocasiones y destinatarios individuales — Desktop

Implementation: COMPLETE

Regression checks: PASS

Visual status: AWAITING_VISUAL_APPROVAL

Referencia: aplicar el mismo ajuste realizado en categorías, basado en la página de Productos, a Nacimiento, Baby shower, Cumpleaños, Primera Comunión, Para bebés, Para niños y Para alguien especial.

## Implementación

- Las siete páginas utilizan el hero rosa con fotografía integrada, ola inferior y nubes sobre el listado. Las tarjetas comparten el acabado de Productos y la cuadrícula de cuatro columnas en escritorio.
- Se generaliza el estilo de categorías como `taxonomy-landing-desktop.css`, compartido por categorías, ocasiones y destinatarios. No se duplican reglas por página.
- Cabecera superpuesta y contenido acotado al mismo ancho de página que las categorías. Los índices de ocasiones y regalos mantienen su presentación existente.
- Se conservan las fotografías originales del hero, encuadradas mediante `object-fit: contain`, y el producto mostrado. No se editan archivos de imagen ni contenido editorial.
- Se mantienen productos, precios, orden, favoritos, URLs y metadatos. Sin JavaScript adicional. El ajuste se limita a escritorio desde 48rem; móvil conserva su composición.

## Verificación

- `npm test`: 48 archivos y 304 tests PASS.
- `npm run typecheck`: 208 archivos, 0 errores, 0 avisos, 0 hints.
- `npm run lint` y `npm run format`: PASS.
- `npm run build`: 35 páginas generadas.
- `npm run verify:artifact`, `npm run verify:responsive`, `npm run verify:accessibility` y `npm run verify:seo`: PASS.
- `git diff --check`: PASS.
- Navegador sobre el build: siete páginas a 1440, 900, 768 y 390 px solicitados, sin desbordamientos ni imágenes rotas. Se registran los anchos efectivos en `browser-audit.json` (1441 y 391 px en esos dos tamaños).
- Productos presentes por página: Nacimiento 3, Baby shower 2, Cumpleaños 3, Primera Comunión 2, bebés 2, niños 2 y alguien especial 6.
- Ola y nubes visibles en escritorio y ocultas en móvil. Encuadre `contain` en escritorio y composición compacta anterior conservada.
- Regresión de Productos, categoría Papelería y los índices Ocasiones y Regalos: sin desbordamientos; cabecera superpuesta solo donde corresponde. Sin errores de consola registrados en la sesión final.

## Capturas

- [Nacimiento](ocasiones-nacimiento-1440.png)
- [Baby shower](ocasiones-baby-shower-1440.png)
- [Cumpleaños](ocasiones-cumpleanos-1440.png)
- [Primera Comunión](ocasiones-comunion-1440.png)
- [Para bebés](regalos-bebe-1440.png)
- [Para niños](regalos-ninos-1440.png)
- [Para alguien especial](regalos-alguien-especial-1440.png)
- [Primera Comunión a 768 px](comunion-768.png)

Manual review: comparar estas siete páginas con el estilo de Productos y las categorías. La aprobación visual explícita del usuario sigue pendiente.

STOP
