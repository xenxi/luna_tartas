# Auditoría de rendimiento M8.2

## Gate reproducible

`npm run verify:assets` revisa todos los medios fuente versionados bajo
`src/assets`: cada raster debe ocupar como máximo 8 MiB y cada SVG 250 KiB.
La validación del catálogo mantiene además 24 MP y bloquea SVG no seguros.
El total de imágenes fuente sólo genera un aviso por encima de 75 MiB; no
bloquea la publicación al añadir productos. Los presupuestos por página del
artefacto siguen siendo obligatorios.

El 2026-10-18 se sustituye el tope total inicial de 100 MiB y su ampliación
temporal a 256 MiB por este aviso, por petición expresa del propietario.
El catálogo actual suma 114.714.084 bytes. El aviso permite crecimiento y no
resuelve por sí mismo el coste de checkout o del historial Git; su mantenimiento
sigue siendo responsabilidad del equipo técnico. Los tests ejecutan el checker
real con más de 100, 256 y 512 MiB; exigen éxito con aviso y siguen rechazando
archivos individuales excesivos. Comprueban también la frontera de 75 MiB.

`scripts/source-asset-policy.mjs` centraliza raíz, extensiones y umbral.
El generador incluye la política opcional `sourceAssets` en el contrato y el
índice privados de Studio. No publica tamaños ni borradores en la web.
Studio mide metadatos del árbol Git, sin descargar originales, y conserva un
aviso global sin cierre hasta que una medición nueva confirma la reducción.

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
