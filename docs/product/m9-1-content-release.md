# M9.1 — Cierre editorial de contenido

## Alcance y fuente

Esta ficha registra la revisión final de catálogo, copy y assets ejecutada el
2026-08-17. La fuente editorial son los YAML bajo `src/content/`; la fuente de
medios son los archivos bajo `src/assets/catalog/` y `src/assets/brand/`.
No se incorporan fixtures, placeholders ni datos inferidos.

## Inventario publicado

| Entidad | Cantidad | Comprobación |
| --- | ---: | --- |
| Productos | 8 | Todos `published`, con ID/slug estable, copy, relación, precio, personalización, aprobación y medios válidos |
| Categorías | 4 | Todas `published`, con resumen, descripción y orden editorial |
| Ocasiones | 4 | Todas `published`, con resumen, descripción y orden editorial |
| Destinatarios | 3 | Todos `published`, con resumen, descripción y orden editorial |

Productos publicados: `tarta-de-panales-personalizada`,
`libreta-personalizada-a5`, `lamina-natalicia-a5`,
`lamina-personalizada-a5`, `pack-personalizado`,
`invitacion-marcapaginas-personalizada`,
`tarjeta-felicitacion-personalizada-a6` y
`etiquetas-personalizadas-regalos`.

## Media y derechos

- Las 8 portadas y las galerías declaradas resuelven dentro de
  `src/assets/catalog/` y pasan los límites de tamaño y dimensiones del
  contrato.
- Cada media publicada tiene alt específico, owner, permiso y evidencia.
- La imagen social por defecto sigue siendo la fotografía hero aprobada.
- El logo oficial `src/assets/brand/logo-luna-tartas.png` se usa sin
  modificación en Organization JSON-LD y como favicon PNG. No se inventan
  monogramas, iconos ni variantes de marca.

## Copy y datos no publicados

Precios, personalización, relaciones, contacto, WhatsApp y copy publicado
proceden de aprobaciones editoriales registradas en cada YAML o en
`docs/product/content-readiness.md`. La identidad legal no aprobada, fuentes de
marca no entregadas, credenciales, DNS y Search Console permanecen fuera del
artefacto y no se sustituyen con placeholders.

## Resultado

La validación de schemas, relaciones, medios, HTML público, SEO, JSON-LD y
catálogo debe ejecutarse sobre el commit de cierre. La matriz de readiness se
actualiza con esta ficha; cualquier nueva modificación editorial reabre esta
revisión y su aprobación.
