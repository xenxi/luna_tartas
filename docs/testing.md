# Peso total informativo y aviso en Studio — 18 de octubre de 2026

Por petición expresa del propietario, se sustituye el bloqueo total de 256 MiB
por un aviso de mantenimiento por encima de 75 MiB. Raster de más de 8 MiB,
imágenes de más de 24 MP, SVG inseguros/excesivos y páginas que incumplan los
presupuestos de rendimiento siguen bloqueados por sus controles existentes.
No se modifican productos, imágenes ni precios.

La política de raíz/extensiones/umbral se comparte con Studio a través del
contrato e índice privados generados. No incluye totales dependientes del
catálogo: los clientes anteriores pueden seguir publicando sin causar deriva.
Studio mide el árbol Git y mantiene el aviso hasta verificar la reducción.

Verificación local: lint y tipos sin diagnósticos; 332 pruebas en 52 archivos.
Los casos del checker real verifican el aviso sin bloqueo incluso con 520 MiB,
la frontera de 75 MiB y los rechazos por archivo. Build de 40 páginas con 14
productos; assets, enlaces, rendimiento, artefacto, catálogo, SEO, schema e
índice: PASS. Transferencia inicial máxima a 375 px: 269.892 bytes.
Formato de los archivos de código cambiados: PASS. El aviso total actual de
114.714.084 bytes es esperado y se conserva visible en el log.

La verificación de Studio y sus paquetes se documenta en su propio repositorio.
Los resultados locales no acreditan por sí solos la publicación remota.

# Corrección anterior del presupuesto de publicación — 18 de octubre de 2026

El run `39099760754` sobre `93ea6b9` construye la web, pero falla en
`Check public artifact`: `verify:assets` contabiliza 114.714.084 bytes
(109,4 MiB), por encima del límite inicial de 100 MiB. Reintentar ese SHA
reproduce el fallo. Se amplía explícitamente el presupuesto total a 256 MiB;
la justificación y el impacto están en `quality/performance-audit.md`.
No se modifican productos, fotografías ni el índice de Studio.

Verificación local con Node 24.19.0 y npm 11.17.0:

- Lint y tipos: PASS, cero errores, warnings o hints.
- 331 tests en 52 archivos: PASS. Cinco regresiones nuevas ejecutan el checker
  real: crecimiento por encima de 100 MiB, frontera de 256 MiB y rechazo de
  excesos totales, raster de más de 8 MiB y SVG de más de 250 KiB.
- Build: 40 páginas, 14 productos publicados. Schema, Studio, assets, enlaces,
  rendimiento, artefacto, catálogo, SEO, crawl, JSON-LD, accesibilidad,
  responsive y redirects: PASS. Transferencia inicial máxima a 375 px:
  269.892 bytes; se mantienen los presupuestos de la web servida.
- Dependencias: 508 paquetes, licencias evaluadas, cero advisories pendientes.
- Determinismo: 1.196 archivos idénticos entre dos builds. La mutación de un
  enlace crítico vacío se rechaza correctamente.
- Formato de los dos archivos de código cambiados: PASS.

El aviso de fuentes a partir de 75 MiB se mantiene y es esperado. El volumen
permitido en Git aumenta; el límite duro total sigue activo en 256 MiB.
Vitest requirió ejecutarse fuera del aislamiento de Windows por un error
`EPERM` al renombrar su caché temporal; la ejecución posterior completa pasó.
Los checks de accesibilidad y responsive inspeccionan el artefacto. No cambia
la UI y no se repite la revisión visual. La evidencia local no acredita por
sí sola un despliegue remoto.

# Integración de Studio — 17 de octubre de 2026

La integración pendiente se aplica sobre `46502f5`, conservando los productos y
las correcciones de publicación de main. Se regenera el índice privado con 15
productos y 11 taxonomías. Los SHA de documentos y portadas coinciden con Git.
El endpoint público incluye únicamente las 12 portadas publicadas en WebP de
320 px; ni el índice privado ni el manifiesto interno se copian a dist.

Verificación local:

- Lint, tipos (cero errores, warnings o hints), schema/índice y 326 pruebas
  en 51 archivos: PASS.
- Build: 38 páginas. Enlaces, artefacto, catálogo, assets, rendimiento, SEO,
  crawl, JSON-LD, accesibilidad, responsive y redirects: PASS.
- Determinismo: 1046 archivos idénticos entre dos builds. Mutación de enlace
  crítico rechazada correctamente.
- Seguridad: PASS en 632 archivos versionados, 219 revisiones, dos workflows
  y 1046 archivos de artefacto, sin secretos ni campos internos publicados.
- Formato de los archivos de código/JSON modificados: PASS. El chequeo global
  mantiene 21 avisos en archivos heredados fuera del diff, incluidos finales de
  línea de Windows y YAML escrito desde Studio. No se reformatean productos.
- Assets emite el aviso previo de presupuesto total: 102250208 bytes frente al
  umbral orientativo de 78643200. El control termina correctamente.
- El control de dependencias detectó el advisory npm 1240991. Se actualiza sólo
  `http-cache-semantics` de 4.2.0 a 4.3.0 en el lockfile; el control posterior
  pasa con 508 paquetes, licencias evaluadas y cero advisories pendientes.

No cambia la interfaz visual ni se realiza una publicación de productos desde
Android. Esta evidencia local no acredita por sí sola un despliegue remoto.

# Corrección del fallo de publicación — 2 de octubre de 2026

## Resultado vigente tras desbloquear el CI de la PR #3

