# Auditoría de rendimiento M8.2

## Gate reproducible

`npm run verify:assets` revisa todos los medios fuente versionados bajo
`src/assets`: cada raster debe ocupar como máximo 8 MiB, cada SVG 250 KiB y
el conjunto no puede exceder 256 MiB (aviso a partir de 75 MiB). La validación
del catálogo mantiene además el límite de 24 MP y bloquea SVG no seguros.

Recalibración del 2026-10-18 para corregir la publicación del catálogo
(owner: equipo técnico): el run `39099760754`, commit `93ea6b9`, construye
correctamente la web pero bloquea sus 114.714.084 bytes de fuentes frente al
antiguo tope de 100 MiB. Se fija un presupuesto total de 256 MiB, 2,34 veces
el volumen actual, para permitir crecimiento editorial sin modificar imágenes
ni productos. Aumenta el volumen permitido en Git y su coste de checkout;
no aumenta los presupuestos de transferencia de cada página. Se conserva el
aviso de 75 MiB para revisar ese crecimiento y todos los límites individuales
y de rendimiento servido. Las pruebas ejecutan el checker real con totales
por encima de 100 MiB, en 256 MiB y por encima de 256 MiB; también comprueban
que raster y SVG sobredimensionados siguen bloqueados.

Después de `npm run build`, `npm run verify:performance` inspecciona las 25
rutas HTML de `dist`. Comprueba que cada `picture` generado entregue AVIF y
WebP mediante `srcset`, mantenga JPEG como fallback, declare `width`, `height`
y `sizes`, y use lazy loading salvo el candidato LCP. En viewport de 375 px
selecciona la variante AVIF correspondiente y aplica los presupuestos de la
estrategia de calidad: HTML/CSS <= 50 KiB gzip, JavaScript inicial <= 30 KiB
gzip, transferencia inicial <= 1.5 MiB, LCP <= 300 KiB y otras imágenes <=
200 KiB.

La medición inicial (2026-08-17) cubrió las 25 páginas: 109 `picture`
responsivos y una transferencia inicial máxima de 84.022 bytes a 375 px. La
preview local a 375 × 812 confirmó que Home y una ficha no tienen overflow;
cada una conserva un único LCP eager/high-priority con dos fuentes modernas y
dimensiones intrínsecas. El primer artefacto no tiene fuentes web ni JavaScript
de cliente habilitado: los stacks de sistema evitan transferencia y cambios de
métrica de fuente; la instrumentación de analytics está desactivada por
configuración. La ornamentación es SVG/CSS secundaria y no incorpora una
dependencia ni una ruta de carga JavaScript crítica. El atributo
`width`/`height` preserva la relación de aspecto antes de descargar las
imágenes, por lo que el gate también evita una fuente de CLS.

## Límites de la evidencia

La auditoría estática es determinista y se ejecuta en CI, pero no sustituye
mediciones de laboratorio. Lighthouse móvil se ejecutará tres veces sobre la
preview de producción cuando haya navegador y perfil de red controlado; M8.3
registrará la matriz real de navegadores. No se infiere una puntuación
Lighthouse ni CWV de campo sin esas ejecuciones.
