# Dirección visual y contrato de marca

## Estado y autoridad

Este documento convierte los principios de producto y diseño en una dirección implementable para la recuperación M4.11.2–M4.11.8 y su continuidad en M5–M9. No sustituye una guía de marca completa. El 2026-08-17 Luna aprobó el nombre público «Luna Tartas», la alternativa «Luna Estudio» y el logo oficial para publicación web y JSON-LD; favicon, iconos, variantes y tipografías continúan bloqueados. La fotografía y contenido aprobados durante M4 se pueden usar conforme a su readiness y derechos trazados.

La referencia visual desktop vigente de la Home está registrada en [`reference/luna-home-art-direction-reference.png`](reference/luna-home-art-direction-reference.png). El propietario la sustituyó el 2026-08-17 y la versión anterior con lockup serif queda obsoleta para M8.9. La imagen vigente es el **DESKTOP VISUAL REFERENCE / ART DIRECTION CONTRACT**: define dirección artística, composición, jerarquía, densidad, ritmo, escala, proporciones, tratamiento fotográfico, cards, tipografía, ornamentación, superficies, paleta, CTA, Footer y calidad percibida. No autoriza productos, fotografías, textos, categorías, iconos funcionales o datos ficticios y no sustituye los contratos funcionales existentes.

La referencia móvil recibida en [`reference/luna-home-art-direction-reference-mobile.png`](reference/luna-home-art-direction-reference-mobile.png) queda reservada para la futura M8.10. En M8.9 no se implementan las funciones ficticias de carrito, favoritos o cuenta que muestra la maqueta, ni se cierra el diseño móvil.

La dirección provisional sí queda aprobada técnicamente para construir el sistema visual. Debe poder sustituirse mediante configuración, tokens y assets, sin reescribir componentes ni contenido.

La lámina interna [`visual-direction-review.svg`](visual-direction-review.svg) conserva la revisión histórica de M3.1. Está marcada como documentación no publicable y no es un asset de marca, una implementación de página ni la referencia aprobada de la Home.

Fuentes autoritativas relacionadas:

- [`design-principles.md`](design-principles.md): principios y capas del sistema.
- [`../product/vision.md`](../product/vision.md): propuesta, recorrido y prioridades del producto.
- [`../product/content-readiness.md`](../product/content-readiness.md): estado, owner y gate de entradas.
- [`../architecture/risks-and-open-decisions.md`](../architecture/risks-and-open-decisions.md): riesgos de identidad y licencias.

## Inventario de marca revisado

| Entrada                     | Estado          | Evidencia revisada                                                        | Uso permitido ahora                                                       | Condición de salida                                                     |
| --------------------------- | --------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Nombre comercial            | `READY`         | Aprobación directa de Luna, 2026-08-17                                    | «Luna Tartas» y alternativa «Luna Estudio» en web/JSON-LD                 | Mantener fuente, owner, fecha y aprobación                              |
| Logo oficial                | `READY`         | `src/assets/brand/logo-luna-tartas.png`, entregado por Luna el 2026-08-17 | Uso en `Organization` JSON-LD; no deriva variantes ni iconos              | Mantener archivo, derechos y aprobación                                 |
| Variantes, favicon e iconos | `READY`         | Logo oficial aprobado reutilizado sin modificación                         | El logo PNG aprobado se usa como favicon; no se derivan marcas ni iconos   | Mantener el archivo oficial y añadir variantes sólo con nueva aprobación |
| Favicon e iconos de marca   | `READY`         | `BaseLayout.astro` enlaza el logo oficial como favicon PNG                 | No se publica ningún monograma, luna o símbolo derivado                    | Master específico sólo si el propietario lo entrega y aprueba            |
| Tipografías de marca        | `BLOCKED`       | No existen nombres, archivos, proveedor ni licencia                       | Stacks del sistema definidos en este documento                            | Familia, pesos necesarios, archivos/proveedor, licencia y aprobación    |
| Fotografía de producto      | `READY`         | Selección final en `src/assets/catalog/`, con derechos y alt por media     | Portadas y galerías publicadas tras validación del catálogo                | Mantener fuente, selección, autor/permiso, alt y aprobación             |
| Guía de voz o identidad     | `TBD`           | No existe documento entregado                                             | Aplicar sólo los principios de producto ya aprobados                      | Guía o aprobación explícita del owner                                   |

No se incorporó ningún asset de marca en M3.1. En M9.1 se incorpora únicamente
el logo oficial entregado y aprobado; reutilizar el mismo PNG como favicon no
crea una variante ni una propuesta de identidad.

## Concepto rector: Atelier de pequeños detalles

