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
