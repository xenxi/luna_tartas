# Store Catalog Contract 3.0.0

Luna mantiene su fuente YAML y el contrato de producto generado 2.1. Studio
añade un envelope de integración; no cambia URLs ni contratos públicos existentes.

`npm run studio:generate` valida fuentes con Zod y genera
`schemas/store-catalog.json` y `catalog/index.json`. Ejecutarlo después de editar
contenido o schema. `npm run verify:studio`, tests y prebuild rechazan deriva.
El índice lleva identidad, estado, precio/inventario, taxonomías, portada/orden,
SHA Git de documentos/assets y generatedAt. Es interno: incluye drafts/archived
para el editor y no se sirve desde public ni dist.

La web genera `/catalog/assets.json` con productos publicados y thumbnails WebP
de 320px. El SHA del original permite comprobar que la miniatura desplegada
corresponde al asset editorial actual. No expone borradores ni originales internos.

Studio muestra primero el índice local y comprueba HEAD en background. HEAD igual
no descarga documentos/assets; un cambio descarga el índice fijado a ese commit.
El YAML se obtiene al editar y conserva el escritor round-trip. Antes de publicar
se hidratan y validan documentos, referencias y assets. Fuente, imágenes e índice
se escriben en un único commit; el workflow existente valida y despliega.

Migración: publicar estos artefactos junto a la integración de la web antes de
distribuir Studio. El cliente sigue leyendo 2.x sin índice mediante el adaptador
anterior. No se extraen catálogos a un repositorio central.

## Aviso persistente de peso de imágenes

La definición incluye opcionalmente `sourceAssets` (raíz, extensiones y umbral
de aviso), generado desde `scripts/source-asset-policy.mjs`. No añade una
capacidad obligatoria: los clientes anteriores conservan compatibilidad.
El total superior a 75 MiB es mantenimiento y no bloquea la publicación.

Studio consulta los tamaños del árbol Git fijado al HEAD del catálogo en
segundo plano, sin descargar los originales. Incluye imágenes editoriales y
archivos sin referencias, igual que el checker web. Guarda la medición por
repositorio/rama y política; conserva el aviso sin conexión y durante un fallo
de sincronización. Se muestra sobre el router, en todas las pantallas, sin
cierre ni caducidad. Sólo una medición nueva bajo el umbral lo elimina.
Este control añade una consulta ligera del árbol cuando cambia HEAD; el listado
sigue entregándose desde el índice sin esperar esa petición.

## Verificación

La integración se valida sobre el catálogo y las dependencias actuales. Los
resultados y las limitaciones de publicación se registran en
[`../testing.md`](../testing.md).