La experiencia debe sentirse como un pequeño atelier/boutique artesanal digital: cercana, delicada, creativa y profesional, con composición editorial contemporánea. La referencia anterior “obrador editorial cálido” queda absorbida por este concepto más preciso; no se crea una segunda dirección ni se invalida el sistema construido en M3.

Palabras guía: **artesanía, mimo, detalle, emoción, cercanía, calidad, carácter, sereno y nítido**.

Evitar: estructura repetitiva hero→grid→grid→grid→CTA, ilustraciones lunares no aprobadas, exceso de rosa sin contraste, script ornamental en texto largo, texturas que reduzcan legibilidad, sombras de tarjeta genéricas, badges promocionales agresivos, carruseles automáticos y decoración que compita con la fotografía. La mascota, corazones, estrellas y acuarelas de la referencia vigente sí forman parte del contrato, pero deben proceder de assets aprobados o de primitivas SVG/CSS coherentes.

La emoción debe venir de producto y copy reales. Cuando falte una imagen se usa un fallback neutro y accesible, no una fotografía sintética que pueda confundirse con oferta comercial.

## Paleta provisional

Los tokens implementados en M3.2 son el baseline, no una identidad inmutable. La referencia recalibrada (`#FAF7F2`, `#FFFDFC`, `#352C29`, `#C98287`, `#E8C7C5`, `#B96F62`, `#9BA58F`, `#D9C6AC`) orienta la atmósfera, pero no se adopta a ciegas: M4.11.2 la mapea contra roles existentes, conserva los valores que ya cumplen contraste y cambia nombres/medidas sólo cuando resuelven un problema demostrado. Los productos y fotografías aportan la mayor parte del color; no se llenan grandes superficies de rosa pastel.

| Rol propuesto    | Valor     | Uso                                                  | Contraste comprobado                                             |
| ---------------- | --------- | ---------------------------------------------------- | ---------------------------------------------------------------- |
| Lienzo cálido    | `#FFF8F0` | Fondo principal                                      | Tinta 14.70:1; texto secundario 6.12:1                           |
| Superficie       | `#FFFFFF` | Superficies que necesitan separación real            | Tinta 15.48:1; texto secundario 6.45:1                           |
| Tinta            | `#2F211D` | Texto y pictogramas principales                      | 14.70:1 sobre lienzo; 15.48:1 sobre superficie                   |
| Texto secundario | `#6F5A51` | Metadata y texto auxiliar de tamaño normal           | 6.12:1 sobre lienzo; 6.45:1 sobre superficie                     |
| Acción           | `#8F294B` | Enlaces, CTA y controles activos                     | 7.71:1 sobre lienzo; blanco sobre acción 8.12:1                  |
| Acción intensa   | `#74203C` | Hover/active con puntero                             | Blanco sobre acción intensa 10.42:1                              |
| Acento artesanal | `#C45E47` | Detalle, ilustración o superficie amplia no textual  | 3.96:1 sobre lienzo: no usar para texto normal ni foco           |
| Borde suave      | `#D8C5B9` | Separación decorativa secundaria                     | 1.58:1 sobre lienzo: no delimita por sí solo un control o estado |
| Foco/información | `#155E75` | Anillo de foco y mensajes informativos               | 6.90:1 sobre lienzo; 7.27:1 sobre superficie                     |
| Éxito            | `#2F6B4F` | Mensaje o estado positivo, acompañado de texto/icono | 5.97:1 sobre lienzo; 6.29:1 sobre superficie                     |
| Error            | `#9B2C2C` | Error, acompañado de texto/icono                     | 7.15:1 sobre lienzo; 7.53:1 sobre superficie                     |

Reglas de uso:

- Tinta y texto secundario son los únicos colores base para párrafos.
- Acción conserva subrayado o una señal distinta al color cuando funciona como enlace en texto.
- El foco usa un contorno visible que no depende de sombra, hover ni color de fondo.
- Acento y borde suave son decorativos; no comunican estado ni límites interactivos por sí solos.
- Estados de éxito/error incluyen lenguaje explícito y, cuando aporte claridad, un icono semántico.
- No se coloca texto sobre fotografía sin una superficie opaca que garantice el contraste medido.

## Dirección tipográfica provisional

Hasta recibir una fuente aprobada se mantienen familias instaladas por el sistema, sin requests de red, archivos redistribuidos ni dependencia de proveedor:

- **Display/editorial:** `ui-serif, Georgia, Cambria, "Times New Roman", serif` para títulos cortos.
- **Lectura/UI:** `ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif` para cuerpo, navegación, precios y controles.

