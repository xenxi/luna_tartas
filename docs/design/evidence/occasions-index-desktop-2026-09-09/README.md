# Ocasiones — Desktop

Visual status: `AWAITING_VISUAL_APPROVAL`.

Referencia: imagen adjunta por el usuario el 2026-09-09.

## Implementación

- Hero nuevo generado mediante edición de la imagen original: globo rosa, nubes, flores y conejito, conservando como referencia las invitaciones de Primera Comunión de Claudia. El original sigue disponible y se utiliza en móvil.
- Composición de escritorio con título en dos líneas, nota manuscrita, transición de nubes, cuatro tarjetas con fotos horizontales, botones rosas, beneficios y cierre personalizado.
- Se conservan las cuatro ocasiones publicadas, sus fotografías de catálogo y URLs. No se añaden ocasiones ficticias a partir de la referencia.
- Menú y footer sin modificaciones de archivos, contenido o estructura; siguen usando el shell compartido con la home.
- Estilos limitados a `.taxonomies-page.occasions-index` desde 768 px. Textos editoriales en `src/content/occasion-index.ts`. Sin nuevo JavaScript cliente, cambios de dominio o contratos SEO.
- La revisión del build detectó y corrigió diferencias por el orden del CSS: las reglas de ocasiones tienen prioridad sobre las reglas compartidas en desarrollo y en la versión compilada.

## Verificación

- Build: PASS, 35 páginas.
- Typecheck: PASS, 0 errores, advertencias o sugerencias.
- Lint y formato: PASS.
- Vitest: 303/304 pruebas PASS. Una prueba preexistente falla en `tests/site-shell.test.ts:148`: busca una cadena literal del header en una sola línea; HEAD ya contiene esa expresión partida en dos líneas. Se ha comprobado con `git show HEAD:src/components/site/SiteHeader.astro`. No se modifica el menú ni se amplía esta tarea para cambiar su test.
- Enlaces, SEO, accesibilidad y responsive del artefacto: PASS.
- Navegador en 2242, 1440, 929, 807, 768, 390 y 320 px: sin desbordamientos ni imágenes rotas. Sin errores de JavaScript.
- Axe WCAG A/AA en el contenido principal a 1440, 768 y 320 px: 0 infracciones. Foco de teclado visible mediante el anillo de box-shadow compartido.
- Cuatro enlaces de ocasiones y CTA disponibles sin JavaScript; navegación a Primera Comunión verificada.
- Build servido localmente: hero optimizado AVIF, cuatro tarjetas y 0 infracciones de accesibilidad a 1440 px. Captura `occasions-production-1440.png` inspeccionada tras corregir la prioridad del CSS.
- HTML de menú y footer idéntico al capturado antes del cambio, tanto en home como en ocasiones. La captura completa de home no es idéntica píxel a píxel: la diferencia está localizada en el arte del cierre (x=808–1082, y=1821–1987), por lo que no se presenta como una comparación visual exacta de toda la home.
- Assets: PASS con aviso de tamaño agregado de fuentes (85.3 MB frente a 78.6 MB); el umbral ya estaba excedido antes. El nuevo PNG pesa aproximadamente 2 MB; la variante AVIF de 1440 px pesa aproximadamente 49 KB.

Resultado global de regresiones: FAIL por el test preexistente del shell; los checks de esta implementación pasan.

La aprobación visual corresponde al usuario. No se inicia rediseño móvil ni otra vista.

STOP
