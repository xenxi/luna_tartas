# Dirección visual y contrato de marca

## Estado y autoridad

Este documento convierte los principios de producto y diseño en una dirección implementable para M3.2–M5. No aprueba una identidad comercial ni sustituye una guía de marca. A fecha de 2026-08-16 no se han recibido nombre comercial aprobado, logo, favicon, iconos, tipografías ni evidencia de derechos; por tanto, todos los elementos de identidad permanecen bloqueados y no son publicables.

La dirección provisional sí queda aprobada técnicamente para construir el sistema visual. Debe poder sustituirse mediante configuración, tokens y assets, sin reescribir componentes ni contenido.

La lámina interna [`visual-direction-review.svg`](visual-direction-review.svg) permite revisar paleta, jerarquía tipográfica y composición móvil/escritorio. Está marcada como documentación no publicable y no es un asset de marca ni una implementación de página.

Fuentes autoritativas relacionadas:

- [`design-principles.md`](design-principles.md): principios y capas del sistema.
- [`../product/vision.md`](../product/vision.md): propuesta, recorrido y prioridades del producto.
- [`../product/content-readiness.md`](../product/content-readiness.md): estado, owner y gate de entradas.
- [`../architecture/risks-and-open-decisions.md`](../architecture/risks-and-open-decisions.md): riesgos de identidad y licencias.

## Inventario de marca revisado

| Entrada | Estado | Evidencia revisada | Uso permitido ahora | Condición de salida |
| --- | --- | --- | --- | --- |
| Nombre comercial | `BLOCKED` | No existe fuente o aprobación entregada | Sólo la referencia interna del proyecto; nunca como identidad publicada | Nombre, variante escrita, owner, fuente, fecha y aprobación |
| Logo y variantes | `BLOCKED` | No existen masters ni guía de uso | Ningún logo inventado; reservar una región semántica reemplazable | Masters web, variantes, área de seguridad, tamaños mínimos y aprobación |
| Favicon e iconos de marca | `BLOCKED` | No existen archivos ni derechos acreditados | Ningún monograma, luna o símbolo provisional en producción | SVG/PNG masters, autor, licencia o permiso y aprobación |
| Tipografías de marca | `BLOCKED` | No existen nombres, archivos, proveedor ni licencia | Stacks del sistema definidos en este documento | Familia, pesos necesarios, archivos/proveedor, licencia y aprobación |
| Fotografía de producto | `TBD` para M9.1 | No hay selección ni derechos/alt entregados | Sólo fixtures aislados en tests; nunca moodboard o build público | Originales, selección, autor/permiso, alt y aprobación |
| Guía de voz o identidad | `TBD` | No existe documento entregado | Aplicar sólo los principios de producto ya aprobados | Guía o aprobación explícita del owner |

No se incorpora ningún asset de marca en M3.1. La ausencia es deliberada: un placeholder técnico no debe parecer una propuesta de logo ni cruzar al artefacto público.

## Concepto rector: obrador editorial cálido

La experiencia debe sentirse artesanal, cercana, dulce y profesional sin convertirse en una pastelería infantil ni en una plantilla de ecommerce. La referencia es una mesa de trabajo cuidada: fondos luminosos y cálidos, tinta oscura, composiciones con aire, fotografía grande y pequeños acentos de color.

Palabras guía: **cálido, hecho con cuidado, sereno, personal y nítido**.

Evitar: ilustraciones lunares literales sin aprobación, exceso de rosa, script ornamental, texturas que reduzcan legibilidad, sombras de tarjeta genéricas, badges promocionales agresivos, carruseles automáticos y decoración que compita con la fotografía.

La emoción debe venir de producto y copy reales. Cuando falte una imagen se usa un fallback neutro y accesible, no una fotografía sintética que pueda confundirse con oferta comercial.

## Paleta provisional

Los valores son una propuesta técnica para convertirse en tokens semánticos en M3.2. No constituyen colores de marca aprobados. Los ratios se calcularon con WCAG para sRGB; deben comprobarse de nuevo sobre la combinación final y en todos los estados.