El contraste entre serif editorial y sans cálida/legible ya cumple la intención sin coste de red, por lo que se conserva como decisión provisional. M4.11.2 puede ajustar escala, peso, medida y ritmo antes de proponer una nueva familia. Si más adelante una fuente aporta valor suficiente, debe ser WOFF2 self-hosted, con licencia y subsets documentados, `font-display` y fallback métricamente seguro; no se acepta una regresión de LCP/CLS por estética.

Contrato para M3.2/M3.3:

- Cuerpo mínimo de `1rem`; texto auxiliar nunca menor de `0.875rem` salvo evidencia accesible específica.
- Interlineado aproximado de 1.5–1.7 en lectura y 1.05–1.2 en display, validado sin colisiones.
- Longitud de lectura objetivo de 45–70 caracteres; los títulos no dependen de saltos manuales.
- Pesos contenidos: regular y semibold/bold; no simular pesos que una fuente futura no incluya.
- Mayúsculas sólo para etiquetas cortas, con espaciado legible; nunca para párrafos.
- Si llega una webfont, limitar familias/pesos, verificar licencia web y origen, usar formatos modernos, preload sólo si es crítico y mantener fallback compatible.

## Fotografía, forma e iconografía

La fotografía real aprobada es el elemento expresivo principal. Debe mostrar producto con color natural, detalle de acabado y contexto suficiente, evitando filtros que falseen el resultado. Hero: producto y punto focal protegidos, espacio negativo útil y `object-position` decidido por viewport. Producto: ratios consistentes cuando comparar ayuda. Trabajos/proceso: se permiten proporciones variadas y asimetría controlada para construir narrativa. Detalle/macro: reservado a acabado, materiales, lazos o packaging, nunca como sustituto ambiguo de la vista completa. Todo recorte responsive se revisa a 320/768/1440 y conserva dimensiones intrínsecas para evitar CLS.

Futuras sesiones deberían cubrir manos preparando productos, montaje, lazos, packaging, materiales, detalles, producto terminado y preparación/entrega. Cada activo necesita original, autor/permiso, aprobación, alt y decisión de recorte/object-position antes de producción. M4.11.2–M4.11.8 trabajan sólo con material ya aprobado; M9.1 incorpora la selección final.

Las formas usan radios suaves y consistentes, no cápsulas en todos los elementos. Sombras sólo cuando expliquen elevación; la separación normal se resuelve con espacio, contraste de superficie y borde. Los detalles orgánicos pueden aparecer como recortes o líneas discretas, nunca detrás de texto de lectura.

Los iconos funcionales deben ser SVG simples, de trazo coherente, con nombre accesible cuando comuniquen significado y ocultos a tecnología asistiva cuando sean decorativos. No se adopta una librería hasta demostrar que los pocos iconos necesarios no se resuelven mejor localmente y con licencia documentada.

## Composición responsive

### Móvil: referencia primaria (320–767 px)

- Jerarquía lineal clara, pero con composición propia: propuesta, producto/idea, evidencia y CTA; no es el desktop comprimido.
- Fotografía antes que ornamentación; contenido esencial visible sin interacción horizontal.
- CTA principal de ancho cómodo, target mínimo de 44 × 44 CSS px y separación que evite pulsaciones accidentales.
- Navegación corta y progresiva; no esconder la conversión detrás de un carrusel o hover.
- Espacio lateral suficiente desde 320 px, sin títulos recortados ni overflow.
- Galería y medios reservan dimensiones para evitar saltos de layout.

### Escritorio: expansión editorial (768–1440+ px)

- El mismo orden semántico se amplía a composiciones de dos columnas cuando mejore la lectura.
- Container legible; el contenido no se estira para llenar pantallas grandes.
- Ritmo asimétrico moderado mediante escala y espacio, sin alterar orden de teclado/DOM.
- Hover enriquece, pero ninguna información o acción depende de él.
- Fotografía puede ganar escala; el texto mantiene su medida y CTA cercano al contexto que convierte.

No se define un breakpoint por dispositivo. Los puntos responden al contenido; cada milestone visual comprueba 320, 768 y 1440 px.

## Ritmo editorial y narrativa

La Home alterna zonas de densidad y descanso, fotografía grande, cambios sutiles de superficie, proporciones diversas, asimetrías controladas y espacio negativo. Las cards siguen siendo reutilizables, pero no todas las secciones deben parecer la misma rejilla. Categorías, ocasiones, destinatarios, destacados, trabajos, proceso y CTA final deben leerse como capítulos conectados.

“Trabajos realizados” es la principal oportunidad de composición editorial: imágenes de diferentes proporciones, superposición o desplazamiento controlado y profundidad sutil, sin alterar el orden semántico. “Cuéntanos tu idea” funciona como cierre emocional y conduce a WhatsApp conservando el contrato aprobado, no como bloque funcional aislado.

