# Para regalar — Desktop

Visual status: `AWAITING_VISUAL_APPROVAL`.

Referencia: imagen adjunta por el usuario el 2026-09-09. El menú y el footer se mantienen como en la home; las tarjetas utilizan el diseño de Ocasiones.

## Implementación

- Hero rosa con bolsa de regalo, lazo y conejito, nota manuscrita, nube azul, luna y transición ondulada al listado. Imagen generada con la herramienta integrada `image_gen` a partir del hero original y la referencia visual; archivo `src/assets/gifts/gifts-hero-v2.png`, prompt completo en `hero-prompt.md`.
- Tres columnas para los tres destinatarios publicados: bebés, niños y alguien especial. Se conservan los textos YAML, fotografías del catálogo, enlaces y orden. No se crean las categorías adicionales de la referencia.
- El diseño existente de tarjetas, beneficios y cierre de Ocasiones se comparte mediante `src/components/taxonomies/taxonomy-index-desktop.css`, renombrado desde `occasion-index-desktop.css`. Los ajustes propios de Regalos están en `gift-index-desktop.css`; todos se limitan a escritorio desde 768 px.
- Textos editoriales de la página centralizados en `src/content/gift-index.ts`. Catálogo, dominio, rutas y metadatos SEO conservados. Sin nuevo JavaScript cliente.
- Móvil mantiene el hero original y sus estilos. Menú y footer mantienen sus componentes, estructura y estilos compartidos.

## Verificación

- Build: PASS, 35 páginas.
- Typecheck: PASS, 0 errores, advertencias o sugerencias.
- Lint y formato: PASS, incluidas las dos hojas CSS de esta tarea.
- Vitest: 303/304 pruebas PASS. Fallo preexistente en `tests/site-shell.test.ts:148`, que espera una cadena del header en una sola línea. `git show HEAD:src/components/site/SiteHeader.astro` confirma que ya estaba partida en HEAD. El menú y el test permanecen intactos.
- Enlaces, SEO, catálogo, accesibilidad y responsive del artefacto: PASS.
- Assets: PASS con aviso preexistente por tamaño agregado de fuentes; total actual 87.15 MB frente al umbral de aviso de 78.64 MB.
- Navegador sobre el build de producción a 2242, 1440, 941, 807, 768, 390 y 320 px: sin desbordamientos, imágenes rotas ni errores de JavaScript.
- Axe WCAG A/AA sobre el contenido principal a 1440, 768 y 320 px: 0 infracciones. Foco de teclado visible. Enlaces de destinatarios y CTA disponibles sin JavaScript; navegación a `/regalos/bebe/` comprobada.
- Comparación con las capturas anteriores al cambio: home y Ocasiones a 1440 px, y Regalos móvil a 390 px, idénticas píxel a píxel en la auditoría final.
- HTML del menú y del footer idéntico antes/después en home, Ocasiones y Regalos.
- Capturas de producción a 1440 y 768 px inspeccionadas; nubes ajustadas en escritorio pequeño para evitar solapamientos con los textos.

Resultado global de regresiones: FAIL por el test preexistente del shell. Los checks de esta implementación pasan.

## Revisión manual

Comparar `gifts-1440.png` y la vista `/regalos/` con la referencia aprobada. La aprobación visual corresponde al usuario. No se inicia otra vista ni una tarea de rediseño móvil.

STOP
