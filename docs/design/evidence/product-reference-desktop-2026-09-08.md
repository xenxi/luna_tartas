# Producto — Desktop

Estado: `AWAITING_VISUAL_APPROVAL`.

Referencia: primera imagen de producto aportada por el usuario el 8 de septiembre de 2026; segunda imagen de categorías y home actual como contexto de estilo. Alcance: plantilla de detalle de producto en escritorio (desde 1024 px). No se inicia otra vista ni el rediseño Mobile.

## Implementación

- Composición en dos columnas, miniaturas verticales, favorito sobre la fotografía y ampliación existente. La fotografía se muestra completa, sin reemplazar el catálogo por imágenes de la referencia.
- Paleta de escritorio centralizada en tokens, precio destacado, beneficios compactos, nota artesanal rosa y opciones reales de personalización antes del pedido por WhatsApp.
- Luna, nubes y corazones reutilizados de la home; contenido nuevo de presentación en `src/content/product-detail.ts`.
- Descripción y taxonomías en un panel, accesos a personalización, entrega y preguntas frecuentes; recomendaciones compactas y pie alineado en columnas.
- Conservados YAML, precios, URLs, metadatos, datos estructurados, favoritos y conversión. No se añaden carrito, reseñas, variantes ficticias ni JavaScript nuevo.

## Verificación

- Astro check: 200 archivos, 0 errores, avisos o sugerencias.
- Vitest: 303 pruebas, 48 archivos, PASS. Expectativa del componente actualizada para el slot de personalización.
- ESLint y compilación de 35 páginas: PASS.
- Auditorías del artefacto: enlaces, SEO, datos estructurados, accesibilidad, responsive y presupuesto de rendimiento: PASS.
- Navegador: 1024, 1280, 1440 y 1920 px, sin desbordamiento horizontal. Regresión a 390 px: decoraciones nuevas ocultas y layout de una columna. Esta comprobación no constituye implementación ni aprobación de Mobile.
- Galería: selección de segunda imagen y vuelta a portada, apertura y cierre de ampliación. Favoritos: activar/desactivar, restaurando el estado anterior. PASS.
- Variante con una sola fotografía: etiquetas para regalos, columna completa sin hueco de miniaturas. PASS.
- Versión compilada: sin errores de consola ni imágenes rotas tras cargar la página.

## Revisión manual

Comparar la ficha con la primera referencia y la home, especialmente proporción entre fotografía y personalización, densidad y decoración. El contenido comercial real limita la equivalencia literal con la maqueta. La aprobación visual corresponde al usuario según `AGENTS.md`.

Vista local: http://127.0.0.1:4322/productos/tarta-de-panales-personalizada/
