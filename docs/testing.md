# Corrección del fallo de publicación — 2 de octubre de 2026

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

Limitaciones previas, sin cambios de dependencias ni de datos editoriales:

- Prettier detecta seis productos sin formatear: etiquetas, historia del
  nombre, lámina natalicia, lámina personalizada, libreta y tarta de pañales.
  Los archivos de esta corrección cumplen el formato con finales LF.
- `verify:dependencies` falla con 35 alertas npm sin evaluar; el lockfile no
  cambia. Este control bloquea el CI de las PR aunque el pipeline de
  despliegue y sus verificadores locales pasen.
- Las comprobaciones de accesibilidad y responsive inspeccionan el artefacto;
  no son una prueba manual con lector de pantalla ni una sesión de navegador.
- La ejecución remota original no puede repararse con un reintento: vuelve
  a construir el mismo commit. Se necesita integrar esta corrección.