El proceso equivalente a “Cada detalle cuenta” ya tiene una base implementada en M4.5. M4.11.4 puede integrarla visualmente y usar el flujo aprobado, pero no inventa una sección/copy alternativo. Una ampliación fotográfica requiere imágenes reales de manos, preparación, materiales/packaging y producto terminado con derechos y alt; se solicita como contenido para M9.1 si no está disponible.

## Lenguaje gráfico e imperfección controlada

El vocabulario histórico de M4.11.2 (`thread`, `underline`, `dots`) ya no basta
para la referencia vigente. M8.9.2 debe evolucionarlo, sin crear duplicación,
para representar corazón dibujado, corazón con trazo, sparkle de cuatro puntas,
pequeños corazones, línea curva/punteada, nube/acuarela azul, wash rosa y la
mascota sólo cuando exista un asset oficial adecuado. Todo ornamento sigue
siendo decorativo, oculto a tecnologías asistivas, sin pointer events ni
JavaScript. No se usan emoji Unicode ni se sustituye copy, información, foco o
fotografía.

La imperfección puede usar rotaciones aproximadas de ±0.5–1.5 grados, posiciones levemente desplazadas, líneas no perfectamente geométricas y superposiciones fotográficas controladas. Debe conservar legibilidad, alineación percibida y profesionalidad; se reduce en móvil cuando cause ruido o riesgo de overflow.

## Motion system

Regla: **nada se mueve porque sí**. El vocabulario inicial queda limitado a:

1. **Reveal:** opacity y desplazamiento vertical pequeño, duración contenida y stagger sólo cuando ordene la lectura.
2. **Micro-parallax:** opcional y editorial, nunca fondo agresivo; desplazamientos relativos orientativos de 10–20 px en media secundaria y hasta 20–40 px en un detalle decorativo. Se usa sólo con coste medido y preferencia por CSS/API nativa.
3. **Hover/focus:** cambios discretos (por ejemplo `translateY` de −2/−3 px, escala interior 1.01–1.02, sombra/color o desplazamiento de pocos píxeles) durante aproximadamente 180–300 ms. Foco por teclado es como mínimo igual de claro y no depende de movimiento.
4. **Draw/reveal de ornamentos:** reservado a líneas o detalles pequeños que aporten continuidad visual.

No hay autoplay ni transiciones de layout. Ningún efecto bloquea interacción, provoca CLS, oculta contenido o justifica una librería pesada. `prefers-reduced-motion: reduce` elimina parallax, desplazamientos, draw y efectos no esenciales; el estado final queda visible sin depender de JavaScript. Mobile puede omitir cualquier movimiento que no aporte.

## Firma del creador en el Footer

La firma es un detalle final que conecta el cuidado del producto con el cuidado de la experiencia digital. Copy aprobado único:

**Hecho con mimo para Luna · Creado por Antonio MDM · © {YEAR}**

- Aparece en la zona inferior del Footer, después de navegación/contacto/legal y con separación suficiente. Tiene jerarquía tipográfica secundaria, buena legibilidad, roles de color existentes y contraste WCAG AA; no funciona como CTA ni como publicidad protagonista.
- `Antonio MDM` enlaza a `https://antoniomdm.dev/` mediante un `<a>` real que funciona sin JavaScript, conserva navegación por teclado y un foco claramente visible. No usa `target="_blank"` salvo que una convención futura del proyecto lo justifique; en ese caso requiere el `rel` seguro correspondiente.
- `{YEAR}` se calcula una sola vez durante el build de Astro, preferentemente con una constante en el frontmatter del Footer. No se hardcodea en varios lugares, no añade dependencia, hidratación ni JavaScript cliente.
- El enlace puede recibir subrayado fino y una transición de color o desplazamiento mínimo coherente con el motion system. No se anima si no aporta; reduced motion sigue gobernando.
- No se sustituye el copy por iconos de corazón, emojis u ornamentación. Debe responder a 320/768/1440 sin overflow y no competir con las acciones principales del Footer.

M4.11.2–M4.11.8 son la recuperación trazable de implementación de este contrato. M4.1 y el primer cierre de M4.11 conservan su estado histórico `DONE`; M8.6 verifica después el cumplimiento por referencia, sin borrar la recuperación ni redefinirla.

## Accesibilidad