El paso `Review dependency security and licenses` de la ejecución
`37029980546` falló por 35 advisories nuevos. Se actualizan Astro a `7.3.5`,
Vitest a `4.1.11` y las dependencias transitivas con un lockfile reproducible.
`npm ci` y `verify:dependencies` pasan: 508 paquetes, licencias evaluadas,
cero vulnerabilidades y cero excepciones de advisories. La licencia MPL-2.0
de Lightning CSS se documenta en `docs/quality/security-review.md`.

Verificación completa después de la actualización:

- Lint, typecheck (cero errores, warnings o hints), schema y 314 tests pasan.
- Build de 35 páginas; nueve productos publicados en catálogo y HTML.
- Assets, enlaces, SEO, crawl, JSON-LD, catálogo, rendimiento, artefacto,
  seguridad, accesibilidad, responsive y redirects pasan.
- Determinismo: 818 archivos idénticos entre builds; mutación rechazada.
- Smoke real en Edge a 1440 y 375 px: home, listado, navegación a producto,
  enlace WhatsApp y carga de las tres imágenes editoriales de Sobre Luna.
  Sin errores JavaScript ni desbordamiento horizontal en Sobre Luna.
- Edge a 375 px con JavaScript desactivado: listado, ficha y enlace WhatsApp
  funcionan. Inspección visual de capturas de Sobre Luna en ambos anchos.
- Se conserva `compressHTML: true` para evitar cambios en los espacios inline
  al actualizar Astro. Se sustituyen tres assertions de Vitest obsoletas por
  su equivalente vigente `toThrow`.
- Formato de los archivos de código modificados: correcto.

Límites: siguen los seis avisos de formato de productos previos indicados
abajo. No se altera su contenido. No se prueba Safari/Firefox ni un lector
de pantalla. La integración de la PR en main activará el despliegue; la
comprobación local no acredita publicación en producción.

## Evidencia anterior de la reparación de imágenes

La ejecución 36577869022 de GitHub Actions falló durante `astro build`: la
página Sobre Luna importaba `etiquetas-comunion-claudia.jpeg`, eliminada en el
commit `acb7aeb` al actualizar las fotos del producto desde Studio.

Las tres imágenes de catálogo usadas directamente en Sobre Luna tienen ahora
copias editoriales en `src/assets/about`. Los originales son los mismos; no se
cambian productos, precios ni contenido. Una prueba comprueba que los imports
estáticos de imágenes de las páginas existen y no dependen del catálogo mutable.

Validación sobre `f1967e8` con la corrección:

- Node 24.19.0, npm 11.17.0 y `npm ci`.
- Lint y typecheck correctos; 314 pruebas pasan. En Windows se normalizaron
  temporalmente los finales de línea a LF para ejecutar los tests de texto
  con el mismo formato que el checkout Linux de GitHub Actions.
- Build correcto: 35 páginas, con las imágenes de Sobre Luna optimizadas.
- Schema, assets, enlaces, SEO, crawl, JSON-LD, catálogo, rendimiento,
  artefacto, seguridad, accesibilidad, responsive y redirects correctos.
- Determinismo correcto: 818 archivos idénticos entre dos builds. La prueba
  de mutación rechaza un enlace crítico vacío.
- Los assets suman 92.315.096 bytes: aviso de 75 MiB, dentro del límite
  obligatorio de 100 MiB.

Limitaciones de la primera verificación (antes de actualizar dependencias):

- Prettier detecta seis productos sin formatear: etiquetas, historia del
  nombre, lámina natalicia, lámina personalizada, libreta y tarta de pañales.
  Los archivos de esta corrección cumplen el formato con finales LF.
- `verify:dependencies` fallaba con 35 alertas npm sin evaluar. Resuelto por
  la actualización descrita arriba; el lockfile actualizado sustituye el
  diagnóstico anterior.
- Las comprobaciones de accesibilidad y responsive inspeccionan el artefacto;
  no son una prueba manual con lector de pantalla ni una sesión de navegador.
- La ejecución remota original no puede repararse con un reintento: vuelve
  a construir el mismo commit. Se necesita integrar esta corrección.

## Publicación desde Studio: fechas YAML sin comillas (2026-10-02)

La ejecución `37040671561`, sobre `47681ea`, falla al cargar el producto
`dinosaurio-articulado-3d`: Astro interpreta las fechas de aprobación sin
comillas como objetos Date, mientras Studio y los tests usan strings de YAML
1.2. La corrección anterior de imágenes/dependencias ya estaba integrada.

El adaptador de Content Collections conserva `glob` y valida el texto original
con YAML 1.2 Core. No modifica el producto ni relaja el schema de aprobación.
No exige actualizar Studio. Un test ejecuta `astro sync` real en un proyecto
temporal: acepta la fecha sin comillas y rechaza `2026-02-31`. Los otros casos
cubren fechas con comillas, timestamps, nulos, números y claves duplicadas.

Verificación local sobre el catálogo de ese commit:

- Lint y typecheck: cero errores, warnings o hints; contrato generado sin drift.
- 324 tests pasan; build de 36 páginas y diez productos publicados.
- Dependencias: cero vulnerabilidades pendientes y cero excepciones.
- Assets, enlaces, SEO, crawl, JSON-LD, catálogo, rendimiento, artefacto,
  seguridad, accesibilidad, responsive y redirects pasan.
- Determinismo: 882 archivos idénticos; mutación rechazada.
- Formato de los archivos de código modificados correcto. Los finales de línea
  se normalizaron temporalmente a LF para reproducir el checkout Linux de CI.
- Assets: 96.466.742 bytes; aviso de 75 MiB, bajo el límite de 100 MiB.

Las comprobaciones de accesibilidad y responsive son sobre el artefacto.
Este cambio no altera la interfaz; no se repite la revisión visual del móvil.
El build local no acredita todavía el despliegue remoto de esta corrección.