| Rol propuesto | Valor | Uso | Contraste comprobado |
| --- | --- | --- | --- |
| Lienzo cálido | `#FFF8F0` | Fondo principal | Tinta 14.70:1; texto secundario 6.12:1 |
| Superficie | `#FFFFFF` | Superficies que necesitan separación real | Tinta 15.48:1; texto secundario 6.45:1 |
| Tinta | `#2F211D` | Texto y pictogramas principales | 14.70:1 sobre lienzo; 15.48:1 sobre superficie |
| Texto secundario | `#6F5A51` | Metadata y texto auxiliar de tamaño normal | 6.12:1 sobre lienzo; 6.45:1 sobre superficie |
| Acción | `#8F294B` | Enlaces, CTA y controles activos | 7.71:1 sobre lienzo; blanco sobre acción 8.12:1 |
| Acción intensa | `#74203C` | Hover/active con puntero | Blanco sobre acción intensa 10.42:1 |
| Acento artesanal | `#C45E47` | Detalle, ilustración o superficie amplia no textual | 3.96:1 sobre lienzo: no usar para texto normal ni foco |
| Borde suave | `#D8C5B9` | Separación decorativa secundaria | 1.58:1 sobre lienzo: no delimita por sí solo un control o estado |
| Foco/información | `#155E75` | Anillo de foco y mensajes informativos | 6.90:1 sobre lienzo; 7.27:1 sobre superficie |
| Éxito | `#2F6B4F` | Mensaje o estado positivo, acompañado de texto/icono | 5.97:1 sobre lienzo; 6.29:1 sobre superficie |
| Error | `#9B2C2C` | Error, acompañado de texto/icono | 7.15:1 sobre lienzo; 7.53:1 sobre superficie |

Reglas de uso:

- Tinta y texto secundario son los únicos colores base para párrafos.
- Acción conserva subrayado o una señal distinta al color cuando funciona como enlace en texto.
- El foco usa un contorno visible que no depende de sombra, hover ni color de fondo.
- Acento y borde suave son decorativos; no comunican estado ni límites interactivos por sí solos.
- Estados de éxito/error incluyen lenguaje explícito y, cuando aporte claridad, un icono semántico.
- No se coloca texto sobre fotografía sin una superficie opaca que garantice el contraste medido.

## Dirección tipográfica provisional

Hasta recibir una fuente aprobada se usarán familias instaladas por el sistema, sin requests de red, archivos redistribuidos ni dependencia de proveedor:

- **Display/editorial:** `ui-serif, Georgia, Cambria, "Times New Roman", serif` para títulos cortos.
- **Lectura/UI:** `ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif` para cuerpo, navegación, precios y controles.

El contraste entre serif y sans aporta carácter sin comprometer carga ni licencias de webfont. La implementación debe tolerar métricas distintas: alturas fluidas, sin recortes, sin fijar bloques de texto por píxeles y con fallbacks visibles desde el primer render.

Contrato para M3.2/M3.3:

- Cuerpo mínimo de `1rem`; texto auxiliar nunca menor de `0.875rem` salvo evidencia accesible específica.
- Interlineado aproximado de 1.5–1.7 en lectura y 1.05–1.2 en display, validado sin colisiones.
- Longitud de lectura objetivo de 45–70 caracteres; los títulos no dependen de saltos manuales.
- Pesos contenidos: regular y semibold/bold; no simular pesos que una fuente futura no incluya.
- Mayúsculas sólo para etiquetas cortas, con espaciado legible; nunca para párrafos.
- Si llega una webfont, limitar familias/pesos, verificar licencia web y origen, usar formatos modernos, preload sólo si es crítico y mantener fallback compatible.

## Fotografía, forma e iconografía

La fotografía será el elemento expresivo principal cuando exista material aprobado. Debe mostrar producto real con color natural, detalle de acabado y contexto suficiente, evitando filtros que falseen el resultado. Los encuadres previstos son vertical o cuadrado para cards y horizontal controlado para hero; el punto focal debe sobrevivir al recorte responsive.

Las formas usan radios suaves y consistentes, no cápsulas en todos los elementos. Sombras sólo cuando expliquen elevación; la separación normal se resuelve con espacio, contraste de superficie y borde. Los detalles orgánicos pueden aparecer como recortes o líneas discretas, nunca detrás de texto de lectura.

Los iconos funcionales deben ser SVG simples, de trazo coherente, con nombre accesible cuando comuniquen significado y ocultos a tecnología asistiva cuando sean decorativos. No se adopta una librería hasta demostrar que los pocos iconos necesarios no se resuelven mejor localmente y con licencia documentada.

## Composición responsive

### Móvil: referencia primaria (320–767 px)

- Una columna y jerarquía lineal: propuesta, producto/idea, evidencia y CTA.
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

No se define un breakpoint por dispositivo. M3.2 elegirá puntos donde el contenido deje de caber, y M3.3 comprobará 320, 768 y 1440 px.