- Objetivo WCAG 2.2 AA para contraste, teclado, foco, zoom y targets.
- HTML y orden de lectura gobiernan la composición; el CSS no crea una lectura visual distinta de la semántica.
- El color nunca es la única señal. Enlaces, errores, selección y disponibilidad tienen texto, forma o icono adicional.
- El foco es persistente, no queda oculto por cabeceras y contrasta contra lienzo y superficie.
- A 200 % de zoom y 320 CSS px no se pierde contenido ni aparece scroll horizontal, salvo medios que lo requieran por naturaleza.
- El motion system anterior se aplica como mejora progresiva y `prefers-reduced-motion: reduce` conserva una experiencia completa y estable.
- Los fallbacks de imagen conservan dimensiones y una descripción útil; el alt pertenece al contenido aprobado, no se deriva del nombre de archivo.

## Contrato de sustitución de marca

La identidad futura se integra por bordes explícitos:

1. Nombre y estado de publicación en configuración global validada.
2. Logo/favicon/iconos en un directorio de marca separado del catálogo, con manifest de fuente, derechos, aprobación y variantes.
3. Color y tipo mediante tokens semánticos; ningún componente usa hex, familia o asset de marca directamente.
4. Componentes consumen roles (`action`, `surface`, `text`) y una región de marca, no nombres visuales como `pinkButton` o `moonLogo`.
5. La sustitución activa una revisión de contraste, métricas tipográficas, recortes responsive, peso de assets y snapshot/build antes de marcar la entrada `READY`.

Un activo sólo puede pasar a producción con esta ficha mínima:

| Campo                   | Requisito                                                         |
| ----------------------- | ----------------------------------------------------------------- |
| Identificador y versión | Nombre estable y fecha/versión del master                         |
| Fuente                  | Archivo, entrega o referencia trazable                            |
| Autor/owner             | Persona o entidad identificada                                    |
| Derechos                | Licencia o permiso, alcance web y restricciones                   |
| Aprobación              | Responsable y fecha                                               |
| Variantes               | Formato, fondo, tamaño mínimo y uso permitido                     |
| Accesibilidad           | Nombre/alt cuando proceda; decorativo declarado cuando no         |
| Técnica                 | Dimensiones, peso, formato y revisión de contenido activo/externo |

## Decisiones y blockers al cierre de M3.1

### Aprobado para implementación provisional

- Concepto “Atelier de pequeños detalles”, evolución compatible de “obrador editorial cálido”, y jerarquía producto/contenido/CTA.
- Paleta funcional propuesta con restricciones y ratios registrados.
- Serif de sistema para display y sans de sistema para lectura/UI.
- Mobile first, composición editorial progresiva y fotografía protagonista sólo cuando sea real y aprobada.
- Contrato de sustitución por configuración, tokens y assets separados.

### Bloquea la identidad definitiva, no la dirección provisional M4.11.2–M9

- Nombre comercial y escritura aprobada.
- Logo, favicon, iconos, variantes y reglas de uso.
- Tipografías de marca y licencia web o autorización de alternativa.
- Fotografías, derechos, selección y alt text.

Owner: **Propietario del negocio**. Acción: entregar cada entrada con la ficha de derechos y aprobación anterior. Hasta entonces, el equipo técnico conserva el estado `BLOCKED`/`TBD`, usa sólo el sistema provisional y no publica placeholders de identidad.

## Revisión M3.1

| Comprobación                           | Móvil                                            | Escritorio                                     | Resultado                                          |
| -------------------------------------- | ------------------------------------------------ | ---------------------------------------------- | -------------------------------------------------- |
| Jerarquía y orden de lectura definidos | Una columna desde 320 px                         | Expansión sin cambiar DOM                      | `PASS` de especificación                           |
| Conversión accesible                   | CTA contextual, target 44 × 44 px                | CTA cercano al contenido; hover no obligatorio | `PASS` de especificación                           |
| Contraste de texto/acciones/foco       | Ratios AA registrados                            | Mismas combinaciones semánticas                | `PASS` calculado                                   |
| Tipo y carga                           | Fallbacks sin recorte ni red                     | Medida de lectura limitada                     | `PASS` de contrato                                 |
| Medios y estabilidad                   | Dimensiones reservadas, sin carrusel obligatorio | Escala sin desbordar container                 | `PASS` de especificación                           |
| Licencias/propiedad                    | No se incorpora material sin evidencia           | Mismo contrato                                 | `PASS`: 0 assets incorporados; blockers explícitos |

Esta tabla conserva la evidencia histórica de M3.1 y no se reabre. La recalibración posterior se implementa y valida en M4.11; M5 propaga la dirección a producto/conversión y M8.6 ejecuta el gate visual final en 320/768/1440 px, teclado, zoom, reduced motion, rendimiento y ausencia de CLS.
