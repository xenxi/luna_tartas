# Home hero — sustitución de tarta

Implementation: COMPLETE
Regression checks: PASS
Visual status: AWAITING_VISUAL_APPROVAL

Solicitud: sustituir la tarta del hero por la referencia del usuario y ajustar la composición.

Se utiliza `src/assets/home/hero-fairy-reference.png` (1817 × 866), preparada con ImageGen a partir de `user-reference.png` (320 × 213). Es una adaptación generada de la referencia, con restauración de detalle y extensión del fondo rosa; no es una ampliación literal. Se conserva la referencia original para comparar el hada, las flores y las cintas de yute durante la revisión manual.

El encuadre de escritorio usa `object-fit: cover` y posición vertical del 42% para conservar proporciones. Actualizado el texto alternativo editorial. Se mantienen textos, enlaces, controles y estructura del hero. No se ha realizado un rediseño móvil.

## Verificación

- `npm run lint`: PASS.
- `npm run typecheck`: PASS; 208 archivos, 0 errores, avisos o sugerencias.
- `npm test`: PASS; 304 tests en 48 archivos.
- `npm run build`: PASS; 35 páginas, variantes AVIF/WebP/JPEG generadas.
- Navegador local: inspección visual en escritorio amplio y a 914 px; carga correcta y sin desbordamiento horizontal a 914 px.
- Regresión móvil: viewport solicitado 390 × 844, ancho reportado 391 px; imagen cargada y sin desbordamiento horizontal.
- Vista restaurada: ancho reportado 807 px, sin desbordamiento, imagen cargada; sin errores de consola registrados.

Revisión manual pendiente: comparar el nuevo hero con la tarta adjunta y aprobar la composición. Las comprobaciones técnicas no constituyen aprobación visual.