## Accesibilidad y movimiento

- Objetivo WCAG 2.2 AA para contraste, teclado, foco, zoom y targets.
- HTML y orden de lectura gobiernan la composición; el CSS no crea una lectura visual distinta de la semántica.
- El color nunca es la única señal. Enlaces, errores, selección y disponibilidad tienen texto, forma o icono adicional.
- El foco es persistente, no queda oculto por cabeceras y contrasta contra lienzo y superficie.
- A 200 % de zoom y 320 CSS px no se pierde contenido ni aparece scroll horizontal, salvo medios que lo requieran por naturaleza.
- El movimiento es breve y funcional. No hay autoplay, parallax ni transiciones de layout. `prefers-reduced-motion: reduce` elimina desplazamiento y efectos no esenciales.
- Los fallbacks de imagen conservan dimensiones y una descripción útil; el alt pertenece al contenido aprobado, no se deriva del nombre de archivo.

## Contrato de sustitución de marca

La identidad futura se integra por bordes explícitos:

1. Nombre y estado de publicación en configuración global validada.
2. Logo/favicon/iconos en un directorio de marca separado del catálogo, con manifest de fuente, derechos, aprobación y variantes.
3. Color y tipo mediante tokens semánticos; ningún componente usa hex, familia o asset de marca directamente.
4. Componentes consumen roles (`action`, `surface`, `text`) y una región de marca, no nombres visuales como `pinkButton` o `moonLogo`.
5. La sustitución activa una revisión de contraste, métricas tipográficas, recortes responsive, peso de assets y snapshot/build antes de marcar la entrada `READY`.

Un activo sólo puede pasar a producción con esta ficha mínima:

| Campo | Requisito |
| --- | --- |
| Identificador y versión | Nombre estable y fecha/versión del master |
| Fuente | Archivo, entrega o referencia trazable |
| Autor/owner | Persona o entidad identificada |
| Derechos | Licencia o permiso, alcance web y restricciones |
| Aprobación | Responsable y fecha |
| Variantes | Formato, fondo, tamaño mínimo y uso permitido |
| Accesibilidad | Nombre/alt cuando proceda; decorativo declarado cuando no |
| Técnica | Dimensiones, peso, formato y revisión de contenido activo/externo |

## Decisiones y blockers al cierre de M3.1

### Aprobado para implementación provisional

- Concepto “obrador editorial cálido” y jerarquía producto/contenido/CTA.
- Paleta funcional propuesta con restricciones y ratios registrados.
- Serif de sistema para display y sans de sistema para lectura/UI.
- Mobile first, composición editorial progresiva y fotografía protagonista sólo cuando sea real y aprobada.
- Contrato de sustitución por configuración, tokens y assets separados.

### Bloquea la identidad definitiva, no M3.2–M3.6

- Nombre comercial y escritura aprobada.
- Logo, favicon, iconos, variantes y reglas de uso.
- Tipografías de marca y licencia web o autorización de alternativa.
- Fotografías, derechos, selección y alt text.

Owner: **Propietario del negocio**. Acción: entregar cada entrada con la ficha de derechos y aprobación anterior. Hasta entonces, el equipo técnico conserva el estado `BLOCKED`/`TBD`, usa sólo el sistema provisional y no publica placeholders de identidad.

## Revisión M3.1

| Comprobación | Móvil | Escritorio | Resultado |
| --- | --- | --- | --- |
| Jerarquía y orden de lectura definidos | Una columna desde 320 px | Expansión sin cambiar DOM | `PASS` de especificación |
| Conversión accesible | CTA contextual, target 44 × 44 px | CTA cercano al contenido; hover no obligatorio | `PASS` de especificación |
| Contraste de texto/acciones/foco | Ratios AA registrados | Mismas combinaciones semánticas | `PASS` calculado |
| Tipo y carga | Fallbacks sin recorte ni red | Medida de lectura limitada | `PASS` de contrato |
| Medios y estabilidad | Dimensiones reservadas, sin carrusel obligatorio | Escala sin desbordar container | `PASS` de especificación |
| Licencias/propiedad | No se incorpora material sin evidencia | Mismo contrato | `PASS`: 0 assets incorporados; blockers explícitos |

La revisión es de dirección, no de componentes renderizados: M3.1 no implementa home ni foundations. M3.2 codifica la propuesta en tokens y M3.3 valida visualmente la base renderizada en 320/768/1440 px, teclado, zoom y reduced motion.
